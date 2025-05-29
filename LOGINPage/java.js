document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (email && password) {
        alert("Welcome to MIHRAB, " + email + "!");
    } else {
        alert("Please enter valid email and password.");
    }
    });
    //validation
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email.");
        return;
    }

    if (!password) {
        alert("Please enter your password.");
        return;
    }
    alert("Welcome to MIHRAB, " + email + "!");
    });


