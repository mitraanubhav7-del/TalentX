import { createApp } from './app.js';
import { db } from './db.js';

const port = Number(process.env.PORT || 3001);
const app = createApp(db);

app.listen(port, '0.0.0.0', () => {
  console.log(`TalentX API listening on 0.0.0.0:${port}`);
});
