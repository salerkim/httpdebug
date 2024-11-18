const PROXY_SETTINGS = {
    mode: "direct",
    rules: {
        singleProxy: {
            scheme: "http",
            host: "",
            port: 0
        },
        bypassList: []
    }
};

// 强制设置为直接连接的函数
async function forceDirectConnection() {
    try {
        // 尝试多种方式确保直接连接
        if (chrome.proxy) {
            // 清除所有代理设置
            if (chrome.proxy.settings) {
                await chrome.proxy.settings.clear({ scope: 'regular' });
                // 强制设置为直接连接
                await chrome.proxy.settings.set({
                    value: { mode: "direct" },
                    scope: 'regular'
                });
            }
        }

        // 清理所有存储的代理相关数据
        await chrome.storage.local.get(null, async (data) => {
            const cleanData = {};
            for (let key in data) {
                if (key === 'history' || key === 'templates') {
                    cleanData[key] = data[key].map(item => ({
                        ...item,
                        proxy: {
                            enabled: false,
                            type: 'http',
                            host: '',
                            port: '',
                            username: '',
                            password: '',
                            isLocalProxy: true
                        }
                    }));
                } else if (!key.includes('proxy')) {
                    cleanData[key] = data[key];
                }
            }
            await chrome.storage.local.clear();
            await chrome.storage.local.set(cleanData);
        });

        console.log('强制设置直接连接完成');
    } catch (error) {
        console.error('强制设置直接连接失败:', error);
    }
}

// 在多个时机调用清理函数
chrome.runtime.onInstalled.addListener(forceDirectConnection);
chrome.runtime.onStartup.addListener(forceDirectConnection);
chrome.runtime.onSuspend.addListener(forceDirectConnection);

// 定期检查并清理
setInterval(forceDirectConnection, 60000); // 每分钟检查一次

chrome.runtime.onInstalled.addListener(() => {
    console.log('扩展已安装');
});

// 添加消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'INIT') {
        sendResponse({ success: true });
        return true;
    }

    if (message.type === 'makeRequest') {
        makeRequest(message, sendResponse);
        return true;  // 保持消息通道开启
    }

    if (message.type === 'SEND_TO_TESTER') {
        // 查找或创建主测试工具标签页
        chrome.tabs.query({url: chrome.runtime.getURL('main.html')}, async (tabs) => {
            try {
                if (tabs.length > 0) {
                    // 如果已存在，先激活标签页
                    await chrome.tabs.update(tabs[0].id, {active: true});
                    // 等待一段时间确保页面已经准备好
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'LOAD_REQUEST',
                            data: message.data
                        }, (response) => {
                            sendResponse(response || {success: true});
                        });
                    }, 500);
                } else {
                    // 如果不存在，创建新标签页
                    const tab = await chrome.tabs.create({
                        url: 'main.html',
                        active: true
                    });
                    // 等待页面加载完成
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tab.id, {
                            type: 'LOAD_REQUEST',
                            data: message.data
                        }, (response) => {
                            sendResponse(response || {success: true});
                        });
                    }, 1000);
                }
            } catch (error) {
                console.error('Error handling SEND_TO_TESTER:', error);
                sendResponse({success: false, error: error.message});
            }
        });
        return true; // 保持消息通道开启
    }
});

// 发送HTTP请求的函数
async function makeRequest(requestData, sendResponse) {
    try {
        const options = {
            method: requestData.method,
            headers: new Headers(requestData.headers || {}),
            credentials: 'include'
        };

        // 添加请求体
        if (requestData.body && ['POST', 'PUT', 'PATCH'].includes(requestData.method)) {
            options.body = requestData.body;
        }

        // 如果启用了代理，添加代理信息到请求头
        if (requestData.proxy && requestData.proxy.enabled) {
            options.headers.set('X-Proxy-Host', requestData.proxy.host);
            options.headers.set('X-Proxy-Port', requestData.proxy.port);
            options.headers.set('X-Proxy-Type', requestData.proxy.type);

            if (requestData.proxy.username && requestData.proxy.password) {
                const authString = btoa(`${requestData.proxy.username}:${requestData.proxy.password}`);
                options.headers.set('Proxy-Authorization', `Basic ${authString}`);
            }
        }

        // 发送请求
        console.log('Sending request:', requestData.url, options);
        const response = await fetch(requestData.url, options);
        
        // 获取响应数据
        const responseData = await response.text();
        let parsedData;
        try {
            parsedData = JSON.parse(responseData);
        } catch (e) {
            parsedData = responseData;
        }

        // 获取响应头
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        // 获取URL的域名信息
        const url = new URL(requestData.url);
        
        // 使用chrome.cookies API获取cookie
        const cookies = await chrome.cookies.getAll({
            domain: url.hostname
        });

        // 将cookie信息添加到headers中
        if (cookies && cookies.length > 0) {
            headers['set-cookie'] = cookies.map(cookie => {
                let cookieString = `${cookie.name}=${cookie.value}`;
                if (cookie.path) cookieString += `; path=${cookie.path}`;
                if (cookie.domain) cookieString += `; domain=${cookie.domain}`;
                if (cookie.secure) cookieString += '; secure';
                if (cookie.httpOnly) cookieString += '; httpOnly';
                if (cookie.sameSite) cookieString += `; sameSite=${cookie.sameSite}`;
                if (cookie.expirationDate) {
                    const expires = new Date(cookie.expirationDate * 1000).toUTCString();
                    cookieString += `; expires=${expires}`;
                }
                return cookieString;
            });
        }

        // 发送响应
        sendResponse({
            success: true,
            status: response.status,
            statusText: response.statusText,
            headers: headers,
            data: parsedData,
            cookies: cookies // 直接包含完整的cookie对象数组
        });

    } catch (error) {
        console.error('Request failed:', error);
        sendResponse({
            success: false,
            error: error.message || '请求失败'
        });
    }
}

// 添加监听器来处理cookie变化
chrome.cookies.onChanged.addListener((changeInfo) => {
    console.log('Cookie changed:', changeInfo);
});
  