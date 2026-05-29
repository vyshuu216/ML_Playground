# 🧠 ML Playground

An interactive Machine Learning Playground built with the MERN stack that allows users to run, visualize, and experiment with popular machine learning algorithms directly in the browser.

## 🌐 Live Demo

🔗 Frontend: https://ml-playground-iota.vercel.app

🔗 Backend API: https://ml-playground-2q7u.onrender.com

---

## 📌 Features

### 🤖 Machine Learning Algorithms
- Linear Regression
- K-Means Clustering
- Logistic Regression

### 📊 Interactive Visualizations
- Dynamic scatter plots
- Regression line visualization
- Cluster visualization
- Classification result visualization

### 🧠 AI Insights
- Algorithm performance analysis
- Generated insights for results
- Experiment interpretation

### 💾 Experiment Management
- Save experiments
- View experiment history
- Store results in MongoDB

### 🎨 Modern User Interface
- Responsive design
- Dark futuristic theme
- Interactive controls
- Real-time updates

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- Chart.js
- React ChartJS 2
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## 🏗️ Project Architecture

```text
ML_Playground/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── .env.example
│
├── README.md
└── package.json
```

---

## 🚀 Algorithms Included

### 📈 Linear Regression

Fits a best-fit line through data points and calculates:

- Slope
- Intercept
- R² Score
- Predictions

### 🎯 K-Means Clustering

Groups data points into clusters:

- Adjustable cluster count
- Centroid visualization
- Cluster analysis

### 🔍 Logistic Regression

Performs binary classification:

- Accuracy calculation
- Decision boundary simulation
- Classification visualization

---

## 📷 Screenshots

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Linear Regression

![Linear Regression](screenshots/linear-regression.png)

### K-Means Clustering

![KMeans](screenshots/kmeans.png)

### Logistic Regression

![Logistic Regression](screenshots/logistic-regression.png)

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/vyshuu216/ML_Playground.git
cd ML_Playground
```

### Install Dependencies

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### Environment Variables

Create `.env` inside `/server`

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

### Run Application

Backend

```bash
cd server
npm run dev
```

Frontend

```bash
cd client
npm start
```

---

## 📡 API Endpoints

### Health Check

```http
GET /api/health
```

### Run Algorithm

```http
POST /api/ml/run
```

### Save Experiment

```http
POST /api/experiments
```

### Get Experiment History

```http
GET /api/experiments
```

---

## 🎯 Learning Objectives

This project demonstrates:

- Machine Learning Fundamentals
- Data Visualization
- Full Stack Development
- REST API Design
- MongoDB Integration
- Deployment & Hosting
- Interactive User Experience Design

---

## 👩‍💻 Author

**Vyshnavi**

GitHub: https://github.com/vyshuu216

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star.
