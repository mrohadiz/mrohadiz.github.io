# Mobile UX Refinement Review (Author Card & Footer)

## Ringkasan Eksekutif
Pengalaman membaca di perangkat seluler (*mobile reading experience*) telah dioptimalkan secara signifikan. Pembaruan berfokus pada pengurangan jarak vertikal (*scrolling fatigue*), penerapan prinsip *progressive disclosure*, dan reorganisasi informasi (Author Card & Footer) untuk menjaga agar halaman terasa ringkas namun tetap informatif, tanpa mengorbankan SEO atau *Accessibility*.

---

## 1. Files Modified
- `_includes/author-card.html` — Perombakan total komponen profil penulis.
- `_includes/footer.html` — Implementasi *two-column grid* responsif.
- `_layouts/article.html` — Rekayasa ulang alur baca (*reading flow*) di akhir artikel.

---

## 2. Reduksi Tinggi (*Mobile Height Reduction*) & Whitespace
Tinggi ruang kosong berlebih di akhir artikel sebelumnya menyebabkan *scrolling* yang melelahkan. Kami telah melakukan:
- **Penyatuan Komponen:** Mengurangi margin raksasa antara artikel dan footer.
- **Tinggi Author Card (≤ 150px):** Kartu penulis diubah dari elemen bertumpuk vertikal yang panjang menjadi kartu fleksibel *inline* (Gambar Avatar - Info Utama - Label Keahlian kompak).
- **Tinggi Footer (Berikurang > 40%):** Dengan susunan kotak (*grid*) 2 kolom, tautan yang tadinya berderet ke bawah sepanjang layar kini hanya memakan setengah *viewport*.

---

## 3. Reading Flow & Progressive Disclosure
Alur baca kini sangat linear dan logis, dirancang khusus agar pembaca terus berada di *loop* retensi konten:
1. **Artikel Berakhir**
2. **Related Articles (Baru!):** Muncul secara instan di bawah artikel dengan *spacing* ketat, memancing pembaca untuk terus membaca (Algoritma pencocokan `tags` secara otomatis diterapkan).
3. **Author Card:** Menggunakan prinsip *progressive disclosure*. Hanya menampilkan Nama, Role, Keahlian Utama (berupa label ringkas), dan tautan `About Author →` untuk biografi lengkap. Tidak ada duplikasi teks biografi yang membosankan.
4. **Back to Notes:** Tombol kembali ke indeks catatan diletakkan di tengah dengan rapi.
5. **Footer:** Sebagai elemen terminal.

---

## 4. Footer Simplification & Two-Column Grid
- Tampilan daftar tautan raksasa vertikal (*vertical list*) pada mobile telah diganti dengan *grid-template-columns: 1fr 1fr*.
- Tautan sekunder (seperti *methodology*, *principles*, dll) sebagian besar digabungkan atau dikompresi.
- Telah ditambahkan pemicu tambahan `More Resources →` yang menavigasikan pengunjung ke direktori aset tanpa harus membanjiri antarmuka footer global.

---

## 5. Accessibility & Mobile Typography (A11y)
- **Teks Memanjang:** Font panjang dan judul kini memiliki manajemen tinggi baris (`line-height`) dan *wrapping* yang elegan agar tidak pecah di layar selebar 360px.
- **Aria Labels:** Diterapkan di `<aside aria-label="About the author">`, `<section aria-label="Related articles">`, serta `<ul aria-label="...">` pada setiap kolom footer.
- **Focus States & Target Sentuh:** Semua elemen yang bisa diklik (*links*, *buttons*) telah diberi ukuran target *tap/touch* yang lega dan *outline focus* untuk visibilitas navigasi *keyboard*.

---

## Kesimpulan
Tanpa memuat satu pun *library* tambahan, desain *mobile* baru kini terasa seperti dokumentasi modern (*Modern Documentation Site*). Pembaca dihantarkan mulus dari akhir artikel ke referensi terkait, didukung oleh identitas penulis yang kredibel namun tidak menginterupsi *flow*, dan ditutup oleh arsitektur footer yang solid dan terstruktur rapi di layar kecil.
