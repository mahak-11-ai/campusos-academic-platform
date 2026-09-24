import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Subject from '../models/Subject.js';
import Question from '../models/Question.js';

export const getStudentStats = asyncHandler(async (req, res) => {
  const totalResources = await Resource.countDocuments();
  const totalSubjects = await Subject.countDocuments();
  const myQuestions = await Question.countDocuments({ askedBy: req.user._id });
  const pendingQuestions = await Question.countDocuments({
    askedBy: req.user._id,
    status: 'pending',
  });

  res.json({
    totalResources,
    totalSubjects,
    myQuestions,
    pendingQuestions,
  });
});

export const getTeacherStats = asyncHandler(async (req, res) => {
  const myResources = await Resource.countDocuments({ uploadedBy: req.user._id });
  const totalResources = await Resource.countDocuments();
  const totalSubjects = await Subject.countDocuments();
  const pendingQuestions = await Question.countDocuments({ status: 'pending' });

  res.json({
    myResources,
    totalResources,
    totalSubjects,
    pendingQuestions,
  });
});
