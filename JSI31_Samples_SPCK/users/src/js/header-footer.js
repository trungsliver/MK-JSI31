// ===============================
// THEME
// ===============================

const body = document.body;
const themeBtn = document.getElementById("themeBtn");
const themeIcon = themeBtn.querySelector("i");

// Load theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("darkmode");
    themeIcon.className = "bi bi-sun-fill";
} else {
    themeIcon.className = "bi bi-moon-stars-fill";
}

// Toggle theme
themeBtn.addEventListener("click", () => {

    body.classList.toggle("darkmode");

    const isDark = body.classList.contains("darkmode");

    if (isDark) {

        localStorage.setItem("theme", "dark");
        themeIcon.className = "bi bi-sun-fill";

    } else {

        localStorage.setItem("theme", "light");
        themeIcon.className = "bi bi-moon-stars-fill";

    }

});


// ===============================
// ACTIVE MENU
// ===============================

const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-link").forEach(link => {

    const href = link.getAttribute("href");

    link.classList.remove("active");

    if (href === currentPage) {
        link.classList.add("active");
    }

});


// ===============================
// HEADER SCROLL EFFECT
// ===============================

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 20) {

        header.style.padding = "0";
        header.style.boxShadow = "0 8px 25px rgba(0,0,0,.18)";
        header.style.transition = ".3s";

    } else {

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";

    }

});


// ===============================
// CLOSE MOBILE MENU AFTER CLICK
// ===============================

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        const navbar = document.querySelector(".navbar-collapse");

        if (navbar.classList.contains("show")) {

            bootstrap.Collapse.getInstance(navbar).hide();

        }

    });

});