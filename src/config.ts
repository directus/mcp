import dotenv from 'dotenv';
import * as z from 'zod';
import { DEFAULT_SYSTEM_PROMPT } from './constants/default-prompts.js';
import { nullableString } from './types/common.js';

const configSchema = z
	.object({
		DIRECTUS_URL: z.string().describe('The URL of the Directus instance.'),
		DIRECTUS_TOKEN: nullableString().describe(
			'The user token for the Directus instance.',
		),
		DIRECTUS_USER_EMAIL: nullableString().describe(
			'The email of the user to login with.',
		),
		DIRECTUS_USER_PASSWORD: nullableString().describe(
			'The password of the user to login with.',
		),
		DISABLE_TOOLS: z
			.string()
			.default('["delete-item"]')
			.transform((val) => JSON.parse(val))
			.pipe(z.array(z.string()))
			.describe("Disable specific tools by name. Defaults to ['delete-item']"),
		MCP_SYSTEM_PROMPT_ENABLED: z
			.string()
			.optional()
			.default('true')
			.describe('Enable a tailored system prompt for the MCP server.'),
		MCP_SYSTEM_PROMPT: nullableString().describe(
			'Overwrite the default system prompt for the MCP server. Will load into the context before you use any other Directus tools.',
		).default(DEFAULT_SYSTEM_PROMPT),
		DIRECTUS_PROMPTS_COLLECTION_ENABLED: z
			.string()
			.optional()
			.default('false')
			.describe('Enable MCP prompts.'),
		DIRECTUS_PROMPTS_COLLECTION: nullableString().describe(
			'The Directus collection to store LLM prompts in.',
		),
		DIRECTUS_PROMPTS_NAME_FIELD: nullableString().default('name').describe(
			'The name of the field that contains the prompt name.',
		),
		DIRECTUS_PROMPTS_DESCRIPTION_FIELD: nullableString().default('description').describe(
			'The name of the field that contains the prompt description.',
		),
		DIRECTUS_PROMPTS_SYSTEM_PROMPT_FIELD: nullableString().default('system_prompt').describe(
			'The name of the field that contains the prompt.',
		),
		DIRECTUS_PROMPTS_MESSAGES_FIELD: nullableString().default('messages').describe(
			'The name of the field that contains the prompt messages.',
		),
	})
	.refine(
		(data) => {
			return (
				!!data.DIRECTUS_TOKEN
				|| (!!data.DIRECTUS_USER_EMAIL && !!data.DIRECTUS_USER_PASSWORD)
			);
		},
		{
			message:
				'Either DIRECTUS_TOKEN or both DIRECTUS_USER_EMAIL and DIRECTUS_USER_PASSWORD must be provided.',
			path: ['DIRECTUS_TOKEN'],
		},
	);

export const createConfig = () => {
	dotenv.config();

	return configSchema.parse(process.env);
};

export type Config = z.infer<typeof configSchema>;
