<<<<<<< HEAD
document.getElementById("auth-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    showLoading();

    setTimeout(() => {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "../index.html";
    }, 3000);
  } else {
    alert("Sai tài khoản hoặc mật khẩu!");
    window.location.href = "login.html";
  }
});

function showLoading() {
  const formBox = document.getElementById("form-box");
  formBox.innerHTML = `
    <div class="loader-container">
      <div class="loader"></div>
      <p>Đang xử lý, vui lòng đợi...</p>
    </div>
  `;
}
=======
document.getElementById("auth-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Hiển thị vòng xoay loading
    showLoading();

    // Giả lập loading trong 3 giây, rồi chuyển trang
    setTimeout(() => {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "index.html";
    }, 3000);
  } else {
    alert("Sai tài khoản hoặc mật khẩu!");
    window.location.href = "login.html";
  }
});

function showLoading() {
  const formBox = document.getElementById("form-box");
  formBox.innerHTML = `
    <div class="loader-container">
      <div class="loader"></div>
      <p>Đang xử lý, vui lòng đợi...</p>
    </div>
  `;
}
>>>>>>> master
