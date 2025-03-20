# Services

Direktori ini berisi service classes yang mengelola logika bisnis aplikasi. Service bertindak sebagai perantara antara controllers dan repositories, serta bertanggung jawab untuk mengatur logika bisnis kompleks yang melibatkan satu atau lebih entitas.

## Struktur

Service mengikuti prinsip Single Responsibility Principle, dimana masing-masing service hanya bertanggung jawab untuk satu jenis fungsionalitas yang spesifik.

## AuthService

`AuthService` menyediakan operasi terkait autentikasi dan manajemen token.

### Penggunaan

```javascript
const { AuthService } = require("../models");

// Registrasi user baru
const registerUser = async (userData) => {
  try {
    const result = await AuthService.register(userData);
    return result; // { user, token }
  } catch (error) {
    // Handle error
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const result = await AuthService.login(email, password);
    return result; // { user, token }
  } catch (error) {
    // Handle error
  }
};

// Memeriksa token dan mendapatkan user
const getUserFromToken = async (token) => {
  try {
    const user = await AuthService.getUserFromToken(token);
    return user;
  } catch (error) {
    // Handle error
  }
};

// Memverifikasi token
const verifyUserToken = (token) => {
  try {
    const decoded = AuthService.verifyToken(token);
    return decoded; // { id, email, role }
  } catch (error) {
    // Handle error
  }
};
```

## Kenapa Menggunakan Service Pattern?

1. **Separation of Concern**: Memisahkan logika bisnis dari controllers dan repositories
2. **Reusability**: Dapat digunakan kembali di berbagai controllers
3. **Testability**: Memudahkan unit testing
4. **Maintainability**: Lebih mudah untuk mempertahankan dan mengembangkan kode
5. **Domain Logic**: Menempatkan logika bisnis kompleks dalam satu tempat yang terorganisir

## Implementasi Lain yang Mungkin

Service lain yang mungkin diimplementasikan di masa depan:

1. **EmailService**: Untuk mengirim email
2. **PaymentService**: Untuk mengelola pembayaran
3. **NotificationService**: Untuk mengelola notifikasi
4. **FileUploadService**: Untuk mengelola upload file
