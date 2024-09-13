/**
 * Describes an image using GPT 4o multi-modal capabilities.
 */
import * as path from "https://deno.land/std@0.214.0/path/mod.ts";
import { inspect, say } from "../../shared/cli.ts";
import { initOpenAI } from "../../shared/openai.ts";

const openai = initOpenAI();

// sent prompt to gpt and relay response

export function getModuleDirectory() {
    return path.dirname(path.fromFileUrl(import.meta.url));
}

const dir = getModuleDirectory();
// const data = await encodeImage(dir + "/./data/ninja_cat_sm.png");
// const dataURL = "data:image/png;base64," + data;

const dataURL = await imageToDataURL(dir + "/./data/ninja_cat_sm.png");

console.log(dataURL.slice(0, 100));

async function main() {
    const response = await openai.chat.completions.create({
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
                            // "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                        },
                    },
                ],
            },
        ],
    });

    console.log(response.choices[0].message.content);
}
main();

import { extname } from "https://deno.land/std/path/mod.ts";
import { contentType } from "https://deno.land/std/media_types/mod.ts";
import { encodeBase64 } from "https://deno.land/std/encoding/base64.ts";

async function imageToDataURL(path) {
    const data = await Deno.readFile(path);
    const mimeType = contentType(extname(path)) || "application/octet-stream";
    const base64Data = encodeBase64(data);
    return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Encodes an image file to a base64 string.
 * drafted by claude 3.5 sonnet 2024/09/12
 * improved by hand
 * @param {string} imagePath - The file path of the image to encode.
 * @returns {Promise<string>} A promise that resolves to the base64 encoded string.
 */
/*
async function encodeImage(imagePath) {
    // Read the entire file into memory as a Uint8Array
    // Deno.readFile returns a Promise that resolves to a Uint8Array
    const imageData = await Deno.readFile(imagePath);

    // Convert the Uint8Array to a base64 encoded string
    return btoa(
        imageData
            // Use reduce to iterate over each byte in the array
            .reduce(
                // Convert each byte to its corresponding ASCII character
                (data, byte) => data + String.fromCharCode(byte),
                // Start with an empty string as the initial value
                "",
            ),
    );
}
    */
