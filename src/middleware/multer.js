// src/middleware/multer.js

import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images allowed'));
    }
    cb(null, true);
  },
});

// Що тут відбувається?

// storage: multer.memoryStorage() — зберігає файл у пам’яті сервера (не на диску).
// limits.fileSize — обмежує розмір завантаження до 2 МБ.
// fileFilter — визначає, які файли дозволено приймати. У цьому випадку — лише ті, чий mimetype починається з "image/".

// fileFilter — це функція, яку multer викликає для кожного завантаженого файлу. Вона отримує три аргументи:
// req — HTTP-запит, як у звичайному Express;
// file — інформація про файл (назва, MIME-тип, розмір тощо);
// cb — callback, який повідомляє multer, що робити з файлом.
