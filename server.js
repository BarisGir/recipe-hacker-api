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
    return res.status(500).json({ error: "API Key eksik!" });
  }

  try {
    // EN GENİŞ KAPSAMLI BAĞLANTI: v1beta ve gemini-1.5-flash-latest
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    const data = await response.json();
    
    // Eğer Google hala hata döndürürse, hatanın ne olduğunu bozmadan eklentiye ilet
    if (data.error) {
        return res.status(data.error.code || 400).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Sunucu tarafında teknik bir arıza oluştu.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor.`));
