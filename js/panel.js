document.addEventListener('DOMContentLoaded', function() {
  const requestList = document.getElementById('requestList');
  const searchInput = document.getElementById('searchInput');
  const methodFilter = document.getElementById('methodFilter');
  const clearRequestsBtn = document.getElementById('clearRequests');
  
  // 存储所有请求
  let allRequests = [];

  // 监听来自 background 的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "NEW_REQUEST_FROM_NETWORK") {
      addRequestToList(message.data);
      allRequests.unshift(message.data);
      filterRequests();
    }
  });

  // 搜索和过滤功能
  searchInput.addEventListener('input', filterRequests);
  methodFilter.addEventListener('change', filterRequests);

  // 清空列表功能
  clearRequestsBtn.addEventListener('click', () => {
    if (confirm('确定要清空请求列表吗？')) {
      allRequests = [];
      requestList.innerHTML = '';
    }
  });

  function filterRequests() {
    const searchTerm = searchInput.value.toLowerCase();
    const methodValue = methodFilter.value;
    
    requestList.innerHTML = '';
    
    const filteredRequests = allRequests.filter(request => {
      const matchesSearch = (
        request.url.toLowerCase().includes(searchTerm) ||
        request.method.toLowerCase().includes(searchTerm) ||
        (request.postData && JSON.stringify(request.postData).toLowerCase().includes(searchTerm))
      );
      
      const matchesMethod = !methodValue || request.method === methodValue;
      
      return matchesSearch && matchesMethod;
    });

    if (filteredRequests.length === 0) {
      requestList.innerHTML = '<div class="no-results">没有找到匹配的请求</div>';
      return;
    }

    filteredRequests.forEach(request => {
      const requestItem = createRequestItem(request);
      requestList.appendChild(requestItem);
    });
  }

  function createRequestItem(requestData) {
    const requestItem = document.createElement('div');
    requestItem.className = 'request-item';
    
    const time = new Date(requestData.timestamp).toLocaleTimeString();
    
    requestItem.innerHTML = `
      <div class="request-method ${requestData.method}">${requestData.method}</div>
      <div class="request-url" title="${requestData.url}">${highlightText(requestData.url, searchInput.value)}</div>
      <div class="request-time">${time}</div>
      <button class="send-to-tester">发送到测试工具</button>
    `;

    // 修改点击事件处理
    const sendButton = requestItem.querySelector('.send-to-tester');
    sendButton.addEventListener('click', async () => {
      try {
        // 准备请求数据
        const data = {
          url: requestData.url,
          method: requestData.method,
          headers: requestData.headers || {},
          body: requestData.postData?.text || '',
          timestamp: requestData.timestamp
        };

        // 发送消息并等待响应
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({
            type: 'SEND_TO_TESTER',
            data: data
          }, (response) => {
            resolve(response);
          });
        });

        // 处理响应
        if (response && response.success) {
          showToast('已发送到测试工具');
        } else {
          showToast('发送失败: ' + (response?.error || '未知错误'), 'error');
        }
      } catch (error) {
        console.error('发送请求失败:', error);
        showToast('发送失败，请重试', 'error');
      }
    });

    return requestItem;
  }

  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // 添加请求到列表
  function addRequestToList(requestData) {
    const requestItem = createRequestItem(requestData);
    requestList.insertBefore(requestItem, requestList.firstChild);
  }

  // 添加提示消息功能
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}); 