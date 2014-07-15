var convert = require('./bbcode-to-markdown');

var strings = [
    '[quote author=Luke Larris link=topic=2835.msg20559#msg20559 date=1405282198]<br />test<br />[/quote]<br /><br />hey!'
];

strings.forEach(function(str) {
    console.log('===BEFORE===\n' + str);
    console.log('\n===AFTER===\n' +  convert(str) + '\n\n');
});