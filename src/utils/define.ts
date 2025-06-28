import type { PromptDefinition } from '../types/prompt.js';
import type { ToolDefinition } from '../types/tool.js';

export const defineTool = (
	name: string,
	tool: Omit<ToolDefinition, 'name'>,
): ToolDefinition => ({ name, ...tool });

export const definePrompt = (
	name: string,
	prompt: Omit<PromptDefinition, 'name'>,
): PromptDefinition => ({ name, ...prompt });
