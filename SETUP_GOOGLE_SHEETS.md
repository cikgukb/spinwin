# Panduan Setup Google Sheets Integration

## Langkah 1: Buat Google Sheet Baru

1. Pergi ke [Google Sheets](https://sheets.google.com)
2. Klik **Blank** untuk buat spreadsheet baru
3. Namakan spreadsheet anda (contoh: "KB Wealth Spin & Win Data")
4. Di **Row 1**, masukkan header berikut:
   - A1: `Nama`
   - B1: `Telefon`
   - C1: `Email`
   - D1: `Timestamp`

## Langkah 2: Buat Google Apps Script

1. Dalam Google Sheet, klik menu **Extensions** > **Apps Script**
2. Padam semua kod sedia ada
3. **Salin dan tampal** kod berikut:

```javascript
function doPost(e) {
  try {
    // Buka spreadsheet aktif
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Dapatkan data dari form
    var nama = e.parameter.nama;
    var telefon = e.parameter.telefon;
    var email = e.parameter.email;
    var timestamp = e.parameter.timestamp;
    
    // Tambah row baru dengan data
    sheet.appendRow([nama, telefon, email, timestamp]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function untuk test
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Web App is running!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Klik **File** > **Save** (atau Ctrl+S)
5. Namakan projek anda (contoh: "SpinWin Form Handler")

## Langkah 3: Deploy sebagai Web App

1. Klik butang **Deploy** (sebelah kanan atas) > **New deployment**
2. Klik ikon **gear** sebelah "Select type" dan pilih **Web app**
3. Isikan maklumat berikut:
   - **Description**: "Spin & Win Form Handler"
   - **Execute as**: Pilih **Me** (akaun anda)
   - **Who has access**: Pilih **Anyone** (untuk membolehkan sesiapa sahaja submit form)
4. Klik **Deploy**
5. Klik **Authorize access** dan pilih akaun Google anda
6. Jika ada warning "This app isn't verified", klik **Advanced** > **Go to [nama projek] (unsafe)**
7. Klik **Allow** untuk memberikan kebenaran

## Langkah 4: Salin Web App URL

1. Selepas deploy, anda akan nampak **Web app URL**
2. **Salin URL** tersebut (ia kelihatan seperti: `https://script.google.com/macros/s/ABC...XYZ/exec`)

## Langkah 5: Kemaskini script.js

1. Buka fail `script.js` dalam projek anda
2. Cari baris ini:
   ```javascript
   const GOOGLE_SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
   ```
3. Gantikan `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL` dengan URL yang anda salin tadi:
   ```javascript
   const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/ABC...XYZ/exec";
   ```
4. Simpan fail

## Langkah 6: Test

1. Buka website anda
2. Isi borang pendaftaran
3. Semak Google Sheet anda - data sepatutnya muncul!

---

## Troubleshooting

### Data tidak masuk ke Sheet?
- Pastikan URL telah dikemaskini dalam `script.js`
- Semak Console browser untuk melihat error (tekan F12 > Console)
- Pastikan anda telah deploy sebagai **Web App** (bukan "Test deployment")

### Error "Authorization required"?
- Klik **Authorize access** semula dalam Apps Script
- Pastikan pilihan "Who has access" adalah **Anyone**

### Nak update kod Apps Script?
1. Buat perubahan pada kod
2. Klik **Deploy** > **Manage deployments**
3. Klik ikon pensil untuk edit deployment
4. Tukar **Version** ke **New version**
5. Klik **Deploy**

---

## Keselamatan

⚠️ **Penting**: URL Web App anda adalah sensitif. Jangan kongsi secara terbuka kerana sesiapa yang mempunyai URL boleh menghantar data ke sheet anda.

Untuk keselamatan lebih lanjut, anda boleh menambah pengesahan dalam kod Apps Script seperti secret key atau referrer check.
