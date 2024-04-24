type DateInterval = {
    y: number;
    m: number;
    d: number;
    h: number;
    i: number;
    s: number;
    f: number;
};
type EventOptions = {
    updateIntervalMSThreshold?: number;
};
/**
 * A class for handling progress
 */
export default class Progress {
    static readonly DEFAULT_TO_STRING_FORMAT: string;
    /**
     * @ignore
     */
    private _counter;
    /**
     * @ignore
     */
    private _events;
    /**
     * @ignore
     */
    private _locale;
    /**
     * @ignore
     */
    private _startTime;
    /**
     * @ignore
     */
    private _totalCount;
    /**
     * @ignore
     */
    private _unit;
    constructor(totalCount?: number | null, locale?: string | null, unit?: string | null);
    /**
     * Gets the current counter value
     */
    get Counter(): number;
    /**
     * Gets the elapsed time since the progress was started
     */
    get ElapsedTime(): DateInterval;
    /**
     * Gets the percentage of the progress that has been completed
     */
    get PercentageCompleted(): number | null;
    /**
     * Gets the start time of the progress
     */
    get StartTime(): Date;
    /**
     * Gets the total count of the progress
     */
    get TotalCount(): number | null;
    /**
     * Calculatees the estimated time enroute
     */
    calculateEstimatedTimeEnroute(): DateInterval | null;
    /**
     * Calculates the estimated time of arrival
     */
    calculateEstimatedTimeOfArrival(): Date | null;
    /**
     * @ignore
     */
    private formatValue;
    /**
     * Increments the counter by 1
     */
    incrementCounter(): void;
    /**
     * Adds an event listener
     *
     * ```typescript
     * const progress = new Progress();
     * progress.on('change', (progress) => {
     *    console.log(progress.toFormattedString());
     * });
     * progress.incrementCounter(); // fires the 'change' event
     * ```
     */
    on(eventName: string, callback: (progress: Progress) => void, options?: EventOptions): void;
    /**
     * @ignore
     */
    private raiseEvent;
    /**
     * @ignore
     */
    private static round;
    /**
     * Sets the counter to a specific value
     */
    setCounter(value: number): void;
    /**
     * Sets the total count of the progress
     */
    setTotalCount(value: number): void;
    /**
     * Converts the progress to a formatted string
     */
    toFormattedString(format?: string): string;
}
export {};
