const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to redirect requests without .html to clean URLs
app.use((req, res, next) => {
  const originalUrl = req.url;
  
  // Check if the URL does not already end with .html
  if (!req.url.endsWith('.html')) {
    const htmlPath = path.join(__dirname, 'public', `${req.url}.html`);
    
    // Check if an HTML file exists for the requested URL
    fs.exists(htmlPath, (exists) => {
      if (exists) {
        // Redirect to the clean URL
        res.redirect(301, req.url + '.html');
      } else {
        next();
      }
    });
  } else {
    // If URL ends with .html, remove the extension
    const cleanUrl = req.url.replace('.html', '');
    res.redirect(301, cleanUrl);
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Dynamically serve project pages from the "projects" folder
app.get('/projects/:project', (req, res) => {
  const projectName = req.params.project;
  const projectPath = path.join(__dirname, 'public', 'projects', `${projectName}.html`);
  
  console.log('Requesting project path:', projectPath);
  
  fs.exists(projectPath, (exists) => {
    if (exists) {
      res.sendFile(projectPath);
    } else {
      console.log('Project not found:', projectPath);
      res.status(404).send('Page not found');
    }
  });
});

// Serve the homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Handle sitemap explicitly
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

// Handle 404 errors for unmatched routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});