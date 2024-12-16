const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to dynamically generate valid pages
function generateValidPages() {
  const basePagesDir = path.join(__dirname, 'public');
  const projectsDir = path.join(__dirname, 'public', 'projects');
  
  const validPages = ['/'];

  try {
    // Read root HTML files
    const rootFiles = fs.readdirSync(basePagesDir)
      .filter(file => 
        path.extname(file) === '.html' && 
        file !== 'index.html' && 
        !file.includes('404')
      )
      .map(file => `/${path.basename(file, '.html')}`);
    
    validPages.push(...rootFiles);

    // Read project pages
    const projectFiles = fs.readdirSync(projectsDir)
      .filter(file => path.extname(file) === '.html')
      .map(file => `/projects/${path.basename(file, '.html')}`);
    
    validPages.push('/projects', ...projectFiles);
  } catch (err) {
    console.error('Error reading directories:', err);
  }

  return validPages;
}

// Custom middleware to handle routes without .html extension
app.use((req, res, next) => {
  const requestPath = req.path;
  
  // Dynamically generate valid pages each time
  const validPages = generateValidPages();

  // Check if the request matches a valid page
  if (validPages.includes(requestPath) || validPages.includes(requestPath + '/')) {
    let filePath;
    
    // Handle root and index specially
    if (requestPath === '/' || requestPath === '/index') {
      filePath = path.join(__dirname, 'public', 'index.html');
    } 
    // Handle project pages
    else if (requestPath.startsWith('/projects/')) {
      filePath = path.join(__dirname, 'public', 'projects', requestPath.split('/').pop() + '.html');
    }
    // Handle other pages
    else {
      filePath = path.join(__dirname, 'public', requestPath.slice(1) + '.html');
    }

    // Check if file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }

  // If no matching route is found, send 404
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});