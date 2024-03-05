// server.ts
import express from 'express';

export const app = express();
const port = 3000; // or any port you prefer

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
