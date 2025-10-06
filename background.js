chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
      if (details.url.includes("audioclip")) {
          console.log("Detected Instagram voice message:", details.url);

          chrome.storage.local.get({ audioClips: [] }, function (data) {
              let audioClips = data.audioClips;

              // Get current date and time
              let timestamp = new Date().toLocaleString(); 

              // Check if this URL is already saved
              let exists = audioClips.some(clip => clip.url === details.url);
              if (!exists) {
                  audioClips.push({ url: details.url, timestamp: timestamp });
                  chrome.storage.local.set({ audioClips: audioClips });

                  // Notify the popup to update in real-time
                  chrome.runtime.sendMessage({ action: "updateAudioList" }).catch(() => {
                      console.log("Popup is not open, skipping message.");
                  });
              }
          });
      }
  },
  { urls: ["*://cdn.fbsbx.com/*"] }
);
