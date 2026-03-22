# [ML_playground]

An interactive **Machine Learning Playground** built with the MERN stack. Run ML algorithms directly in the browser, visualise results with charts, get AI-powered insights, and save experiments to MongoDB.

---

## ✨ Features

- 🧠 **3 ML Algorithms** — Linear Regression, K-Means Clustering, Logistic Regression
- 📊 **Interactive Charts** — Scatter plots, regression lines, cluster visualisation
- ⚙️ **Configurable Parameters** — Adjust sample size, number of clusters, and more
- 💡 **AI Insights** — Groq-powered explanations of each result
- 💾 **Save Experiments** — Store results to MongoDB and view history
- 🗂 **Experiment History** — View, browse and delete past runs
- 🎨 **Cyberpunk Dark UI** — Monospace fonts, cyan accents, grid background

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js, Chart.js, custom CSS    |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| AI         | Groq API (llama-3.3-70b)          |
| Charts     | react-chartjs-2                   |

---

## 📁 Project Structure

```
ml_playground/
├── client/                  ← React frontend
│   ├── public/index.html
│   └── src/
│       ├── components/Navbar.js/.css
│       ├── pages/
│       │   ├── PlaygroundPage.js/.css
│       │   └── HistoryPage.js/.css
│       ├── App.js / App.css
│       └── index.js
├── server/                  ← Express backend
│   ├── controllers/
│   │   ├── mlController.js       ← ML algorithm logic
│   │   └── experimentController.js
│   ├── models/Experiment.js
│   ├── routes/ml.js
│   ├── routes/experiment.js
│   ├── index.js
│   └── .env.example
├── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas
- Groq API key (free) — get one at [console.groq.com](https://console.groq.com)

### 1. Install all dependencies
```bash
npm run install-all
```

### 2. Configure environment variables
```bash
cd server
copy .env.example .env
```

Edit `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/ml_playground
PORT=5000
GROQ_API_KEY=gsk_your_key_here
```

### 3. Run the app
```bash
npm run dev
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| POST   | /api/ml/run               | Run an ML algorithm          |
| GET    | /api/ml/dataset           | Get a sample dataset         |
| POST   | /api/experiments          | Save an experiment           |
| GET    | /api/experiments          | Get all experiments          |
| DELETE | /api/experiments/:id      | Delete an experiment         |

---

## 🧠 Algorithms Implemented

- **Linear Regression** — Least squares method, returns slope, intercept, R² score
- **K-Means Clustering** — Iterative centroid assignment, configurable k
- **Logistic Regression** — Gradient descent binary classifier, returns accuracy

---

## 📜 License

MIT — open source and free to use.
