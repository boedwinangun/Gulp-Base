# Gulp-Base
Gulp Automation
- Gulp Build system
- SASS for CSS preprocessing.
- Image minification.
- BrowserSync server, Sebagai Webserver Local dan sinkronisasi browser beserta perangkat lain (ex: mobile).
- JsHint.
- Notifikasi Error Reporting With Growl. `Test: Windows 7 Ultimate`

## Notifikasi with Growl
Agar notifikasi berjalan lancar pada OS windows lakukan 2 langkah berikut :
- Install Growl for Windows [http://www.growlforwindows.com/gfw/default.aspx]
- Aktifkan Growl.
`Test: Windows 7 Ultimate`

## Instalasi
Beberapa langkah yang harus dilakukan:
### 1. Download and install Node.js
- Kunjungungi https://nodejs.org/en/ dan download Node.js
- Instalasi node.js sama seperti software lain yang berjalan di windows.
- Cek apakah node sudah terinstal dengan baik melalui command line:
```sh
node -v
```

### 2. Clone the Repo:
```sh
$ git clone https://github.com/boedwinangun/gulp-base.git
```

### 3. Install dependencies:
Arahkan ke folder root gulp-base dengan command line dan jalankan perintah berikut :
```sh
$ npm install
```

## Pemakaian
Gunakan 2 langkah berikut:
### 1. Langkah Develop
- Memantau seluruh perubahan file pada folder app.
- Mengirimkan pesan notifikasi bila terjadi error.
```sh
$ gulp
```

### 2. Langkah Produksi
- Membuat folder dist beserta file zip yang siap di produksi.
```sh
$ gulp distZip
```

*Note: Notifikasi Growl Wajib terkoneksi dengan internet Jika tidak Notifikasi hanya sebatas WindowsBalloon*
*Note: Informasi lebih detail silahkan baca artikel berikut ini*
> Artikel [https://solvedia.blogspot.co.id/2017/08/javascript-langkah-mudah-otomatisasi.html]  
