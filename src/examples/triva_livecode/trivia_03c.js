/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import boxen from "npm:boxen@latest";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
import * as log from "../../shared/logger.ts";

// hide DEBUG and INFO logs
setLogLevel(LogLevel.LOG);

async function generateQuestions(topic) {
    const questionsString = await promptGPT(
        `Generate 4 questions for a triva game. Do not provide answers.
     Provide the questions as a javascript array of strings like this:
     ["question 1", "question 2", "question 3", "question 4"]. Do not include a code fence.
     Include only the array, start with [ and end with ].
     The topic is ${topic}.
    `,
        { max_tokens: 1024, temperature: 0.3 },
        {
            showStats: false,
            loadingMessage: "Generating questions...",
            successMessage: "Questions generated.",
        },
    );

    log.info("questionsString", questionsString);
    // gpt returns a string, we need to parse it to get a usable array
    let questions = [];
    try {
        questions = JSON.parse(questionsString);
        return questions;
    } catch (_e) {
        say(`Error parsing questions string: "${questionsString}"`);
        return [];
    }
}

async function evaluateAnswer(question, answer) {
    const response = await promptGPT(
        `The question was '${question}'.
    The provided answer was '${answer}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer yes or no. If no, provide the correct answer.
    `,
        { max_tokens: 64, temperature: 0.1 },
        {
            showStats: false,
            loadingMessage: "Evaluating...",
            successMessage: "",
        },
    );

    return response;
}

async function main() {
    // greet the player
    console.log(
        boxen("Welcome to Trivia!", {
            borderColor: "blue",

            borderStyle: "round",
            padding: 1,
        }),
    );

    // user configuration
    const topic = await ask("What do you want to be quized on?");

    // generate quiz
    const questions = await generateQuestions(topic);
    log.info("questions", questions);
    say("");

    // game loop
    for (const [i, question] of questions.entries()) {
        const questionNumber = colors.blue(
            `Question ${i + 1} of ${questions.length}`,
        );
        const answer = await ask(
            `${questionNumber} ${question}`,
        );
        const evaluation = await evaluateAnswer(question, answer);
        say(evaluation);
        say("");
    }
}

main();
