/**
 * Describes an image using GPT 4o multi-modal capabilities.
 */

import { say } from "../../shared/cli.ts";
import { gpt } from "../../shared/openai.ts";

// sent prompt to gpt and relay response
const response = await gpt({
    messages: [
        {
            role: "user",
            content: [
                { "type": "text", "text": "Just say 'yes'." },
                { "type": "image_url", "url": data },
            ],
        },
    ],
});

/**
 * Converts an image file to a base64 data URL.
 * @param {string} imagePath - The path to the image file.
 * @returns {Promise<string>} - A promise that resolves to the base64 data URL.
 */
async function imageToBase64DataUrl(imagePath) {
    const imageBuffer = await Deno.readFile(imagePath);
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const mimeType = "image/png"; // Change this to the correct MIME type if needed
    return `data:${mimeType};base64,${base64Image}`;
}

say(`GPT Response: ${response.content}`);
