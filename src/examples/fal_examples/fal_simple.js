import * as fal from "npm:@fal-ai/serverless-client";

import { loadEnv } from "../../shared/util.ts";
import * as log from "../../shared/logger.ts";

log.setLogLevel(log.LogLevel.DEBUG);

const env = loadEnv();
if (!env.FAL_API_KEY) log.warn("No FAL_API_KEY in .env file");
fal.config({
    credentials: env.FAL_API_KEY, // or a$function that returns a string
});

const result = await fal.subscribe("fal-ai/fast-lightning-sdxl", {
    input: {
        "prompt": "A dragon knitting a scarf.",
        "image_size": "square_hd",
        "num_inference_steps": 4,
        "num_images": 1,
        "enable_safety_checker": true,
        "seed": 1337,
    },
});

console.log(Deno.inspect(result));

console.log(result.images[0].url);
