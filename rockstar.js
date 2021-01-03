#!/usr/bin/env node
//
// Like the standard rockstar interpreter, but "READ" reads from stdin

// Satriani isn't on NPM at the time of this writing
const satriani = require("./rockstar/satriani/satriani.js");
const fs = require("fs");

var rockstar = new satriani.Interpreter();

var sourceFilePath = process.argv[2];
var source = fs.readFileSync(sourceFilePath).toString();

var input = () => {
    var test = fs.readFileSync("/dev/stdin").toString().replace(/\n/g, "");
    return test;
}

try {
    var tree = rockstar.parse(source);
    fs.writeFileSync("debug-ast.json", JSON.stringify(tree, null, "  "));

    var result = rockstar.run(tree, input, console.log);
    // if (result) {
    //     console.log(result);
    // }
} catch (e) {
    if (e.location && e.location.start) {
        let lines = source.split(/\n/);
        console.error(lines[e.location.start.line - 1]);
        console.error(' '.repeat(e.location.start.column - 1) + '^');
        console.error(e.message);
        console.error(sourceFilePath + " line " + e.location.start.line + " col " + e.location.start.column);
    } else {
        throw e;
    }
}
