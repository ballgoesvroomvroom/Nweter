const baseURL = "/res";

const express = require("express");

const views = require("../views.js");

const router = express.Router();

router.use(express.static("public"));

// INVALID RESOURCE LINK; simply return a 404 status
router.use((req, res, next) => {
	// end of stack
	res.status(404).end();
})

module.exports = {
	baseURL, router
}