// src/controllers/notesController.js

import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати список усіх нотаток
// export const getAllNotes = async (req, res) => {
//   const notes = await Note.find();
//   res.status(200).json(notes);
// };

export const getAllNotes = async (req, res) => {
  // Отримуємо параметри запиту
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  // Базовий запит
  // const notesQuery = Note.find();

  // Додаємо критерій пошуку тільки нотаток поточного користувача
  const notesQuery = Note.find({ userId: req.user._id });

  // Текстовий пошук по title + content (працює лише якщо створено текстовий індекс)
  if (search) {
    notesQuery.where({
      $text: { $search: search },
    });
  }

  // Фільтр за тегом
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  // Пагінація

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  // const note = await Note.findById(noteId);

  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
    // інший правильний варіант (на старіших версіях)
    // next(createHttpError(404, 'Note not found'));
    // return;
  }

  res.status(200).json(note);
};

// Новий контролер

export const createNote = async (req, res) => {
  // const note = await Note.create(req.body);

  const note = await Note.create({
    ...req.body,
    // Додаємо властивість userId
    userId: req.user._id,
  });

  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  // const note = await Note.findOneAndDelete({
  //   _id: noteId,
  // });

  const note = await Note.findOneAndDelete({
    _id: noteId,
    // Критерій пошуку по userId
    userId: req.user._id,
  });

  // findByIdAndDelete - тільки по ID шукає і видаляє
  // findOneAndDelete - можна дописати ще додаткові умови - категорія, ще щось

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  // const note = await Note.findOneAndUpdate(
  //   { _id: noteId }, // Шукаємо по id
  //   req.body,
  //   { new: true },
  // );

  const note = await Note.findOneAndUpdate(
    // Критерій пошуку по userId
    { _id: noteId, userId: req.user._id },
    req.body, // передаємо оновлення
    { new: true },
    // за замовленням нічого не поверає, щоб повернути оновлений документ,
    // треба цю дод.властивість
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
