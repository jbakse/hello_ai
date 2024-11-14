/**
 * Describes an image using GPT 4o multi-modal capabilities.
 */

// set up logging level
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
setLogLevel(LogLevel.LOG);

import { say } from "../../shared/cli.ts";
import { gpt } from "../../shared/openai.ts";

// open file relative to this script, convert to data URL
const pathname = new URL("./data/ninja_cat_sm.png", import.meta.url).pathname;
const dataURL = await imageToDataURL(pathname);
console.log(dataURL.slice(0, 50));

// send it to gpt for description
const response = await gpt(
  {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe the background in detail.",
          },
          {
            type: "image_url",
            image_url: {
              "url": dataURL,
            },
          },
        ],
      },
    ],
  },
);

say(response.content);

/// Library funciton to convert image to data URL
import { extname } from "https://deno.land/std@0.211.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.211.0/encoding/base64.ts";

/**
 * Converts an image file to a data URL.
 * @param {string} path - The path to the image file.
 * @returns {Promise<string>} The data URL.
 */
async function imageToDataURL(path) {
  const data = await Deno.readFile(path);
  const mimeType = contentType(extname(path)) || "application/octet-stream";
  const base64Data = encodeBase64(data);
  return `data:${mimeType};base64,${base64Data}`;
}
