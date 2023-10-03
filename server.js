const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('elasticsearch');

const app = express();
const PORT = process.env.PORT || 3015;

// Create an Elasticsearch client
const elasticClient = new Client({ node: 'http://localhost:9200' });

// Middleware
app.use(bodyParser.json());

// CRUD Operations

// Create a document
app.post('/items', async (req, res) => {
  try {
    const { index, body } = req.body;
    const response = await elasticClient.index({
      index,
      body,
    });
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read a document
app.get('/items/:index/:id', async (req, res) => {
  try {
    const { index, id } = req.params;
    const response = await elasticClient.get({
      index,
      id,
    });
    res.json(response.body);
  } catch (error) {
    res.status(404).json({ error: 'Document not found' });
  }
});

// Update a document
app.put('/items/:index/:id', async (req, res) => {
  try {
    const { index, id } = req.params;
    const { body } = req.body;
    const response = await elasticClient.update({
      index,
      id,
      body: {
        doc: body,
      },
    });
    res.json(response.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a document
app.delete('/items/:index/:id', async (req, res) => {
  try {
    const { index, id } = req.params;
    const response = await elasticClient.delete({
      index,
      id,
    });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
