const fs = require("fs");
const path = require("path");

class CardData {
	static fileName = path.join(root, "./public/content/all.txt");
	static cardDataHeaderRegex = /^# (\w*?)$/;
	static lineSplitRegex = /\r?\n/;

	static parsed = false;
	static parsedContent = {};

	static parse() {
		var localParsed = {}; // build a dictionary containing the data

		var contents = fs.readFileSync(this.fileName, 'utf-8');
		var lines = contents.split(this.lineSplitRegex);

		var currentHeader = "";
		var built = "";

		var currentTick = 0;
		for (let i = 0; i < lines.length; i++) {
			var line = lines[i];

			var match = this.cardDataHeaderRegex.exec(line);
			if (match) {
				if (currentHeader.length > 0) {
					// push currentHeader into parsed
					localParsed[currentHeader] = built.slice(0, -1); // remove trailing line feed
				}

				// new 'session'
				currentHeader = match[1]; // get group 1
				built = "";
				currentTick = 0;
			} else if (line === "" && currentHeader.length > 0) {
				// only apply if there's a currentHeader
				// space delimiter
				currentTick++; // increment tick
				if (currentTick === 3) {
					// second occurrence;
					// done with current chapter
					// push it into parsed
					localParsed[currentHeader] = built.slice(0, -1); // remove trailing line feed

					// reset
					currentHeader = "";
					built = "";
					currentTick = 0;
				} else {
					// include this IMPORTANT empty line delimiter for client to parse properly
					built += "\n";
				}
			} else if (currentHeader.length > 0) {
				built += `${line}\n`
			}
		}
		if (currentHeader.length > 0) {
			console.warn(`${this.fileName} does not have a trailing line at the end`);
			localParsed[currentHeader] = built.slice(0, -2);
		}

		this.parsedContent = localParsed;
		this.parsed = true;
	}

	static getData(name) {
		// get data by id
		if (!this.parsed) {
			this.parse();
		}

		return this.parsedContent[name];
	}
}

module.exports = CardData;
