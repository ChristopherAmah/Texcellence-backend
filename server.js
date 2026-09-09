import 'dotenv/config';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

const port = Number(process.env.PORT || 5000);
const startServer = async () => {
  await connectDatabase();
  app.listen(port, () => console.info(`TEXCELLENCE API listening on port ${port}`));
};
startServer().catch((error) => { console.error('Unable to start TEXCELLENCE API', error); process.exit(1); });
