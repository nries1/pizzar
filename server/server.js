const express = require('express');
const PORT = process.env.port || 3000;
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '..', '/public')));

app.use('*', (req, res, next) => {
  console.log(req.url);
  next();
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
});
