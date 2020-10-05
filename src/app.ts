import fs from 'fs';
import path from 'path';
import Throttle from 'throttle';
import { Writable } from 'stream';
import express, { Request, Response } from 'express';

const app = express();

const file = path.join(__dirname, '../media/music.mp3');
const writeStream: Writable[] = [];

function play() {
  const readStream = fs.createReadStream(file);
  const throttle = new Throttle(224000 / 8);
  let stream = readStream.pipe(throttle);

  stream.on('data', chunk => {
    writeStream.forEach(stream => {
      stream.write(chunk);
    });
  });

  stream.on('end', play);
}

play();

app.get('/stream', (req: Request, res: Response) => {
  writeStream.push(res);
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'audio/mpeg',
    'Transfer-Encoding': 'chunked',
  });
});

app.listen(3000, () => console.log('Server started!'));
