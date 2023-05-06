import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.mjs';
import authRouter from './routes/auth.mjs';
import verifyToken from './middlewares/verifyToken.mjs';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// routes
app.use('/api', apiRouter);
app.use('/api', authRouter);

// middleware for verifying JWT
app.use('/api', verifyToken);

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
