// Simple client-side auth (for demo only)
(function () {
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("student-users") || "{}");
    } catch (e) {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem("student-users", JSON.stringify(users));
  }

  window.signupUser = function (e) {
    if (e) e.preventDefault();

    const name = document.getElementById("name")?.value?.trim();
    const email = document.getElementById("email")?.value?.trim().toLowerCase();
    const password = document.getElementById("password")?.value;
    const confirm = document.getElementById("confirm")?.value;

    if (!name || !email || !password) return alert("Please fill all fields");
    if (password !== confirm) return alert("Passwords do not match");

    const users = getUsers();
    if (users[email]) return alert("An account with this email already exists");

    users[email] = { name, password };
    saveUsers(users);

    localStorage.setItem("student-authenticated", "true");
    localStorage.setItem("student-user-email", email);

    window.location.href = "index.html";
  };

  window.loginUser = function (e) {
    if (e) e.preventDefault();

    const email = document.getElementById("email")?.value?.trim().toLowerCase();
    const password = document.getElementById("password")?.value;

    if (!email || !password) return alert("Please fill all fields");

    const users = getUsers();
    const user = users[email];

    if (!user || user.password !== password)
      return alert("Invalid credentials");

    localStorage.setItem("student-authenticated", "true");
    localStorage.setItem("student-user-email", email);

    window.location.href = "index.html";
  };

  window.logoutUser = function () {
    localStorage.removeItem("student-authenticated");
    localStorage.removeItem("student-user-email");
    window.location.href = "login.html";
  };

  // attach handlers when forms are present
  document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    if (signupForm) signupForm.addEventListener("submit", signupUser);
    if (loginForm) loginForm.addEventListener("submit", loginUser);
  });
})();
