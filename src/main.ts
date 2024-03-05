import express from 'express';
import 'dotenv/config';
import { parser } from './event_parser';
import { syncDB } from './sync_tidebit_db';

export const app = express();
const port = process.env.API_PORT || 3000; // or any port you prefer

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

parser();
// syncDB();
