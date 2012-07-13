(function() {
var TestObj;
var root = this;
TestObj = {
  rootDate: global.Date,
  install: function() { root.Date = TestObj.FakeDate; },
  uninstall: function() { root.Date = TestObj.GlobalDate; }
};

TestObj.FakeDate = function() { console.log('this is a fake date function'); return 'hello'; };
TestObj.FakeDate.prototype.someMethod = function() { return 'this is a method'; };

module.exports = TestObj;
})();
