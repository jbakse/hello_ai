import { roundToDecimalPlaces } from "./util.ts";
import { assertEquals } from "https://deno.land/std@0.214.0/assert/assert_equals.ts";

Deno.test("roundToDecimalPlaces rounds to default min and max decimal places", () => {
  assertEquals(roundToDecimalPlaces(1.234567), "1.23");
});

Deno.test("roundToDecimalPlaces uses default max equal to min when only min is specified", () => {
  assertEquals(roundToDecimalPlaces(1.234567, 3), "1.235");
});

Deno.test("roundToDecimalPlaces rounds to min decimal places", () => {
  assertEquals(roundToDecimalPlaces(1.20000, 2, 4), "1.20");
});

Deno.test("roundToDecimalPlaces handles whole numbers", () => {
  assertEquals(roundToDecimalPlaces(1, 2, 4), "1.00");
});

Deno.test("roundToDecimalPlaces handles numbers with fewer decimals than min", () => {
  assertEquals(roundToDecimalPlaces(1.2, 3, 4), "1.200");
});

Deno.test("roundToDecimalPlaces handles numbers with more decimals than max", () => {
  assertEquals(roundToDecimalPlaces(1.23456789, 2, 4), "1.2346");
});
