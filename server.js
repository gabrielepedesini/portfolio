const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to redirect requests with .html to clean URLs
app.use((req, res, next) => {
  if (req.url.endsWith('.html') && !req.url.includes('/projects/')) {
    res.redirect(301, req.url.replace('.html', ''));
  } else {
    next();
  }
});

// Serve static files from the "public" directory (including assets, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve project pages without .html
app.get('/projects/:project', (req, res) => {
  const projectName = req.params.project;
  const projectPath = path.join(__dirname, 'public', 'projects', `${projectName}.html`);
  res.sendFile(projectPath, (err) => {
    if (err) {
      res.status(404).send('Page not found');
    }
  });
});

// Serve the sitemap.xml file
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Default route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404 errors for unmatched routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
