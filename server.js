const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/tarif-hacker', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; 
  
  try {
    // Önce bir modelleri listeleyelim, bakalım senin hesap neyi görüyor?
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();
    
    // Modellerin isimlerini bir metin haline getirelim
    const modelListesi = listData.models ? listData.models.map(m => m.name).join(", ") : "Liste alınamadı";

    // Asıl isteği gönderelim
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await response.json();

    if (data.error) {
      // HATA VARSA: Hem hatayı hem de senin erişebildiğin modelleri ekrana basıyoruz!
      return res.status(404).json({
        error: {
          message: `MODEL BULUNAMADI! Senin erişebildiğin modeller şunlar: ${modelListesi}. Google'ın hatası ise: ${data.error.message}`
        }
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Liste çekilirken hata oluştu.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Sunucu ${port} portunda çalışıyor.`));
