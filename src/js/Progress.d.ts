export default class Progress {
    static readonly DEFAULT_TO_STRING_FORMAT: string;
    private _counter;
    private _events;
    private _startTime;
    private _totalCount;
    constructor(totalCount?: number | null);
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
    incrementCounter(): void;
    on(eventName: string, callback: Function): void;
    setCounter(value: number): void;
    toFormattedString(format?: string): string;
}
