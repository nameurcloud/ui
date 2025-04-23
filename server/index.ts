import express from 'express';
import { getIdentityToken } from './auth/token';

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/api/get-token', async (req, res) => {
  try {
    const audience = 'https://api.nameurcloud.com'; // Your backend Cloud Run URL
    const token = await getIdentityToken(audience);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate token', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
