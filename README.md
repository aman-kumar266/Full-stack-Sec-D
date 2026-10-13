# Full Stack Development Lab Practicals (Set A)

Solutions for the uploaded BTCS303P-AS08 practical sheet:
- **A1:** Student Records REST API (Node.js + Express), in-memory storage, validation, duplicate email handling, age filter, fetch and delete.
- **A2:** Feedback Form (React), required `data-testid` values, field validation, comment counter, success message.
- **MERN-style separate folders:** backend (Express API) and frontend (React/Vite). The practical specifically asks for in-memory API and React form, so MongoDB is an optional extension rather than required for the exact lab solution.

## Requirements
- Node.js 18+ (Node.js 20+ recommended)
- npm

## Project layout
```text
fullstack-lab-practicals/
├── student-api/       # A1 standalone Express REST API
├── feedback-form/     # A2 standalone React + Vite app
├── mern/
│   ├── backend/       # Express API + optional MongoDB persistence
│   └── frontend/      # React + Vite app
└── .gitignore
```

## Run A1 (in-memory REST API)
```bash
cd student-api
npm install
npm run dev
```
API runs at `http://localhost:5000`.
Try:
- `POST /students` JSON: `{"name":"Aman Kumar","email":"aman@example.com","age":20}`
- `GET /students`
- `GET /students?minAge=18`
- `GET /students/1`
- `DELETE /students/1`

## Run A2 (React feedback form)
```bash
cd feedback-form
npm install
npm run dev
```
Open the URL Vite prints (usually `http://localhost:5173`).

## Run MERN version
1. Start MongoDB locally or use a MongoDB Atlas connection string.
2. Copy `mern/backend/.env.example` to `mern/backend/.env` and set `MONGODB_URI`.
3. In one terminal:
```bash
cd mern/backend
npm install
npm run dev
```
4. In another terminal:
```bash
cd mern/frontend
npm install
npm run dev
```
The MERN API runs at port 5001; frontend uses `/api` via Vite proxy.

## Test API with curl
```bash
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Aman Kumar","email":"aman@example.com","age":20}'
curl http://localhost:5000/students
curl "http://localhost:5000/students?minAge=18"
curl http://localhost:5000/students/1
curl -i -X DELETE http://localhost:5000/students/1
```

## Push to GitHub
Create a new empty repository on GitHub, then from this project folder:
```bash
git init
git add .
git commit -m "Complete full stack lab practicals"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Replace the remote URL with your own repository URL. Do not commit `.env`, `node_modules`, or secrets.
