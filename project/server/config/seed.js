import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

dotenv.config();

const subjects = [
  { name: 'Data Structures & Algorithms', code: 'CS301', description: 'Fundamental data structures, algorithm design and analysis.' },
  { name: 'Operating Systems', code: 'CS302', description: 'Process management, memory, file systems, and concurrency.' },
  { name: 'Database Management Systems', code: 'CS303', description: 'Relational model, SQL, normalization, transactions.' },
  { name: 'Computer Networks', code: 'CS304', description: 'OSI/TCP-IP model, routing, protocols, network security.' },
  { name: 'Object Oriented Programming', code: 'CS201', description: 'Classes, inheritance, polymorphism, design patterns.' },
  { name: 'Engineering Mathematics', code: 'MA201', description: 'Calculus, linear algebra, probability and statistics.' },
  { name: 'Machine Learning', code: 'CS401', description: 'Supervised and unsupervised learning, neural networks.' },
  { name: 'Web Technologies', code: 'CS305', description: 'HTML, CSS, JavaScript, backend frameworks, REST APIs.' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await Subject.deleteMany();
    await Resource.deleteMany();

    const createdSubjects = await Subject.insertMany(subjects);
    console.log(`Seeded ${createdSubjects.length} subjects`);

    const teacher = await User.findOne({ role: 'teacher' });
    if (teacher) {
      const dsa = createdSubjects.find((s) => s.code === 'CS301');
      const os = createdSubjects.find((s) => s.code === 'CS302');
      const dbms = createdSubjects.find((s) => s.code === 'CS303');

      await Resource.create([
        {
          title: 'Introduction to Arrays and Linked Lists',
          description: 'Comprehensive notes covering arrays, dynamic arrays, and singly/doubly linked lists with examples.',
          subject: dsa._id,
          subjectName: dsa.name,
          topic: 'Arrays & Linked Lists',
          resourceType: 'notes',
          fileUrl: 'https://example.com/dsa-arrays-notes.pdf',
          uploadedBy: teacher._id,
          uploaderName: teacher.name,
        },
        {
          title: 'DBMS 2022 Previous Year Paper',
          description: 'End-semester examination paper from 2022 with full syllabus coverage.',
          subject: dbms._id,
          subjectName: dbms.name,
          topic: 'Final Exam',
          resourceType: 'previous-paper',
          fileUrl: 'https://example.com/dbms-2022-paper.pdf',
          uploadedBy: teacher._id,
          uploaderName: teacher.name,
        },
        {
          title: 'Process Scheduling Algorithms',
          description: 'Notes on FCFS, SJF, Round Robin and Priority scheduling with solved problems.',
          subject: os._id,
          subjectName: os.name,
          topic: 'CPU Scheduling',
          resourceType: 'notes',
          fileUrl: 'https://example.com/os-scheduling.pdf',
          uploadedBy: teacher._id,
          uploaderName: teacher.name,
        },
      ]);
      console.log('Seeded sample resources');
    } else {
      console.log('No teacher found — skipping resource seed. Create a teacher account first.');
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
