const express = require('express');
const cors = require('cors');
const ytDlp = require('yt-dlp-exec');
const app = express();
app.use(cors());
app.use(express.json());
app.post('/api/download', async (req, res) => {
  const { url, quality } = req.body;
  if(!url) return res.status(400).json({error: "URL লাগবে"});
  try {
    const info = await ytDlp(url, {dumpSingleJson: true, noWarnings: true, noCheckCertificates: true});
    let format = info.formats.find(f => f.format_id === quality) || info.formats.at(-1);
    res.json({title: info.title, thumbnail: info.thumbnail, downloadUrl: format.url, quality: format.format_note || format.height + 'p'});
  } catch (error) {res.status(500).json({error: "ভিডিও পাওয়া যায়নি"});}
});
module.exports = app;
