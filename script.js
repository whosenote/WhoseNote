document.addEventListener("DOMContentLoaded", () => {
  const wallForm = document.getElementById("freedomWallForm");
  const toggleWallBtn = document.getElementById("toggle-wall");
  const freedomWallPanel = document.getElementById("freedom-wall");

  // 👉 Palitan ito ng latest Web App URL mo
  const sheetURL = "https://script.google.com/macros/s/AKfycbyhWLPl598wbvInG52P1w_38MwIY1JuxLmjhau6XTUDZmfiO6MVEEoO-xYT0y7CJRESDQ/exec";

  toggleWallBtn.addEventListener("click", () => {
    if (freedomWallPanel.classList.contains("show")) {
      freedomWallPanel.classList.remove("show");
      setTimeout(() => {
        freedomWallPanel.style.display = "none";
      }, 300);
    } else {
      freedomWallPanel.style.display = "block";
      setTimeout(() => {
        freedomWallPanel.classList.add("show");
      }, 10);
      loadMessages();
    }
  });

  wallForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const today = new Date().toISOString().slice(0, 10);
    const postKey = `posts_${today}`;
    let postCount = parseInt(localStorage.getItem(postKey)) || 0;

    if (postCount >= 3) {
      showPopup("🚫 You can only post 3 messages per day.");
      return;
    }

    fetch(sheetURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: wallForm.message.value,
        device: navigator.userAgent
      })
    })
      .then(res => res.json())
      .then(() => {
        localStorage.setItem(postKey, postCount + 1);
        showPopup("🎉 Message Sent!");
        wallForm.reset();
        loadMessages();
      })
      .catch(err => {
        console.error("❌ Error posting message:", err);
        showPopup("Something went wrong. Try again.");
      });
  });

  function loadMessages() {
    fetch(sheetURL)
      .then(res => res.json())
      .then(data => {
        const wallMessages = document.getElementById("wall-messages");
        wallMessages.innerHTML = "";

        data.reverse().forEach(msg => {
          const div = document.createElement("div");
          div.style.cssText = `
            background: white;
            color: black;
            margin: 8px 0;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
          `;
          div.innerHTML = `
            <p>${msg.message}</p>
            <span style="font-size: 10px; color: gray;">${msg.time || ''}</span><br>
            <span style="font-size: 10px; color: gray;">${msg.device || ''}</span>
          `;
          wallMessages.appendChild(div);
        });
      })
      .catch(err => {
        console.error("❌ Error loading messages:", err);
      });
  }

  loadMessages();
});

function showPopup(message) {
  const popup = document.getElementById("popup");
  const h3 = popup.querySelector("h3");

  h3.innerText = message || "🎉 Message Sent!";

  popup.style.display = "block";
  setTimeout(() => { popup.style.display = "none"; }, 3000);
}
