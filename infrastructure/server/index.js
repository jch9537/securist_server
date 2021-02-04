const dotenv = require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello Securist');
});

app.listen(port, () =>
    console.log(`Securist App listen http://localhost:${port}`)
);
