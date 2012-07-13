describe('Timecop.MockDate', function() {
  var Timecop = require('../timecop.js');
  var expect = require('chai').expect;
  var now, date;

  beforeEach(function() {
    now = new Date();
    Timecop.install();
  });

  afterEach(function() {
    Timecop.returnToPresent();
    Timecop.uninstall();
  });

  describe('when created in the present without arguments', function() {
    beforeEach(function() {
      date = new Timecop.MockDate();
    });

    it('should be about the same as now', function() {
      expect(date.getTime()).to.be.closeTo(now.getTime(), 500);
    });
  });

  describe('when created while time traveling to the past without arguments', function() {
    beforeEach(function() {
      Timecop.travel(1980, 4, 29);
      date = new Timecop.MockDate();
    });

    it('should be in the past', function() {
      expect(date.getFullYear()).to.equal(1980);
    });

    it('should stay in the past even after we return to the present', function() {
      Timecop.returnToPresent();
      expect(date.getFullYear()).to.equal(1980);
    });
  });

  describe('when created with year, month, date', function() {
    beforeEach(function() {
      date = new Timecop.MockDate(1838, 8, 18, 16, 45);
    });

    it('should ignore our time travels', function() {
      expect(date.getFullYear()).to.equal(1838);
      Timecop.travel(1945, 5, 6);
      expect(date.getFullYear()).to.equal(1838);
      Timecop.returnToPresent();
      expect(date.getFullYear()).to.equal(1838);
    });
  });

  describe('the setters', function() {
    it('should have them', function() {
      [
        'Date', 'Day', 'FullYear', 'Hours', 'Milliseconds', 'Minutes', 'Month',
        'Seconds', 'Time', 'TimezoneOffset', 'UTCDate', 'UTCDay',
        'UTCFullYear', 'UTCHours', 'UTCMilliseconds', 'UTCMinutes',
        'UTCMonth', 'UTCSeconds', 'Year'
      ].forEach(function(aspect) {
        expect(date['set' + aspect]).to.be.a('function');
      });
    });
  });

  it('proxies setters to the underlying date', function() {
    date = new Timecop.MockDate();
    date.setFullYear(1838);
    expect(date.getFullYear()).to.equal(1838);
  });

});
