document.addEventListener("DOMContentLoaded", function () {
    let audioListDiv = document.getElementById("audioList");
    let clearButton = document.getElementById("clearStorage");

    function updateAudioList() {
        chrome.storage.local.get("audioClips", function (data) {
            let audioClips = data.audioClips || [];
            audioListDiv.innerHTML = "";

            if (audioClips.length === 0) {
                audioListDiv.innerHTML = "<p>No voice messages detected.</p>";
                return;
            }

            audioClips.forEach((clip, index) => {
                let div = document.createElement("div");
                div.classList.add("audio-item");

                let infoDiv = document.createElement("div");
                infoDiv.style.flexGrow = "1";

                let link = document.createElement("a");
                link.href = clip.url;
                link.textContent = `Voice Message ${index + 1}`;
                link.target = "_blank";

                let timestamp = document.createElement("p");
                timestamp.textContent = clip.timestamp;
                timestamp.style.fontSize = "12px";
                timestamp.style.color = "#666";
                timestamp.style.margin = "2px 0";

                infoDiv.appendChild(link);
                infoDiv.appendChild(timestamp);

                let downloadBtn = document.createElement("button");
                downloadBtn.textContent = "⬇";
                downloadBtn.classList.add("download-btn");
                downloadBtn.addEventListener("click", () => {
                    let a = document.createElement("a");
                    a.href = clip.url;
                    a.download = `instagram_voice_${index + 1}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });

                div.appendChild(infoDiv);
                div.appendChild(downloadBtn);
                audioListDiv.appendChild(div);
            });
        });
    }


    updateAudioList();


    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "updateAudioList") {
            updateAudioList();
        }
    });


    clearButton.addEventListener("click", function () {
        chrome.storage.local.set({ audioClips: [] }, function () {
            updateAudioList();
        });
    });
});
