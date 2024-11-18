// 导出templates对象供其他文件使用
window.templates = {
    // 添加请求头行函数
    addHeaderRow(key = '', value = '') {
        const headersContainer = document.getElementById('headersContainer');
        if (!headersContainer) {
            console.error('Headers container not found');
            return;
        }

        const headerRow = document.createElement('div');
        headerRow.className = 'header-row';
        
        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.className = 'header-key';
        keyInput.placeholder = 'Header名称';
        keyInput.value = key;
        
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.className = 'header-value';
        valueInput.placeholder = 'Header值';
        valueInput.value = value;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = '删除';
        removeButton.className = 'remove-header danger-btn';
        removeButton.onclick = () => headerRow.remove();
        
        headerRow.appendChild(keyInput);
        headerRow.appendChild(valueInput);
        headerRow.appendChild(removeButton);
        
        headersContainer.appendChild(headerRow);
    },

    // 加载模板列表
    async loadTemplates() {
        try {
            const result = await chrome.storage.local.get(['templates']);
            const templatesList = document.getElementById('templatesList');
            if (!templatesList) return;

            const templateData = result.templates || [];
            templatesList.innerHTML = '';

            templateData.forEach(template => {
                const templateItem = document.createElement('div');
                templateItem.className = 'template-item';
                templateItem.dataset.template = JSON.stringify(template);

                // 添加代理信息到显示中
                const proxyInfo = template.proxy?.enabled 
                    ? `<span class="proxy-info" title="使用代理: ${template.proxy.host}:${template.proxy.port}">🔒</span>` 
                    : '';

                templateItem.innerHTML = `
                    <div class="template-header">
                        <h4>${template.name}</h4>
                        ${proxyInfo}
                        <button class="delete-template-btn" title="删除模板">×</button>
                    </div>
                    <div class="template-info">
                        <span class="method ${template.method.toLowerCase()}">${template.method}</span>
                        <span class="url">${template.url}</span>
                        ${template.description ? `<div class="description">${template.description}</div>` : ''}
                        ${template.proxy?.enabled ? `<span class="proxy-type">${template.proxy.type.toUpperCase()} 代理</span>` : ''}
                    </div>
                `;

                // 添加点击事件
                templateItem.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('delete-template-btn')) {
                        window.templates.loadTemplateData(template);
                    }
                });

                // 添加删除按钮事件
                const deleteBtn = templateItem.querySelector('.delete-template-btn');
                deleteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('确定要删除这个模板吗？')) {
                        await window.templates.deleteTemplate(template.id);
                    }
                });

                templatesList.appendChild(templateItem);
            });
        } catch (error) {
            console.error('加载模板失败:', error);
            showToast('加载模板失败', 'error');
        }
    },

    // 加载模板数据到表单
    loadTemplateData(template) {
        // 设置请求方法
        const methodSelect = document.getElementById('httpMethod');
        if (methodSelect) methodSelect.value = template.method;
        
        // 设置URL
        const urlInput = document.getElementById('urlInput');
        if (urlInput) urlInput.value = template.url;
        
        // 设置请求体
        const requestBody = document.getElementById('requestBody');
        if (requestBody) requestBody.value = template.body || '';
        
        // 设置代理信息
        const enableProxy = document.getElementById('enableProxy');
        const proxyInputs = document.querySelector('.proxy-inputs');
        const proxyType = document.getElementById('proxyType');
        const proxyHost = document.getElementById('proxyHost');
        const proxyPort = document.getElementById('proxyPort');
        const proxyUsername = document.getElementById('proxyUsername');
        const proxyPassword = document.getElementById('proxyPassword');

        // 重置代理设置
        if (enableProxy) {
            enableProxy.checked = false;
            if (proxyInputs) proxyInputs.style.display = 'none';
            if (proxyType) proxyType.value = 'http';
            if (proxyHost) proxyHost.value = '';
            if (proxyPort) proxyPort.value = '';
            if (proxyUsername) proxyUsername.value = '';
            if (proxyPassword) proxyPassword.value = '';
        }

        // 如果模板包含代理配置且启用了代理，则设置代理信息
        if (template.proxy && template.proxy.enabled) {
            if (enableProxy) {
                enableProxy.checked = true;
                if (proxyInputs) proxyInputs.style.display = 'flex';
                if (proxyType) proxyType.value = template.proxy.type || 'http';
                if (proxyHost) proxyHost.value = template.proxy.host || '';
                if (proxyPort) proxyPort.value = template.proxy.port || '';
                if (proxyUsername) proxyUsername.value = template.proxy.username || '';
                if (proxyPassword) proxyPassword.value = template.proxy.password || '';
            }
        }
        
        // 清除现有请求头并添加新的
        const headersContainer = document.getElementById('headersContainer');
        if (headersContainer) {
            headersContainer.innerHTML = '';
            if (template.headers && typeof template.headers === 'object') {
                Object.entries(template.headers).forEach(([key, value]) => {
                    this.addHeaderRow(key, value);
                });
            }
        }
    },

    // 删除模板
    async deleteTemplate(templateId) {
        try {
            const result = await chrome.storage.local.get(['templates']);
            let templateData = result.templates || [];
            
            templateData = templateData.filter(t => t.id !== templateId);
            await chrome.storage.local.set({ templates: templateData });
            
            // 重新加载模板列表
            this.loadTemplates();
            showToast('模板已删除', 'success');
        } catch (error) {
            console.error('删除模板失败:', error);
            showToast('删除模板失败', 'error');
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 加载模板列表
    window.templates.loadTemplates();

    // 监听保存模板事件
    const confirmSaveTemplate = document.getElementById('confirmSaveTemplate');
    if (confirmSaveTemplate) {
        confirmSaveTemplate.addEventListener('click', async () => {
            const templateName = document.getElementById('templateName')?.value.trim();
            const templateDesc = document.getElementById('templateDesc')?.value.trim();
            
            if (!templateName) {
                showToast('请输入模板名称', 'error');
                return;
            }

            try {
                const result = await chrome.storage.local.get(['templates']);
                let templateData = result.templates || [];
                
                const newTemplate = {
                    id: Date.now(),
                    name: templateName,
                    description: templateDesc,
                    method: document.getElementById('httpMethod')?.value || 'GET',
                    url: document.getElementById('urlInput')?.value || '',
                    headers: getHeaders(),
                    body: document.getElementById('requestBody')?.value || '',
                    proxy: getProxyConfig()
                };

                templateData.push(newTemplate);
                await chrome.storage.local.set({ templates: templateData });

                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(document.getElementById('saveTemplateModal'));
                if (modal) modal.hide();

                // 清空输入
                document.getElementById('templateName').value = '';
                document.getElementById('templateDesc').value = '';

                // 重新加载模板列表
                window.templates.loadTemplates();
                showToast('模板保存成功', 'success');
            } catch (error) {
                console.error('保存模板失败:', error);
                showToast('保存模板失败', 'error');
            }
        });
    }
});

// 辅助函数
function getHeaders() {
    const headers = {};
    document.querySelectorAll('.header-row').forEach(row => {
        const key = row.querySelector('.header-key')?.value;
        const value = row.querySelector('.header-value')?.value;
        if (key && value) {
            headers[key] = value;
        }
    });
    return headers;
}

function getProxyConfig() {
    return {
        enabled: document.getElementById('enableProxy')?.checked || false,
        type: document.getElementById('proxyType')?.value || 'http',
        host: document.getElementById('proxyHost')?.value || '',
        port: document.getElementById('proxyPort')?.value || '',
        username: document.getElementById('proxyUsername')?.value || '',
        password: document.getElementById('proxyPassword')?.value || ''
    };
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
} 