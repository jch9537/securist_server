//서버
const dotenv = require('dotenv').config();
const express = require('express');

const routes = require('./routes');

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello Securist');
});

app.listen(port, () =>
    console.log(`Securist App listen http://localhost:${port}`)
);

//서버에서 할 것 : 클라이언트 인증확인(토큰)
