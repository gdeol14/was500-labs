const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Route: GET /
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Server Error</h1>');
        console.error('Error reading index.html:', err);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }
  // Route: GET /about
  else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About - Middle-earth Legends</title>
        <style>
          body { background: #1a0026; color: #fff8dc; font-family: Georgia, serif; margin: 0; padding: 20px; }
          header { background: #3b0a45; padding: 20px; border-bottom: 2px solid #ffd700; text-align: center; }
          h1 { color: #ffd700; margin: 0; }
          .content { max-width: 800px; margin: 40px auto; background: rgba(59, 10, 69, 0.5); padding: 30px; border: 2px solid #ffd700; border-radius: 10px; }
          p { line-height: 1.6; color: #ffec8b; }
          a { color: #ffd700; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <header>
          <h1>About the Fellowship</h1>
        </header>
        <div class="content">
          <h2 style="color: #ffd700;">The Legend of Middle-earth</h2>
          <p>The Fellowship of the Ring was formed to combat the dark forces of Mordor and protect the realm of Middle-earth from destruction. Comprising hobbits, elves, dwarves, humans, and a wizard, this legendary band embarked on a perilous quest to save their world.</p>
          <p>Each member brought unique skills and unwavering courage to the mission. From the quiet determination of the hobbits to the ancient wisdom of Gandalf, the Fellowship demonstrated that unity and friendship could overcome even the greatest darkness.</p>
          <p>Their legacy lives on in the hearts of all who cherish tales of heroism, sacrifice, and hope.</p>
          <p><a href="/">← Back to Home</a></p>
        </div>
      </body>
      </html>
    `);
  }
  // Route: GET /contact
  else if (req.url === '/contact' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact - Middle-earth Legends</title>
        <style>
          body { background: #1a0026; color: #fff8dc; font-family: Georgia, serif; margin: 0; padding: 20px; }
          header { background: #3b0a45; padding: 20px; border-bottom: 2px solid #ffd700; text-align: center; }
          h1 { color: #ffd700; margin: 0; }
          .content { max-width: 800px; margin: 40px auto; background: rgba(59, 10, 69, 0.5); padding: 30px; border: 2px solid #ffd700; border-radius: 10px; }
          p { line-height: 1.6; color: #ffec8b; }
          a { color: #ffd700; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <header>
          <h1>Contact the Fellowship</h1>
        </header>
        <div class="content">
          <h2 style="color: #ffd700;">Get in Touch</h2>
          <p><strong>Email:</strong> fellowship@middleearth.com</p>
          <p><strong>Headquarters:</strong> Rivendell, Middle-earth</p>
          <p><strong>Hours:</strong> Available 24/7 for urgent fellowship matters</p>
          <p>To join the Fellowship or inquire about our quests, please visit our registration page or use the form on the home page.</p>
          <p><a href="/">← Back to Home</a></p>
        </div>
      </body>
      </html>
    `);
  }
  // Route: POST /api/join
  else if (req.url === '/api/join' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Parse form data
        const data = querystring.parse(body);

        // Validate required fields
        if (!data.fellowName || !data.fellowEmail || !data.fellowAge) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Missing required fields' }));
          return;
        }

        // Validate email format
        if (!data.fellowEmail.includes('@')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Invalid email address' }));
          return;
        }

        // Validate age is a number
        const age = parseInt(data.fellowAge);
        if (isNaN(age) || age < 1 || age > 999) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Age must be a valid number between 1 and 999' }));
          return;
        }

        // Validate class selection
        if (!data.fellowClass) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Character class is required' }));
          return;
        }

        // Ensure data directory exists
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        // Read existing fellowship data
        const filePath = path.join(dataDir, 'fellowship.json');
        let fellows = [];
        if (fs.existsSync(filePath)) {
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            fellows = JSON.parse(fileContent);
          } catch (parseErr) {
            console.error('Error parsing fellowship.json:', parseErr);
            fellows = [];
          }
        }

        // Add new fellow
        fellows.push({
          name: data.fellowName,
          email: data.fellowEmail,
          age: age,
          class: data.fellowClass,
          date: new Date().toISOString()
        });

        // Write updated data back to file
        fs.writeFileSync(filePath, JSON.stringify(fellows, null, 2));

        // Send success response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: true,
          message: `Welcome to the Fellowship, ${data.fellowName}!`
        }));
      } catch (err) {
        console.error('Error processing form submission:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: 'Server error' }));
      }
    });
  }
  // Static file serving (GET)
  else if (req.method === 'GET') {
    const filePath = path.join(__dirname, 'public', req.url);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        // Determine MIME type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/plain';

        if (ext === '.html') contentType = 'text/html';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'application/javascript';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.svg') contentType = 'image/svg+xml';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
  // 404 for everything else
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});