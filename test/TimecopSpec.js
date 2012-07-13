describe('Timecop', function(done) {
  var chai = require('chai'),
      expect = chai.expect,
      Timecop = require('../timecop.js');

  chai.use(require('./helpers/matchers'));

  beforeEach(function() {
    Timecop.install();
  });

  afterEach(function() {
    Timecop.returnToPresent();
    Timecop.uninstall();
  });

  it('should exist', function() {
    expect(typeof(Timecop)).not.to.equal('undefined');
  });

  it('should have a public API', function() {
    expect(Timecop['travel']).to.be.a('function');
    expect(Timecop['freeze']).to.be.a('function');
    expect(Timecop['returnToPresent']).to.be.a('function');
    expect(Timecop['topOfStack']).to.be.a('function');
    expect(Timecop['buildNativeDate']).to.be.a('function');
  });

  describe('.travel', function(done) {
    describe('with a date spelled out in numbers as arguments', function() {
      var someTimeIn2008 = new Timecop.NativeDate(2008, 6, 5, 14, 30, 15, 450);
      beforeEach(function() {
        Timecop.travel(someTimeIn2008);
      });

      it('should leave time running', function(done) {
        var self = this;
        var date1 = new Date();
        setTimeout(function() {
          var date2 = new Date();
          expect(date2.getTime() - date1.getTime()).to.be.greaterThan(200);
          expect(date2.getTime() - date1.getTime()).to.be.lessThan(400);
          self.timePassed = true;
          done();
        }, 300);
      });

      it('should change the time of dates created without any arguments', function() {
        expect(new Date()).to.be.closeInTimeTo(someTimeIn2008);
      });

      it('should not change the dates created with arguments', function() {
        var date = new Date(1999, 8, 24);
        expect(date.getFullYear()).to.equal(1999);
        expect(date.getMonth()   ).to.equal(8);
        expect(date.getDate()    ).to.equal(24);
      });
    });

    describe('when given a Date as an argument', function() {
      var independenceDay = new Timecop.NativeDate(1776, 6, 4);
      beforeEach(function() {
        Timecop.travel(independenceDay);
      });
      it('should travel to that Date', function() {
        expect(new Date()).to.be.closeInTimeTo(independenceDay);
      });
    });

    describe('when given a parseable String as an argument', function() {
      var turnOfMillennium = new Timecop.NativeDate(2000, 0, 1);
      beforeEach(function() {
        Timecop.travel(turnOfMillennium.toString());
      });
      it('should travel to that Date', function() {
        expect(new Date()).to.be.closeInTimeTo(turnOfMillennium);
      });
    });

    describe('when given a non-parseable String as an argument', function() {
      it('should throw an exception', function() {
        var badDate = 'ioankl ajfklja';
        expect(function() {
          Timecop.travel(badDate);
        }).to['throw']('Could not parse date: "' + badDate + '"');
      });
    });

    describe('with a function as the last argument', function() {
      var duringTrip;

      beforeEach(function() {
        Timecop.travel(1901, 1, 2, function() {
          duringTrip = new Date();
        });
      });

      it('should evaluate the function in the given time', function() {
        expect(duringTrip).to.be.closeInTimeTo(new Date(1901, 1, 2));
      });

      it('should automatically return to the present', function() {
        expect(Timecop.topOfStack()).to.be['null'];
      });
    });

  }); // Timecop.travel

  describe('.freeze', function(done) {
    describe('with a date spelled out in numbers as arguments', function(done) {
      beforeEach(function() {
        this.timeout(500);
        Timecop.freeze(2008, 6, 5, 14, 30, 15, 450);
      });

      it('should stop time', function(done) {
        var self = this;
        var date1 = new Date();
        setTimeout(function() {
          var date2 = new Date();
          expect(date2).toBeTheSameTimeAs(date1);
          self.timePassed = true;
          done();
        }, 300);
      });
    });

    describe('with a function as the last argument', function() {
      var duringTrip;

      beforeEach(function() {
        Timecop.freeze(1864, 4, 22, function() {
          duringTrip = new Date();
        });
      });

      it('should evaluate the function in the given time', function() {
        expect(duringTrip).to.be.closeInTimeTo(new Date(1864, 4, 22));
      });

      it('should automatically return to the present', function() {
        expect(Timecop.topOfStack()).to.be['null'];
      });
    });

  }); // Timecop.freeze

  describe('.return', function() {
    it('should return to the present regardless of the size of the Timecop stack', function() {
      var beforeLeave = new Date();
      Timecop.travel(1982, 7,  8);
      Timecop.freeze(1969, 9,  10);
      Timecop.travel(2004, 11, 12);
      Timecop.returnToPresent();
      var afterReturn = new Date();
      expect(afterReturn).to.be.closeInTimeTo(beforeLeave);
    });
  });
});
