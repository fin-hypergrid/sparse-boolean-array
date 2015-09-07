'use strict';

/* global describe, it */

require('should'); // extends Object with `should`
var Spy = require('./SimpleSpy.js')

var RangeSelectionModel = require('../src/js/RangeSelectionModel.js');

describe('RangeSelectionModel that', function() {
    it('is a function that', function() {
        (typeof RangeSelectionModel).should.equal('function');
    });
    describe('when used as a constructor returns an API that', function() {
        var model;
        beforeEach(function() {
            model = new RangeSelectionModel;
        });
        describe('has a member `selection` that', function() {
            it('is an array', function () {
                (model.selection instanceof Array).should.be.true();
            });
            it('is initially empty', function() {
                model.selection.length.should.equal(0);
            });
        });
        describe('has a member `select` that', function() {
            it('is a function', function() {
                (typeof model.select).should.equal('function');
            });
            it('returns identity for chaining', function () {
                model.select(3).should.equal(model);
            });
            it('when called with A SINGLE numeric param (or a single array with a single numeric element) results in `selection` array with A SINGLE run that starts and ends with the same cell', function() {
                model.select(3).selection.should.deepEqual([[3,3]]);
                model.select(3).selection.should.deepEqual([[3,3]]);
            });
            it('when called with TWO IDENTICAL numeric params (or a single array with a two identical numeric elements) results in `selection` array with A SINGLE run that starts and ends with the same cell', function() {
                model.select(4,4).selection.should.deepEqual([[4,4]]);
                model.select([4,4]).selection.should.deepEqual([[4,4]]);
            });
            it('when called with ASCENDING params (or a single array with ascending elements) results in `selection` array with A SINGLE run that starts and ends with those cells in ASCENDING order', function() {
                model.select(5,11).selection.should.deepEqual([[5,11]]);
                model.select([5,11]).selection.should.deepEqual([[5,11]]);
            });
            it('when called with DESCENDING params (or a single array with descending elements) results in `selection` array with A SINGLE run (element) that starts and ends with those cells still in ASCENDING order', function() {
                model.select(11,5).selection.should.deepEqual([[5,11]]);
                model.select([11,5]).selection.should.deepEqual([[5,11]]);
            });
            it('when called TWICE with NON-OVERLAPPING, NON-ADJACENT runs in any order, results in `selection` array with TWO runs (elements)', function() {
                model.select(3,4);
                model.select(6,7).selection.should.deepEqual([[3,4],[6,7]]);
            });
            describe('when called TWICE with OVERLAPPING runs, results in `selection` array with A SINGLE run (element)', function() {
                describe('where runs were selected in ascending order such that', function() {
                    beforeEach(function() {
                        model.select(3, 5);
                    });
                    describe('2nd run starts more than 1 point before 1st run\'s start point and', function () {
                        it('ends more than 1 point after 1st run\'s end point', function () {
                            model.select(1, 7).selection.should.deepEqual([[1, 7]]);
                        });
                        it('ends just after 1st run\'s end point', function () {
                            model.select(1, 6).selection.should.deepEqual([[1, 6]]);
                        });
                        it('ends at 1st run\'s end point', function () {
                            model.select(1, 5).selection.should.deepEqual([[1, 5]]);
                        });
                        it('ends before 1st run\'s end point', function () {
                            model.select(1, 4).selection.should.deepEqual([[1, 5]]);
                        });
                    });
                    describe('2nd run starts just before 1st run\'s start point and', function () {
                        it('ends more than 1 point after 1st run\'s end point', function () {
                            model.select(2, 7).selection.should.deepEqual([[2, 7]]);
                        });
                        it('ends just after 1st run\'s end point', function () {
                            model.select(2, 6).selection.should.deepEqual([[2, 6]]);
                        });
                        it('ends at 1st run\'s end point', function () {
                            model.select(2, 5).selection.should.deepEqual([[2, 5]]);
                        });
                        it('ends before 1st run\'s end point', function () {
                            model.select(2, 4).selection.should.deepEqual([[2, 5]]);
                        })
                    });
                    describe('2nd run starts at 1st run\'s start point and', function () {
                        it('ends more than 1 point after 1st run\'s end point', function () {
                            model.select(3, 7).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 1st run\'s end point', function () {
                            model.select(3, 6).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 1st run\'s end point', function () {
                            model.select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                        it('ends before 1st run\'s end point', function () {
                            model.select(3, 4).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                    describe('2nd run starts between 1st run\'s start and end points and before ends', function () {
                        it('ends more than 1 point after 1st run\'s end point', function () {
                            model.select(4, 7).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 1st run\'s end point', function () {
                            model.select(4, 6).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 1st run\'s end point', function () {
                            model.select(4, 5).selection.should.deepEqual([[3, 5]]);
                        });
                        it('ends before 1st run\'s end point', function () {
                            model.select(4, 4).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                    describe('2nd run starts at 1st run\'s end point and', function () {
                        it('ends more than 1 point after 1st run\'s end point', function () {
                            model.select(5, 7).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 1st run\'s end point', function () {
                            model.select(5, 6).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 1st run\'s end point', function () {
                            model.select(5, 5).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                });
                describe('where runs were selected in descending order such that', function() {
                    describe('1st run starts more than 1 point before 2nd run\'s start point and', function () {
                        it('ends more than 1 point after 2nd run\'s end point', function () {
                            model.select(1, 7).select(3, 5).selection.should.deepEqual([[1, 7]]);
                        });
                        it('ends just after 2nd run\'s end point', function () {
                            model.select(1, 6).select(3, 5).selection.should.deepEqual([[1, 6]]);
                        });
                        it('ends at 2nd run\'s end point', function () {
                            model.select(1, 5).select(3, 5).selection.should.deepEqual([[1, 5]]);
                        });
                        it('ends before 2nd run\'s end point', function () {
                            model.select(1, 4).select(3, 5).selection.should.deepEqual([[1, 5]]);
                        });
                    });
                    describe('1st run starts just before 2nd run\'s start point and', function () {
                        it('ends more than 1 point after 2nd run\'s end point', function () {
                            model.select(2, 7).select(3, 5).selection.should.deepEqual([[2, 7]]);
                        });
                        it('ends just after 2nd run\'s end point', function () {
                            model.select(2, 6).select(3, 5).selection.should.deepEqual([[2, 6]]);
                        });
                        it('ends at 2nd run\'s end point', function () {
                            model.select(2, 5).select(3, 5).selection.should.deepEqual([[2, 5]]);
                        });
                        it('ends before 2nd run\'s end point', function () {
                            model.select(2, 4).select(3, 5).selection.should.deepEqual([[2, 5]]);
                        })
                    });
                    describe('1st run starts at 2nd run\'s start point and', function () {
                        it('ends more than 1 point after 2nd run\'s end point', function () {
                            model.select(3, 7).select(3, 5).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 2nd run\'s end point', function () {
                            model.select(3, 6).select(3, 5).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 2nd run\'s end point', function () {
                            model.select(3, 5).select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                        it('ends before 2nd run\'s end point', function () {
                            model.select(3, 4).select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                    describe('1st run starts between 2nd run\'s start and end points and before ends', function () {
                        it('ends more than 1 point after 2nd run\'s end point', function () {
                            model.select(4, 7).select(3, 5).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 2nd run\'s end point', function () {
                            model.select(4, 6).select(3, 5).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 2nd run\'s end point', function () {
                            model.select(4, 5).select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                        it('ends before 2nd run\'s end point', function () {
                            model.select(4, 4).select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                    describe('1st run starts at 2nd run\'s end point and', function () {
                        it('ends more than 1 point after 2nd run\'s end point', function () {
                            model.select(5, 7).select(3, 5).selection.should.deepEqual([[3, 7]]);
                        });
                        it('ends just after 2nd run\'s end point', function () {
                            model.select(5, 6).select(3, 5).selection.should.deepEqual([[3, 6]]);
                        });
                        it('ends at 2nd run\'s end point', function () {
                            model.select(5, 5).select(3, 5).selection.should.deepEqual([[3, 5]]);
                        });
                    });
                });
            });
            describe('when called TWICE with ADJACENT runs, results in `selection` array with A SINGLE run (element) that covers both', function() {
                it('where runs were selected in ascending order', function() {
                    model.select(3, 4).select(5, 7).selection.should.deepEqual([[3, 7]]);
                });
                it('where runs were selected in descending order', function() {
                    model.select(5, 7).select(3, 4).selection.should.deepEqual([[3, 7]]);
                });
            });
            describe('when called THRICE with 2 NON-ADJACENT, NON-OVERLAPPING runs', function() {
                beforeEach(function() {
                    model.select(1, 3).select(7, 9);
                });
                describe('results in `selection` array with A SINGLE run (element)', function() {
                    describe('when a 3rd run COMPLETELY OVERLAPS 1st run and', function() {
                        it('is ADJACENT to 2nd run', function() {
                            model.select(0, 6).selection.should.deepEqual([[0, 9]]);
                        });
                        it('PARTIALLY OVERLAPS 2nd run', function() {
                            model.select(0, 8).selection.should.deepEqual([[0, 9]]);
                        });
                        it('COMPLETELY OVERLAPS 2nd run', function() {
                            model.select(0, 10).selection.should.deepEqual([[0, 10]]);
                        });
                    });
                    describe('when a 3rd run is ADJACENT to 1st run and', function() {
                        it('is ADJACENT to 2nd run', function() {
                            model.select(4, 6).selection.should.deepEqual([[1, 9]]);
                        });
                        it('PARTIALLY OVERLAPS 2nd run', function() {
                            model.select(4, 8).selection.should.deepEqual([[1, 9]]);
                        });
                        it('COMPLETELY OVERLAPS 2nd run', function() {
                            model.select(4, 10).selection.should.deepEqual([[1, 10]]);
                        });
                    });
                    describe('when a 3rd PARTIALLY OVERLAPS 1st run and', function() {
                        it('is ADJACENT to 2nd run', function() {
                            model.select(2, 6).selection.should.deepEqual([[1, 9]]);
                        });
                        it('PARTIALLY OVERLAPS 2nd run', function() {
                            model.select(2, 8 ).selection.should.deepEqual([[1, 9]]);
                        });
                        it('COMPLETELY OVERLAPS 2nd run', function() {
                            model.select(2, 10).selection.should.deepEqual([[1, 10]]);
                        });
                    });
                });
                describe('results in `selection` array with TWO runs (elements) when a 3rd run that DOES NOT EXTEND TO 2nd run', function() {
                    // these expected results reflect the peculiarities of current algorithm regarding the order of runs (which are officially unordered)
                    it('COMPLETELY OVERLAPS 1st run', function() {
                        model.select(0, 5).selection.should.deepEqual([[7, 9], [0, 5]]);
                    });
                    it('is ADJACENT to 1st run', function() {
                        model.select(4, 5).selection.should.deepEqual([[7, 9], [1, 5]]);
                    });
                    it('PARTIALLY OVERLAPS 1st run', function() {
                        model.select(2, 5).selection.should.deepEqual([[7, 9], [1, 5]]);
                    });
                });
            });
        });
        describe('has a member `deselect` that', function() {
            beforeEach(function() {
                model.select(3, 5);
            });
            it('is a function', function () {
                (typeof model.deselect).should.equal('function');
            });
            it('returns identity for chaining', function () {
                model.deselect(0).should.equal(model);
            });
            it('when called with a run in the middle of an existing run, breaks the existing run in TWO runs', function() {
                model.deselect(4).selection.should.deepEqual([[3, 3], [5, 5]]);
            });
            it('when called with a run that truncates two existing runs, replaces existing runs with remaining portion of each', function() {
                model.select(7, 10).deselect(4, 9).selection.should.deepEqual([[3, 3], [10, 10]]);
            });
            it('when called with a run with no overlap at all, leaves original run intact', function() {
                model.deselect(1).selection.should.deepEqual([[3, 5]]);
                model.deselect(2).selection.should.deepEqual([[3, 5]]);
                model.deselect(6).selection.should.deepEqual([[3, 5]]);
                model.deselect(7).selection.should.deepEqual([[3, 5]]);
            });
            describe('when called with an obscuring run, completely removes the existing run', function() {
                it('when the obscuring run PRECISELY OVERLAPS the existing run', function() {
                    model.deselect(3, 5).selection.length.should.equal(0);
                });
                describe('when the obscuring run EXCESSIVELY OVERLAPS the existing run', function() {
                    it('with excess before', function() {
                        model.deselect(2, 5).selection.length.should.equal(0);
                    });
                    it('with excess after', function() {
                        model.deselect(3, 6).selection.length.should.equal(0);
                    });
                    it('with excess before and after', function() {
                        model.deselect(2, 6).selection.length.should.equal(0);
                    });
                });
            });
            describe('when called with a PARTIALLY OVERLAPPING run, truncates the existing run', function() {
                it('from before its start, leaving a run of a single point', function() {
                    model.deselect(2, 4).selection.should.deepEqual([[5, 5]]);
                });
                it('from its start, leaving a run of a single point', function() {
                    model.deselect(3, 4).selection.should.deepEqual([[5, 5]]);
                });
                it('from its start, leaving a run of multiple points', function() {
                    model.deselect(3, 3).selection.should.deepEqual([[4, 5]]);
                });
                it('from after its end, leaving a run of a single point', function() {
                    model.deselect(4, 6).selection.should.deepEqual([[3, 3]]);
                });
                it('from its end, leaving a run of a single point', function() {
                    model.deselect(4, 5).selection.should.deepEqual([[3, 3]]);
                });
                it('from its end, leaving a run of multiple points', function() {
                    model.deselect(5, 5).selection.should.deepEqual([[3, 4]]);
                });
            });
        });
        describe('has a member `isSelected` that', function() {
            beforeEach(function () {
                model.select(3, 5).select(9,11);
            });
            it('is a function', function () {
                (typeof model.deselect).should.equal('function');
            });
            describe('when called with a point', function() {
                it('before 1st run, returns `false`', function () {
                    model.isSelected(1).should.be.not.ok();
                });
                it('adjacent to 1st run, returns `false`', function () {
                    model.isSelected(2).should.be.not.ok();
                });
                it('of 1st run\'s start, returns `true`', function () {
                    model.isSelected(3).should.be.ok();
                });
                it('in middle of 1st run, returns `true`', function () {
                    model.isSelected(4).should.be.ok();
                });
                it('of 1st run\'s stop, returns `true`', function () {
                    model.isSelected(5).should.be.ok();
                });
                it('adjacent to 1st run, returns `false`', function () {
                    model.isSelected(6).should.be.not.ok();
                });
                it('after 1st run and before 2nd run, returns `false`', function () {
                    model.isSelected(7).should.be.not.ok();
                });
                it('adjacent to 2nd run, returns `false`', function () {
                    model.isSelected(8).should.be.not.ok();
                });
                it('of 2nd run\'s start, returns `true`', function () {
                    model.isSelected(9).should.be.ok();
                });
                it('in middle of 2nd run, returns `true`', function () {
                    model.isSelected(10).should.be.ok();
                });
                it('of 2nd run\'s stop, returns `true`', function () {
                    model.isSelected(11).should.be.ok();
                });
                it('adjacent to 2nd run, returns `false`', function () {
                    model.isSelected(12).should.be.not.ok();
                });
                it('after 2nd run, returns `false`', function () {
                    model.isSelected(13).should.be.not.ok();
                });
            });
        });
        describe('has a member `clear` that', function() {
            it('is a function', function () {
                (typeof model.select).should.equal('function');
            });
            it('returns identity for chaining', function () {
                model.clear().should.equal(model);
            });
            it('when called, empties `selection`', function() {
                model.select(1, 2).select(4, 5).clear().selection.length.should.equal(0);
            });
        });
    });
});
