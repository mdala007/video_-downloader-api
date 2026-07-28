const express = require('express');
const cors = require('cors');
const ytdlp = require('yt-dlp-exec');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/download', async (req, res) => {
  res.json({ status: "API Working" });
});

app.post('/download', async (req, res) => {
  const { url, quality } = req.body;
  if(!url) return res.status(400).json({error: "URL lagbe"});
  try {
    const info = await ytdlp(url, {dumpSingleJson: true, noWarnings: true, noCheckCertificates: true});
    let format = info.formats.find(f => f.format_id == quality) || info.formats.at(-1);
    res.json({title: info.title, thumbnail: info.thumbnail, downloadUrl: format.url, quality: format.format_note });
  } catch (error) {res.status(500).json({error: "Video pawa jayni"});}
});

module.exports = app;
