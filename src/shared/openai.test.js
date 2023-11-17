import { jest } from "@jest/globals";

import { gptPrompt } from "./openai";

// beforeAll(() => {
//   jest.spyOn(console, "log").mockImplementation(console.log);
// });

// afterAll(() => {
//   console.log.mockRestore();
// });

test("basic", () => {
  expect(1).toBe(1);
});

test("gptPrompt returns a string when called with a simple prompt", async () => {
  const prompt = "Test prompt";

  const result = await gptPrompt(prompt);

  console.log("result", result);

  expect(typeof result).toBe("string");
  expect(result.length).toBeGreaterThan(0);
}, 10000);
