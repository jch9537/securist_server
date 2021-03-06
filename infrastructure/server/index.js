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

// const corsOptions = {
//     // origin: 'http://localhost',
//     origin: function (origin, callback) {
//         callback(null, true);
//     },
//     Credential: true,
//     optionsSuccessStatus: 200,
// };

app.use(
    cors({
        origin(origin, callback) {
            callback(null, true);
        },
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sanitizer); // 태그제거 : XSS 방어
app.use(routes);
app.use(errorHandler);

app.post('/', (req, res) => {
    res.send('Hello World!!');
});

function errorHandler(err, req, res, next) {
    // res.status(err.status || 500);
    res.send(err || 'Error!!');
}

app.listen(port, () => {
    console.log(`Securist App listen http://localhost:${port}`);
});
