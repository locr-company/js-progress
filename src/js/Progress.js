class Progress {
    constructor(totalCount = null) {
        this._counter = 0;
        this._events = {};
        this._totalCount = null;
        this._startTime = new Date();
        this._totalCount = totalCount;
    }
    get Counter() {
        return this._counter;
    }
    get ElapsedTime() {
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
    get PercentageCompleted() {
        if (this._totalCount === null) {
            return null;
        }
        return this._counter / this._totalCount * 100;
    }
    get StartTime() {
        return this._startTime;
    }
    get TotalCount() {
        return this._totalCount;
    }
    calculateEstimatedTimeEnroute() {
        if (this._totalCount === null || this._counter === 0) {
            return null;
        }
        const elapsedTime = this.ElapsedTime;
        const totalElapsedSeconds = elapsedTime.s +
            elapsedTime.i * 60 +
            elapsedTime.h * 3600 +
            elapsedTime.d * 86400 +
            elapsedTime.m * 2592000 +
            elapsedTime.y * 31536000;
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
    calculateEstimatedTimeOfArrival() {
        const ete = this.calculateEstimatedTimeEnroute();
        if (ete === null) {
            return null;
        }
        const now = new Date();
        now.setTime(now.getTime() + ete.hours * 60 * 60 * 1000 + ete.minutes * 60 * 1000 + ete.seconds * 1000);
        return now;
    }
    incrementCounter() {
        this._counter++;
        if (this._events['change']) {
            this._events['change'].forEach((callback) => {
                callback(this);
            });
        }
    }
    on(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    }
    setCounter(value) {
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
    toFormattedString(format = Progress.DEFAULT_TO_STRING_FORMAT) {
        const elapsedTime = this.ElapsedTime;
        const ete = this.calculateEstimatedTimeEnroute();
        const eta = this.calculateEstimatedTimeOfArrival();
        let formattedETA = 'N/A';
        if (eta) {
            const paddedNumber = (num) => String(num).padStart(2, '0');
            const etaYear = eta.getFullYear();
            const etaMonth = paddedNumber(eta.getMonth() + 1); // Monat beginnt bei 0
            const etaDay = paddedNumber(eta.getDate());
            const etaHour = paddedNumber(eta.getHours());
            const etaMinute = paddedNumber(eta.getMinutes());
            const etaSecond = paddedNumber(eta.getSeconds());
            formattedETA = `${etaYear}-${etaMonth}-${etaDay} ${etaHour}:${etaMinute}:${etaSecond}`;
        }
        const replacements = {
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
Progress.DEFAULT_TO_STRING_FORMAT = 'progress => ${Counter}/${TotalCount} (${PercentageCompleted}%)' +
    '; elapsed: ${ElapsedTime}' +
    '; ete: ${EstimatedTimeEnroute}' +
    '; eta: ${EstimatedTimeOfArrival}';
export default Progress;
//# sourceMappingURL=Progress.js.map