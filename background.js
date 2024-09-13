chrome.action.onClicked.addListener(async (tab) => {
  let { enabled } = await chrome.storage.session.get("enabled")
  if(!enabled) {
    enabled = false
  }

  chrome.storage.session.set({ enabled: !enabled })

  if(!enabled) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['refresher.js']
    })
  }
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'refresh') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        
        chrome.tabs.reload(tabId, {}) 
      }
    });
  }
})

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const { enabled } = await chrome.storage.session.get("enabled")
  if (enabled && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['refresher.js']
    });
  }
});