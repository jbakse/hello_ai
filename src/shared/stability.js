// import fs from "fs";

// export async function makeImageStability(prompt, c = {}) {
//   const path =
//     "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

//   const headers = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: `Bearer ${secrets.stabilityKey}`,
//   };

//   const body = {
//     steps: 30,
//     width: 1024,
//     height: 1024,
//     seed: 0,
//     cfg_scale: 5,
//     samples: 1,
//     // style_preset: "fantasy-art",
//     // clip_guidance_preset: "FAST_BLUE",
//     text_prompts: [
//       {
//         text: prompt,
//         weight: 1,
//       },
//     ],
//   };

//   const response = await fetch(path, {
//     headers,
//     method: "POST",
//     body: JSON.stringify(body),
//   });

//   if (!response.ok) {
//     throw new Error(`Non-200 response: ${await response.text()}`);
//   }

//   const responseJSON = await response.json();

//   responseJSON.artifacts.forEach((image, index) => {
//     fs.writeFileSync(
//       `./out/txt2img_${image.seed}.png`,
//       Buffer.from(image.base64, "base64"),
//     );
//   });
// }
