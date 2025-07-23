document.addEventListener("DOMContentLoaded", () => {
  const wallToggle = document.getElementById("toggle-wall");
  const wallPanel = document.getElementById("freedom-wall");
  const form = document.getElementById("wall-form");
  const textarea = document.getElementById("freedomMessage");
  const messageList = document.getElementById("freedomMessages");

  const SHEET_URL = "https://script.google.com/macros/s/AKfycbyOmhOdrqrf3Z-cTyK0p84p9qkM6HgMpt3R6HiPOj4_TRwg9j59lEKCUs49gto5nyTC/exec";

  if (wallToggle && wallPanel) {
    wallToggle.addEventListener("click", () => {
      const isVisible = wallPanel.style.display === "block";
      wallPanel.style.display = isVisible ? "none" : "block";
      if (!isVisible) checkPostLimit();
    });
  }

  function loadMessages() {
    fetch(SHEET_URL)
      .then(res => res.json())
      .then(data => {
        messageList.innerHTML = "";
        data.reverse().forEach(item => {
          const li = document.createElement("li");
          li.textContent = item.message;
          messageList.appendChild(li);
        });
      })
      .catch(err => console.error("❌ Load failed", err));
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = textarea.value.trim();
      if (message === "") return;

      if (!checkPostLimit()) return;

      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        const res = await fetch(SHEET_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message, device: navigator.userAgent })
        });

        if (!res.ok) throw new Error("Send failed");

        textarea.value = "";
        updatePostCount();
        loadMessages();
        showWallPopup?.();
        confetti?.();

        submitButton.textContent = "✅ Message Sent!";
      } catch (err) {
        console.error("❌ Send failed", err);
        alert("Something went wrong. Please try again.");
        submitButton.textContent = "Post";
      }

      setTimeout(() => {
        submitButton.textContent = "Post";
        submitButton.disabled = false;
      }, 1500);
    });
  }

  function checkPostLimit() {
    const today = new Date().toLocaleDateString();
    const stored = JSON.parse(localStorage.getItem("freedomWallPostData")) || {};
    if (stored.date === today && stored.count >= 3) {
      textarea.disabled = true;
      alert("🚫 You've reached the daily limit of 3 messages.");
      return false;
    }
    textarea.disabled = false;
    return true;
  }

  function updatePostCount() {
    const today = new Date().toLocaleDateString();
    let stored = JSON.parse(localStorage.getItem("freedomWallPostData")) || {};
    if (stored.date !== today) stored = { date: today, count: 0 };
    stored.count++;
    localStorage.setItem("freedomWallPostData", JSON.stringify(stored));
    if (stored.count >= 3) {
      textarea.disabled = true;
      alert("🚫 You've reached the daily limit of 3 messages.");
    }
  }

  loadMessages();
  setInterval(loadMessages, 1000);
});

function showWallPopup() {
  const popup = document.getElementById("wall-popup");
  if (!popup) return;
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}
