
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
