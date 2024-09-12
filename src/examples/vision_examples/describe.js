/**
 * Describes an image using GPT 4o multi-modal capabilities.
 */
import * as path from "https://deno.land/std@0.214.0/path/mod.ts";
import { say } from "../../shared/cli.ts";
import { gpt } from "../../shared/openai.ts";

// sent prompt to gpt and relay response

export function getModuleDirectory() {
    return path.dirname(path.fromFileUrl(import.meta.url));
}

const dir = getModuleDirectory();
console.log(dir);
const dataURL = await pngToBase64DataUrl(dir + "/./data/ninja_cat.png");
const response = await gpt({
    messages: [
        {
            role: "user",
            content: [
                { "type": "text", "text": "Just say 'yes'." },
                { "type": "image_url", "url": dataURL },
            ],
        },
    ],
});

say(`GPT Response: ${response.content}`);

/**
 * Converts an image file to a base64 data URL.
 * @param {string} imagePath - The path to the image file.
 * @returns {Promise<string>} - A promise that resolves to the base64 data URL.
 */
async function pngToBase64DataUrl(imagePath) {
    console.log(imagePath);
    const imageBuffer = await Deno.readFile(imagePath);
    console.log(imageBuffer);
    const base64Image = btoa(
        String.fromCharCode(...new Uint8Array(imageBuffer)),
    );
    const mimeType = "image/png"; // Change this to the correct MIME type if needed
    return `data:${mimeType};base64,${base64Image}`;
}
