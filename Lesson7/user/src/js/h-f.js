const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

// load theme
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("darkmode");
  toggleBtn.innerText = "☀️";
}

// toggle theme
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("darkmode");

  if (body.classList.contains("darkmode")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.innerText = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.innerText = "🌙";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");

  if (theme === "dark") {
    document.body.classList.add("darkmode");
  }
});