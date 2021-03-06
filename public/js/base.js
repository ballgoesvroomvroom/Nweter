import Modal from "/res/js/includes/modalService.js";

const END = 2019;
const START = 2022;

let current = START; // operate using strings
let current_str = current.toString();


const cardData_SSK = "cardData";

$(document).ready(() => {
	const $selectors = {
		"track-year-disp": $("#track-year-disp"),
		"track-runner": $("#track-runner"),
		"track-head": $("#track-head"),

		"page-year-disp": $("#page-year-disp"),
		"fasttrack-button": $("#fasttrack-button"),
		"backtrack-button": $("#backtrack-button"),

		"moreButtons": $(".project-card-container .project-side-menu.more"),

		"modalWindow": $("#modalWindow"),

		"articleModal": $("#articleModal"),
		"articleModalExit": $("#articleModalExit"),

		"articleHeader": $("#articleHeader"),
		"articleThumbnail": $("#articleThumbnail"),
		"articleThumbnail-carousell": $("#articleThumbnail-carousell"),
		"articleContainer": $("#articleContainer"),

		"articleCarousellSelection": $(".carousell-selections"),
		"articleCarousellActiveSelection": $("#articleThumbnail-activeSelection"),
	}

	const $externalReferences = {
		"js-github": $(".project-side-menu#js-github")
	}

	const $yearFrames = {}; // store the content-frame here

	// initialise content-frames for each of the years
	for (let i = 0; i <= START -END; i++) { // <= to include the last iteration (the exact diff between end - start to get start)
		var year = (END +i).toString();
		$yearFrames[year] = $(`#${year}`)
	}

	const modalWindow = Modal.registerWindow($selectors["modalWindow"]);

	const articleModal = modalWindow.registerPanel($selectors["articleModal"]);

	// exit buttons
	articleModal.registerExitButtons($selectors["articleModalExit"]);

	// get card data, either from cache or from server
	function getCardData(name) {
		// returns the text
		var cached_cardData = sessionStorage.getItem(cardData_SSK);

		if (cached_cardData) {
			cached_cardData = JSON.parse(cached_cardData);

			if (cached_cardData && cached_cardData.hasOwnProperty(name)) {
				return new Promise(res => res(cached_cardData[name]));
			} else if (cached_cardData == null) {
				cached_cardData = {};
			}
		} else {
			cached_cardData = {};
		}

		return fetch(`/res/card-data/?i=${name}`, {
			method: "GET"
		}).then(r => {
			if (r.status === 200) {
				return r.text();
			} else {
				return Promise.reject("Failed to get contents")
			}
		}).then(txt => {
			// add to cache
			cached_cardData[name] = txt;
			sessionStorage.setItem(cardData_SSK, JSON.stringify(cached_cardData));

			return txt;
		})
	}
	
	// trigger buttons (card expand button)
	$selectors["moreButtons"].on("click", (e) => {
		var trigger = e.currentTarget;
		var container = trigger.parentNode.parentNode;

		var prepend = "card-"
		var rawID = container.id.slice(prepend.length);

		// load in content
		$selectors["articleContainer"].empty();
		getCardData(rawID).then(txt => {
			// first few lines are images (an empty line delimiter is used to separate image definitions with the actual html content)
			var images = [];
			let lines = txt.split(/\r?\n/gm);
			for (let i = 0; i < lines.length; i++) {
				let line = lines[i];
				if (line === "") {
					// delimiter for images and actual content
					break;
				} else {
					images.push(line);
				}
			}

			let header = lines[images.length +1];
			let content = lines.slice(images.length +3).join("\n"); // +1 to skip the empty line delimiter; +2 to skip the header and the following empty line delimiter

			$selectors["articleHeader"].text(header);

			if (images.length === 0) {
				// no images
				$selectors["articleThumbnail"].addClass("hidden");
				$selectors["articleThumbnail-carousell"].addClass("hidden");
			} else {
				// add in the images
				var children = $selectors["articleThumbnail"].children();

				for (let i = 0; i < Math.min(images.length, children.length); i++) {
					children[i].setAttribute("src", images[i]);
				}

				// see if theres excess images

				if (children.length > images.length) {
					for (let i = 0; i < children.length - images.length; i++) {
						children[images.length +i].remove();
					}
				} else if (images.length > children.length) {
					// not enough images
					for (let i = 0; i < images.length - children.length; i++) {
						// create new images
						const $img = $("<img>", {
							"class": "cover",
							"src": images[children.length +i]
						});

						$img.appendTo($selectors["articleThumbnail"]);
					}
				}

				// add/remove extra caro
				// update carousell children count
				var caro_children = $(".carousell-selections");
				console.log(images.length, caro_children.length);

				if (caro_children.length > images.length) {
					for (let i = 0; i < caro_children.length -images.length; i++) {
						caro_children[images.length +i].remove();
					}
				} else if (images.length > caro_children.length) {
					for (let i = 0; i < images.length -caro_children.length; i++) {
						let e = i +caro_children.length;
						const $button = $("<button>", {
							"class": "carousell-selections"
						});
						$button.appendTo($selectors["articleThumbnail-carousell"]);

						$button.on("click", () => {
							// scroll to a specific image
							$selectors["articleThumbnail"][0].scrollTo($selectors["articleThumbnail"].outerWidth() *e, 0)

							// change position of active selection
							var t = $(".carousell-selections").length;
							if (t % 2 === 0) {
								// even number
								$selectors["articleCarousellActiveSelection"].css("left", `calc(50% - ${12 + 16 *(Math.floor($(".carousell-selections").length /2) -1)}px + ${16 *e}px`);
							} else {
								$selectors["articleCarousellActiveSelection"].css("left", `calc(50% - ${4 + 16 *Math.floor($(".carousell-selections").length /2)}px + ${16 *e}px`);
							}
						})
					}
				}				
				$selectors["articleThumbnail-carousell"].children()[1].click(); // trigger the first button
				
				$selectors["articleThumbnail"].removeClass("hidden");
				$selectors["articleThumbnail-carousell"].removeClass("hidden");
			}

			$selectors["articleContainer"].html(content);

			articleModal.show(true);
		})
	});

	function switchYear(year) {
		// year: number; the year to jump to

		// hide current frame
		$yearFrames[current_str].addClass("hidden");

		// validated year to be within START and END range
		current = year;
		current_str = year.toString();

		// show frame
		$yearFrames[current_str].removeClass("hidden");

		// scroll to the top
		window.scrollTo({ top: 0, behavior: "smooth" });

		// update visuals
		year = year.toString();
		$selectors["track-year-disp"].text(`${current_str.slice(0, 2)}:${current_str.slice(2)}`);
		$selectors["page-year-disp"].text(current_str);

		// update track length
		$selectors["track-runner"].css("width", `${Math.ceil((START -year)/(START -END) *100)}%`)

		// hide skip buttons
		if (current === END) {
			$selectors["backtrack-button"].addClass("invisible");
		} else {
			$selectors["backtrack-button"].removeClass("invisible");
		}

		if (current === START) {
			$selectors["fasttrack-button"].addClass("invisible");
		} else {
			$selectors["fasttrack-button"].removeClass("invisible");
		}
	}

	function prevYear() {
		if (current <= END) {
			// already at the oldest
			return;
		} else {
			switchYear(current -1);
		}
	}

	function forwardYear() {
		if (current >= START) {
			// already at the latest
			return;
		} else {
			switchYear(current +1);
		}
	}

	$selectors["fasttrack-button"].on("click", () => {
		forwardYear();
	})

	$selectors["backtrack-button"].on("click", () => {
		prevYear();
	})

	// track-head dragged event
	var isTrackHeadHeldDown = false;
	$selectors["track-head"].on({
		mousedown: function () {
			isTrackHeadHeldDown = true;
		},

		mouseup: function () {
			isTrackHeadHeldDown = false;
		}
	});

	var prevMousePos = 0;
	// var trackHead_update = setInterval(() => {
	// 	if (isTrackHeadHeldDown) {
	// 	}
	// }, 100)

	// initialise call
	switchYear(2022);
})