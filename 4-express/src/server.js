import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import brewsRouter from './routes/brews.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(compression());

app.use('/api/brews', brewsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
