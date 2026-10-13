import { useEffect, useState } from 'react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({ name: '', email: '', age: '' });
  const [minAge, setMinAge] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState({ name: '', email: '', rating: '', comment: '' });
  const [feedbackMessage, setFeedbackMessage] = useState('');

  async function loadStudents() {
    try {
      const suffix = minAge === '' ? '' : `?minAge=${encodeURIComponent(minAge)}`;
      const response = await fetch(`/api/students${suffix}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load students');
      setStudents(data);
    } catch (error) { setMessage(error.message); }
  }
  useEffect(() => { loadStudents(); }, []); // Initial list load

  async function addStudent(e) {
    e.preventDefault(); setMessage('');
    try {
      const response = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add student');
      setStudent({ name: '', email: '', age: '' }); setMessage(`Added ${data.name} successfully.`); await loadStudents();
    } catch (error) { setMessage(error.message); }
  }
  async function deleteStudent(id) {
    setMessage('');
    try {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || 'Delete failed'); }
      setMessage('Student deleted.'); await loadStudents();
    } catch (error) { setMessage(error.message); }
  }
  async function submitFeedback(e) {
    e.preventDefault(); setFeedbackMessage('');
    try {
      const response = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedback) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Feedback could not be submitted');
      setFeedbackMessage(`Thank you, ${data.name}! Feedback submitted.`);
      setFeedback({ name: '', email: '', rating: '', comment: '' });
    } catch (error) { setFeedbackMessage(error.message); }
  }

  return <main className="shell">
    <header><p className="eyebrow">FULL STACK DEVELOPMENT LAB</p><h1>Student Records & Feedback</h1><p className="muted">React frontend · Express API · MongoDB database</p></header>
    {message && <p className="notice" role="status">{message}</p>}
    <section className="panel">
      <h2>Add a student</h2>
      <form className="student-form" onSubmit={addStudent}>
        <input aria-label="Student name" placeholder="Full name" required value={student.name} onChange={e => setStudent({ ...student, name: e.target.value })}/>
        <input aria-label="Student email" placeholder="Email" type="email" required value={student.email} onChange={e => setStudent({ ...student, email: e.target.value })}/>
        <input aria-label="Student age" placeholder="Age" type="number" min="1" max="120" required value={student.age} onChange={e => setStudent({ ...student, age: e.target.value })}/>
        <button>Add student</button>
      </form>
      <div className="list-heading"><h2>Student records</h2><form onSubmit={e => { e.preventDefault(); loadStudents(); }} className="filter"><label htmlFor="min-age">Minimum age</label><input id="min-age" type="number" min="0" value={minAge} onChange={e => setMinAge(e.target.value)}/><button className="secondary">Filter</button></form></div>
      {students.length === 0 ? <p className="muted">No student records found.</p> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Age</th><th>Action</th></tr></thead><tbody>{students.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.age}</td><td><button className="danger" onClick={() => deleteStudent(s.id)}>Delete</button></td></tr>)}</tbody></table></div>}
    </section>
    <section className="panel">
      <h2>Course feedback</h2>
      <form className="feedback-form" onSubmit={submitFeedback}>
        <label>Name<input required value={feedback.name} onChange={e => setFeedback({ ...feedback, name: e.target.value })}/></label>
        <label>Email<input required type="email" value={feedback.email} onChange={e => setFeedback({ ...feedback, email: e.target.value })}/></label>
        <label>Rating<select required value={feedback.rating} onChange={e => setFeedback({ ...feedback, rating: e.target.value })}><option value="">Choose rating</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} / 5</option>)}</select></label>
        <label>Comment <span className="muted">{feedback.comment.length}/200</span><textarea maxLength="200" rows="3" value={feedback.comment} onChange={e => setFeedback({ ...feedback, comment: e.target.value })}/></label>
        <button>Submit feedback</button>
      </form>
      {feedbackMessage && <p className="notice" role="status">{feedbackMessage}</p>}
    </section>
    <footer>Lab project · Keep your database credentials in a local .env file.</footer>
  </main>;
}
