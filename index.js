// declare library
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const socket = require('socket.io');
const socketController = require('./src/socket/index');
const http = require('http');

const userApp = require('./src/router/user.router');

const app = express();

try {
	app.use(express.static("assets"));
	app.use(helmet());
	app.use(bodyParser.json());
	app.use(xss());
	app.use(cors());
	app.use(userApp);

	const server = http.createServer(app);
	const io = socket(server, {
		cors: {
			origin: '*',
		}
	})

	let count = 0;

	io.on('connection', (socket) => {
		console.log('new user connected ' + count);

		count = count + 1;
		socketController(io, socket);
	})

	// jalankan express
	server.listen(process.env.PORT, () => {
		console.log("SERVICE IS RUNNING ON PORT " + process.env.PORT);
	});
} catch (err) {
	console.log(err);
}