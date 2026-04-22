import { toTitleCase } from '@filmato/utils';
import express, { type Express } from 'express';

const app : Express = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send(toTitleCase('hello express!'));  
});

export default app;