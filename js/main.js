function addHeaderRow(key = '', value = '') {
  const container = document.getElementById('headersContainer');
  const headerRow = document.createElement('div');
  headerRow.className = 'header-row';

  // 创建请求头名称输入框
  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.className = 'header-key';
  keyInput.placeholder = '请求头名称';
  keyInput.value = key;

  // 创建请求头值输入框
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.className = 'header-value';
  valueInput.placeholder = '请求头值';
  valueInput.value = value;

  // 创建删除按钮
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-header-btn';
  deleteBtn.innerHTML = '×';
  deleteBtn.onclick = () => headerRow.remove();

  // 组装行元素
  headerRow.appendChild(keyInput);
  headerRow.appendChild(valueInput);
  headerRow.appendChild(deleteBtn);
  container.appendChild(headerRow);
}

document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const methodSelect = document.getElementById('httpMethod');
  const urlInput = document.getElementById('urlInput');
  const headersContainer = document.getElementById('headersContainer');
  const requestBody = document.getElementById('requestBody');
  const sendButton = document.getElementById('sendRequest');
  const commonHeaders = document.getElementById('commonHeaders');
  const historySearch = document.getElementById('historySearch');
  const historyFilter = document.getElementById('historyFilter');
  const clearHistoryBtn = document.getElementById('clearHistory');
  const historyPanel = document.getElementById('historyPanel');
  const resizer = document.getElementById('panelResizer');
  const toggleHistoryBtn = document.getElementById('toggleHistory');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const saveTemplateBtn = document.getElementById('saveTemplateBtn');

  // 分别获取左侧历史面板和右侧请求配置的标签页元素
  const historyTabBtns = document.querySelectorAll('.history-panel .tab-btn');
  const historyTabContents = document.querySelectorAll('.history-panel .tab-content');
  const requestTabBtns = document.querySelectorAll('.request-tabs .tab-btn');
  const requestTabContents = document.querySelectorAll('.request-tabs .tab-content');

  // 修改这部代码
  function initializeEventListeners() {
    // 获取所有需要的DOM元素
    const elements = {
      addHeaderBtn: document.getElementById('addHeaderBtn'),
      commonHeadersSelect: document.getElementById('commonHeaders'),
      parseCurlBtn: document.getElementById('parseCurl'),
      saveTemplateBtn: document.getElementById('saveTemplateBtn'),
      modalElement: document.getElementById('saveTemplateModal'),
      confirmSaveTemplate: document.getElementById('confirmSaveTemplate'),
      sendButton: document.getElementById('sendRequest'),
      clearHistoryBtn: document.getElementById('clearHistory'),
      historySearch: document.getElementById('historySearch'),
      historyFilter: document.getElementById('historyFilter'),
      historyPanel: document.getElementById('historyPanel'),
      resizer: document.getElementById('panelResizer'),
      toggleHistoryBtn: document.getElementById('toggleHistory')
    };

    // 检查所有必需的元素是否都已加载
    const missingElements = Object.entries(elements)
      .filter(([key, element]) => !element)
      .map(([key]) => key);

    if (missingElements.length > 0) {
      console.log('等待元素加载:', missingElements.join(', '));
      setTimeout(initializeEventListeners, 100);
      return;
    }

    // 所有元素都已加载，开始添加事件监听器
    try {
      // 初始化左侧历史面板的标签页切换
      const historyTabBtns = document.querySelectorAll('.history-panel .tab-btn');
      const historyTabContents = document.querySelectorAll('.history-panel .tab-content');
      
      if (historyTabBtns.length && historyTabContents.length) {
        historyTabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            historyTabBtns.forEach(b => b.classList.remove('active'));
            historyTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.dataset.tab + 'Tab';
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
              tabContent.classList.add('active');
            }
          });
        });
      }

      // 初始化右侧请求配置的标签页切换
      const requestTabBtns = document.querySelectorAll('.request-tabs .tab-btn');
      const requestTabContents = document.querySelectorAll('.request-tabs .tab-content');
      
      if (requestTabBtns.length && requestTabContents.length) {
        requestTabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            requestTabBtns.forEach(b => b.classList.remove('active'));
            requestTabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.dataset.tab + 'Tab';
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
              tabContent.classList.add('active');
            }
          });
        });
      }

      // 其他事件监听器的初始化保持不变...
    } catch (error) {
      console.error('初始化事件监听器失败:', error);
    }
  }

  // 开始初始化事件监听器
  setTimeout(initializeEventListeners, 100);

  // 添加代理设置相关代码
  const enableProxy = document.getElementById('enableProxy');
  const proxyInputs = document.querySelector('.proxy-inputs');
  const proxyType = document.getElementById('proxyType');
  const proxyHost = document.getElementById('proxyHost');
  const proxyPort = document.getElementById('proxyPort');
  const proxyUsername = document.getElementById('proxyUsername');
  const proxyPassword = document.getElementById('proxyPassword');

  // 代理开关事件
  if (enableProxy) {
    enableProxy.addEventListener('change', function() {
      if (proxyInputs) {
        proxyInputs.style.display = this.checked ? 'flex' : 'none';
      }
    });
  }

  // 添加重定向设置相关代码
  const enableRedirect = document.getElementById('enableRedirect');
  const redirectInfo = document.querySelector('.redirect-info');
  const maxRedirects = document.getElementById('maxRedirects');

  // 重定向开关事件
  if (enableRedirect) {
    enableRedirect.addEventListener('change', function() {
      if (redirectInfo) {
        redirectInfo.style.display = this.checked ? 'flex' : 'none';
      }
    });
  }

  // 修改发送请求按钮的事件监听代码
  if (sendButton) {
    sendButton.addEventListener('click', () => {
      // 验证URL
      const url = urlInput?.value?.trim() || '';
      if (!url) {
        displayError({ error: '请输入有效的URL' });
        return;
      }

      try {
        // 验证URL格式
        new URL(url);
      } catch (e) {
        displayError({ error: 'URL格式无效，请确保包含 http:// 或 https://' });
        return;
      }

      // 收集请求头
      const headers = {};
      document.querySelectorAll('.header-row').forEach(row => {
        const key = row.querySelector('.header-key')?.value?.trim();
        const value = row.querySelector('.header-value')?.value?.trim();
        if (key && value) {
          headers[key] = value;
        }
      });

      // 收集代理设置 - 修改代理配置的收集方式
      const enableProxy = document.getElementById('enableProxy');
      let proxyConfig = null;
      
      if (enableProxy && enableProxy.checked) {
        const proxyType = document.getElementById('proxyType');
        const proxyHost = document.getElementById('proxyHost');
        const proxyPort = document.getElementById('proxyPort');
        const proxyUsername = document.getElementById('proxyUsername');
        const proxyPassword = document.getElementById('proxyPassword');

        // 确保只收集必要的代理信息，不包含任何可能影响全局设置的配置
        proxyConfig = {
          enabled: true,
          type: proxyType?.value || 'http',
          host: proxyHost?.value || '',
          port: proxyPort?.value || '',
          username: proxyUsername?.value || '',
          password: proxyPassword?.value || '',
          isLocalProxy: true  // 标记这是本地代理配置
        };
      }

      // 构建请求数据
      const requestData = {
        type: 'makeRequest',
        method: methodSelect?.value || 'GET',
        url: url,
        headers: {
          ...headers,
          'Accept': '*/*',
          'Connection': 'keep-alive'
        },
        body: requestBody?.value || '',
        timestamp: new Date().toISOString()
      };

      // 只在需要时添加代理配置
      if (proxyConfig) {
        requestData.proxy = proxyConfig;
      }

      const responseContainer = document.getElementById('responseContainer');
      if (responseContainer) {
        responseContainer.innerHTML = '<div class="loading">正在发送请求...</div>';
      }

      // 发送请求并处理响应
      chrome.runtime.sendMessage(requestData, response => {
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          displayError({ 
            error: '请求失败', 
            details: chrome.runtime.lastError.message 
          });
          return;
        }

        // 添加空值检查
        if (!response) {
          displayError({ error: '未收到响应数据' });
          return;
        }

        // 处理错误响应
        if (response.error) {
          displayError({ 
            error: '请求失败', 
            details: response.error 
          });
          return;
        }

        try {
          // 构造安全的响应对象
          const safeResponse = {
            success: true,  // 如果没有错误，则认为成功
            status: response.status || 0,
            statusText: response.statusText || '',
            headers: response.headers || {},
            data: response.data || null
          };

          // 处理��功的响应
          displayResponse(safeResponse);
          
          // 保存到历史记录
          const historyData = {
            ...requestData,
            response: safeResponse
          };
          saveToHistory(historyData);
        } catch (error) {
          console.error('处理响应失败:', error);
          displayError({ 
            error: '处理响应失败', 
            details: error.message 
          });
        }
      });
    });
  }

  // 清空历史记录按钮事件
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', async () => {
      if (confirm('确定要清空所历史记录吗？')) {
        try {
          await chrome.storage.local.remove(['history']);
          await loadHistory();
          showToast('历史记录空', 'success');
        } catch (error) {
          console.error('清空历史记录失败:', error);
          showToast('清空历史记录失败', 'error');
        }
      }
    });
  }

  // 搜索和筛选事件监听
  if (historySearch && historyFilter) {
    historySearch.addEventListener('input', filterHistory);
    historyFilter.addEventListener('change', filterHistory);
  }

  // 加载历史记录
  loadHistory();

  // 添加模板点击事件
  document.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      const method = item.querySelector('.method').textContent;
      const url = item.querySelector('.url').textContent;
      const body = item.querySelector('.template-body')?.textContent || '';
      const headers = item.querySelector('.template-headers')?.textContent || '';

      methodSelect.value = method;
      urlInput.value = url;
      requestBody.value = body;

      if (headers) {
        const headerLines = headers.split('\n');
        headerLines.forEach(line => {
          const [key, value] = line.split(':').map(s => s.trim());
          if (key && value) {
            addHeaderRow(key, value);
          }
        });
      }
    });
  });

  if (saveTemplateBtn) {
    saveTemplateBtn.addEventListener('click', () => {
      // 获取必要的DOM元素
      const methodSelect = document.getElementById('httpMethod');
      const urlInput = document.getElementById('urlInput');
      const requestBody = document.getElementById('requestBody');

      // 收集请求头
      const headers = {};
      document.querySelectorAll('.header-row').forEach(row => {
        const key = row.querySelector('.header-key')?.value;
        const value = row.querySelector('.header-value')?.value;
        if (key && value) {
          headers[key] = value;
        }
      });

      // 收集代理设置
      const enableProxy = document.getElementById('enableProxy');
      const proxyType = document.getElementById('proxyType');
      const proxyHost = document.getElementById('proxyHost');
      const proxyPort = document.getElementById('proxyPort');
      const proxyUsername = document.getElementById('proxyUsername');
      const proxyPassword = document.getElementById('proxyPassword');

      const proxyConfig = {
        enabled: enableProxy?.checked || false,
        type: proxyType?.value || 'http',
        host: proxyHost?.value || '',
        port: proxyPort?.value || '',
        username: proxyUsername?.value || '',
        password: proxyPassword?.value || '',
        isLocalProxy: true
      };

      // 获取模态框元素
      const modalElement = document.getElementById('saveTemplateModal');
      if (!modalElement) {
        console.error('找不到模态框元素');
        return;
      }

      let modal;
      try {
        modal = new bootstrap.Modal(modalElement);
      } catch (error) {
        console.error('初始化模态框失败:', error);
        return;
      }

      // 确认保存模板按钮事件
      const confirmSaveTemplate = document.getElementById('confirmSaveTemplate');
      if (confirmSaveTemplate) {
        confirmSaveTemplate.onclick = async () => {
          try {
            const templateName = document.getElementById('templateName')?.value?.trim();
            const templateDesc = document.getElementById('templateDesc')?.value?.trim();
            
            if (!templateName) {
              showToast('请输入模板名称', 'error');
              return;
            }
            
            // 构建模板数据
            const template = {
              name: templateName,
              description: templateDesc,
              method: methodSelect?.value || 'GET',
              url: urlInput?.value || '',
              headers: headers,
              body: requestBody?.value || '',
              proxy: proxyConfig,
              timestamp: new Date().toISOString()
            };

            // 直接使用 chrome.storage.local 保存
            const result = await chrome.storage.local.get(['templates']);
            const templates = result.templates || [];
            templates.push(template);
            await chrome.storage.local.set({ templates });

            // 隐藏模态框
            modal.hide();
            
            // 等待模态框动画完成后再清理
            setTimeout(() => {
              // 移除模态框背景
              const backdrops = document.querySelectorAll('.modal-backdrop');
              backdrops.forEach(backdrop => backdrop.remove());
              
              // 移除body上的modal相关类和样式
              document.body.classList.remove('modal-open');
              document.body.style.removeProperty('padding-right');
              document.body.style.removeProperty('overflow');
              
              // 重置模态框的显示状态
              modalElement.style.display = 'none';
              modalElement.classList.remove('show');
              modalElement.setAttribute('aria-hidden', 'true');
              modalElement.removeAttribute('aria-modal');
              modalElement.removeAttribute('role');
              
              // 清空输入框
              document.getElementById('templateName').value = '';
              document.getElementById('templateDesc').value = '';
              
              // 显示成功提示
              showToast('模板保存成功', 'success');
              
              // 重新加载模板列表
              if (typeof loadTemplates === 'function') {
                loadTemplates();
              }
            }, 300); // 等待模态框关闭动画完成

          } catch (error) {
            console.error('保存模板失败:', error);
            showToast('保存模板失败: ' + error.message, 'error');
          }
        };
      }

      // 显示模态框
      try {
        modal.show();
      } catch (error) {
        console.error('显示模态框失败:', error);
        showToast('显示模态框失败', 'error');
      }
    });
  }

  // 修改响应标签页始化代码
  function initializeResponseTabs() {
    const responseTabBtns = document.querySelectorAll('.response-tabs .tab-btn');
    const responseTabContents = document.querySelectorAll('.response-tabs .tab-content');

    if (responseTabBtns.length && responseTabContents.length) {
      responseTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // 移除所有活动状态
          responseTabBtns.forEach(b => b.classList.remove('active'));
          responseTabContents.forEach(c => c.classList.remove('active'));
          
          // 添加当前标签的活动状态
          btn.classList.add('active');
          const tabId = btn.dataset.tab + 'Tab';
          const tabContent = document.getElementById(tabId);
          if (tabContent) {
            tabContent.classList.add('active');
          }
        });
      });
    }
  }

  // 在显示响应时初始化标签页
  function displayResponse(response) {
    const responseContainer = document.getElementById('responseContainer');
    if (!responseContainer) {
      console.error('Response container not found');
      return;
    }

    // 清除加载状态并添加新的DOM结构
    responseContainer.innerHTML = `
      <div class="response-status">
        <span id="responseStatus"></span>
      </div>
      <div class="response-tabs">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="responseBody">响应体</button>
          <button class="tab-btn" data-tab="responseHeaders">响应头</button>
          <button class="tab-btn" data-tab="responseCookies">Cookie</button>
        </div>
        
        <div class="tab-content active" id="responseBodyTab">
          <div class="response-body-controls">
            <select id="responseFormat">
              <option value="formatted">格式化</option>
              <option value="raw">原始数据</option>
            </select>
            <select id="indentSize">
              <option value="2">缩进: 2空格</option>
              <option value="4">缩进: 4空格</option>
              <option value="tab">缩进: Tab</option>
            </select>
            <button id="expandAll">全部展开</button>
            <button id="collapseAll">全部折叠</button>
          </div>
          <div id="responseBodyFormatted" class="json-viewer"></div>
          <pre id="responseBodyRaw" style="display: none;"></pre>
        </div>
        
        <div class="tab-content" id="responseHeadersTab">
          <pre id="responseHeadersContent"></pre>
        </div>
        
        <div class="tab-content" id="responseCookiesTab">
          <pre id="responseCookiesContent"></pre>
        </div>
      </div>
    `;

    // 等待DOM更新完成后再添加事件监听器
    setTimeout(() => {
      // 初始化响应标签页
      const responseTabBtns = responseContainer.querySelectorAll('.response-tabs .tab-btn');
      const responseTabContents = responseContainer.querySelectorAll('.response-tabs .tab-content');

      if (responseTabBtns.length && responseTabContents.length) {
        responseTabBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            // 移除所有活动状态
            responseTabBtns.forEach(b => b.classList.remove('active'));
            responseTabContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前标的活动状态
            btn.classList.add('active');
            const tabId = btn.dataset.tab + 'Tab';
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
              tabContent.classList.add('active');
            }
          });
        });
      }

      // 获取新创建的元素
      const statusElement = document.getElementById('responseStatus');
      const bodyFormatted = document.getElementById('responseBodyFormatted');
      const bodyRaw = document.getElementById('responseBodyRaw');
      const headersContent = document.getElementById('responseHeadersContent');
      const cookiesContent = document.getElementById('responseCookiesContent');
      const formatSelect = document.getElementById('responseFormat');
      const indentSelect = document.getElementById('indentSize');
      const expandAllBtn = document.getElementById('expandAll');
      const collapseAllBtn = document.getElementById('collapseAll');
      
      if (!response.success) {
        displayError(response);
        return;
      }

      // 显示状态
      if (statusElement) {
        statusElement.textContent = `状态: ${response.status} ${response.statusText}`;
      }
      
      // 修改处理响应体的部分
      let responseData = response.data;
      let rawData = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
      
      // 显示原始数据（默认隐藏）
      if (bodyRaw) {
        bodyRaw.textContent = rawData;
        bodyRaw.style.display = 'none';  // 默认隐藏原始数据
      }

      // 格式并显示JSON（默认示）
      if (bodyFormatted) {
        try {
          if (typeof responseData === 'string') {
            responseData = JSON.parse(responseData);
          }
          renderJsonViewer(bodyFormatted, responseData);
          bodyFormatted.style.display = 'block';  // 默认显示格式化数据
        } catch (e) {
          bodyFormatted.innerHTML = `<div class="error">无法解析为JSON: ${e.message}</div>`;
          // 如果无法解析为JSON，显示原始数据
          if (bodyRaw) {
            bodyRaw.style.display = 'block';
            bodyFormatted.style.display = 'none';
          }
        }
      }

      // 显示响应头
      if (headersContent) {
        headersContent.textContent = JSON.stringify(response.headers, null, 2);
      }

      // 修改处理Cookie的部分
      if (cookiesContent) {
        // 优先使用直接返回的 cookies 数组
        if (response.cookies && response.cookies.length > 0) {
          cookiesContent.innerHTML = '<div class="cookies-list">';
          
          response.cookies.forEach(cookie => {
            cookiesContent.innerHTML += `
              <div class="cookie-item">
                <div class="cookie-header">
                  <span class="cookie-name">${escapeHtml(cookie.name)}</span>
                  <span class="cookie-value">${escapeHtml(cookie.value)}</span>
                </div>
                <div class="cookie-attributes">
                  ${cookie.domain ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">domain</span>
                      <span class="attribute-value">${escapeHtml(cookie.domain)}</span>
                    </span>
                  ` : ''}
                  ${cookie.path ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">path</span>
                      <span class="attribute-value">${escapeHtml(cookie.path)}</span>
                    </span>
                  ` : ''}
                  ${cookie.expirationDate ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">expires</span>
                      <span class="attribute-value">${new Date(cookie.expirationDate * 1000).toUTCString()}</span>
                    </span>
                  ` : ''}
                  ${cookie.secure ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">secure</span>
                    </span>
                  ` : ''}
                  ${cookie.httpOnly ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">httpOnly</span>
                    </span>
                  ` : ''}
                  ${cookie.sameSite ? `
                    <span class="cookie-attribute">
                      <span class="attribute-key">sameSite</span>
                      <span class="attribute-value">${escapeHtml(cookie.sameSite)}</span>
                    </span>
                  ` : ''}
                </div>
              </div>
            `;
          });

          cookiesContent.innerHTML += '</div>';
        } else {
          // 回退到从响应头解析cookie
          // ... 保持原有的从响应头解析cookie的代码 ...
        }
      }

      // 修改格式换件
      if (formatSelect) {
        formatSelect.value = 'formatted';  // 设置默认选项为格式化
        formatSelect.addEventListener('change', function() {
          if (this.value === 'raw') {
            bodyRaw.style.display = 'block';
            bodyFormatted.style.display = 'none';
          } else {
            bodyRaw.style.display = 'none';
            bodyFormatted.style.display = 'block';
          }
        });
      }

      // 添加缩进大小切换事件
      if (indentSelect) {
        indentSelect.addEventListener('change', function() {
          const indent = this.value === 'tab' ? '\t' : Number(this.value);
          if (bodyFormatted) {
            try {
              renderJsonViewer(bodyFormatted, responseData, { indent });
            } catch (e) {
              console.error('重新渲染JSON失败:', e);
            }
          }
        });
      }

      // 展开/折叠按钮事件
      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
          document.querySelectorAll('.json-viewer .collapsible').forEach(el => {
            el.classList.remove('collapsed');
          });
        });
      }

      if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
          document.querySelectorAll('.json-viewer .collapsible').forEach(el => {
            el.classList.add('collapsed');
          });
        });
      }

      // 初始化响应标签页
      initializeResponseTabs();
    }, 0);
  }

  // 解析cURL命令的函数
  function parseCurlCommand(curlCommand) {
    try {
        // 清理命令字符串，处理多行和转义
        const cleanCommand = curlCommand
            .replace(/\\\n\s*/g, ' ')  // 处理多行
            .replace(/\\'/g, "'")      // 处理转义的引号
            .trim();

        // 解析请求方法
        const methodMatch = cleanCommand.match(/--request\s+(\w+)/i) || 
                          cleanCommand.match(/-X\s+(\w+)/i) ||
                          cleanCommand.match(/--location\s+--request\s+(\w+)/i);
        if (methodMatch) {
            document.getElementById('httpMethod').value = methodMatch[1]?.toUpperCase() || 'GET';
        }

        // 解析URL - 支持带引号和不带号的URL
        const urlMatch = cleanCommand.match(/curl\s+(?:--location\s+)?(?:--request\s+\w+\s+)?['"]?(https?:\/\/[^'"]\S+)['"]?/i) ||
                        cleanCommand.match(/curl\s+(?:--location\s+)?(?:--request\s+\w+\s+)?(['"])(https?:\/\/.*?)\1/i);
        if (urlMatch) {
            document.getElementById('urlInput').value = urlMatch[1] || urlMatch[2];
        }

        // 清除现有请求头
        const headersContainer = document.getElementById('headersContainer');
        if (headersContainer) {
            headersContainer.innerHTML = '';
        }

        // 解析请求头
        const headerMatches = cleanCommand.match(/(?:--header|-H)\s+['"]([^'"]+)['"]/g);
        if (headerMatches) {
            headerMatches.forEach(match => {
                const headerContent = match.match(/(?:--header|-H)\s+['"]([^'"]+)['"]/)[1];
                const [key, ...valueParts] = headerContent.split(':');
                const value = valueParts.join(':').trim();
                if (key && value) {
                    addHeaderRow(key, value);
                }
            });
        }

        // 解析请求体 - 支持 JSON 格式
        const dataMatch = cleanCommand.match(/--data-raw\s+'({[\s\S]*?})'/);
        if (dataMatch) {
            try {
                // 尝试解析和格式化 JSON
                const jsonData = JSON.parse(dataMatch[1]);
                document.getElementById('requestBody').value = JSON.stringify(jsonData, null, 4);
            } catch (e) {
                // 如果不是有效的 JSON，直接使用原始字符串
                document.getElementById('requestBody').value = dataMatch[1];
            }
        }

        // 清空cURL命令输入框
        document.getElementById('curlCommand').value = '';

        // 显示成功提示
        showToast('cURL命令解析成功', 'success');

    } catch (error) {
        console.error('解析cURL命令失败:', error);
        showToast('解析cURL命令失败: ' + error.message, 'error');
    }
  }

  // 获取请求头函数
  function getHeaders() {
    const headers = {};
    const headerRows = document.querySelectorAll('.header-row');
    
    headerRows.forEach(row => {
      const key = row.querySelector('.header-key').value.trim();
      const value = row.querySelector('.header-value').value.trim();
      if (key && value) {
        headers[key] = value;
      }
    });
    
    return headers;
  }

  // 添加等待templates对象加载的函数
  function waitForTemplates(callback, maxAttempts = 10) {
    let attempts = 0;
    
    function checkTemplates() {
        attempts++;
        if (window.templates) {
            callback();
        } else if (attempts < maxAttempts) {
            setTimeout(checkTemplates, 100);
        } else {
            console.error('无法加载templates对象');
        }
    }
    
    checkTemplates();
  }

  // 修改loadTemplates函数
  function loadTemplates() {
    waitForTemplates(() => {
        try {
            window.templates.loadTemplates();
        } catch (error) {
            console.error('加载模板失败:', error);
        }
    });
  }

  // 在DOMContentLoaded事件中调用loadTemplates
  document.addEventListener('DOMContentLoaded', () => {
    // ... 其他初始化代码 ...
    loadTemplates();
  });

  // 添加模态框初始化函数
  function initializeModal() {
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    const modalElement = document.getElementById('saveTemplateModal');
    
    if (!saveTemplateBtn || !modalElement || !window.bootstrap) {
      console.log('等待元素和Bootstrap加载...');
      setTimeout(initializeModal, 100);
      return;
    }

    try {
      // 初始化Bootstrap模态框
      const saveTemplateModal = new bootstrap.Modal(modalElement);

      // 保存模板按钮点击事件
      saveTemplateBtn.addEventListener('click', () => {
        console.log('Opening modal...'); // 调试日志
        saveTemplateModal.show();
      });

      // 确认保存模板按钮事件
      const confirmSaveTemplate = document.getElementById('confirmSaveTemplate');
      if (confirmSaveTemplate) {
        confirmSaveTemplate.addEventListener('click', () => {
          const templateName = document.getElementById('templateName')?.value.trim();
          const templateDesc = document.getElementById('templateDesc')?.value.trim();
          
          if (!templateName) {
            alert('请输入模板名称');
            return;
          }
          
          // 获取当前请求的信息
          const template = {
            name: templateName,
            description: templateDesc,
            method: document.getElementById('httpMethod')?.value || 'GET',
            url: document.getElementById('urlInput')?.value || '',
            headers: getHeaders(),
            body: document.getElementById('requestBody')?.value || ''
          };
          
          // 发送保存请求
          chrome.runtime.sendMessage(
            { type: 'saveTemplate', template },
            (response) => {
              if (response.success) {
                alert('模板保存成功！');
                saveTemplateModal.hide();
                // 清空输入框
                document.getElementById('templateName').value = '';
                document.getElementById('templateDesc').value = '';
                // 重新加载模板列表
                loadTemplates();
              } else {
                alert('保存失败：' + response.message);
              }
            }
          );
        });
      }
    } catch (error) {
      console.error('初始化模态框失败:', error);
    }
  }

  // 启动模态框初始化
  initializeModal();

  // 添加请求头按钮事件监听
  const addHeaderBtn = document.getElementById('addHeaderBtn');
  if (addHeaderBtn) {
    addHeaderBtn.addEventListener('click', () => {
      addHeaderRow();
    });
  }

  // 初始化面板拖动功能
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  // 简化切换按钮逻辑
  if (toggleHistoryBtn && historyPanel) {
    // 初始化面板状态
    chrome.storage.local.get(['historyPanelCollapsed'], (data) => {
      if (data.historyPanelCollapsed) {
        historyPanel.classList.add('collapsed');
        toggleHistoryBtn.querySelector('.toggle-icon').textContent = '▶';
        toggleHistoryBtn.style.left = '0';
      }
    });

    // 切换按钮点击件
    toggleHistoryBtn.addEventListener('click', () => {
      const isCollapsed = historyPanel.classList.toggle('collapsed');
      toggleHistoryBtn.querySelector('.toggle-icon').textContent = isCollapsed ? '▶' : '◀';
      
      // 保存状态
      chrome.storage.local.set({ historyPanelCollapsed: isCollapsed });
    });
  }

  // 修改拖动功能
  if (resizer && historyPanel && toggleHistoryBtn) {
    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = historyPanel.offsetWidth;
      document.body.style.cursor = 'col-resize';
      
      const handleMouseMove = (e) => {
        if (!isResizing) return;
        const width = Math.min(600, Math.max(200, startWidth + (e.clientX - startX)));
        historyPanel.style.width = `${width}px`;
        toggleHistoryBtn.style.left = `${width}px`;
      };
      
      const handleMouseUp = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      e.preventDefault();
    });
  }

  // 添加常见请求头选择事件
  const commonHeadersSelect = document.getElementById('commonHeaders');
  if (commonHeadersSelect) {
    commonHeadersSelect.addEventListener('change', function() {
      if (this.value) {
        try {
          const [key, value] = this.value.split(':').map(s => s.trim());
          if (key) {
            addHeaderRow(key, value ? value.trim() : '');
            // 重置选择框
            this.value = '';
          }
        } catch (error) {
          console.error('解析请求头数据败:', error);
        }
      }
    });
  }

  // 添加设置面板切换功能
  const settingsToggles = document.querySelectorAll('.settings-toggle');
  settingsToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.dataset.target;
      const targetContent = document.getElementById(targetId);
      const toggleIcon = this.querySelector('.toggle-icon');
      
      if (targetContent) {
        const isVisible = targetContent.style.display !== 'none';
        targetContent.style.display = isVisible ? 'none' : 'block';
        toggleIcon.textContent = isVisible ? '▼' : '▲';
      }
    });
  });

  // 请求头管理相关函数
  function addHeaderRow(key = '', value = '') {
    const container = document.getElementById('headersContainer');
    const headerRow = document.createElement('div');
    headerRow.className = 'header-row';

    // 创建请求头名称输入框
    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.className = 'header-key';
    keyInput.placeholder = '请求头名称';
    keyInput.value = key;

    // 创建请求头值输入框
    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'header-value';
    valueInput.placeholder = '请求头值';
    valueInput.value = value;

    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-header-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => headerRow.remove();

    // 组装行元素
    headerRow.appendChild(keyInput);
    headerRow.appendChild(valueInput);
    headerRow.appendChild(deleteBtn);
    container.appendChild(headerRow);
  }

  // 获取所有请求头
  function getHeaders() {
    const headers = {};
    const headerRows = document.querySelectorAll('.header-row');
    
    headerRows.forEach(row => {
      const key = row.querySelector('.header-key').value.trim();
      const value = row.querySelector('.header-value').value.trim();
      if (key && value) {
        headers[key] = value;
      }
    });
    
    return headers;
  }

  // 始化请求头相关事件监听
  function initHeadersEvents() {
    // 添加请求头按钮
    document.getElementById('addHeaderBtn').addEventListener('click', () => {
      addHeaderRow();
    });

    // 常用请求头下拉框
    document.getElementById('commonHeaders').addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected) {
        const [key, value] = selected.split(':');
        addHeaderRow(key, value);
        e.target.value = ''; // 重置选择
      }
    });
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', () => {
    initHeadersEvents();
    // 添加一个默认的空请求头行
    addHeaderRow();
  });

  // 添加 curl 解析相关代码
  const parseCurlBtn = document.getElementById('parseCurl');
  const curlCommandInput = document.getElementById('curlCommand');

  if (parseCurlBtn && curlCommandInput) {
    parseCurlBtn.addEventListener('click', () => {
      const curlCommand = curlCommandInput.value.trim();
      if (curlCommand) {
        parseCurlCommand(curlCommand);
      } else {
        showToast('请输入cURL命令', 'error');
      }
    });
  }
});

// 监听来其他页面的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'loadRequest') {
    loadRequestData(message.data);
  }
});

// 渲染JSON查看器
function renderJsonViewer(container, data, options = { indent: 2 }) {
  function createNode(key, value, level = 0) {
    const wrapper = document.createElement('div');
    wrapper.className = 'json-node';
    wrapper.style.marginLeft = `${level * 20}px`;

    const keySpan = document.createElement('span');
    keySpan.className = 'json-key';
    keySpan.textContent = key ? `"${key}": ` : '';

    const valueContainer = document.createElement('span');
    valueContainer.className = 'json-value';

    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      const isArray = Array.isArray(value);
      const bracketSpan = document.createElement('span');
      bracketSpan.className = 'json-bracket';
      bracketSpan.textContent = isArray ? '[' : '{';
      
      const content = document.createElement('div');
      content.className = 'json-content collapsible';
      
      Object.entries(value).forEach(([k, v]) => {
        content.appendChild(createNode(isArray ? '' : k, v, level + 1));
      });
      
      const closingBracket = document.createElement('span');
      closingBracket.className = 'json-bracket';
      closingBracket.textContent = isArray ? ']' : '}';
      closingBracket.style.marginLeft = `${level * 20}px`;

      wrapper.appendChild(keySpan);
      wrapper.appendChild(bracketSpan);
      wrapper.appendChild(content);
      wrapper.appendChild(closingBracket);

      // 添加折叠能
      bracketSpan.addEventListener('click', () => {
        content.classList.toggle('collapsed');
      });
    } else {
      valueContainer.textContent = typeof value === 'string' ? `"${value}"` : value;
      wrapper.appendChild(keySpan);
      wrapper.appendChild(valueContainer);
    }

    return wrapper;
  }

  container.innerHTML = '';
  container.appendChild(createNode('', data));
}

// 初始化响应标签页
function initResponseTabs() {
  const responseTabBtns = document.querySelectorAll('.response-tabs .tab-btn');
  const responseTabContents = document.querySelectorAll('.response-tabs .tab-content');

  responseTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      responseTabBtns.forEach(b => b.classList.remove('active'));
      responseTabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab') + 'Tab';
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
}

// 显示错误
function displayError(error) {
  const responseContainer = document.getElementById('responseContainer');
  if (responseContainer) {
    responseContainer.innerHTML = `
      <div class="error-container">
        <h4>错误</h4>
        <div class="error-message">${error.error}</div>
        ${error.details ? `<div class="error-details">${error.details}</div>` : ''}
        <div class="error-help">
          请检：
          <ul>
            <li>URL是否正确且包含http://或https://</li>
            <li>目标服务器是否可访问</li>
            <li>是否存在跨域制</li>
          </ul>
        </div>
      </div>
    `;
  }
  console.error('Request error:', error);
}
// 修改显示历史记录的函数
function displayHistory(history) {
  const historyContainer = document.getElementById('historyContainer');
  if (!historyContainer) return;

  // 清空现有内容
  historyContainer.innerHTML = '';

  // 添加新的历史记录项
  history.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.dataset.id = item.id;
    
    // 确保包含完整的请求数据，包括代理信息
    const safeItem = {
      id: item.id,
      method: item.method,
      url: item.url,
      headers: item.headers,
      body: item.body,
      timestamp: item.timestamp,
      proxy: item.proxy || {
        enabled: false,
        type: 'http',
        host: '',
        port: '',
        username: '',
        password: ''
      }
    };

    // 存储完整的请求数据
    historyItem.dataset.request = JSON.stringify(safeItem);
    
    // 添加代理信息到显示中
    const proxyInfo = item.proxy?.enabled 
      ? `<span class="proxy-info" title="使用代理: ${item.proxy.host}:${item.proxy.port}">🔒</span>` 
      : '';
    
    historyItem.innerHTML = `
      <div class="history-item-header">
        <span class="method ${item.method.toLowerCase()}">${item.method}</span>
        ${proxyInfo}
        <button class="delete-history-item" data-id="${item.id}" title="删除此记录">×</button>
      </div>
      <span class="url">${item.url}</span>
      <div class="history-item-details">
        <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
        <span class="header-count">${Object.keys(item.headers || {}).length} 个请求头</span>
        ${item.proxy?.enabled ? `<span class="proxy-type">${item.proxy.type.toUpperCase()} 代理</span>` : ''}
      </div>
    `;

    // 添加删除按钮的点击事件
    const deleteBtn = historyItem.querySelector('.delete-history-item');
    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('确定要删除这条历史记录吗？')) {
        try {
          // 从存储中获取最新的历史记录
          const result = await chrome.storage.local.get(['history']);
          let currentHistory = result.history || [];
          
          // 过滤掉要删除的记录
          const id = Number(e.target.dataset.id);
          currentHistory = currentHistory.filter(h => h.id !== id);
          
          // 更新储
          await chrome.storage.local.set({ history: currentHistory });
          
          // 从DOM中移除元素
          historyItem.remove();
          
          showToast('历史记录已删除', 'success');
        } catch (error) {
          console.error('删除历史记录失败:', error);
          showToast('删除历史记录失败', 'error');
        }
      }
    });

    // 添加点击事件加载请求数据
    historyItem.addEventListener('click', (e) => {
      if (!e.target.classList.contains('delete-history-item')) {
        try {
          const requestData = JSON.parse(historyItem.dataset.request);
          loadRequestData(requestData);
        } catch (error) {
          console.error('解析请求数据失败:', error);
        }
      }
    });

    historyContainer.appendChild(historyItem);
  });
}

// 修改保存历史记录的函数
async function saveToHistory(requestData) {
  try {
    const result = await chrome.storage.local.get(['history']);
    let history = result.history || [];
    
    // 清理代理配置中可能影全局设置的部分
    const cleanProxyConfig = requestData.proxy ? {
      enabled: requestData.proxy.enabled,
      type: requestData.proxy.type,
      host: requestData.proxy.host,
      port: requestData.proxy.port,
      username: requestData.proxy.username,
      password: requestData.proxy.password,
      isLocalProxy: true
    } : null;

    const historyItem = {
      id: Date.now() + Math.random(),
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers,
      body: requestData.body,
      timestamp: requestData.timestamp,
      proxy: cleanProxyConfig,  // 使用清理后的代理配置
      response: {
        status: requestData.response.status,
        statusText: requestData.response.statusText,
        headers: requestData.response.headers,
        data: requestData.response.data
      }
    };
    
    history.unshift(historyItem);
    if (history.length > 100) {
      history.pop();
    }
    
    await chrome.storage.local.set({ history });
    await loadHistory();
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
}

// 添加消息监听器来处理历史记录更新
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "HISTORY_UPDATED") {
    loadHistory();  // 重新加载历史记录
  }
});

// 修改加载历史记录的函数
async function loadHistory() {
  try {
    const result = await chrome.storage.local.get(['history']);
    let history = result.history || [];
    
    // 清理历史记录中的代理配置
    history = history.map(item => ({
      ...item,
      proxy: item.proxy ? {
        ...item.proxy,
        isLocalProxy: true  // 确保所有��理配置都标记为本地
      } : null
    }));
    
    // 保存清理后的历史记录
    await chrome.storage.local.set({ history });
    
    displayHistory(history);
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
}

// 添加显示提示的助函数
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// 修改加载历史记录中的请求数据到表单的函数
function loadRequestData(requestData) {
  // 等待 DOM 加载完成后再执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => doLoadRequestData(requestData));
    return;
  }
  doLoadRequestData(requestData);
}

// 实际执行加载请求数据的函数
function doLoadRequestData(requestData) {
  console.log('Loading request data:', requestData);

  // 修改选择器以匹配实际的 HTML 结构
  waitForElements([
    'select#httpMethod',           // 方法选择器
    'input#urlInput',             // URL 输入框
    'textarea#requestBody',       // 请求体文本框
    'div#headersContainer',       // 请求头容器
    '.tab-btn[data-tab="headers"]'  // 请求头标签页按钮
  ], 1000).then(elements => {
    try {
      const [methodSelect, urlInput, requestBody, headersContainer, headersTab] = elements;

      // 设置请求方法
      if (methodSelect && requestData.method) {
        methodSelect.value = requestData.method;
      }
      
      // 设置URL
      if (urlInput && requestData.url) {
        urlInput.value = requestData.url;
      }
      
      // 设置请求体
      if (requestBody && requestData.body) {
        requestBody.value = requestData.body;
      }
      
      // 清除现有请求头
      if (headersContainer) {
        headersContainer.innerHTML = '';
        
        // 添加请求头
        if (requestData.headers && typeof requestData.headers === 'object') {
          Object.entries(requestData.headers).forEach(([key, value]) => {
            if (typeof addHeaderRow === 'function') {
              addHeaderRow(key, value);
            }
          });
        }
      }

      // 切换到请求头标签页
      if (headersTab) {
        headersTab.click();
      }

      showToast('请求数据加载成功', 'success');
    } catch (error) {
      console.error('加载请求数据时发生错误:', error);
      showToast('加载请求数据失败: ' + error.message, 'error');
    }
  }).catch(error => {
    console.error('等待DOM元素超时:', error);
    // 输出当前页面上的实际元素ID，帮助调试
    const allElements = document.querySelectorAll('[id]');
    console.log('当前页面上的所有元素ID:', Array.from(allElements).map(el => el.id));
    showToast('加载请求数据失败: 页面元素未就绪', 'error');
  });
}

// 等待多个元素加载完成的辅助函数
function waitForElements(selectors, timeout = 5000) {
  const promises = selectors.map(selector => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素 ${selector} 超时`));
      }, timeout);
    });
  });

  return Promise.all(promises);
}

// 索和筛选历史记录
async function filterHistory() {
  try {
    const searchText = historySearch.value.toLowerCase();
    const filterMethod = historyFilter.value;
    
    const { history = [] } = await chrome.storage.local.get('history');
    
    const filteredHistory = history.filter(item => {
      const matchesSearch = item.url.toLowerCase().includes(searchText) ||
                           item.method.toLowerCase().includes(searchText);
      const matchesMethod = filterMethod === 'all' || item.method === filterMethod;
      return matchesSearch && matchesMethod;
    });
    
    displayHistory(filteredHistory);
  } catch (error) {
    console.error('筛选历史记录失败:', error);
  }
}

// 修改删除历史记录的处理
async function deleteHistoryItem(id) {
  try {
    // 发送消息给background script处理删除操作
    const response = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'deleteHistoryItem', id: id },
        (response) => resolve(response)
      );
    });

    if (response.success) {
      // 重新加载历史记录
      await loadHistory();
      return true;
    } else {
      console.error('删除历史记录失败:', response.error);
      return false;
    }
  } catch (error) {
    console.error('删除历史记录失败:', error);
    return false;
  }
}

function addNetworkRequest(requestData) {
  const requestList = document.getElementById('requestList');
  const requestItem = document.createElement('div');
  requestItem.className = 'request-item';
  
  requestItem.innerHTML = `
    <div class="request-method ${requestData.method.toLowerCase()}">${requestData.method}</div>
    <div class="request-url">${requestData.url}</div>
    <div class="request-time">${new Date(requestData.timestamp).toLocaleTimeString()}</div>
  `;
  
  requestItem.addEventListener('click', () => {
    displayRequestDetails(requestData);
  });
  
  requestList.appendChild(requestItem);
}

// 监听来自background的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_REQUEST_LIST") {
    addNetworkRequest(message.data);
  }
});

// 添加一些样式到 CSS
const style = document.createElement('style');
style.textContent = `
  .proxy-info {
    margin-left: 8px;
    color: #4CAF50;
    cursor: help;
  }

  .proxy-type {
    background: #e8f5e9;
    color: #388e3c;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.8em;
    margin-left: 8px;
  }
`;
document.head.appendChild(style);

// 添加显示请求详情的函数
function displayRequestDetails(requestData) {
  // 设置请求方法
  const methodSelect = document.getElementById('httpMethod');
  if (methodSelect) methodSelect.value = requestData.method;
  
  // 设置URL
  const urlInput = document.getElementById('urlInput');
  if (urlInput) urlInput.value = requestData.url;
  
  // 设置请求体
  const requestBody = document.getElementById('requestBody');
  if (requestBody) requestBody.value = requestData.body || '';
  
  // 设置代理信息
  if (requestData.proxy) {
    const enableProxy = document.getElementById('enableProxy');
    const proxyType = document.getElementById('proxyType');
    const proxyHost = document.getElementById('proxyHost');
    const proxyPort = document.getElementById('proxyPort');
    const proxyUsername = document.getElementById('proxyUsername');
    const proxyPassword = document.getElementById('proxyPassword');
    const proxyInputs = document.querySelector('.proxy-inputs');

    if (enableProxy) {
      enableProxy.checked = requestData.proxy.enabled;
      if (proxyInputs) {
        proxyInputs.style.display = requestData.proxy.enabled ? 'flex' : 'none';
      }
    }
    if (proxyType) proxyType.value = requestData.proxy.type || 'http';
    if (proxyHost) proxyHost.value = requestData.proxy.host || '';
    if (proxyPort) proxyPort.value = requestData.proxy.port || '';
    if (proxyUsername) proxyUsername.value = requestData.proxy.username || '';
    if (proxyPassword) proxyPassword.value = requestData.proxy.password || '';
  }
  
  // 清除现有请求头
  const headersContainer = document.getElementById('headersContainer');
  if (headersContainer) {
    headersContainer.innerHTML = '';
    
    // 添加请求头
    if (requestData.headers && typeof requestData.headers === 'object') {
      Object.entries(requestData.headers).forEach(([key, value]) => {
        addHeaderRow(key, value);
      });
    }
  }

  // 如果有响应数据，显示响应
  if (requestData.response) {
    displayResponse({
      success: true,
      status: requestData.response.status,
      statusText: requestData.response.statusText,
      headers: requestData.response.headers,
      data: requestData.response.data
    });
  }

  // 切换到请求头标签页
  const headersTab = document.querySelector('.tab-btn[data-tab="headers"]');
  if (headersTab) {
    headersTab.click();
  }
}

// 修改模板保存按钮的事件监听
if (saveTemplateBtn) {
  saveTemplateBtn.addEventListener('click', () => {
    // 获取必要的DOM元素
    const methodSelect = document.getElementById('httpMethod');
    const urlInput = document.getElementById('urlInput');
    const requestBody = document.getElementById('requestBody');

    // 收集请求头
    const headers = {};
    document.querySelectorAll('.header-row').forEach(row => {
      const key = row.querySelector('.header-key')?.value?.trim();
      const value = row.querySelector('.header-value')?.value?.trim();
      if (key && value) {
        headers[key] = value;
      }
    });

    // 收集代理设置
    const enableProxy = document.getElementById('enableProxy');
    const proxyType = document.getElementById('proxyType');
    const proxyHost = document.getElementById('proxyHost');
    const proxyPort = document.getElementById('proxyPort');
    const proxyUsername = document.getElementById('proxyUsername');
    const proxyPassword = document.getElementById('proxyPassword');

    const proxyConfig = {
      enabled: enableProxy?.checked || false,
      type: proxyType?.value || 'http',
      host: proxyHost?.value || '',
      port: proxyPort?.value || '',
      username: proxyUsername?.value || '',
      password: proxyPassword?.value || '',
      isLocalProxy: true
    };

    // 获取模态框元素
    const modalElement = document.getElementById('saveTemplateModal');
    if (!modalElement) {
      console.error('找不到模态框元素');
      return;
    }

    let modal;
    try {
      modal = new bootstrap.Modal(modalElement);
    } catch (error) {
      console.error('初始化模态框失败:', error);
      return;
    }

    // 确认保存模板按钮事件
    const confirmSaveTemplate = document.getElementById('confirmSaveTemplate');
    if (confirmSaveTemplate) {
      confirmSaveTemplate.onclick = async () => {
        try {
          const templateName = document.getElementById('templateName')?.value?.trim();
          const templateDesc = document.getElementById('templateDesc')?.value?.trim();
          
          if (!templateName) {
            showToast('请输入模板名称', 'error');
            return;
          }
          
          // 构建模板数据
          const template = {
            name: templateName,
            description: templateDesc,
            method: methodSelect?.value || 'GET',
            url: urlInput?.value || '',
            headers: headers,
            body: requestBody?.value || '',
            proxy: proxyConfig,
            timestamp: new Date().toISOString()
          };

          // 直接使用 chrome.storage.local 保存
          const result = await chrome.storage.local.get(['templates']);
          const templates = result.templates || [];
          templates.push(template);
          await chrome.storage.local.set({ templates });

          // 隐藏模态框
          modal.hide();
          
          // 等待模态框动画完成后再清理
          setTimeout(() => {
            // 移除模态框背景
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            
            // 移除body上的modal相关类和样式
            document.body.classList.remove('modal-open');
            document.body.style.removeProperty('padding-right');
            document.body.style.removeProperty('overflow');
            
            // 重置模态框的显示状态
            modalElement.style.display = 'none';
            modalElement.classList.remove('show');
            modalElement.setAttribute('aria-hidden', 'true');
            modalElement.removeAttribute('aria-modal');
            modalElement.removeAttribute('role');
            
            // 清空输入框
            document.getElementById('templateName').value = '';
            document.getElementById('templateDesc').value = '';
            
            // 显示成功提示
            showToast('模板保存成功', 'success');
            
            // 重新加载模板列表
            if (typeof loadTemplates === 'function') {
              loadTemplates();
            }
          }, 300); // 等待模态框关闭动画完成

        } catch (error) {
          console.error('保存模板失败:', error);
          showToast('保存模板失败: ' + error.message, 'error');
        }
      };
    }

    // 显示模态框
    try {
      modal.show();
    } catch (error) {
      console.error('显示模态框失败:', error);
      showToast('显示模态框失败', 'error');
    }
  });
}

// 修改模板点击事件
function initializeTemplateEvents() {
  document.querySelectorAll('.template-item').forEach(item => {
    item.addEventListener('click', () => {
      try {
        const templateData = JSON.parse(item.dataset.template);
        
        // 设置请求方法
        const methodSelect = document.getElementById('httpMethod');
        if (methodSelect) methodSelect.value = templateData.method;
        
        // 设置URL
        const urlInput = document.getElementById('urlInput');
        if (urlInput) urlInput.value = templateData.url;
        
        // 设置请求体
        const requestBody = document.getElementById('requestBody');
        if (requestBody) requestBody.value = templateData.body || '';
        
        // 设置代理信息
        if (templateData.proxy) {
          const enableProxy = document.getElementById('enableProxy');
          const proxyType = document.getElementById('proxyType');
          const proxyHost = document.getElementById('proxyHost');
          const proxyPort = document.getElementById('proxyPort');
          const proxyUsername = document.getElementById('proxyUsername');
          const proxyPassword = document.getElementById('proxyPassword');
          const proxyInputs = document.querySelector('.proxy-inputs');

          if (enableProxy) {
            enableProxy.checked = templateData.proxy.enabled;
            if (proxyInputs) {
              proxyInputs.style.display = templateData.proxy.enabled ? 'flex' : 'none';
            }
          }
          if (proxyType) proxyType.value = templateData.proxy.type || 'http';
          if (proxyHost) proxyHost.value = templateData.proxy.host || '';
          if (proxyPort) proxyPort.value = templateData.proxy.port || '';
          if (proxyUsername) proxyUsername.value = templateData.proxy.username || '';
          if (proxyPassword) proxyPassword.value = templateData.proxy.password || '';
        }
        
        // 清除现有请求头
        const headersContainer = document.getElementById('headersContainer');
        if (headersContainer) {
          headersContainer.innerHTML = '';
          
          // 添加请求头
          if (templateData.headers && typeof templateData.headers === 'object') {
            Object.entries(templateData.headers).forEach(([key, value]) => {
              addHeaderRow(key, value);
            });
          }
        }

        showToast('模板加载成功', 'success');
      } catch (error) {
        console.error('加载模板失败:', error);
        showToast('加载模板失败', 'error');
      }
    });
  });
}

// 添加HTML转义函数以防止XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 修改消息监听器部分
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOAD_REQUEST') {
    // 确保页面已经加载完成
    if (document.readyState === 'complete') {
      handleLoadRequest(message.data, sendResponse);
    } else {
      // 如果页面还没加载完成，等待加载
      window.addEventListener('load', () => {
        handleLoadRequest(message.data, sendResponse);
      });
    }
    return true; // 保持消息通道开启
  }
});

// 添加处理请求数据的函数
function handleLoadRequest(data, sendResponse) {
  try {
    // 获取必要的元素
    const methodSelect = document.querySelector('select#httpMethod');
    const urlInput = document.querySelector('input#urlInput');
    const requestBody = document.querySelector('textarea#requestBody');
    const headersContainer = document.querySelector('div#headersContainer');

    // 检查元素是否存在
    if (!methodSelect || !urlInput || !requestBody || !headersContainer) {
      console.error('找不到必要的DOM元素');
      sendResponse({ success: false, error: '页面元素未就绪' });
      return;
    }

    // 设置值
    methodSelect.value = data.method || 'GET';
    urlInput.value = data.url || '';
    requestBody.value = data.body || '';

    // 清除并设置请求头
    headersContainer.innerHTML = '';
    if (data.headers && typeof data.headers === 'object') {
      Object.entries(data.headers).forEach(([key, value]) => {
        if (typeof addHeaderRow === 'function') {
          addHeaderRow(key, value);
        }
      });
    }

    sendResponse({ success: true });
  } catch (error) {
    console.error('处理请求数据时发生错误:', error);
    sendResponse({ success: false, error: error.message });
  }
}


