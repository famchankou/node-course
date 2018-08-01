'use strict';

var util = require('util');

module.exports = {
    hello: hello
};

function hello(req, res) {
    var name = req.swagger.params.name.value || 'stranger';
    var hello = util.format('Hello, %s!', name);
    res.json(hello);
}
