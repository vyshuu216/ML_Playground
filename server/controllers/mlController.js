const fetch = require('node-fetch');

// ─── Linear Regression (Least Squares) ───────────────────────────────────────
function linearRegression(data) {
  const n = data.length;
  const sumX = data.reduce((s, p) => s + p.x, 0);
  const sumY = data.reduce((s, p) => s + p.y, 0);
  const sumXY = data.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = data.reduce((s, p) => s + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const predicted = data.map((p) => ({ x: p.x, y: slope * p.x + intercept }));
  const ssRes = data.reduce((s, p) => s + Math.pow(p.y - (slope * p.x + intercept), 2), 0);
  const ssTot = data.reduce((s, p) => s + Math.pow(p.y - sumY / n, 2), 0);
  const r2 = 1 - ssRes / ssTot;

  return { slope: +slope.toFixed(4), intercept: +intercept.toFixed(4), r2: +r2.toFixed(4), predicted, original: data };
}

// ─── K-Means Clustering ───────────────────────────────────────────────────────
function kMeans(data, k = 3, maxIter = 100) {
  let centroids = data.slice(0, k).map((p) => ({ x: p.x, y: p.y }));

  let assignments = new Array(data.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    const newAssignments = data.map((p) => {
      let minDist = Infinity, cluster = 0;
      centroids.forEach((c, i) => {
        const d = Math.sqrt(Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
        if (d < minDist) { minDist = d; cluster = i; }
      });
      return cluster;
    });

    const newCentroids = Array.from({ length: k }, (_, i) => {
      const pts = data.filter((_, j) => newAssignments[j] === i);
      if (pts.length === 0) return centroids[i];
      return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
    });

    if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) break;
    assignments = newAssignments;
    centroids = newCentroids;
  }

  const points = data.map((p, i) => ({ ...p, cluster: assignments[i] }));
  return { points, centroids, k };
}

// ─── Logistic Regression (Binary Classification) ─────────────────────────────
function logisticRegression(data, learningRate = 0.1, epochs = 1000) {
  let w1 = 0, w2 = 0, b = 0;
  const sigmoid = (z) => 1 / (1 + Math.exp(-z));

  for (let e = 0; e < epochs; e++) {
    let dw1 = 0, dw2 = 0, db = 0;
    data.forEach((p) => {
      const z = w1 * p.x + w2 * p.y + b;
      const pred = sigmoid(z);
      const err = pred - p.label;
      dw1 += err * p.x;
      dw2 += err * p.y;
      db += err;
    });
    w1 -= (learningRate * dw1) / data.length;
    w2 -= (learningRate * dw2) / data.length;
    b -= (learningRate * db) / data.length;
  }

  const predictions = data.map((p) => {
    const z = w1 * p.x + w2 * p.y + b;
    const prob = sigmoid(z);
    return { ...p, predicted: prob >= 0.5 ? 1 : 0, probability: +prob.toFixed(3) };
  });

  const correct = predictions.filter((p) => p.predicted === p.label).length;
  const accuracy = +(correct / data.length * 100).toFixed(2);

  return { predictions, accuracy, weights: { w1: +w1.toFixed(4), w2: +w2.toFixed(4), b: +b.toFixed(4) } };
}

// ─── Generate sample datasets ─────────────────────────────────────────────────
function generateDataset(type, n = 50) {
  const rand = () => Math.random();
  const randn = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2;

  if (type === 'linear') {
    return Array.from({ length: n }, (_, i) => {
      const x = i / n * 10;
      return { x: +x.toFixed(2), y: +(2.5 * x + 3 + randn() * 3).toFixed(2) };
    });
  }

  if (type === 'clusters') {
    const centers = [{ x: 2, y: 2 }, { x: 7, y: 3 }, { x: 4, y: 8 }];
    return Array.from({ length: n }, (_, i) => {
      const c = centers[i % 3];
      return { x: +(c.x + randn()).toFixed(2), y: +(c.y + randn()).toFixed(2) };
    });
  }

  if (type === 'classification') {
    return Array.from({ length: n }, () => {
      const label = rand() > 0.5 ? 1 : 0;
      return {
        x: +(label === 1 ? 6 + randn() : 3 + randn()).toFixed(2),
        y: +(label === 1 ? 6 + randn() : 3 + randn()).toFixed(2),
        label,
      };
    });
  }

  return [];
}

// ─── AI Insights via Groq ─────────────────────────────────────────────────────
async function getAIInsights(algorithm, results) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 300,
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: 'You are an ML expert. Give a short 2-3 sentence insight about the results. Be specific and educational.',
          },
          {
            role: 'user',
            content: `Algorithm: ${algorithm}. Results: ${JSON.stringify(results)}. Give a brief insight.`,
          },
        ],
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Analysis complete.';
  } catch {
    return 'Analysis complete. Check the results above for details.';
  }
}

// ─── Route Handlers ───────────────────────────────────────────────────────────
exports.runAlgorithm = async (req, res) => {
  try {
    const { algorithm, dataset, parameters } = req.body;

    let data = generateDataset(
      algorithm === 'linear_regression' ? 'linear' :
      algorithm === 'kmeans' ? 'clusters' : 'classification',
      parameters?.n || 50
    );

    let results;
    if (algorithm === 'linear_regression') {
      results = linearRegression(data);
    } else if (algorithm === 'kmeans') {
      results = kMeans(data, parameters?.k || 3);
    } else if (algorithm === 'logistic_regression') {
      results = logisticRegression(data);
    } else {
      return res.status(400).json({ error: 'Unknown algorithm' });
    }

    const insights = await getAIInsights(algorithm, results);
    res.json({ success: true, algorithm, results, insights, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Algorithm execution failed' });
  }
};

exports.getDataset = (req, res) => {
  const { type, n } = req.query;
  const data = generateDataset(type || 'linear', parseInt(n) || 50);
  res.json({ data });
};
