chrome.action.onClicked.addListener(async (tab) => {
  let { tabId } = await chrome.storage.session.get("tabId")
  if(tabId === tab.id) {
    chrome.storage.session.set({ tabId: undefined })
    return
  }

  console.log("setting active tab to:", tab.id)
  chrome.storage.session.set({ tabId: tab.id })

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['refresher.js']
  })
})

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'refresh') {
    console.log("refresh received")
    const { tabId } = await chrome.storage.session.get("tabId")
    if(tabId) {
      console.log("refreshing tab:", tabId)
      chrome.tabs.reload(tabId, {}) 
    }
  }
})

chrome.tabs.onUpdated.addListener(async (_, changeInfo) => {
  const { tabId } = await chrome.storage.session.get("tabId")
  if (tabId && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['refresher.js']
    });
  }
});