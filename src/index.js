import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({
  path: './env',
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  })
  .catch((err) => {
    console.log(`mongodb connection failed`, err);
  });
