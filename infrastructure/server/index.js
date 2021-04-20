// TODO : LOG 처리
//서버
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../../.env'),
});
const express = require('express');
const cors = require('cors');

const sanitizer = require('../server/modules/sanitizer');
const routes = require('./routes');

const app = express();
const port = process.env.SERVER_PORT || 3000;

const corsOptions = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200,
};

app.options('*', cors(corsOptions));
app.use(express.json());
app.use(sanitizer); // 태그제거 : XSS 방어
app.use(routes);

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

app.listen(port, () =>
    console.log(`Securist App listen http://localhost:${port}`)
);
