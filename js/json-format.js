document.getElementById('format').addEventListener('click', function() {
    const input = document.getElementById('input').value;
    const errorDiv = document.getElementById('error');
    try {
        const obj = JSON.parse(input);
        document.getElementById('output').value = JSON.stringify(obj, null, 2);
        errorDiv.style.display = 'none';
    } catch (e) {
        errorDiv.textContent = '错误：无效的JSON格式 - ' + e.message;
        errorDiv.style.display = 'block';
    }
});

document.getElementById('compress').addEventListener('click', function() {
    const input = document.getElementById('input').value;
    const errorDiv = document.getElementById('error');
    try {
        const obj = JSON.parse(input);
        document.getElementById('output').value = JSON.stringify(obj);
        errorDiv.style.display = 'none';
    } catch (e) {
        errorDiv.textContent = '错误：无效的JSON格式 - ' + e.message;
        errorDiv.style.display = 'block';
    }
});

document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
    document.getElementById('error').style.display = 'none';
});

document.getElementById('copy').addEventListener('click', function() {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    const button = this;
    const originalText = button.textContent;
    button.textContent = '已复制！';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '#2c3e50';
    }, 1500);
});

// 添加快捷键支持
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                document.getElementById('format').click();
                e.preventDefault();
                break;
            case 'c':
                if (document.activeElement !== document.getElementById('input')) {
                    document.getElementById('copy').click();
                    e.preventDefault();
                }
                break;
        }
    }
}); 