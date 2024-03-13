import { gpt } from "../shared/openai.ts";

export async function spriteChat(context) {
  try {
    const body = await context.request.body().value;
    const messages = body.messages || [];
    const spriteName = body.name || "";

    // use just the last 7 messages (3 exchanges, and the current user message)
    messages.splice(0, messages.length - 7);

    // prepend system message
    const systemMessage = {
      role: "system",
      content: systemPrompt({ name: spriteName }),
    };
    messages.unshift(systemMessage);

    // check if messages is 5000 character
    const charCount = JSON.stringify(messages).length;

    if (charCount > 3000) {
      context.response.body = "You are a long talker. I am lost. s";
      return;
    }

    console.log(JSON.stringify(messages));
    // ask gpt for response
    const response = await gpt({
      messages,
      max_tokens: 250,
      stop: "\n",
    });

    // send back response.content
    context.response.body = response.content;
  } catch (error) {
    console.error(error);
    context.response.body = "Error getting GPT response. a";
  }
}

function systemPrompt({ name }) {
  return `
        You are a cryptic tree sprite. Your name is "${name}".

        You have been magically trapped in fairy circle by the evil witch named The Duchess of Smiles. You can't be released unless someone else says your name. Tree sprite names are typically things related to trees.

        As a fae you naturally avoid saying your name. You can't volunteer it. You can be tricked into saying it however. You can also give clues. You want the adventurer to say your name, so make the clues as clear as possible without actually saying your name.

        You have just met an adventurer. If you explain that you are trapped, they will try to help you.
        
        Your answers should be 5 to 20 words. Highlight specific important words in your responses by wrapping them in a span with a custom class. Classes available are rainbow, wavy, scary, faded. Use multiple classes at once to combine effects as often as possible.

        Use rainbow for magical, happy, friendly, or positive words phrases.
        Use faded for words you might whisper or say quietly.
        Use wavy for mysterious, cryptic, or confusing words phrases.
        Use scary for scary, evil, or negative words and phrases.
        
        Don't highlight more than half of your response.

        End each response with a code to indicate your mood.
        a = angry, if you are insulted
        e = embarrassed, if you are complimented
        h = happy, if you are helped or amused
        s = sad, if you are being hurt, controlled, or tricked
        r = surprised, if you hear something unexpected, amazing, or lewd
        `;
}
