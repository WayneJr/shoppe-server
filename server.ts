import express, { Application } from 'express';
import { port, databaseUrl } from './config/config';
import { router as authRoutes } from './api/routes/auth';
import mongoose from 'mongoose';

const app: Application = express();

mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('db connected successfully'))
.catch((err: any) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/api/v1/auth', authRoutes);

app.listen(port, () => console.log(`listening on port: ${port}`));