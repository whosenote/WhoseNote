const themes = [
  "linear-gradient(-45deg, #fbeaff, #eecbff, #e6baff, #d7b5f9)",
  "linear-gradient(-45deg, #e0f7fa, #c8e6c9, #f0f4c3, #ffe0b2)",
  "linear-gradient(-45deg, #fdfcfb, #e2d1c3, #e4f9f5, #ffe8ec)",
  "linear-gradient(-45deg, #ffe5ec, #fad2e1, #cdb4db, #d8e2dc)"
];

let currentTheme = 0;

function switchTheme() {
  currentTheme = (currentTheme + 1) % themes.length;
  document.body.style.background = themes[currentTheme];
  document.body.style.backgroundSize = "600% 600%";
  document.body.style.animation = "softMove 30s ease infinite";
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", switchTheme);
  }
});


