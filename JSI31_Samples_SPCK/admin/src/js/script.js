const USERNAME = "admin";

const PASSWORD = "Admin@123";

const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value.trim();

    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (username === "" || password === "") {

        message.style.color = "red";

        message.innerHTML = "Please fill all fields.";

        return;

    }

    if (username === USERNAME && password === PASSWORD) {

        localStorage.setItem("adminLogin", "true");

        message.style.color = "green";

        message.innerHTML = "Login successful...";

        setTimeout(() => {

            window.location.href = "products.html";

        }, 1000);

    } else {

        message.style.color = "red";

        message.innerHTML = "Incorrect username or password.";

    }

});


/*=========================
Protect Admin Pages
=========================*/

const page = location.pathname.split("/").pop();

if (page === "products.html" || page === "orders.html") {

    if (localStorage.getItem("adminLogin") !== "true") {

        alert("Please login as administrator.");

        location.href = "index.html";

    }

}


/*=========================
Logout Function
=========================*/

function logout() {

    localStorage.removeItem("adminLogin");

    location.href = "index.html";

}