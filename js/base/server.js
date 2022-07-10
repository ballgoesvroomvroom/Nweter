const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// set root path
global.root = path.resolve(path.join(__dirname, "../../"));
console.log(global.root);

// routers
const main_router = require("../includes/router/main_router.js");
const resources_router = require("../includes/router/resources_router.js");

const views = require("../includes/views.js");
// database.autosave = -1; // disable autosave

const PORT = 5006;
const app = express();
const httpServer = http.createServer(app);

app.use(cors());

// @https://stackoverflow.com/a/27855234/12031810
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routers
app.use((req, res, next) => {
	// disable cache for all pages
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
	next();
});

app.use(resources_router.baseURL, resources_router.router);
app.use(main_router.baseURL, main_router.router);

app.use((req, res, next) => {
	// end of stack
	res.status(404).sendFile(views.notFound);
})

// https://nodejs.org/api/process.html#signal-events
function exitHandler() {
	console.log("EXITING");
	// const p = new Promise(res => {
	// 	database.pushContents();
	// 	serverDatabase.pushContents(res);
	// }).then(() => {
	// 	console.log("EXITING 2")
	// 	process.exit();
	// })
}

process.on("SIGHUP", exitHandler);
process.on("SIGINT", exitHandler);

httpServer.listen(PORT, () => {
	console.log("listening at", PORT);
})
