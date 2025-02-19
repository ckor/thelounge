const colorCodeMap = [
	["00", "Blanc"],
	["01", "Noir"],
	["02", "Bleu"],
	["03", "Vert"],
	["04", "Rouge"],
	["05", "Marron"],
	["06", "Magenta"],
	["07", "Orange"],
	["08", "Jaune"],
	["09", "Vert clair"],
	["10", "Cyan"],
	["11", "Cyan clair"],
	["12", "Bleu clair"],
	["13", "Rose"],
	["14", "Gris"],
	["15", "Gris clair"],
];

const timeFormats = {
	msgDefault: "HH:mm",
	msgWithSeconds: "HH:mm:ss",
	msg12h: "hh:mm A",
	msg12hWithSeconds: "hh:mm:ss A",
};

export default {
	colorCodeMap,
	commands: [] as string[],
	timeFormats,
	// Same value as media query in CSS that forces sidebars to become overlays
	mobileViewportPixels: 768,
};
