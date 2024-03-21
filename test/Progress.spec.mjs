import assert from 'assert';
import { expect } from 'chai';

import Progress from '../src/js/Progress.js';

describe('Progress', function () {
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
        });

        it('set invalid counter', function () {
            const progress = new Progress();
            expect(() => progress.setCounter(-1)).to.throw('Counter must be greater than or equal to 0');
        });
    });

    describe('method calculateEstimatedTimeOfArrival', function () {
        it('estimated time of arrival', async function () {
            const progress = new Progress(1_000);
            progress.incrementCounter();

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const eta = progress.calculateEstimatedTimeOfArrival();
            expect(eta).to.be.instanceOf(Date);
            const totalSeconds = (eta.getTime() - progress.StartTime.getTime()) / 1000;
            expect(totalSeconds).to.be.at.least(900);
            expect(totalSeconds).to.be.at.most(1_100);
        });
    });

    describe('method calculateEstimatedTimeEnroute', function () {
        it('estimated time enroute is greater than 0 seconds', async function () {
            const progress = new Progress(1_000);
            progress.setCounter(200);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            expect(ete.seconds).to.be.at.least(3);
            expect(ete.seconds).to.be.at.most(5);
        });

        it('estimated time enroute is less than 60 seconds', async function () {
            const progress = new Progress(55);
            progress.setCounter(1);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.hours, 0);
            assert.equal(ete.minutes, 0);
            expect(ete.seconds).to.be.at.least(50);
            expect(ete.seconds).to.be.at.most(60);
        });

        it('estimated time enroute equals 1 minute', async function () {
            const progress = new Progress(90);
            progress.setCounter(1);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.hours, 0);
            assert.equal(ete.minutes, 1);
        });

        it('estimated time enroute is less than 1 hour', async function () {
            const progress = new Progress(3_500);
            progress.setCounter(1);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.hours, 0);
            expect(ete.minutes).to.be.at.least(55);
            expect(ete.minutes).to.be.at.most(60);
        });

        it('estimated time enroute equals 1 hour', async function () {
            const progress = new Progress(3_700);
            progress.setCounter(1);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

            const ete = progress.calculateEstimatedTimeEnroute();
            expect(ete).to.be.not.null;
            assert.equal(ete.hours, 1);
            assert.equal(ete.minutes, 1);
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
    });

    describe('method toFormattedString', function () {
        it('to formatted string with no totalCount', function () {
            const progress = new Progress();
            progress.incrementCounter();

            const expectedString = 'progress => 1/- (N/A%); elapsed: 00:00:00; ete: N/A; eta: N/A';
            assert.equal(progress.toFormattedString(), expectedString);
        });

        it('to formatted string with totalCount', async function () {
            const progress = new Progress(1_000);

            await new Promise((resolve) => setTimeout(resolve, 1_000));

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
    });
});