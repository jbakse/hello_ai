import * as log from "./logger.ts";

type ModelCostsRecord = Record<
    string,
    { promptCost: number; completionCost: number }
>;

/**
 * Calculate the cost of a prompt and completion based on the model
 * @param model The model to calculate the cost for
 * @param prompt_tokens The number of tokens in the prompt
 * @param completion_tokens The number of tokens in the completion
 * @returns The cost of the prompt and completion in USD
 */
export function calculateCost(
    model: string,
    prompt_tokens: number,
    completion_tokens: number,
): number {
    // 2024-09-13
    // cost in USD per 1000 tokens for each model
    // https://openai.com/api/pricing/
    const model_costs: ModelCostsRecord = {
        "gpt-4o": { promptCost: 0.005, completionCost: 0.015 },
        "gpt-4o-2024-08-06": { promptCost: 0.0025, completionCost: 0.01 },
        "gpt-4o-2024-05-13": { promptCost: 0.005, completionCost: 0.015 },

        "gpt-4o-mini": { promptCost: 0.00015, completionCost: 0.0006 },
        "gpt-4o-mini-2024-07-18": {
            promptCost: 0.00015,
            completionCost: 0.0006,
        },

        "gpt-4-turbo": { promptCost: 0.0100, completionCost: 0.0300 },
        "gpt-4-turbo-2024-04-09": {
            promptCost: 0.0100,
            completionCost: 0.0300,
        },
        "gpt-4": { promptCost: 0.0300, completionCost: 0.0600 },
        "gpt-4-32k": { promptCost: 0.0600, completionCost: 0.1200 },
        "gpt-4-0125-preview": { promptCost: 0.0100, completionCost: 0.0300 },
        "gpt-4-1106-preview": { promptCost: 0.0100, completionCost: 0.0300 },
        "gpt-4-vision-preview": { promptCost: 0.0100, completionCost: 0.0300 },

        "gpt-3.5-turbo-0125": { promptCost: 0.0005, completionCost: 0.0015 },
        "gpt-3.5-turbo-instruct": {
            promptCost: 0.0015,
            completionCost: 0.0020,
        },
        "gpt-3.5-turbo-1106": { promptCost: 0.0010, completionCost: 0.0020 },
        "gpt-3.5-turbo-0613": { promptCost: 0.0015, completionCost: 0.0020 },
        "gpt-3.5-turbo-16k-0613": {
            promptCost: 0.0030,
            completionCost: 0.0040,
        },
        "gpt-3.5-turbo-0301": { promptCost: 0.0015, completionCost: 0.0020 },

        "davinci-002": { promptCost: 0.0020, completionCost: 0.0020 },
        "babbage-002": { promptCost: 0.0004, completionCost: 0.0004 },
    };

    if (model in model_costs) {
        const mc = model_costs[model];
        const prompt_cost = (prompt_tokens / 1000) * mc.promptCost;
        const completion_cost = (completion_tokens / 1000) * mc.completionCost;
        return (prompt_cost + completion_cost);
    } else {
        log.warn(`model ${model} not found in model_costs`);
        return 0;
    }
}
