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

  // Створюємо базовий запит
  const notesQuery = Note.find();

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

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

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
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
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

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
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
