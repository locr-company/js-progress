# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2024-03-22

### Fixed

- method toFormattedString(), so that output with fractions has a fixed size of 2.

## [1.1.0] - 2024-03-22

### Added

- This CHANGELOG file.
- localization and formatting byte units.
- method: setTotalCount(value: number): void

### Changed

- constructor signature: constructor(totalCount?: number | null, locale?: string | null, unit?: string | null)
- method signature (added options): on(eventName: string, callback: Function, options: { updateIntervalMSThreshold?: number } | undefined = undefined): void

## [1.0.0] - 2024-03-21

### Added

- constructor: constructor(totalCount: number | null = null).
- method: calculateEstimatedTimeEnroute(): {hours: number, minutes: number, seconds: number} | null
- method: calculateEstimatedTimeOfArrival(): Date | null
- method: incrementCounter()
- method: on(eventName: string, callback: Function): void
- method: setCounter(value: number): void
- method: toFormattedString(format: string = Progress.DEFAULT_TO_STRING_FORMAT): string
- property: Counter: number
- property: ElapsedTime: { y: number, m: number, d: number, h: number, i: number, s: number, f: number }
- property: PercentageCompleted: number | null
- property: StartTime: Date
- property: TotalCount: number | null

[unreleased]: https://github.com/locr-company/js-progress/compare/v1.0.0...HEAD
[1.1.1]: https://github.com/locr-company/js-progress/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/locr-company/js-progress/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/locr-company/js-progress/releases/tag/v1.0.0