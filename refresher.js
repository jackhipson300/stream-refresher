if(!window.scriptInjected) {
  let ignoreFlag = true;
  let timeout = undefined;

  const handleRefresh = () => {
    console.log('buffering')
    if(ignoreFlag) {
      ignoreFlag = false;
      return;
    }

    if(!timeout) {
      timeout = setTimeout(() => {
        console.log('requesting refresh')
        chrome.runtime.sendMessage({ action: 'refresh' })
      }, 2000)
    }
  }

  const cancelRefresh = () => {
    console.log('cancel')
    clearTimeout(timeout)
  }

  const video = document.querySelector('video')
  if(!video) {
    console.log("video not found")
  } else {
    console.log("starting")
    video.click()

    // const events = [
    //   'play', 'pause', 'ended', 'timeupdate', 'volumechange',
    //   'seeking', 'seeked', 'loadedmetadata', 'loadeddata',
    //   'canplay', 'canplaythrough', 'waiting', 'stalled'
    // ];
    // events.forEach((e) => video.addEventListener(e, (event) => console.log(event)))

    video.addEventListener('waiting', handleRefresh)
    video.addEventListener('stalled', handleRefresh)
    video.addEventListener('playing', cancelRefresh)
  }
}