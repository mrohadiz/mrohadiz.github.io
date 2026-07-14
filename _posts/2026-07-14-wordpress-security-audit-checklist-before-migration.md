---
layout: article
title: "WordPress Security Audit Checklist Before Migration"
date: 2026-07-14
last_modified_at: 2026-07-14
categories:
  - Digital Garden
tags:
  - wordpress
  - security
  - audit
  - migration
  - checklist
excerpt: "Checklist praktis untuk memeriksa keamanan WordPress sebelum migrasi server."
image: "/assets/images/thumbnail.png"
---



Sebelum memigrasikan WordPress ke server baru, saya selalu memeriksa apakah situs benar-benar bersih dari indikator kompromi. Di shared hosting, audit tidak bisa menjangkau semua lapisan infrastruktur, jadi fokus utama ada pada core WordPress, file, plugin, theme, database, dan konfigurasi dasar.

## 1. Identitas Website

- [ ] Verifikasi domain yang diaudit
- [ ] Cek `siteurl` dan `home`
- [ ] Catat versi WordPress
- [ ] Catat versi PHP
- [ ] Catat jenis web server
- [ ] Catat penyedia hosting

## 2. Integritas WordPress Core

- [ ] Jalankan verifikasi checksum WordPress
- [ ] Identifikasi file core yang berubah
- [ ] Backup file mencurigakan sebelum tindakan
- [ ] Restore core resmi jika perlu
- [ ] Verifikasi ulang checksum sampai valid

## 3. File Asing dan Indikator Malware

- [ ] Cari file PHP asing di root
- [ ] Cari file tersembunyi seperti `.pid`, `.htpasswd`, `.bak`, `.old`
- [ ] Cari file dengan nama acak
- [ ] Periksa indikasi web shell
- [ ] Periksa indikasi SEO spam
- [ ] Periksa indikator Adminer atau file manager ilegal

## 4. Signature Kode Mencurigakan

- `base64_decode(`
- `eval(`
- `assert(`
- `gzinflate(`
- `shell_exec(`
- `system(`
- `exec(`
- `passthru(`
- `create_function(`
- `preg_replace('/e')`

## 5. Upload Folder

- [ ] Cari file PHP di `wp-content/uploads`
- [ ] Pastikan file yang ada memang milik plugin resmi
- [ ] Tidak ada web shell di upload folder
- [ ] Tidak ada file executable asing

## 6. Plugin

- [ ] Daftar semua plugin aktif dan nonaktif
- [ ] Cek plugin asing
- [ ] Cek plugin tanpa header WordPress
- [ ] Cek plugin yang tidak muncul di `wp plugin list`
- [ ] Periksa versi plugin
- [ ] Periksa apakah ada CVE atau plugin yang sudah abandoned

## 7. Theme

- [ ] Audit `functions.php`
- [ ] Audit `header.php`
- [ ] Audit `footer.php`
- [ ] Audit `index.php`
- [ ] Audit `404.php`
- [ ] Cari redirect tersembunyi atau injection kode

## 8. Database

- [ ] Cek `wp_options`
- [ ] Cek `wp_posts`
- [ ] Cek `wp_users`
- [ ] Cek `wp_usermeta`
- [ ] Cari kata kunci seperti `casino`, `bonus`, `viagra`, `iframe`, `script`, `hidden link`

## 9. Administrator

- [ ] Cek daftar admin
- [ ] Pastikan tidak ada akun asing
- [ ] Validasi email admin
- [ ] Rencanakan rotasi password setelah audit

## 10. Cron dan Konfigurasi

- [ ] Cek cron WordPress
- [ ] Cek cron plugin
- [ ] Audit `wp-config.php`
- [ ] Audit `.htaccess`
- [ ] Periksa permission file dan folder
- [ ] Pastikan tidak ada permission 777

## 11. IOC dan Baseline

- [ ] Simpan nama file
- [ ] Simpan lokasi file
- [ ] Simpan hash SHA256
- [ ] Simpan ukuran file
- [ ] Simpan waktu modifikasi
- [ ] Buat baseline setelah pembersihan

## 12. Keputusan

Gunakan tiga status ini:

**PASS** — tidak ditemukan indikator kompromi pada ruang lingkup audit

**PASS WITH CONDITIONS** — bersih, tetapi masih ada keterbatasan verifikasi

**FAIL** — masih ada artefak kompromi, core belum valid, atau evidence belum cukup

## Catatan

Di shared hosting, beberapa hal tidak bisa diverifikasi penuh, seperti log server, ownership file, proses sistem, dan konfigurasi OS. Itu harus ditulis sebagai *not verifiable*, bukan otomatis dianggap aman.

Audit yang baik bukan hanya mencari malware. Audit yang baik membantu kita mengambil keputusan migrasi dengan tingkat keyakinan yang jelas.
