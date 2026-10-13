import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

let students = [];
let nextId = 1;

const isValidStudent = ({ name, email, age }) =>
  typeof name === 'string' && name.trim().length > 0 &&
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
  age !== '' && age !== null && age !== undefined &&
  Number.isInteger(Number(age)) && Number(age) > 0 &&
  Number(age) <= 120;

app.post('/students', (req, res) => {
  const body = req.body ?? {};
  if (!isValidStudent(body)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const age = Number(body.age);

  if (students.some((student) => student.email.toLowerCase() === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const student = { id: nextId++, name, email, age };
  students.push(student);
  return res.status(201).json(student);
});

app.get('/students', (req, res) => {
  let result = students;
  if (req.query.minAge !== undefined) {
    const minAge = Number(req.query.minAge);
    if (!Number.isFinite(minAge) || minAge < 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    result = students.filter((student) => student.age >= minAge);
  }
  return res.status(200).json(result);
});

app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((item) => item.id === id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  return res.status(200).json(student);
});

app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  students.splice(index, 1);
  return res.status(204).end();
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Student API running at http://localhost:${PORT}`));
}

export default app;
