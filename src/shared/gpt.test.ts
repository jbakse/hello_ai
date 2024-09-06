import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { gptPrompt } from "./openai.ts";
import * as log from "./logger.ts";

log.setLogLevel(log.LogLevel.WARN);

Deno.test("gptPrompt returns expected response", async () => {
  const prompt = "say one word all lowercase: apple";
  const response = await gptPrompt(prompt);
  assertEquals(response, "apple");
});
