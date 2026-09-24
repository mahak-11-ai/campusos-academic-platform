import asyncHandler from 'express-async-handler';
import Question from '../models/Question.js';
import Subject from '../models/Subject.js';

export const getQuestions = asyncHandler(async (_req, res) => {
  const questions = await Question.find().sort({ createdAt: -1 }).limit(50);
  res.json(questions);
});

export const getMyQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.find({ askedBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(questions);
});

export const askQuestion = asyncHandler(async (req, res) => {
  const { question, subjectId, topic } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Question text is required');
  }

  let subject = null;
  let subjectName = '';
  if (subjectId) {
    subject = await Subject.findById(subjectId);
    if (subject) subjectName = subject.name;
  }

  const q = await Question.create({
    question,
    subject: subject ? subject._id : null,
    topic: topic || '',
    askedBy: req.user._id,
    askerName: req.user.name,
  });

  res.status(201).json(q);
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  if (!answer) {
    res.status(400);
    throw new Error('Answer text is required');
  }

  const q = await Question.findById(req.params.id);
  if (!q) {
    res.status(404);
    throw new Error('Question not found');
  }

  if (req.user.role !== 'teacher') {
    res.status(403);
    throw new Error('Only teachers can answer questions');
  }

  q.answer = answer;
  q.answeredBy = req.user.name;
  q.status = 'answered';
  await q.save();

  res.json(q);
});
