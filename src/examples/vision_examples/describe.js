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

say(`GPT Response: ${response.content}`);
