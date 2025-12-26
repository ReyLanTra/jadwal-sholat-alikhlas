# 🕌 Jadwal Sholat Al-Ikhlas Pekunden

![Banner](https://img.shields.io/badge/Jadwal-Sholat-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-gold)
![License](https://img.shields.io/badge/License-MIT-blue)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)

Website jadwal sholat modern dengan animasi elegan untuk Mushola Al-Ikhlas Pekunden. Dibuat dengan ❤️ menggunakan HTML, CSS, dan JavaScript murni.

## ✨ Demo Live

🌐 **Akses Website**: [https://jadwal-sholat-alikhlas.reyzar.my.id](https://jadwal-sholat-alikhlas.reyzar.my.id)  
📂 **Repository**: [https://github.com/ReyLanTra/Jadwal-Sholat](https://github.com/ReyLanTra/Jadwal-Sholat)

## 🚀 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📅 **Jadwal Lengkap** | Imsak, Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya |
| ⏰ **Jam Real-time** | Tampilan jam WIB, WITA, dan WIT secara live |
| 🎯 **Hari Ini** | Highlight otomatis untuk hari berjalan |
| 🌙 **UI Islami** | Desain dengan tema hijau-emas elegan |
| ✨ **Animasi Keren** | Partikel, floating, dan efek hover modern |
| 📱 **Responsif** | Optimal di desktop, tablet, dan mobile |
| 🔄 **Filter Bulan/Tahun** | Pilih jadwal berdasarkan periode |
| 🎨 **Visual Indikator** | Waktu sholat dengan penanda jelas |

## 🎥 Preview

### 🖥️ Tampilan Desktop
![Desktop View](https://via.placeholder.com/800x450/0b2a1f/ffffff?text=Desktop+View+Coming+Soon)

### 📱 Tampilan Mobile
![Mobile View](https://via.placeholder.com/400x700/0f5132/ffffff?text=Mobile+View+Coming+Soon)

## 🛠️ Teknologi

<div align="center">

| Frontend | Description |
|----------|-------------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | Struktur halaman |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | Styling & animasi |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Interaktivitas |
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) | Hosting & Deployment |

</div>

## 📁 Struktur Project

```
jadwal-sholat-alikhlas/
├── 📄 index.html          # Halaman utama
├── 🎨 style.css           # Stylesheet dengan animasi
├── ⚡ script.js           # JavaScript functionality
├── 📁 assets/
│   └── 🏛️ logo.png       # Logo mushola
├── 📁 kab-tegal/
│   ├── 📊 2025.json       # Data jadwal 2025
│   ├── 📊 2026.json       # Data jadwal 2026
│   └── ...               # Data tahun lainnya
└── 📘 README.md          # Dokumentasi ini
```

## 🚀 Instalasi & Penggunaan

### **Lokal Development**
```bash
# 1. Clone repository
git clone https://github.com/ReyLanTra/Jadwal-Sholat.git

# 2. Masuk ke folder project
cd Jadwal-Sholat

# 3. Buka di browser
# Buka file index.html langsung atau gunakan live server
```

### **Deployment**
```bash
# Push ke GitHub
git add .
git commit -m "Update: description"
git push origin main

# Deploy ke Vercel
# 1. Import dari GitHub di vercel.com
# 2. Pilih repository
# 3. Deploy otomatis!
```

## 🎨 Customization

### **Warna Tema**
```css
:root {
  --gold: #d4af37;      /* Warna emas untuk aksen */
  --dark: #0b2a1f;      /* Hijau tua untuk background */
  --green: #0f5132;     /* Hijau untuk elemen */
  --soft: #f4f8f6;      /* Warna soft untuk kontras */
}
```

### **Data Jadwal**
- Data disimpan dalam format JSON di folder `kab-tegal/`
- Struktur data mengikuti format Kemenag
- Dapat diganti dengan data wilayah lain

## 🔧 Fitur Teknis

### **Animasi CSS3**
```css
/* Contoh animasi floating logo */
@keyframes floatLogo {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(2deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}
```

### **JavaScript Features**
- Fetch data JSON asinkronus
- Filter berdasarkan bulan & tahun
- Update jam real-time
- Highlight hari otomatis

## 📱 Responsive Design

| Device | Breakpoint | Features |
|--------|------------|----------|
| Desktop | > 1024px | Full animations, hover effects |
| Tablet | 768px - 1024px | Adjusted padding, smaller fonts |
| Mobile | < 768px | Stacked layout, touch-friendly |

## 🤝 Berkontribusi

Contributions are welcome! Ikuti langkah berikut:

1. **Fork** repository ini
2. **Buat branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add: AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. **Buka Pull Request**

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Credits & Thanks

**Dibuat dengan penuh cinta oleh:**

<div align="center">

### **👨‍💻 Reyzar Alansyah**
#### *Full Stack Developer & UI/UX Enthusiast*

[![GitHub](https://img.shields.io/badge/GitHub-ReyLanTra-181717?style=for-the-badge&logo=github)](https://github.com/ReyLanTra)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-FF7139?style=for-the-badge)](https://reyzaralansyah.vercel.app)
[![Email](https://img.shields.io/badge/Email-Contact-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:reyzar.alansyah@example.com)

</div>

### **Special Thanks**
- **Kemenag RI** untuk data jadwal sholat
- **Google Fonts** untuk typography
- **Vercel** untuk hosting platform
- **Komunitas Muslim** untuk inspirasi

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ReyLanTra/Jadwal-Sholat&type=Date)](https://star-history.com/#ReyLanTra/Jadwal-Sholat&Date)

---

<div align="center">

**"Barangsiapa memudahkan urusan seorang muslim di dunia, Allah akan memudahkan urusannya di akhirat."**  
*(HR. Muslim)*

---
 
Jika project ini bermanfaat, jangan lupa ⭐ **star** repository ini!

© 2025 - Present | Mushola Al-Ikhlas Pekunden | Reyzar Alansyah

</div>

## 📞 Kontak & Support

Untuk pertanyaan, saran, atau kolaborasi:

- **Issues**: [GitHub Issues](https://github.com/ReyLanTra/Jadwal-Sholat/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ReyLanTra/Jadwal-Sholat/discussions)
- **Email**: orangpolos860@gmail.com
- **WhatsApp**: https://wa.me/6285800240112
- **Media Sosial**: https://medsos.reyzar.my.id/

---

*Terima kasih telah menggunakan Jadwal Sholat Al-Ikhlas Pekunden! Semoga bermanfaat untuk ibadah kita semua.* 🕌
