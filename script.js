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

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Format tanggal Indonesia
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // WIB UTC+7 (Indonesia Barat)
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  clockWIB.innerHTML = `WIB: ${formatTime(wibTime)}<br><small>${formatDate(now)}</small>`;

  // WITA UTC+8 (Indonesia Tengah)
  const witaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  clockWITA.innerHTML = `WITA: ${formatTime(witaTime)}`;

  // WIT UTC+9 (Indonesia Timur)
  const witTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  clockWIT.innerHTML = `WIT: ${formatTime(witTime)}`;

  // Update info tanggal
  updateDateInfo(now);
}

// ==========================
// Info Tanggal
// ==========================
function updateDateInfo(date) {
  let dateInfo = document.getElementById('dateInfo');
  
  if (!dateInfo) {
    dateInfo = document.createElement('div');
    dateInfo.id = 'dateInfo';
    dateInfo.style.cssText = `
      text-align: center;
      margin: 5px 0 15px 0;
      padding: 10px;
      background: rgba(15, 59, 44, 0.6);
      border-radius: 10px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      font-size: 0.9rem;
      color: var(--gold);
      backdrop-filter: blur(5px);
    `;
    
    const controls = document.querySelector('.controls');
    if (controls) {
      controls.appendChild(dateInfo);
    }
  }
  
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  dateInfo.innerHTML = `📅 <strong>${date.toLocaleDateString('id-ID', options)}</strong>`;
}

// ==========================
// Inisialisasi Tahun
// ==========================
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];
YEARS.forEach(y => {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
});

// Set default bulan & tahun
const today = new Date();
yearSelect.value = today.getFullYear();
monthSelect.value = today.getMonth() + 1;

// ==========================
// Load Data Jadwal Sholat - FIXED VERSION
// ==========================
async function loadData() {
  const year = yearSelect.value;
  const month = monthSelect.value;
  
  console.log(`📅 Memuat jadwal: ${year}-${month}`);
  
  body.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px;">
    <div class="loader" style="margin: 0 auto 10px;"></div>
    Memuat data jadwal sholat...
  </td></tr>`;

  try {
    // Coba beberapa sumber data
    const possiblePaths = [
      `https://raw.githubusercontent.com/ReyLanTra/Jadwal-Sholat/main/${year}.json`,
      `/${year}.json`,
      `./${year}.json`,
      `public/kab-tegal/${year}.json`
    ];
    
    let json = null;
    let lastError = null;
    
    for (const path of possiblePaths) {
      try {
        console.log(`🔍 Mencoba path: ${path}`);
        const res = await fetch(path);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const text = await res.text();
        // Cek jika response adalah HTML
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<')) {
          throw new Error('Response is HTML, not JSON');
        }
        
        json = JSON.parse(text);
        console.log(`✅ Berhasil load dari: ${path}`);
        break;
        
      } catch (err) {
        lastError = err;
        console.log(`❌ Gagal dari ${path}:`, err.message);
      }
    }
    
    if (!json) {
      throw new Error(`Tidak bisa menemukan file ${year}.json`);
    }

    // Validasi struktur JSON
    if (!json.time || typeof json.time !== 'object') {
      throw new Error('Format JSON tidak valid: properti "time" tidak ditemukan');
    }

    // Ambil data bulan yang dipilih
    const monthData = json.time[month];
    
    if (!monthData || !Array.isArray(monthData)) {
      body.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px;">Data untuk bulan ini belum tersedia</td></tr>';
      return;
    }

    // Tampilkan info lokasi
    showLocationInfo(json);
    
    // Tampilkan data dengan highlight FIXED
    displayPrayerTimes(monthData, month, year);
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    body.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#ff6b6b;">
      <h4>⚠️ Gagal memuat jadwal</h4>
      <p>${error.message}</p>
      <small>Pastikan file ${year}.json tersedia dan formatnya benar.</small>
      <br>
      <button onclick="loadData()" style="margin-top:15px; padding:8px 16px; background:var(--gold); border:none; border-radius:5px; color:white; cursor:pointer;">
        Coba Lagi
      </button>
    </td></tr>`;
  }
}

// ==========================
// Tampilkan Data Jadwal - FIXED HIGHLIGHT
// ==========================
function displayPrayerTimes(monthData, month, year) {
  body.innerHTML = '';
  
  // PAKAI REAL-TIME DATE SETIAP KALI
  const now = new Date();
  console.log("🕒 REAL TIME CHECK:", {
    date: now.getDate(),
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    full: now.toLocaleDateString('id-ID')
  });
  
  // Log untuk debugging
  console.log(`📊 Processing ${monthData.length} days of data`);
  
  monthData.forEach((day, index) => {
    // Parse tanggal dari data JSON
    let dayNumber = 0;
    let parsedMonth = 0;
    let parsedYear = 0;
    
    try {
      if (day.tanggal && typeof day.tanggal === 'string') {
        // Format: "Rabu, 26/12/2025"
        const parts = day.tanggal.split(', ');
        if (parts.length > 1) {
          const datePart = parts[1]; // "26/12/2025"
          const [d, m, y] = datePart.split('/').map(Number);
          dayNumber = d;
          parsedMonth = m;
          parsedYear = y;
        }
      }
    } catch (e) {
      console.warn(`⚠️ Error parsing date for index ${index}:`, e);
    }
    
    // Fallback: gunakan index + 1 jika parsing gagal
    if (dayNumber === 0 || isNaN(dayNumber)) {
      dayNumber = index + 1;
    }
    
    // FIXED HIGHLIGHT LOGIC: Pakai REAL-TIME date comparison
    const isToday = (
      dayNumber === now.getDate() && 
      parsedMonth === (now.getMonth() + 1) && 
      parsedYear === now.getFullYear()
    );
    
    // Debug log untuk highlight
    if (isToday) {
      console.log(`🎯 HIGHLIGHT FOUND: Day ${dayNumber} is TODAY!`);
    }
    
    const tr = document.createElement('tr');
    
    // Hanya tambah class .today jika benar-benar hari ini
    if (isToday) {
      tr.classList.add('today');
    }
    
    // Clean waktu dari karakter aneh
    const cleanTime = (time) => {
      if (!time || time === 'undefined' || time === 'null') {
        return '--:--';
      }
      return time.toString()
        .replace(/[Il]/gi, '1')  // I atau l → 1
        .replace(/[Oo]/g, '0')   // O atau o → 0
        .trim();
    };
    
    // BUAT SEMUA TANGGAL TAMPIL (tidak ada yang hidden)
    tr.innerHTML = `
      <td>${dayNumber}</td>
      <td><div class="prayer-time">${cleanTime(day.imsak)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.subuh)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.terbit)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.dzuhur)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.ashar)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.maghrib)}</div></td>
      <td><div class="prayer-time">${cleanTime(day.isya)}</div></td>
    `;
    
    body.appendChild(tr);
  });
  
  // Validasi: semua tanggal harus tampil
  console.log(`✅ Displayed ${body.children.length} rows`);
  
  if (monthData.length !== body.children.length) {
    console.error(`❌ DATA LOSS: ${monthData.length} input → ${body.children.length} output`);
  }
}

// ==========================
// Tampilkan Info Lokasi
// ==========================
function showLocationInfo(json) {
  // Hapus info sebelumnya jika ada
  const oldInfo = document.querySelector('.location-info');
  if (oldInfo) oldInfo.remove();
  
  const infoDiv = document.createElement('div');
  infoDiv.className = 'location-info';
  infoDiv.style.cssText = `
    background: rgba(15, 81, 50, 0.3);
    padding: 12px 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    border-left: 4px solid var(--gold);
    font-size: 0.9rem;
    backdrop-filter: blur(5px);
  `;
  
  infoDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
      <div>
        <strong style="color: var(--gold);">📍 ${json.city || 'KAB. TEGAL'}</strong>
        <div style="font-size: 0.8rem; opacity: 0.9;">
          ${json.province || json.procince || 'JAWA TENGAH'} • 
          Lintang: ${json.latitude || 'N/A'} • 
          Bujur: ${json.longitude || json.longtitude || 'N/A'}
        </div>
      </div>
      <div style="font-size: 0.8rem; background: rgba(212, 175, 55, 0.1); 
                  padding: 4px 10px; border-radius: 5px; margin-top: 5px;">
        Sumber: Kemenag RI
      </div>
    </div>
  `;
  
  // Sisipkan sebelum tabel
  const container = document.querySelector('.container');
  const table = document.querySelector('table');
  if (container && table) {
    container.insertBefore(infoDiv, table);
  }
}

// ==========================
// Hover & Parallax Effects
// ==========================
function addHoverEffects() {
  document.querySelectorAll('select, .clock-box, .prayer-time').forEach(el => {
    if (el.tagName === 'SELECT') {
      el.addEventListener('focus', () => el.style.transform = 'translateY(-2px)');
      el.addEventListener('blur', () => el.style.transform = 'translateY(0)');
    } else {
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-3px)';
        el.style.transition = 'all 0.3s ease';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translateY(0)';
      });
    }
  });
}

function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bg = document.querySelector('.bg-animation');
    if (bg) {
      bg.style.transform = `translateY(${scrolled * -0.3}px)`;
    }
  });
}

// ==========================
// Auto-refresh pada perubahan tanggal
// ==========================
let lastCheckedDate = new Date().getDate();

function checkForDateChange() {
  const currentDate = new Date().getDate();
  
  if (currentDate !== lastCheckedDate) {
    console.log(`📅 Tanggal berubah: ${lastCheckedDate} → ${currentDate}`);
    lastCheckedDate = currentDate;
    
    // Tampilkan notifikasi
    showDateChangeNotification(currentDate);
    
    // Reload data setelah 1 detik
    setTimeout(() => {
      console.log("🔄 Reloading data karena tanggal berubah...");
      loadData();
    }, 1000);
  }
}

function showDateChangeNotification(newDate) {
  // Hapus notifikasi sebelumnya
  const oldNotif = document.querySelector('.date-change-notif');
  if (oldNotif) oldNotif.remove();
  
  const notification = document.createElement('div');
  notification.className = 'date-change-notif';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--gold), #ffd700);
    color: var(--dark);
    padding: 12px 20px;
    border-radius: 10px;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4);
    animation: slideIn 0.5s ease;
    font-weight: 600;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 1.2rem;">📅</span>
      <div>
        <strong>Tanggal Diperbarui!</strong><br>
        <small>Sekarang: <strong>${newDate} ${new Date().toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</strong></small>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Hapus setelah 4 detik
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease';
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}

// Tambah animasi untuk notifikasi
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(notificationStyles);

// ==========================
// Responsive Helper
// ==========================
function handleResponsive() {
  const isMobile = window.innerWidth < 768;
  
  // Sesuaikan padding dan font size untuk mobile
  if (isMobile) {
    document.querySelectorAll('.prayer-time').forEach(el => {
      el.style.fontSize = '0.8rem';
      el.style.padding = '3px 5px';
    });
    
    document.querySelectorAll('thead th, tbody td').forEach(el => {
      el.style.padding = '8px 4px';
      el.style.fontSize = '0.85rem';
    });
  }
  
  // Update jam container
  const clockContainer = document.querySelector('.clock-container');
  if (clockContainer) {
    if (isMobile) {
      clockContainer.style.gap = '8px';
      clockContainer.style.flexDirection = 'column';
    } else {
      clockContainer.style.gap = '15px';
      clockContainer.style.flexDirection = 'row';
    }
  }
}

// ==========================
// Inisialisasi Utama
// ==========================
function init() {
  console.log('🕌 Initializing Jadwal Sholat App...');
  
  // Inisialisasi komponen
  initParticles();
  updateClocks();
  addHoverEffects();
  initParallax();
  handleResponsive();
  loadData(); // Load data pertama kali
  
  // Setup interval
  setInterval(updateClocks, 1000);
  setInterval(checkForDateChange, 30000); // Cek perubahan tanggal setiap 30 detik
  
  // Event listeners
  yearSelect.addEventListener('change', loadData);
  monthSelect.addEventListener('change', loadData);
  window.addEventListener('resize', handleResponsive);
  
  // Force check highlight saat page load
  console.log("Page loaded on:", new Date().toLocaleString());
}

// ==========================
// Jalankan Aplikasi
// ==========================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Ekspor untuk debugging
window.JadwalSholatApp = {
  loadData,
  updateClocks,
  checkForDateChange,
  displayPrayerTimes
};
