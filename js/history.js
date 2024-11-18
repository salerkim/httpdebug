document.addEventListener('DOMContentLoaded', function() {
  const historySearch = document.getElementById('historySearch');
  const historyFilter = document.getElementById('historyFilter');
  const clearHistoryBtn = document.getElementById('clearHistory');

  // 加载历史记录
  loadHistory();

  // 搜索和筛选事件监听
  historySearch.addEventListener('input', filterHistory);
  historyFilter.addEventListener('change', filterHistory);

  // 清空历史记录
  clearHistoryBtn.addEventListener('click', async () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      await chrome.storage.local.set({ history: [] });
      loadHistory();
    }
  });
});

// 加载历史记录
async function loadHistory() {
  try {
    const { history = [] } = await chrome.storage.local.get('history');
    displayHistory(history);
  } catch (error) {
    console.error('加载历史记录失败:', error);
  }
}

// 显示历史记录
function displayHistory(history) {
  const historyContainer = document.getElementById('historyContainer');
  historyContainer.innerHTML = history.map(item => `
    <div class="history-item" data-request='${JSON.stringify(item)}'>
      <span class="method ${item.method.toLowerCase()}">${item.method}</span>
      <span class="url">${item.url}</span>
      <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
      <div class="actions">
        <button class="restore-btn" title="在测试工具中打开">打开</button>
        <button class="delete-btn" title="删除记录">删除</button>
      </div>
    </div>
  `).join('');

  // 添加删除按钮事件
  document.querySelectorAll('.delete-btn').forEach((btn, index) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('确定要删除这条记录吗？')) {
        const { history = [] } = await chrome.storage.local.get('history');
        history.splice(index, 1);
        await chrome.storage.local.set({ history });
        loadHistory();
      }
    });
  });

  // 添加打开按钮事件
  document.querySelectorAll('.restore-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const requestData = JSON.parse(e.target.closest('.history-item').dataset.request);
      chrome.runtime.sendMessage({
        type: 'loadRequest',
        data: requestData
      });
      // 打开或切换到测试工具页面
      chrome.tabs.create({ url: 'popup.html' });
    });
  });
}

// 搜索和筛选历史记录
async function filterHistory() {
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
} 