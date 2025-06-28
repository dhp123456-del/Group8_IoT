// Thay cấu hình Firebase của bạn vào đây
const firebaseConfig = {
 apiKey: "AIzaSyBpmtXlI3P1R_ZEewesx-LqxFCoIgQHKw0",
  authDomain: "group8iot-e45ba.firebaseapp.com",
  databaseURL: "https://group8iot-e45ba-default-rtdb.firebaseio.com/",
  projectId: "group8iot-e45ba",
  storageBucket: "group8iot-e45ba.firebasestorage.app",
  messagingSenderId: "455442413718",
  appId: "1:455442413718:web:c2be1b72d84c456101aab7",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Radar canvas setup
const canvas = document.getElementById("radar");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height;
const maxRadius = 250;

const angleDisplay = document.getElementById("angle");
const distanceDisplay = document.getElementById("distance");
const historyList = document.getElementById("history-list");

// Danh sách các điểm đã phát hiện (status = 1)
const detectedPoints = [];

function drawRadar(angle, distance) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 1;
  ctx.font = "12px monospace";
  ctx.fillStyle = "lime";

  // Vẽ các vòng khoảng cách
  for (let r = 50; r <= maxRadius; r += 50) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(`${(r / maxRadius * 40).toFixed(0)}cm`, centerX + r + 5, centerY - 5);
  }

  // Vẽ các vạch chia góc
  for (let deg = 0; deg <= 180; deg += 30) {
    const rad = deg * Math.PI / 180;
    const x = centerX + maxRadius * Math.cos(rad);
    const y = centerY - maxRadius * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    const labelX = centerX + (maxRadius + 10) * Math.cos(rad) - 10;
    const labelY = centerY - (maxRadius + 10) * Math.sin(rad);
    ctx.fillText(`${deg}°`, labelX, labelY);
  }

  // Vẽ tia quét (dù status = 0 hay 1 vẫn quét)
  const rad = angle * Math.PI / 180;
  const sweepX = centerX + maxRadius * Math.cos(rad);
  const sweepY = centerY - maxRadius * Math.sin(rad);
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(sweepX, sweepY);
  ctx.stroke();

  // Vẽ lại tất cả các điểm đã phát hiện trước đó
  ctx.fillStyle = "red";
  detectedPoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Cập nhật thông tin
  angleDisplay.textContent = `${angle}°`;
  distanceDisplay.textContent = `${distance.toFixed(1)} cm`;
}

// Đọc dữ liệu từ Firebase
db.ref("radar").on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const { angle, distance, status } = data;

  // Nếu có vật thể thì lưu điểm vĩnh viễn vào mảng
  if (status === 1) {
    const rad = angle * Math.PI / 180;
    const distRatio = Math.min(distance / 40, 1);
    const dx = centerX + maxRadius * distRatio * Math.cos(rad);
    const dy = centerY - maxRadius * distRatio * Math.sin(rad);

    // Kiểm tra xem điểm này đã được lưu chưa
    const exists = detectedPoints.some(p =>
      Math.abs(p.x - dx) < 5 && Math.abs(p.y - dy) < 5
    );

    if (!exists) {
      detectedPoints.push({ x: dx, y: dy });
    }
  }

  // Vẽ lại radar
  drawRadar(angle, distance);

  // Thêm vào lịch sử
  const time = new Date().toLocaleTimeString();
  const li = document.createElement("li");
  li.textContent = `[${time}] Góc: ${angle}°, Khoảng cách: ${distance}cm, Trạng thái: ${status}`;
  historyList.prepend(li);
  if (historyList.children.length > 20) {
    historyList.removeChild(historyList.lastChild);
  }
});