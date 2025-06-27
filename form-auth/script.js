let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;

  const title = document.getElementById("form-title");
  const toggleText = document.getElementById("toggle-text");

  if (isLogin) {
    title.textContent = "Đăng nhập";
    toggleText.innerHTML = `Chưa có tài khoản? <a href="#" onclick="toggleForm()">Đăng ký</a>`;
  } else {
    title.textContent = "Đăng ký";
    toggleText.innerHTML = `Đã có tài khoản? <a href="#" onclick="toggleForm()">Đăng nhập</a>`;
  }
}

document.getElementById("auth-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isLogin) {
    window.location.href = "/index.html";
  } else {
    window.location.href = "login.html";
  }
});
