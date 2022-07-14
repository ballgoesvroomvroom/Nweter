$(document).ready(function(e) {
	const $selectors = {
		"activator": $("#activator")
	}

	$selectors["activator"].on("click", () => {
		window.location.href = "/timemachine";
	})
})