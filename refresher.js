async function run() {
  let ignoreFlag = true;
  let timeout = undefined;

  const video = document.querySelector('video')

  const handleRefresh = () => {
    if(ignoreFlag) {
      ignoreFlag = false;
      return;
    }

    if(!timeout) {
      timeout = setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'refresh' })
      }, 2000)
    }
  }

  const cancelRefresh = () => {
    clearTimeout(timeout)
  }

  if(!video) {
    console.log("Video not found")
  } else {
    console.log("Starting")
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

run()