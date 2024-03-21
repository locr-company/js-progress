export default class Progress {
    public static readonly DEFAULT_TO_STRING_FORMAT = 'progress => ${Counter}/${TotalCount} (${PercentageCompleted}%)' +
        '; elapsed: ${ElapsedTime}' +
        '; ete: ${EstimatedTimeEnroute}' +
        '; eta: ${EstimatedTimeOfArrival}';

    private _counter: number = 0;
    private _events: { [key: string]: Function[] } = {};
    private _startTime: Date;
    private _totalCount: number | null = null;

    constructor(totalCount: number | null = null) {
        this._startTime = new Date();
        this._totalCount = totalCount;
    }

    public get Counter(): number {
        return this._counter;
    }

    public get ElapsedTime(): { y: number, m: number, d: number, h: number, i: number, s: number, f: number } {
        const now = new Date();
        const diffTotalMilliseconds = now.getTime() - this._startTime.getTime();
        const diffSeconds = diffTotalMilliseconds / 1000;
        const diffMilliseconds = diffTotalMilliseconds % 1000;
        const diffMinutes = diffSeconds / 60;
        const diffHours = diffMinutes / 60;
        const diffDays = diffHours / 24;
        const diffMonths = diffDays / 30;
        const diffYears = diffMonths / 12;

        return {
            y: Math.floor(diffYears),
            m: Math.floor(diffMonths),
            d: Math.floor(diffDays),
            h: Math.floor(diffHours),
            i: Math.floor(diffMinutes),
            s: Math.floor(diffSeconds),
            f: diffMilliseconds
        };
    }

    public get PercentageCompleted(): number | null {
        if (this._totalCount === null) {
            return null;
        }
        return this._counter / this._totalCount * 100;
    }

    public get StartTime(): Date {
        return this._startTime;
    }

    public get TotalCount(): number | null {
        return this._totalCount;
    }

    public calculateEstimatedTimeEnroute(): {hours: number, minutes: number, seconds: number} | null {
        if (this._totalCount === null || this._counter === 0) {
            return null;
        }

        const elapsedTime = this.ElapsedTime;
        const totalElapsedSeconds = elapsedTime.s +
            elapsedTime.i * 60 +
            elapsedTime.h * 3_600 +
            elapsedTime.d * 86_400 +
            elapsedTime.m * 2_592_000 +
            elapsedTime.y * 31_536_000;

        let hoursRemaining = 0;
        let minutesRemaining = 0;
        let secondsRemaining = (totalElapsedSeconds / this._counter * (this._totalCount - this._counter));
        if (secondsRemaining >= 60) {
            minutesRemaining = Math.floor(secondsRemaining / 60);
            secondsRemaining = secondsRemaining % 60;
            if (minutesRemaining >= 60) {
                hoursRemaining = Math.floor(minutesRemaining / 60);
                minutesRemaining = minutesRemaining % 60;
            }
        }
        secondsRemaining = Math.floor(secondsRemaining);

        return {
            hours: hoursRemaining,
            minutes: minutesRemaining,
            seconds: secondsRemaining
        };
    }

    public calculateEstimatedTimeOfArrival(): Date | null
    {
        const ete = this.calculateEstimatedTimeEnroute();
        if (ete === null) {
            return null;
        }

        const now = new Date();
        now.setTime(now.getTime() + ete.hours * 60 * 60 * 1000 + ete.minutes * 60 * 1000 + ete.seconds * 1000);
        return now;
    }

    public incrementCounter(): void {
        this._counter++;

        if (this._events['change']) {
            this._events['change'].forEach((callback) => {
                callback(this);
            });
        }
    }

    public on(eventName: string, callback: Function): void {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }

    public setCounter(value: number): void {
        if (value < 0) {
            throw new Error('Counter must be greater than or equal to 0');
        }
        this._counter = value;

        if (this._events['change']) {
            this._events['change'].forEach((callback) => {
                callback(this);
            });
        }
    }

    public toFormattedString(format: string = Progress.DEFAULT_TO_STRING_FORMAT): string {
        const elapsedTime = this.ElapsedTime;
        const ete = this.calculateEstimatedTimeEnroute();
        const eta = this.calculateEstimatedTimeOfArrival();

        let formattedETA = 'N/A';
        if (eta) {
            const paddedNumber = (num: number) => String(num).padStart(2, '0');

            const etaYear = eta.getFullYear();
            const etaMonth = paddedNumber(eta.getMonth() + 1); // Monat beginnt bei 0
            const etaDay = paddedNumber(eta.getDate());
            const etaHour = paddedNumber(eta.getHours());
            const etaMinute = paddedNumber(eta.getMinutes());
            const etaSecond = paddedNumber(eta.getSeconds());

            formattedETA = `${etaYear}-${etaMonth}-${etaDay} ${etaHour}:${etaMinute}:${etaSecond}`;
        }

        const replacements: Record<string, string> = {
            '${Counter}': this._counter.toString(),
            '${ElapsedTime}': `${String(elapsedTime.h).padStart(2, '0')}:${String(elapsedTime.i).padStart(2, '0')}:${String(elapsedTime.s).padStart(2, '0')}`,
            '${EstimatedTimeEnroute}': ete ? `${String(ete.hours).padStart(2, '0')}:${String(ete.minutes).padStart(2, '0')}:${String(ete.seconds).padStart(2, '0')}` : 'N/A',
            '${EstimatedTimeOfArrival}': formattedETA,
            '${PercentageCompleted}': this.PercentageCompleted !== null ? this.PercentageCompleted.toFixed(2) : 'N/A',
            '${TotalCount}': this._totalCount ? this._totalCount.toString() : '-',
        };

        for (const key in replacements) {
            format = format.replace(key, replacements[key]);
        }
        return format;
    }
}
