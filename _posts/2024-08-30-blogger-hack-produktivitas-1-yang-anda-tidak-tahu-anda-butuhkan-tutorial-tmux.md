---
layout: article
title: "Hack Produktivitas #1 yang Anda Tidak Tahu Anda Butuhkan: Tutorial Tmux"
date: 2024-08-30T09:14:00+07:00
permalink: /2024/08/hack-produktivitas-1-yang-anda-tidak.html
categories:
  - "Infrastructure"
tags:
  - "cli"
  - "linux"
  - "terminal"
excerpt: "Hack Produktivitas #1 yang Anda Tidak Tahu Anda Butuhkan: Tutorial Tmux Tmux adalah alat yang memungkinkan kita untuk mengelola beberapa terminal dalam satu jendela"
migrated_from: "https://www.mrohadiz.my.id/2024/08/hack-produktivitas-1-yang-anda-tidak.html"
image: /assets/images/og/2024-08-30-hack-produktivitas-1-yang-anda-tidak-tahu-anda-butuhkan-tutorial-tmux.png
---

<!-- Migrated from Blogger; lightly cleaned for the digital garden while preserving the original claims and publication date. -->
<!-- META: Pelajari cara menggunakan Tmux untuk meningkatkan produktivitas terminal Anda dengan tutorial dari dasar hingga tingkat lanjut. -->

<h2>Hack Produktivitas #1 yang Anda Tidak Tahu Anda Butuhkan: Tutorial Tmux</h2>
<p>Tmux adalah alat yang memungkinkan kita untuk mengelola beberapa terminal dalam satu jendela. Dengan Tmux, kita bisa membuka banyak terminal sekaligus, mengelola sesi, dan membagi layar menjadi beberapa bagian. Berikut adalah tutorial Tmux dari dasar hingga tingkat lanjut.</p>

<h2>Dasar Tmux</h2>
<h3>1. Instalasi Tmux</h3>
<pre><code>sudo apt-get install tmux</code></pre>

<h3>2. Membuka Tmux</h3>
<pre><code>tmux</code></pre>

<h3>3. Membuat Sesi Baru</h3>
<pre><code>tmux new-session</code></pre>

<h3>4. Membagi Layar</h3>
<pre><code>tmux split-window</code></pre>

<h3>5. Berpindah Antara Layar</h3>
<pre><code>tmux select-pane -t 0</code></pre>
<p>Ganti <code>0</code> dengan nomor layar yang ingin kita pilih.</p>

<h2>Intermediate Tmux</h2>
<h3>1. Membuat Sesi dengan Nama</h3>
<pre><code>tmux new-session -s mysession</code></pre>
<p>Ganti <code>mysession</code> dengan nama sesi yang ingin kita buat.</p>

<h3>2. Menyimpan Sesi</h3>
<pre><code>tmux save-buffer</code></pre>

<h3>3. Memuat Sesi</h3>
<pre><code>tmux load-buffer</code></pre>

<h3>4. Mengelola Sesi</h3>
<pre><code>tmux list-sessions</code></pre>
<p>Perintah ini akan menampilkan daftar sesi yang sedang aktif.</p>

<h3>5. Menghapus Sesi</h3>
<pre><code>tmux kill-session -t mysession</code></pre>
<p>Ganti <code>mysession</code> dengan nama sesi yang ingin kita hapus.</p>

<h2>Advance Tmux</h2>
<h3>1. Menggunakan Keybinding</h3>
<p>Tmux memiliki fitur keybinding yang memungkinkan kita untuk mengatur shortcut untuk perintah-perintah Tmux. Untuk mengatur keybinding, kita bisa mengetikkan perintah berikut:</p>
<pre><code>bind-key -n C-a last-window</code></pre>
<p>Perintah ini akan mengatur shortcut <code>C-a</code> untuk perintah <code>last-window</code>.</p>

<h3>2. Menggunakan Plugin</h3>
<p>Tmux juga mendukung plugin yang dapat membantu kita menambahkan fitur-fitur baru. Untuk menginstal plugin, kita bisa mengetikkan perintah berikut:</p>
<pre><code>tmux plugin install &lt;plugin_name&gt;</code></pre>
<p>Ganti <code>&lt;plugin_name&gt;</code> dengan nama plugin yang ingin kita instal.</p>

<h3>3. Menggunakan Script</h3>
<p>Tmux memiliki fitur script yang memungkinkan kita untuk menjalankan perintah-perintah Tmux secara otomatis. Untuk membuat script, kita bisa mengetikkan perintah berikut:</p>
<pre><code>tmux script -f myscript</code></pre>
<p>Ganti <code>myscript</code> dengan nama script yang ingin kita buat.</p>

<h3>4. Menggunakan Tmux dengan SSH</h3>
<p>Tmux dapat digunakan dengan SSH untuk mengelola sesi remote. Untuk mengelola sesi remote, kita bisa mengetikkan perintah berikut:</p>
<pre><code>tmux -S /tmp/tmux.sock new-session -s mysession</code></pre>
<p>Ganti <code>/tmp/tmux.sock</code> dengan lokasi socket Tmux yang ingin kita gunakan.</p>

<p>Dengan mengikuti tutorial ini, kita akan dapat menggunakan Tmux dengan lebih efektif dan efisien. Tmux adalah alat yang sangat powerful dan dapat membantu kita meningkatkan produktivitas dalam menggunakan terminal.</p>
