class Progress {
    constructor(totalCount = null, locale = null, unit = null) {
        this._counter = 0;
        this._events = {};
        this._locale = null;
        this._totalCount = null;
        this._unit = null;
        this._locale = locale;
        this._startTime = new Date();
        this._totalCount = totalCount;
        this._unit = unit;
    }
    get Counter() {
        return this._counter;
    }
    get ElapsedTime() {
        const now = new Date();
        const diffTotalMilliseconds = now.getTime() - this._startTime.getTime();
        const diffTotalSeconds = diffTotalMilliseconds / 1000;
        const milliseconds = diffTotalMilliseconds % 1000;
        const diffTotalMinutes = diffTotalSeconds / 60;
        const seconds = Math.floor(diffTotalSeconds % 60);
        const diffTotalHours = diffTotalMinutes / 60;
        const minutes = Math.floor(diffTotalMinutes % 60);
        const diffTotalDays = diffTotalHours / 24;
        const hours = Math.floor(diffTotalHours % 24);
        const years = Math.floor(diffTotalDays / 365);
        const days = Math.floor(diffTotalDays % 365);
        return {
            y: years,
            m: 0,
            d: days,
            h: hours,
            i: minutes,
            s: seconds,
            f: milliseconds
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
            //elapsedTime.m * 2_592_000 +
            elapsedTime.y * 31536000;
        let yearsRemaining = 0;
        let daysRemaining = 0;
        let hoursRemaining = 0;
        let minutesRemaining = 0;
        let secondsRemaining = (totalElapsedSeconds / this._counter * (this._totalCount - this._counter));
        if (secondsRemaining >= 60) {
            minutesRemaining = Math.floor(secondsRemaining / 60);
            secondsRemaining = secondsRemaining % 60;
        }
        if (minutesRemaining >= 60) {
            hoursRemaining = Math.floor(minutesRemaining / 60);
            minutesRemaining = minutesRemaining % 60;
        }
        if (hoursRemaining >= 24) {
            daysRemaining = Math.floor(hoursRemaining / 24);
            hoursRemaining = hoursRemaining % 24;
        }
        if (daysRemaining >= 365) {
            yearsRemaining = Math.floor(daysRemaining / 365);
            daysRemaining = daysRemaining % 365;
        }
        secondsRemaining = Math.floor(secondsRemaining);
        return {
            y: yearsRemaining,
            m: 0,
            d: daysRemaining,
            h: hoursRemaining,
            i: minutesRemaining,
            s: secondsRemaining,
            f: 0
        };
    }
    calculateEstimatedTimeOfArrival() {
        const ete = this.calculateEstimatedTimeEnroute();
        if (ete === null) {
            return null;
        }
        const now = new Date();
        now.setTime(now.getTime() + ete.h * 60 * 60 * 1000 + ete.i * 60 * 1000 + ete.s * 1000);
        return now;
    }
    formatValue(value, locale = null) {
        const options = {};
        let unitExt = '';
        if (this._unit) {
            if (this._unit == 'byte') {
                const byteUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
                let index = 0;
                while (value >= 1024 && index < byteUnits.length - 1) {
                    value /= 1024;
                    index++;
                }
                options.maximumFractionDigits = index === 0 ? 0 : 2;
                value = Progress.round(value, options.maximumFractionDigits);
                unitExt = ` ${byteUnits[index]}`;
            }
        }
        let valueString = value.toFixed(options.maximumFractionDigits ?? 0);
        if (locale) {
            if (options.maximumFractionDigits) {
                options.minimumFractionDigits = options.maximumFractionDigits;
            }
            valueString = new Intl.NumberFormat(locale, options).format(value);
        }
        return valueString + unitExt;
    }
    incrementCounter() {
        this._counter++;
        this.raiseEvent('change', this);
    }
    on(eventName, callback, options = {}) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push({ callback, options, internalData: {} });
    }
    raiseEvent(eventName, ...args) {
        if (this._events[eventName]) {
            this._events[eventName].forEach(evt => {
                if (typeof evt.options.updateIntervalMSThreshold === 'number' && evt.internalData.lastTimeEventFired) {
                    const now = new Date();
                    if (now.getTime() - evt.internalData.lastTimeEventFired.getTime() < evt.options.updateIntervalMSThreshold) {
                        return;
                    }
                }
                evt.internalData.lastTimeEventFired = new Date();
                evt.callback(...args);
            });
        }
    }
    static round(number, precision = 0) {
        const factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }
    setCounter(value) {
        if (value < 0) {
            throw new Error('Counter must be greater than or equal to 0');
        }
        this._counter = value;
        this.raiseEvent('change', this);
    }
    setTotalCount(value) {
        if (value < 0) {
            throw new Error('Total count must be greater than or equal to 0');
        }
        this._totalCount = value;
        this.raiseEvent('change', this);
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
            '${Counter}': this.formatValue(this._counter, this._locale),
            '${ElapsedTime}': `${String(elapsedTime.h).padStart(2, '0')}:${String(elapsedTime.i).padStart(2, '0')}:${String(elapsedTime.s).padStart(2, '0')}`,
            '${EstimatedTimeEnroute}': ete ? `${String(ete.h).padStart(2, '0')}:${String(ete.i).padStart(2, '0')}:${String(ete.s).padStart(2, '0')}` : 'N/A',
            '${EstimatedTimeOfArrival}': formattedETA,
            '${PercentageCompleted}': this.PercentageCompleted !== null ? this.PercentageCompleted.toFixed(2) : 'N/A',
            '${TotalCount}': this._totalCount ? this.formatValue(this._totalCount, this._locale) : '-',
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