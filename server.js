const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tarif-hacker', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) return res.status(500).json({ error: "API Key eksik!" });

  try {
    // Senin listendeki en stabil joker model: gemini-pro-latest
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await response.json();
    
    if (data.error) {
        return res.status(data.error.code || 400).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Sunucuda bir aksaklık oldu.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor.`));
