const baseURL = "/res";

const express = require("express");

const views = require("../views.js");
const cardData = require("../cardData.js");

const router = express.Router();

// root is a global variable declared in server.js
const publicPath = `${root}/public`
router.use(express.static(publicPath));

router.get("/card-data", (req, res) => {
	// gets card data with 'i' query parameter representing the card name
	// card-data/i?=redef
	var name = req.query.i; // get title of content to retrieve

	res.type("txt");
	res.send(cardData.getData(name));
})

// INVALID RESOURCE LINK; simply return a 404 status
router.use((req, res, next) => {
	// end of stack
	res.status(404).end();
})

module.exports = {
	baseURL, router
}