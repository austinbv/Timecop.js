module.exports = function(chai, utils) {
  utils.addMethod(chai.Assertion.prototype, 'closeInTimeTo', function (time) {
    var obj = utils.flag(this, 'object');
    new chai.Assertion(obj.getTime()).to.be.closeTo(time.getTime(), 500);
  });
};
