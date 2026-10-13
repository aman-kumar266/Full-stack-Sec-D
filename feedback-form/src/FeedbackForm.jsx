import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const nameInvalid = name.trim().length === 0;
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const ratingInvalid = rating === '';

  function handleSubmit(event) {
    event.preventDefault();
    setAttempted(true);
    if (nameInvalid || emailInvalid || ratingInvalid) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="page">
      <section className="form-card">
        <p className="eyebrow">STUDENT EXPERIENCE</p>
        <h1>Course Feedback</h1>
        <p className="intro">Tell us how the course went. Your feedback helps us improve.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" data-testid="name-input" value={name}
              onChange={(e) => { setName(e.target.value); setSubmitted(false); }}
              aria-invalid={attempted && nameInvalid} placeholder="Your full name" />
            {attempted && nameInvalid && <p className="error" data-testid="name-error">Name is required.</p>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" data-testid="email-input" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setSubmitted(false); }}
              aria-invalid={attempted && emailInvalid} placeholder="you@example.com" />
            {attempted && emailInvalid && <p className="error" data-testid="email-error">Enter a valid email address.</p>}
          </div>

          <div className="field">
            <label htmlFor="rating">Course rating</label>
            <select id="rating" data-testid="rating-select" value={rating}
              onChange={(e) => { setRating(e.target.value); setSubmitted(false); }}
              aria-invalid={attempted && ratingInvalid}>
              <option value="">Select a rating</option>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}{' ★'.repeat(value)}</option>)}
            </select>
            {attempted && ratingInvalid && <p className="error" data-testid="rating-error">Please select a rating.</p>}
          </div>

          <div className="field">
            <label htmlFor="comment">Comments <span className="optional">(optional)</span></label>
            <textarea id="comment" data-testid="comment-input" value={comment}
              maxLength={200} onChange={(e) => { setComment(e.target.value); setSubmitted(false); }}
              rows={4} placeholder="What worked well? What could be better?" />
            <p className="counter" data-testid="comment-count">{comment.length}/200</p>
          </div>

          <button data-testid="submit-btn" type="submit">Submit feedback</button>
          {submitted && <p className="success" role="status" data-testid="success-msg">Thank you, {name.trim()}! Feedback submitted.</p>}
        </form>
      </section>
    </main>
  );
}
