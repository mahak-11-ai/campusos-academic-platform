import asyncHandler from 'express-async-handler';
import Resource from '../models/Resource.js';
import Subject from '../models/Subject.js';

export const getResources = asyncHandler(async (req, res) => {
  const { subject, topic, type, search } = req.query;
  const filter = {};

  if (subject) filter.subject = subject;
  if (type) filter.resourceType = type;
  if (topic) filter.topic = { $regex: topic, $options: 'i' };
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { topic: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const resources = await Resource.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(resources);
});

export const getLatestResources = asyncHandler(async (_req, res) => {
  const resources = await Resource.find()
    .sort({ createdAt: -1 })
    .limit(8);
  res.json(resources);
});

export const getResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(resource);
});

export const getMyResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({ uploadedBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(resources);
});

export const createResource = asyncHandler(async (req, res) => {
  const { title, description, subjectId, topic, resourceType, fileUrl } = req.body;

  if (!title || !subjectId || !topic || !resourceType) {
    res.status(400);
    throw new Error('Title, subject, topic, and resource type are required');
  }

  const subject = await Subject.findById(subjectId);
  if (!subject) {
    res.status(404);
    throw new Error('Subject not found');
  }

  const resource = await Resource.create({
    title,
    description: description || '',
    subject: subject._id,
    subjectName: subject.name,
    topic,
    resourceType,
    fileName: req.file ? req.file.filename : '',
    filePath: req.file ? `/uploads/${req.file.filename}` : '',
    fileUrl: fileUrl || '',
    uploadedBy: req.user._id,
    uploaderName: req.user.name,
  });

  res.status(201).json(resource);
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  if (resource.uploadedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this resource');
  }

  await resource.deleteOne();
  res.json({ message: 'Resource removed' });
});
