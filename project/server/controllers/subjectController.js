import asyncHandler from 'express-async-handler';
import Subject from '../models/Subject.js';

export const getSubjects = asyncHandler(async (_req, res) => {
  const subjects = await Subject.find().sort({ name: 1 });
  res.json(subjects);
});

export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }
  res.json(subject);
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, description } = req.body;
  if (!name || !code) {
    res.status(400);
    throw new Error('Name and code are required');
  }
  const subject = await Subject.create({ name, code, description });
  res.status(201).json(subject);
});
