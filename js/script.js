const yearSelect = document.getElementById('yearSelect');
const monthSelect = document.getElementById('monthSelect');
const body = document.getElementById('jadwalBody');

// ==========================
// Partikel
// ==========================
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}vw`;
    particle.style.bottom = '0px';
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    particlesContainer.appendChild(particle);
  }
}

// ==========================
// Jam Real-time WIB/WITA/WIT
// ==========================
function updateClocks() {
  const now = new Date();

  const clockWIB = document.getElementById('clockWIB');
  const clockWITA = document.getElementById('clockWITA');
  const clockWIT = document.getElementById('clockWIT');

  if (!clockWIB || !clockWITA || !clockWIT) return;

  const formatTime = (d) => `${d.getUTCHours().toString().padStart(2,'0')}:${d.getUTCMinutes().toString().padStart(2,'0')}:${d.getUTCSeconds().toString().padStart(2,'0')}`;

  // WIB UTC+7
  clockWIB.textContent = `WIB: ${formatTime(new Date(now.getTime() + 7*60*60*1000))}`;
  // WITA UTC+8
  clockWITA.textContent = `WITA: ${formatTime(new Date(now.getTime() + 8*60*60*1000))}`;
  // WIT UTC+9
  clockWIT.textContent = `WIT: ${formatTime(new Date(now.getTime() + 9*60*60*1000))}`;
}

// ==========================
// Inisialisasi Tahun
// ==========================
const YEARS = [2025,2026,2027,2028,2029,2030];
YEARS.forEach(y=>{
  const opt=document.createElement('option');
  opt.value=y; opt.textContent=y;
  yearSelect.appendChild(opt);
});

// Set default bulan & tahun
const today = new Date();
yearSelect.value = today.getFullYear();
monthSelect.value = today.getMonth()+1;

// ==========================
// Load Data Jadwal Sholat
// ==========================
async function loadData() {
  const year = yearSelect.value;
  body.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px;">Memuat data...</td></tr>`;

  try {
    const res = await fetch(`/kab-tegal/${year}.json`);
    const json = await res.json();

    // JSON format sekarang: array of objects
    const dataArray = Array.isArray(json) ? json : [json];
    
    body.innerHTML = '';
    dataArray.forEach((d, index) => {
      const tr = document.createElement('tr');
      tr.style.animationDelay = `${index*0.05}s`;

      // Ambil tanggal & bulan dari string "Rabu, 01/01/2025"
      const parts = d.tanggal.split(', ')[1].split('/');
      const tgl = parseInt(parts[0],10);
      const bln = parseInt(parts[1],10);
      const thn = parseInt(parts[2],10);

      if(tgl===today.getDate() && bln===today.getMonth()+1 && thn===today.getFullYear()) {
        tr.classList.add('today');
      }

      tr.innerHTML = `
        <td>${d.tanggal}</td>
        <td><div class="prayer-time">${d.imsak}</div></td>
        <td><div class="prayer-time">${d.subuh}</div></td>
        <td><div class="prayer-time">${d.terbit}</div></td>
        <td><div class="prayer-time">${d.dhuha || '-'}</div></td>
        <td><div class="prayer-time">${d.dzuhur}</div></td>
        <td><div class="prayer-time">${d.ashar}</div></td>
        <td><div class="prayer-time">${d.maghrib}</div></td>
        <td><div class="prayer-time">${d.isya}</div></td>
      `;
      body.appendChild(tr);
    });

    // Panggil fungsi countdown adzan setiap detik
    updateAdzanCountdown(dataArray);

  } catch(e) {
    body.innerHTML='<tr><td colspan="9" style="text-align:center; padding:40px; color:#ff6b6b;">⚠️ Gagal memuat jadwal</td></tr>';
    console.error('Error loading data:', e);
  }
}

// ==========================
// Countdown & Audio Adzan
// ==========================
function updateAdzanCountdown(dataArray){
  if(!dataArray || dataArray.length===0) return;
  const now = new Date();

  // Cari jadwal sholat hari ini
  const partsToday = dataArray.find(d => {
    const parts = d.tanggal.split(', ')[1].split('/');
    const tgl = parseInt(parts[0],10);
    const bln = parseInt(parts[1],10);
    const thn = parseInt(parts[2],10);
    return tgl===today.getDate() && bln===today.getMonth()+1 && thn===today.getFullYear();
  });
  if(!partsToday) return;

  const prayerTimes = ['subuh','dzuhur','ashar','maghrib','isya'];
  prayerTimes.forEach(prayer=>{
    const timeParts = partsToday[prayer].split(':');
    const adzanTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(timeParts[0]), parseInt(timeParts[1]),0);
    const diff = adzanTime - now;
    if(diff > 0 && diff < 60000){ // kurang dari 1 menit
      playAdzan(prayer);
      showNotification(prayer);
    }
  });

  // update setiap detik
  setTimeout(()=>updateAdzanCountdown(dataArray),1000);
}

// Audio adzan
function playAdzan(prayer){
  const audio = new Audio('assets/adzan.mp3'); // pastikan file ada
  audio.play().catch(e=>console.log('Audio play error:',e));
}

// Browser notification
function showNotification(prayer){
  if(!("Notification" in window)) return;
  if(Notification.permission==="granted"){
    new Notification(`Waktu Sholat: ${prayer.toUpperCase()}`);
  } else if(Notification.permission!=="denied"){
    Notification.requestPermission().then(perm=>{
      if(perm==="granted") new Notification(`Waktu Sholat: ${prayer.toUpperCase()}`);
    });
  }
}

// ==========================
// Hover & Parallax
// ==========================
function addHoverEffects(){
  document.querySelectorAll('select, .clock-box, .prayer-time').forEach(el=>{
    el.addEventListener('mouseenter',()=> el.style.transform='translateY(-3px)');
    el.addEventListener('mouseleave',()=> el.style.transform='translateY(0)');
  });
}

function initParallax(){
  window.addEventListener('scroll',()=>{
    const scrolled = window.pageYOffset;
    const bg = document.querySelector('.bg-animation');
    if(bg) bg.style.transform = `translateY(${scrolled*-0.5}px)`;
  });
}

// ==========================
// Inisialisasi
// ==========================
function init(){
  initParticles();
  updateClocks();
  setInterval(updateClocks,1000);
  loadData();
  addHoverEffects();
  initParallax();
}

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', init);

// Update data saat select berubah
yearSelect.addEventListener('change',loadData);
monthSelect.addEventListener('change',loadData);
