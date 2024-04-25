// url_test.ts
import { assertEquals, assertLessOrEqual } from "https://deno.land/std@0.223.0/assert/mod.ts";
import Progress from '../src/ts/Progress.ts';

Deno.test("default values for a new instance", () => {
    const testStartTime = new Date();
    const progress = new Progress();
    assertLessOrEqual(progress.ElapsedTime.s, 1);
    const diffTime = progress.StartTime.getTime() - testStartTime.getTime();
    assertLessOrEqual(diffTime, 1)

    assertEquals(progress.Counter, 0);
    assertEquals(progress.TotalCount, null);
    assertEquals(progress.PercentageCompleted, null);
    assertEquals(progress.calculateEstimatedTimeEnroute(), null);
    assertEquals(progress.calculateEstimatedTimeOfArrival(), null);
});
