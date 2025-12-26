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

  // WIB UTC+7 (Indonesia Barat)
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  clockWIB.textContent = `WIB: ${formatTime(wibTime)}`;

  // WITA UTC+8 (Indonesia Tengah)
  const witaTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  clockWITA.textContent = `WITA: ${formatTime(witaTime)}`;

  // WIT UTC+9 (Indonesia Timur)
  const witTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  clockWIT.textContent = `WIT: ${formatTime(witTime)}`;
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
// Load Data Jadwal Sholat (DIPERBAIKI)
// ==========================
async function loadData() {
  const year = yearSelect.value;
  const month = monthSelect.value;
  
  body.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px;">
    <div class="loader" style="margin: 0 auto 10px;"></div>
    Memuat data jadwal sholat...
  </td></tr>`;

  try {
    const res = await fetch(`${year}.json`);
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: File tidak ditemukan`);
    }
    
    const json = await res.json();
    console.log('📊 JSON loaded:', json);

    // PERBAIKAN: Struktur JSON kamu adalah {"time": {"1": [...], "2": [...], ...}}
    if (!json.time || typeof json.time !== 'object') {
      throw new Error('Format JSON tidak valid: properti "time" tidak ditemukan');
    }

    // Ambil data bulan yang dipilih
    const monthData = json.time[month];
    
    if (!monthData || !Array.isArray(monthData)) {
      body.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">Data untuk bulan ini belum tersedia</td></tr>';
      return;
    }

    // Tampilkan info lokasi
    showLocationInfo(json);
    
    // Tampilkan data
    displayPrayerTimes(monthData, month, year);
    
    // Mulai countdown untuk adzan
    startPrayerTimeCountdown(monthData);

  } catch (e) {
    console.error('❌ Error loading data:', e);
    body.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:40px; color:#ff6b6b;">
      <h3>⚠️ Gagal memuat jadwal</h3>
      <p>${e.message}</p>
      <small>Pastikan file ${year}.json tersedia dan formatnya benar.</small>
      <br>
      <button onclick="loadData()" style="margin-top:15px; padding:8px 16px; background:var(--gold); border:none; border-radius:5px; color:white; cursor:pointer;">
        Coba Lagi
      </button>
    </td></tr>`;
  }
}

// ==========================
// Tampilkan Data Jadwal
// ==========================
function displayPrayerTimes(monthData, month, year) {
  body.innerHTML = '';
  
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  
  monthData.forEach((day, index) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${index * 0.05}s`;

    // Parse tanggal dari string "Rabu, 01/01/2025"
    let dayNumber = 0;
    try {
      const dateStr = day.tanggal;
      if (dateStr) {
        // Ambil bagian tanggal: "01/01/2025"
        const datePart = dateStr.split(', ')[1];
        if (datePart) {
          const [dayStr, monthStr, yearStr] = datePart.split('/');
          dayNumber = parseInt(dayStr, 10);
        }
      }
    } catch (e) {
      console.warn('Error parsing date:', e);
    }

    // Highlight hari ini
    if (dayNumber === currentDate && 
        parseInt(month) === currentMonth && 
        parseInt(year) === currentYear) {
      tr.classList.add('today');
    }

    // Format waktu dengan safety check
    const formatTime = (time) => time || '--:--';
    
    tr.innerHTML = `
      <td>${dayNumber || '?'}</td>
      <td><div class="prayer-time">${formatTime(day.imsak)}</div></td>
      <td><div class="prayer-time">${formatTime(day.subuh)}</div></td>
      <td><div class="prayer-time">${formatTime(day.terbit)}</div></td>
      <td><div class="prayer-time">${formatTime(day.dhuha || '-')}</div></td>
      <td><div class="prayer-time">${formatTime(day.dzuhur)}</div></td>
      <td><div class="prayer-time">${formatTime(day.ashar)}</div></td>
      <td><div class="prayer-time">${formatTime(day.maghrib)}</div></td>
      <td><div class="prayer-time">${formatTime(day.isya)}</div></td>
    `;
    
    body.appendChild(tr);
  });

  // Jika tidak ada data
  if (monthData.length === 0) {
    body.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:20px;">Tidak ada data untuk bulan ini</td></tr>';
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
// Countdown Menuju Waktu Sholat
// ==========================
let countdownInterval = null;

function startPrayerTimeCountdown(monthData) {
  // Hentikan countdown sebelumnya jika ada
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    const now = new Date();
    const currentDate = now.getDate();
    
    // Cari data untuk hari ini
    const todayData = monthData.find(day => {
      try {
        const dateStr = day.tanggal;
        if (dateStr) {
          const datePart = dateStr.split(', ')[1];
          if (datePart) {
            const [dayStr] = datePart.split('/');
            return parseInt(dayStr, 10) === currentDate;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    });
    
    if (!todayData) return;
    
    // Cek setiap waktu sholat
    const prayerTimes = [
      { name: 'Imsak', time: todayData.imsak, audio: 'imsak' },
      { name: 'Subuh', time: todayData.subuh, audio: 'subuh' },
      { name: 'Dzuhur', time: todayData.dzuhur, audio: 'dzuhur' },
      { name: 'Ashar', time: todayData.ashar, audio: 'ashar' },
      { name: 'Maghrib', time: todayData.maghrib, audio: 'maghrib' },
      { name: 'Isya', time: todayData.isya, audio: 'isya' }
    ];
    
    prayerTimes.forEach(prayer => {
      if (!prayer.time) return;
      
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
      const timeDiff = prayerTime - now;
      
      // Jika kurang dari 1 menit dan belum lewat
      if (timeDiff > 0 && timeDiff < 60000) {
        // Cek apakah sudah pernah memainkan audio untuk sholat ini hari ini
        const lastPlayedKey = `lastPlayed_${prayer.name}_${now.toDateString()}`;
        const lastPlayed = localStorage.getItem(lastPlayedKey);
        
        if (!lastPlayed) {
          playAdzan(prayer.audio);
          showNotification(prayer.name);
          localStorage.setItem(lastPlayedKey, 'true');
        }
      }
      
      // Update countdown display (opsional)
      updateCountdownDisplay(prayer.name, timeDiff);
    });
    
  }, 1000); // Update setiap detik
}

function updateCountdownDisplay(prayerName, timeDiff) {
  // Optional: Tambahkan elemen untuk menampilkan countdown di UI
  if (timeDiff > 0 && timeDiff < 3600000) { // Hanya tampilkan jika < 1 jam
    const minutes = Math.floor((timeDiff % 3600000) / 60000);
    const seconds = Math.floor((timeDiff % 60000) / 1000);
    
    // Cari atau buat elemen countdown
    let countdownEl = document.getElementById(`countdown-${prayerName.toLowerCase()}`);
    if (!countdownEl) {
      countdownEl = document.createElement('div');
      countdownEl.id = `countdown-${prayerName.toLowerCase()}`;
      countdownEl.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(212, 175, 55, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      `;
      document.body.appendChild(countdownEl);
    }
    
    countdownEl.textContent = `${prayerName}: ${minutes}m ${seconds}s`;
    
    // Hapus setelah waktu habis
    if (timeDiff <= 0) {
      setTimeout(() => {
        if (countdownEl.parentNode) {
          countdownEl.parentNode.removeChild(countdownEl);
        }
      }, 5000);
    }
  }
}

// ==========================
// Audio Adzan dengan Fallback
// ==========================
function playAdzan(prayerType) {
  try {
    let audioFile;
    
    if (prayerType === 'subuh') {
      audioFile = 'assets/adzan-subuh.mp3';
    } else {
      audioFile = 'assets/adzan.mp3';
    }
    
    const audio = new Audio(audioFile);
    audio.volume = 0.7;
    
    audio.play().catch(e => {
      console.log('Audio play error:', e);
      // Fallback: Gunakan Web Audio API jika ada error
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 2000);
      } catch (err) {
        console.log('Web Audio API juga error:', err);
      }
    });
    
  } catch (error) {
    console.error('Error playing adzan:', error);
  }
}

// ==========================
// Browser Notification
// ==========================
function showNotification(prayerName) {
  if (!("Notification" in window)) {
    console.log("Browser tidak mendukung notifications");
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(`Waktu Sholat ${prayerName}`, {
      body: `Waktu sholat ${prayerName} telah tiba. Mari tunaikan sholat berjamaah.`,
      icon: 'assets/logo.png',
      tag: `sholat-${prayerName}`
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(`Waktu Sholat ${prayerName}`, {
          body: `Waktu sholat ${prayerName} telah tiba.`,
          icon: 'assets/logo.png'
        });
      }
    });
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
      el.addEventListener('mouseenter', () => el.style.transform = 'translateY(-3px)');
      el.addEventListener('mouseleave', () => el.style.transform = 'translateY(0)');
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
// Responsive Helper
// ==========================
function handleResponsive() {
  const isMobile = window.innerWidth < 768;
  
  // Sesuaikan jumlah kolom di mobile
  if (isMobile) {
    document.querySelectorAll('.prayer-time').forEach(el => {
      el.style.fontSize = '0.8rem';
      el.style.padding = '2px 4px';
    });
  }
  
  // Update jam container
  const clockContainer = document.querySelector('.clock-container');
  if (clockContainer) {
    if (isMobile) {
      clockContainer.style.gap = '8px';
    } else {
      clockContainer.style.gap = '15px';
    }
  }
}

// ==========================
// Inisialisasi
// ==========================
function init() {
  console.log('🕌 Initializing Jadwal Sholat App...');
  
  initParticles();
  updateClocks();
  setInterval(updateClocks, 1000);
  loadData();
  addHoverEffects();
  initParallax();
  handleResponsive();
  
  // Event listeners untuk responsive
  window.addEventListener('resize', handleResponsive);
  
  // Event listeners untuk filter
  yearSelect.addEventListener('change', loadData);
  monthSelect.addEventListener('change', loadData);
  
  // Cleanup function
  window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });
}

// Jalankan setelah DOM siap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Ekspor fungsi untuk debugging (opsional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadData,
    updateClocks,
    playAdzan,
    showNotification
  };
}
