
import express from 'express';
import authRouter from './routes/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', authRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
