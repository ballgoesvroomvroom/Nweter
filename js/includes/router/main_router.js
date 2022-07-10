const baseURL = "/";

const express = require("express");

const views = require("../views.js");

const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
	res.type("html");
	res.sendFile(views.home);
})

module.exports = {
	baseURL, router
}