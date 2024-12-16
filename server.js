const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));

// clean urls
app.use((req, res, next) => {
  if (req.url.endsWith('.html')) {
    res.redirect(301, req.url.slice(0, -5));
  } else {
    next();
  }
});

// handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
