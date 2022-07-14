// stores the paths for the different views
const path = require("path");

// root is a global variable
const html = path.join(root, "/public/html/")

class Views {
	static home = path.join(html, "views/home.html");
	static base = path.join(html, "base.html");

	static notFound = path.join(html, "views/404.html");
}

module.exports = Views;