import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { promptGPT } from "./openai.ts";
import * as log from "./logger.ts";

log.setLogLevel(log.LogLevel.WARN);

Deno.test("gptPrompt returns expected response", async () => {
  const prompt = "say this one word in all lowercase: apple";
  const response = await promptGPT(prompt);
  assertEquals(response, "apple");
});
