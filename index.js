require('dotenv').config();
const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  findUrlById = require('./findUrlById'),
  isUrlValid = require('./isUrlValid'),
  app = express();


// Basic Configuration
const port = process.env.PORT || 3000,
  urls = new Map();

// Middleware
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Root endpoint
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Create new shortened url
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body,
    valid = await isUrlValid(url),
    short = urls.size + 1,
    error = { error: "invalid url" },
    returner = {
      "original_url": url,
      "short_url": short
    }

  // Check if url is invalid and if so `{ error: 'invalid url' }`
  if (!valid) {
    res.json(error)
    return
  };

  // Add url to server state
  urls.set(url, short);

  // Return original and shortened in json
  res.json(returner);
})

// Get original url from shortened url
app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id,
    foundUrl = findUrlById(id, urls),
    isUrlFound = !!foundUrl,
    error = { error: 'url not found' };

  if (!isUrlFound) {
    res.json(error)
    return;
  }

  res.redirect(foundUrl)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
