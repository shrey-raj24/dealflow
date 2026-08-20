import express from 'express';
const app = express();

app.post('/api/deals', (req, res) => {
  res.status(202).json({ dealId: 'mock-uuid', status: 'pending_ai' });
});

app.listen(4000, () => console.log('Gateway active on port 4000'));
