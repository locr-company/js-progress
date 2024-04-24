import assert from 'assert';
import { expect } from 'chai';
import FakeTimers from '@sinonjs/fake-timers';

import Progress from '../src/js/Progress.js';

describe('Progress', function () {
    /**
     * @type {FakeTimers.InstalledClock}
     */
    let clock;

    beforeEach(function() {
        clock = FakeTimers.install();
    });

    afterEach(function() {
        clock.uninstall();
    });

    describe('constructor', function () {
        it('default values for a new instance', function () {
            const testStartTime = new Date();
            const progress = new Progress();
            expect(progress.ElapsedTime.s).to.be.at.most(1);
            const diffTime = progress.StartTime.getTime() - testStartTime.getTime();
            expect(diffTime).to.be.at.most(1);

            assert.equal(progress.Counter, 0);
            assert.equal(progress.TotalCount, null);
            assert.equal(progress.PercentageCompleted, null);
            expect(progress.calculateEstimatedTimeEnroute()).to.be.null;
            expect(progress.calculateEstimatedTimeOfArrival()).to.be.null;
        });

        it('new instance with total count', function () {
            const progress = new Progress(1_000);
            assert.equal(progress.Counter, 0);
            assert.equal(progress.TotalCount, 1_000);
            assert.equal(progress.PercentageCompleted, 0);
        });
    });

    describe('ElapsedTime property', function () {
        it('ElapsedTime property is 0', function () {
            const progress = new Progress();
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 second', function () {
            const progress = new Progress();

            clock.tick(1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 1);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 59 second', function () {
            const progress = new Progress();

            clock.tick(59 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 59);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 minute', function () {
            const progress = new Progress();

            clock.tick(60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 1);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 minute and 1 second', function () {
            const progress = new Progress();

            clock.tick(61 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 1);
            assert.equal(elapsedTime.s, 1);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 59 minutes and 59 seconds', function () {
            const progress = new Progress();

            clock.tick(59 * 60 * 1_000 + 59 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 59);
            assert.equal(elapsedTime.s, 59);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 hour', function () {
            const progress = new Progress();

            clock.tick(60 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 1);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 hour and 1 minute', function () {
            const progress = new Progress();

            clock.tick(61 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 1);
            assert.equal(elapsedTime.i, 1);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 23 hours, 59 minutes as 59 seconds', function () {
            const progress = new Progress();

            clock.tick(23 * 60 * 60 * 1_000 +  59 * 60 * 1_000 + 59 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 23);
            assert.equal(elapsedTime.i, 59);
            assert.equal(elapsedTime.s, 59);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 day', function () {
            const progress = new Progress();

            clock.tick(24 * 60 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 1);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 day and 1 hour', function () {
            const progress = new Progress();

            clock.tick(25 * 60 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 1);
            assert.equal(elapsedTime.h, 1);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 364 days, 23 hours, 59 minutes and 59 seconds', function () {
            const progress = new Progress();

            clock.tick(364 * 24 * 60 * 60 * 1_000 + 23 * 60 * 60 * 1_000 + 59 * 60 * 1_000 + 59 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 0);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 364);
            assert.equal(elapsedTime.h, 23);
            assert.equal(elapsedTime.i, 59);
            assert.equal(elapsedTime.s, 59);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 year', function () {
            const progress = new Progress();

            clock.tick(365 * 24 * 60 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 1);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 0);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });

        it('ElapsedTime property is 1 year and 1 day', function () {
            const progress = new Progress();

            clock.tick(366 * 24 * 60 * 60 * 1_000);
            const elapsedTime = progress.ElapsedTime;
            assert.equal(elapsedTime.y, 1);
            assert.equal(elapsedTime.m, 0);
            assert.equal(elapsedTime.d, 1);
            assert.equal(elapsedTime.h, 0);
            assert.equal(elapsedTime.i, 0);
            assert.equal(elapsedTime.s, 0);
            assert.equal(elapsedTime.f, 0);
        });
    });

    describe('method incrementCounter', function () {
        it('incrementCounter', function () {
            const progress = new Progress(1_000);
            assert.equal(progress.Counter, 0);

            progress.incrementCounter();
            assert.equal(progress.Counter, 1);
            assert.equal(progress.PercentageCompleted, 0.1);
        });
    });

    describe('method setCounter', function () {
        it('setCounter', function () {
            const progress = new Progress(1_000);
            assert.equal(progress.Counter, 0);

            progress.setCounter(500);
            assert.equal(progress.Counter, 500);
            assert.equal(progress.PercentageCompleted, 50);

            progress.setCounter(0);
            assert.equal(progress.Counter, 0);
            assert.equal(progress.PercentageCompleted, 0);
        });

        it('set invalid counter', function () {
            const progress = new Progress();
            expect(() => progress.setCounter(-1)).to.throw('Counter must be greater than or equal to 0');
        });
    });

    describe('method setTotalCount', function () {
        it('setTotalCounter', function () {
            const progress = new Progress();
            expect(progress.TotalCount).to.be.null;

            progress.setTotalCount(0);
            assert.equal(progress.TotalCount, 0);

            progress.setTotalCount(1_000);
            assert.equal(progress.TotalCount, 1_000);
        });

        it('set invalid totalCount', function () {
            const progress = new Progress();
            expect(() => progress.setTotalCount(-1)).to.throw('Total count must be greater than or equal to 0');
        });
    });

    describe('method calculateEstimatedTimeOfArrival', function () {
        it('estimated time of arrival', function () {
            const progress = new Progress(1_000);
            progress.incrementCounter();

            clock.tick(1_000);

            const eta = progress.calculateEstimatedTimeOfArrival();
            expect(eta).to.be.instanceOf(Date);
            const totalSeconds = (eta.getTime() - progress.StartTime.getTime()) / 1000;
            expect(totalSeconds).to.be.at.least(900);
            expect(totalSeconds).to.be.at.most(1_100);
        });
    });

    describe('method calculateEstimatedTimeEnroute', function () {
        it('estimated time enroute is greater than 0 seconds', function () {
            const progress = new Progress(1_000);
            progress.setCounter(200);

            clock.tick(1_000);

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 4);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute is less than 60 seconds', function () {
            const progress = new Progress(55);
            progress.setCounter(1);

            clock.tick(1_000);

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 0);
        });

        it('estimated time enroute equals 1 minute', function () {
            const progress = new Progress(61);
            progress.setCounter(1);

            clock.tick(1_000);

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 1);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute is less than 1 hour', function () {
            const progress = new Progress(3_541);
            progress.setCounter(1);

            clock.tick(1_000);

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 59);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute equals 1 hour', function () {
            const progress = new Progress(3_601);
            progress.setCounter(1);

            clock.tick(1_000);

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 1);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute equals 1 hour where time is 1 min later', function () {
            const progress = new Progress(61);
            progress.setCounter(1);

            clock.tick(60 * 1_000);
            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 1);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute equals 1 day where time is 1 hour later', function () {
            const progress = new Progress(25);
            progress.setCounter(1);

            clock.tick(60 * 60 * 1_000);
            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 0);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 1);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute equals 1 year where time is 1 day later', function () {
            const progress = new Progress(366);
            progress.setCounter(1);

            clock.tick(24 * 60 * 60 * 1_000);
            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 1);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });

        it('estimated time enroute equals 1 year where time is 1 year later', function () {
            const progress = new Progress(2);
            progress.setCounter(1);

            clock.tick(365 * 24 * 60 * 60 * 1_000);
            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.y, 1);
            assert.equal(ete.m, 0);
            assert.equal(ete.d, 0);
            assert.equal(ete.h, 0);
            assert.equal(ete.i, 0);
            assert.equal(ete.s, 0);
            assert.equal(ete.f, 0);
        });
    });

    describe('method on', function () {
        it('change event for incrementCounter', function () {
            const progress = new Progress();
            progress.on('change', progress => {
                expect(progress).to.be.instanceOf(Progress);
                assert.equal(progress.Counter, 1);
            });

            progress.incrementCounter();
        });

        it('change event for setCounter', function () {
            const progress = new Progress();
            progress.on('change', progress => {
                expect(progress).to.be.instanceOf(Progress);
                assert.equal(progress.Counter, 2);
            });

            progress.setCounter(2);
        });

        it('change event for setTotalCount', function () {
            const progress = new Progress();
            progress.on('change', progress => {
                expect(progress).to.be.instanceOf(Progress);
                assert.equal(progress.TotalCount, 5);
            });

            progress.setTotalCount(5);
        });
    });

    describe('method on with ms threshold option', function () {
        it('change event for incrementCounter with ms threshold option', function () {
            let eventFiredCounter = 0;
            const progress = new Progress();
            progress.on(
                'change',
                _progress => {
                    eventFiredCounter++;
                },
                { updateIntervalMSThreshold: 100 }
            );

            for (let i = 0; i < 10; i++) {
                progress.incrementCounter();
            }

            clock.tick(110);

            progress.incrementCounter();

            /**
             * The event should be fired 2 times:
             * 1. When the event is fired the first time
             * 2. When the counter is incremented after the 100 ms
             */
            assert.equal(eventFiredCounter, 2);
        });
    });

    describe('method toFormattedString', function () {
        it('to formatted string with no totalCount', function () {
            const progress = new Progress();
            progress.incrementCounter();

            const expectedString = 'progress => 1/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and no locale', function () {
            const progress = new Progress();
            progress.setCounter(1_000);

            const expectedString = 'progress => 1000/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and locale', function () {
            const progress = new Progress(null, 'de-DE');
            progress.setCounter(1_000);

            const expectedString = 'progress => 1.000/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and no locale and byte unit', function () {
            const progress = new Progress(null, null, 'byte');
            progress.setCounter(1_000);

            const expectedString = 'progress => 1000 B/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and no locale and byte unit greater than 1024', function () {
            const progress = new Progress(null, null, 'byte');
            progress.setCounter(2_000);

            const expectedString = 'progress => 1.95 KiB/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no locale and byte greater than 1024 and ensure precision is fixed to 2', function () {
            const progress = new Progress(null, null, 'byte');
            progress.setCounter(1_950);

            const expectedString = 'progress => 1.90 KiB/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and locale and byte unit', function () {
            const progress = new Progress(null, 'de-DE', 'byte');
            progress.setCounter(1_000);

            const expectedString = 'progress => 1.000 B/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with no totalCount and locale and byte unit with counter greater than 1024', function () {
            const progress = new Progress(null, 'de-DE', 'byte');
            progress.setCounter(2_400);

            const expectedString = 'progress => 2,34 KiB/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with locale and byte greater than 1024 and ensure precision is fixed to 2', function () {
            const progress = new Progress(null, 'de-DE', 'byte');
            progress.setCounter(2_360);

            const expectedString = 'progress => 2,30 KiB/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with totalCount and locale and byte unit with totalCount greater than 1024', function () {
            const progress = new Progress(2_000_000, 'de-DE', 'byte');
            progress.setCounter(2_400);

            let pattern = '^';
            pattern += 'progress => \\d+,\\d+ ([KMGTPEZY]i)?B/\\d+,\\d+ ([KMGTPEZY]i)?B \\((\\d{1,3}(\\.\\d+)?)%\\)';
            pattern += '; elapsed: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; ete: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; eta: \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}';
            pattern += '$';
            const re = new RegExp(pattern);
            const matched = re.test(progress.toFormattedString());

            assert.equal(matched, true);
        });

        it('to formatted string with totalCount', function () {
            const progress = new Progress(1_000);

            clock.tick(1_000);

            progress.incrementCounter();

            let pattern = '^';
            pattern += 'progress => 1/1000 \\((\\d{1,3}(\\.\\d+)?)%\\)';
            pattern += '; elapsed: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; ete: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; eta: \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}';
            pattern += '$';
            const re = new RegExp(pattern);
            const matched = re.test(progress.toFormattedString());

            assert.equal(matched, true);
        });

        it('to formatted string with totalCount and locale', function () {
            const progress = new Progress(1_000, 'de-DE');

            clock.tick(1_000);

            progress.incrementCounter();

            let pattern = '^';
            pattern += 'progress => 1/1.000 \\((\\d{1,3}(\\.\\d+)?)%\\)';
            pattern += '; elapsed: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; ete: \\d{2}:\\d{2}:\\d{2}';
            pattern += '; eta: \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}';
            pattern += '$';
            const re = new RegExp(pattern);
            const matched = re.test(progress.toFormattedString());

            assert.equal(matched, true);
        });
    });
});