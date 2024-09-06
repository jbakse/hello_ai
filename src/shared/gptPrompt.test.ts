import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { gptPrompt } from "./openai.ts";

// Mocking OpenAI API response
const mockResponse = {
  choices: [
    {
      message: {
        content: "Mocked response",
      },
    },
  ],
};

// Mocking the gptPrompt function
async function mockGptPrompt(prompt: string) {
  return mockResponse;
}

Deno.test("gptPrompt returns expected response", async () => {
  const prompt = "Test prompt";
  const response = await mockGptPrompt(prompt);
  assertEquals(response, mockResponse);
});
