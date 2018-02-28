const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/api/*', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { app };
