import fs from 'fs';
import throttle from 'throttle';
import express from 'express';

const app = express();

app.listen(3000, () => console.log('Server started!'));
