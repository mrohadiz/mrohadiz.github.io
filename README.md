# M. Rohadiz - Digital Garden

Website personal untuk dokumentasi AI Engineering, Decision Systems, Infrastructure, dan Software Architecture.

## Features

- Dark/Light mode dengan persistensi LocalStorage
- Search functionality
- Responsive design
- Syntax highlighting
- Reading progress bar
- Floating TOC
- Image zoom
- Code copy button
- Intersection Observer animations

## Series System

Artikel dapat dikelompokkan ke dalam *series* untuk memudahkan pembaca mengikuti alur pembahasan yang berkesinambungan.

### Cara Menggunakan

Tambahkan field `series:` di front matter artikel dengan nilai slug (huruf kecil, `dash-case`):

```yaml
---
layout: article
title: "Judul Artikel"
date: 2026-07-28
categories:
  - Decision Systems
tags:
  - tag-1
  - tag-2
series: goal-setting
excerpt: "Deskripsi singkat..."
---
```

Semua artikel dengan nilai `series` yang sama akan dikelompokkan secara otomatis di halaman **topic page** masing-masing (misalnya `/topics/decision-systems/`).

### Contoh Series Saat Ini

| Series | Artikel |
|--------|---------|
| `goal-setting` | Goal Bukan Target, tetapi Proses Membangun Capability · Development Reality · Output Bukan Outcome · Organisasi Juga Mengalami Tahap Perkembangan |

### Menambahkan Artikel ke Series yang Sudah Ada

Cukup tambahkan nilai `series` yang sama ke artikel baru. Topic page akan langsung menampilkan artikel tersebut dalam grup yang sesuai tanpa perlu mengubah kode apa pun.

### Catatan

- Satu artikel hanya bisa menjadi bagian dari **satu series**
- Series ditampilkan di halaman **topic page** masing-masing berdasarkan kategori artikel
- Urutan artikel dalam series ditentukan oleh `date` di front matter

## Tech Stack

- Jekyll
- SCSS
- Vanilla JavaScript
- GitHub Pages

## Development

```bash
# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Build
bundle exec jekyll build
```

## License

MIT
