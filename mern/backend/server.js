import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  age: { type: Number, required: true, min: 1, max: 120 }
}, { timestamps: true });
const Student = mongoose.model('Student', studentSchema);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/students', async (req, res, next) => {
  const { name, email, age } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      age === '' || age === null || age === undefined ||
      !Number.isInteger(Number(age)) || Number(age) < 1 || Number(age) > 120) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const student = await Student.create({ name: name.trim(), email: email.trim().toLowerCase(), age: Number(age) });
    return res.status(201).json({ id: student._id, name: student.name, email: student.email, age: student.age });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'Email already exists' });
    if (err?.name === 'ValidationError') return res.status(400).json({ error: 'Invalid input' });
    return next(err);
  }
});

app.get('/api/students', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.minAge !== undefined) {
      const minAge = Number(req.query.minAge);
      if (!Number.isFinite(minAge) || minAge < 0) return res.status(400).json({ error: 'Invalid input' });
      filter.age = { $gte: minAge };
    }
    const students = await Student.find(filter).sort({ createdAt: 1, _id: 1 }).lean();
    return res.json(students.map(({ _id, name, email, age }) => ({ id: _id, name, email, age })));
  } catch (err) { return next(err); }
});

app.get('/api/students/:id', async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Student not found' });
  try {
    const s = await Student.findById(req.params.id).lean();
    if (!s) return res.status(404).json({ error: 'Student not found' });
    return res.json({ id: s._id, name: s.name, email: s.email, age: s.age });
  } catch (err) { return next(err); }
});

app.delete('/api/students/:id', async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: 'Student not found' });
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });
    return res.status(204).end();
  } catch (err) { return next(err); }
});

app.post('/api/feedback', async (req, res, next) => {
  const { name, email, rating, comment = '' } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 ||
      typeof comment !== 'string' || comment.length > 200) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  try {
    const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', new mongoose.Schema({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, maxlength: 200 }
    }, { timestamps: true }));
    const feedback = await Feedback.create({ name: name.trim(), email: email.trim().toLowerCase(), rating: Number(rating), comment });
    return res.status(201).json({ id: feedback._id, name: feedback.name, email: feedback.email, rating: feedback.rating, comment: feedback.comment });
  } catch (err) { return next(err); }
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  return res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI. Copy .env.example to .env and configure MongoDB.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log(`MERN API running at http://localhost:${PORT}`));
}
if (process.env.NODE_ENV !== 'test') start().catch((err) => { console.error(err); process.exit(1); });
export default app;
