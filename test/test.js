var convert = require('../src/bbcode-to-markdown');

var samples = require('./samples.json');

var assert = function (a, b, sample, i, what) {
	if (a != b) {
		console.log("'" + a + "'\n!=\n'" + b + "'");
		throw JSON.stringify(sample, null, 2) + ", " + what + "() Failed, " + i;
	}
};

samples.forEach(function(sample, i) {
	assert(convert.bbcodeToHTML(sample.raw), sample.html, sample, i, "bbcodeToHTML");
	assert(convert.bbcodeToMarkdown(sample.raw), sample.md, sample, i, "bbcodeToMarkdown");
});
console.log("All good, " + samples.length + " tests passed.");