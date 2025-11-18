// src/models/note.js

import { Schema } from 'mongoose';
import { model } from 'mongoose';

import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
    },
    content: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      required: false,
      default: 'Todo',
      enum: TAGS,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index(
  { title: 'text', content: 'text' },
  {
    name: 'NoteTextIndex',
    weights: { title: 5, content: 1 },
    default_language: 'english',
  },
);

export const Note = model('Note', noteSchema);
