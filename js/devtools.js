// 创建开发者工具面板
chrome.devtools.panels.create(
  "HTTP测试工具",
  "images/icon16.png",
  "panel.html",
  function(panel) {
    console.log("开发者工具面板创建成功！");
  }
);

// 监听网络请求完成事件
chrome.devtools.network.onRequestFinished.addListener(
  function(request) {
    request.getContent((content) => {
      // 过滤掉以冒号开头的请求头
      const filteredHeaders = request.request.headers.reduce((acc, header) => {
        // 只保留不以冒号开头的请求头
        if (!header.name.startsWith(':')) {
          acc[header.name] = header.value;
        }
        return acc;
      }, {});

      const requestData = {
        url: request.request.url,
        method: request.request.method,
        headers: filteredHeaders,
        postData: request.request.postData,
        timestamp: request.startedDateTime,
        responseContent: content
      };

      // 将请求信息添加到自定义面板
      chrome.runtime.sendMessage({
        type: "NEW_REQUEST_FROM_NETWORK",
        data: requestData
      });
    });
  }
); 