const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tarif-hacker', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 
  
  if (!apiKey) {
    return res.status(500).json({ error: "API Key bulunamadı kral!" });
  }

  try {
    // İŞTE BURASI DEĞİŞTİ: gemini-1.5-flash yerine gemini-1.5-flash-latest yaptık!
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu tarafında hata oluştu.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor.`));
