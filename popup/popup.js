document.getElementById('httpTest').addEventListener('click', function() {
    chrome.tabs.query({url: chrome.runtime.getURL('main.html')}, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, {active: true});
        } else {
            chrome.tabs.create({url: 'main.html'});
        }
    });
});

document.getElementById('jsonFormat').addEventListener('click', function() {
    chrome.tabs.create({url: '/pages/json-format.html'});
});

document.getElementById('otherTools').addEventListener('click', function() {
    chrome.tabs.create({url: '/pages/tools.html'});
});

document.getElementById('about').addEventListener('click', function() {
    const aboutContainer = document.getElementById('aboutContainer');
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    
    if (qrcodeContainer.classList.contains('show')) {
        qrcodeContainer.classList.remove('show');
    }
    
    aboutContainer.classList.toggle('show');
});

document.getElementById('qrCode').addEventListener('click', function() {
    const qrcodeContainer = document.getElementById('qrcodeContainer');
    const aboutContainer = document.getElementById('aboutContainer');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrcodeUrl = document.getElementById('qrcodeUrl');
    
    if (aboutContainer.classList.contains('show')) {
        aboutContainer.classList.remove('show');
    }
    
    if (qrcodeContainer.classList.contains('show')) {
        qrcodeContainer.classList.remove('show');
        qrcodeDiv.innerHTML = '';
        qrcodeUrl.textContent = '';
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const url = tabs[0].url;
            
            const qr = qrcode(0, 'M');
            qr.addData(url);
            qr.make();
            
            qrcodeDiv.innerHTML = qr.createImgTag(3);
            qrcodeUrl.textContent = url;
            qrcodeContainer.classList.add('show');
        });
    }
});

// 修改自动打开main.html的逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 先检查是否已经有main.html标签页
    chrome.tabs.query({url: chrome.runtime.getURL('main.html')}, function(tabs) {
        if (tabs.length === 0) {
            // 如果没有，创建新标签页
            chrome.tabs.create({
                url: 'main.html',
                active: false  // 设置为false，这样不会立即切换到新标签页
            }, function(tab) {
                // 等待一段时间后再尝试与页面通信
                setTimeout(() => {
                    try {
                        chrome.tabs.sendMessage(tab.id, { type: 'INIT' }, function(response) {
                            if (chrome.runtime.lastError) {
                                console.log('页面初始化中...');
                            }
                        });
                    } catch (error) {
                        console.log('等待页面加载...');
                    }
                }, 500);
            });
        } else {
            // 如果已经存在，切换到该标签页
            chrome.tabs.update(tabs[0].id, {active: true});
        }
    });
}); 