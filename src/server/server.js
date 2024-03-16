const express = require('express')
const http = require('http')
const https = require("https")
const bodyparser = require('body-parser')
const cors = require('cors');
const morgan = require("morgan")
const fileupload = require('express-fileupload');
const path = require("path")
const fs = require("fs")
const moment = require('moment-timezone');

const auth = require("../routes/authorization")

const publicPath = path.resolve(__dirname, '../public');
const app = express();
morgan('dev')
require('dotenv').config();
moment.tz.setDefault(process.env.TZ);


let corsOptions = null

if (process.env.DEPLOYMENT != 'dev') {
    corsOptions = {
        origin: process.env['url_' + process.env.DEPLOYMENT],
        credentials: true,
        optionSuccessStatus: 200
    }
}

morgan.token("statusColor", (req, res, args) => {
    const status = (
        typeof res.headersSent !== "boolean" ? Boolean(res.header) : res.headersSent
    )
        ? res.statusCode
        : undefined;
    const color =
        status >= 500
            ? 31
            : status >= 400
                ? 33
                : status >= 300
                    ? 36
                    : status >= 200
                        ? 32
                        : 0;

    return "\x1b[" + color + "m" + status + "\x1b[0m";
});

app.use(
    morgan(
        `\x1b[33m:remote-addr :remote-user :method\x1b[0m \x1b[36m:url\x1b[0m :statusColor \x1b[35m:response-time ms - length|:res[content-length]`,
        { skip: (req, res) => req.url === "/RutaSkyLogMorgan" }
    )
);

app.use(cors(corsOptions));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json({ limit: '50mb', extended: true }))
app.use(fileupload());
app.use(express.static(publicPath));

//Routes
app.use("/api/v1/Authorization", auth);

//Middlewares
require("../middlewares/schedule")

let server
if (process.env.DEPLOYMENT == 'prod') {
    const options = {
        key: fs.readFileSync(process.env.SSL_key),
        cert: fs.readFileSync(process.env.SSL_ctr)
    };

    server = https.createServer(options, app)
} else {
    server = http.createServer(app)
}

module.exports = server