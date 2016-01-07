var convert = require('../src/bbcode-to-markdown');

var samples = require('./samples.json');

var assert = function (a, b, sample) {
	if (a != b) {
		console.log(a, "!=", b);
		throw JSON.stringify(sample, null, 2) + ", Failed";
	}
};

samples.forEach(function(sample) {
	assert(convert.bbcodeToHTML(sample.raw), sample.html, sample);
	assert(convert.bbcodeToMarkdown(sample.raw), sample.md, sample);
});
console.log("All good, " + samples.length + " passed.");