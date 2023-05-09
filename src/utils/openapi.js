import {Configuration, OpenAIApi} from "openai";
import {config} from "../config.js";

const configuration = new Configuration({
    apiKey: config.openapi.apiKey,
});

const openai = new OpenAIApi(configuration);

/**
 *
 * @param content
 * @returns {Promise<string>}
 */
export async function openAiTransport(content) {
    console.log({content})
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content}],
    });
    return completion.data.choices[0].message.content
}