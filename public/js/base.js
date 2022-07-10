import Modal from "/res/js/includes/modalService.js";

const END = 2019;
const START = 2022;

let current = START; // operate using strings
let current_str = current.toString();

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

		"subjInput": $("#subjInput"),
		"titleInput": $("#titleInput"),
		"descInput": $("#descInput"),
		"startDateInput": $("#startDateInput"),
		"endDateInput": $("#endDateInput"),

		"inputErrorDisp": $("#inputErrorDisp"),
		"entryCreateSubmit": $("#entryCreateSubmit")
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

	// trigger buttons
	$selectors["moreButtons"].on("click", function(e) {
		articleModal.show(true);
	})

	function switchYear(year) {
		// year: number; the year to jump to

		// hide current frame
		$yearFrames[current_str].addClass("hidden");

		// validated year to be within START and END range
		current = year;
		current_str = year.toString();

		// show frame
		$yearFrames[current_str].removeClass("hidden");

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
	var trackHead_update = setInterval(() => {
		if (isTrackHeadHeldDown) {
			console.log("updated")
		}
	}, 100)

	// initialise call
	switchYear(2022);
})