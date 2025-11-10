// src/middleware/errorHandler.js

import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  // Якщо помилка створена через http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: isProd
        ? 'Something went wrong. Please try again later.'
        : err.message || err.name,
    });
  }

  // Усі інші помилки — як внутрішні
  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};
