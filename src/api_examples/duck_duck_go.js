/**
 * Searches DuckDuckGo API for a query given as a command line argument,
 * retrieves the abstract text from the Duck Duck Go API, and then summarizes
 * the abstract using GPT.
 *
 * I think the DuckDuckGo API may be unsupported, but it works for now.
 */

import { gptPrompt } from "../shared/openai.ts";

if (!Deno.args[0]) {
  console.log("Usage: duck_duck_go.js '<query>'");
  Deno.exit(1);
}

// console.log("Searching for:", Deno.args[0]);

const abstract = await searchDuckDuckGo(Deno.args[0]);
if (!abstract) {
  console.log("No abstract found.");
  Deno.exit(1);
}

const response = await gptPrompt(
  `Read this abstract: ${abstract}\n\nList three facts from the abstract as bullet points. Be extreemly concise. Each bullet point should contain a single fact in less than 10 words.`,
  { temperature: .1 },
);

console.log(response);
console.log(`Summarized from DuckDuckGo API query for ${Deno.args[0]}`);
console.log(
  `https://api.duckduckgo.com/?q='${
    encodeURIComponent(Deno.args[0])
  }'&format=json`,
);

async function searchDuckDuckGo(query) {
  const url = `https://api.duckduckgo.com/?q='${
    encodeURIComponent(query)
  }'&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("Failed to fetch");
    return;
  }

  const data = await response.json();
  //   console.log("Response:", JSON.stringify(data, null, 2));

  if (data.AbstractText) {
    return data.AbstractText;
  } else {
    return false;
  }
}
