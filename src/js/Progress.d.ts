type EventOptions = {
    updateIntervalMSThreshold?: number;
};
export default class Progress {
    static readonly DEFAULT_TO_STRING_FORMAT: string;
    private _counter;
    private _events;
    private _locale;
    private _startTime;
    private _totalCount;
    private _unit;
    constructor(totalCount?: number | null, locale?: string | null, unit?: string | null);
    get Counter(): number;
    get ElapsedTime(): {
        y: number;
        m: number;
        d: number;
        h: number;
        i: number;
        s: number;
        f: number;
    };
    get PercentageCompleted(): number | null;
    get StartTime(): Date;
    get TotalCount(): number | null;
    calculateEstimatedTimeEnroute(): {
        hours: number;
        minutes: number;
        seconds: number;
    } | null;
    calculateEstimatedTimeOfArrival(): Date | null;
    private formatValue;
    incrementCounter(): void;
    on(eventName: string, callback: Function, options?: EventOptions): void;
    private raiseEvent;
    private static round;
    setCounter(value: number): void;
    setTotalCount(value: number): void;
    toFormattedString(format?: string): string;
}
export {};
