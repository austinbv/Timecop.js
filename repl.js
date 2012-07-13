var Timecop = require('./timecop'),
    repl = require("repl"),
    TestObj = require("./test");

var r = repl.start({
  prompt: '> ',
  input: process.stdin,
  output: process.stdout,
  useGlobal: true
}).context;
debugger; 
r.Timecop = Timecop;
r.TestObj = TestObj;
