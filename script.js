// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpmtXlI3P1R_ZEewesx-LqxFCoIgQHKw0",
  authDomain: "group8iot-e45ba.firebaseapp.com",
  databaseURL: "https://group8iot-e45ba-default-rtdb.firebaseio.com/",
  projectId: "group8iot-e45ba",
  storageBucket: "group8iot-e45ba.appspot.com",
  messagingSenderId: "455442413718",
  appId: "1:455442413718:web:c2be1b72d84c456101aab7",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Radar setup
const canvas = document.getElementById("radar");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height;
const maxRadius = 500; // Gấp đôi – tương ứng 100cm

const angleDisplay = document.getElementById("angle");
const distanceDisplay = document.getElementById("distance");
const historyList = document.getElementById("history-list");

const POINT_LIFETIME = 5000; // 5 giây
const detectedPoints = [];   // Mỗi điểm: { x, y, timestamp }

function drawRadar(angle, distance) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 1;
  ctx.font = "14px monospace";
  ctx.fillStyle = "lime";

  // Vẽ các vòng khoảng cách (20, 40, 60, 80, 100 cm)
  for (let i = 1; i <= 5; i++) {
    const radius = (i / 5) * maxRadius;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.fillText(`${i * 20}cm`, centerX + radius + 5, centerY - 5);
  }

  // Vạch chia góc
  for (let deg = 0; deg <= 180; deg += 30) {
    const rad = deg * Math.PI / 180;
    const x = centerX + maxRadius * Math.cos(rad);
    const y = centerY - maxRadius * Math.sin(rad);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    const labelX = centerX + (maxRadius + 20) * Math.cos(rad) - 10;
    const labelY = centerY - (maxRadius + 20) * Math.sin(rad);
    ctx.fillText(`${deg}°`, labelX, labelY);
  }

  // Vẽ tia quét
  const rad = angle * Math.PI / 180;
  const sweepX = centerX + maxRadius * Math.cos(rad);
  const sweepY = centerY - maxRadius * Math.sin(rad);
  ctx.strokeStyle = "#0f0";
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(sweepX, sweepY);
  ctx.stroke();

  // Vẽ các điểm phát hiện còn hiệu lực
  const now = Date.now();
  ctx.fillStyle = "red";
  for (let i = detectedPoints.length - 1; i >= 0; i--) {
    const point = detectedPoints[i];
    if (now - point.timestamp <= POINT_LIFETIME) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      detectedPoints.splice(i, 1); // Xóa điểm hết hạn
    }
  }

  // Cập nhật giao diện
  angleDisplay.textContent = `${angle}°`;
  distanceDisplay.textContent = `${distance.toFixed(1)} cm`;
}

// Đọc dữ liệu từ Firebase
db.ref("radar").on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const { angle, distance, status } = data;

  // Nếu phát hiện vật thể → lưu điểm hiển thị
  if (status === 1 && distance > 0 && distance <= 100) {
    const rad = angle * Math.PI / 180;
    const distRatio = Math.min(distance / 100, 1); // chuẩn hóa theo 100cm
    const dx = centerX + maxRadius * distRatio * Math.cos(rad);
    const dy = centerY - maxRadius * distRatio * Math.sin(rad);
    detectedPoints.push({ x: dx, y: dy, timestamp: Date.now() });
  }

  // Vẽ radar
  drawRadar(angle, distance);

  // Lịch sử đo
  const time = new Date().toLocaleTimeString();
  const li = document.createElement("li");
  li.textContent = `[${time}] Góc: ${angle}°, Khoảng cách: ${distance}cm, Trạng thái: ${status}`;
  historyList.prepend(li);
  if (historyList.children.length > 20) {
    historyList.removeChild(historyList.lastChild);
  }
});
