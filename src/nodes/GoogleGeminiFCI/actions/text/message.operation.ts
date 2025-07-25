import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { updateDisplayOptions } from 'n8n-workflow';

import type { GenerateContentResponse, Content, Tool } from '../../helpers/interfaces';
import { apiRequest } from '../../transport';
import { modelRLC } from '../descriptions';

const properties: INodeProperties[] = [
	modelRLC('modelSearch'),
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'fixedCollection',
		typeOptions: {
			sortable: true,
			multipleValues: true,
		},
		placeholder: 'Add Message',
		default: { values: [{ content: '' }] },
		options: [
			{
				displayName: 'Values',
				name: 'values',
				values: [
					{
						displayName: 'Prompt',
						name: 'content',
						type: 'string',
						description: 'The content of the message to be send',
						default: '',
						placeholder: 'e.g. Hello, how can you help me?',
						typeOptions: {
							rows: 2,
						},
					},
					{
						displayName: 'Role',
						name: 'role',
						type: 'options',
						description:
							"Role in shaping the model's response, it tells the model how it should behave and interact with the user",
						options: [
							{
								name: 'User',
								value: 'user',
								description: 'Send a message as a user and get a response from the model',
							},
							{
								name: 'Model',
								value: 'model',
								description: 'Tell the model to adopt a specific tone or personality',
							},
						],
						default: 'user',
					},
				],
			},
		],
	},
	{
		displayName: 'Simplify Output',
		name: 'simplify',
		type: 'boolean',
		default: true,
		description: 'Whether to return a simplified version of the response instead of the raw data',
	},
	{
		displayName: 'Output Content as JSON',
		name: 'jsonOutput',
		type: 'boolean',
		description: 'Whether to attempt to return the response in JSON format',
		default: false,
	},
	{
		displayName: 'Options',
		name: 'options',
		placeholder: 'Add Option',
		type: 'collection',
		default: {},
		options: [
			{
				displayName: 'System Message',
				name: 'systemMessage',
				type: 'string',
				default: '',
				placeholder: 'e.g. You are a helpful assistant',
			},
			{
				displayName: 'Code Execution',
				name: 'codeExecution',
				type: 'boolean',
				default: false,
				description: 'Whether to enable code execution',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				description: 'Controls randomness in the response',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberStepSize: 0.1,
				},
			},
			{
				displayName: 'Top P',
				name: 'topP',
				type: 'number',
				default: 0.95,
				description: 'Controls diversity via nucleus sampling',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberStepSize: 0.05,
				},
			},
			{
				displayName: 'Top K',
				name: 'topK',
				type: 'number',
				default: 40,
				description: 'Controls diversity via top-k sampling',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Max Output Tokens',
				name: 'maxOutputTokens',
				type: 'number',
				default: 2048,
				description: 'Maximum number of tokens to generate',
				typeOptions: {
					minValue: 1,
					maxValue: 8192,
				},
			},
			{
				displayName: 'Candidate Count',
				name: 'candidateCount',
				type: 'number',
				default: 1,
				description: 'Number of response candidates to generate',
				typeOptions: {
					minValue: 1,
					maxValue: 4,
				},
			},
			{
				displayName: 'Frequency Penalty',
				name: 'frequencyPenalty',
				type: 'number',
				default: 0,
				description: 'Reduces repetition of common tokens',
				typeOptions: {
					minValue: -2,
					maxValue: 2,
					numberStepSize: 0.1,
				},
			},
			{
				displayName: 'Presence Penalty',
				name: 'presencePenalty',
				type: 'number',
				default: 0,
				description: 'Reduces repetition of any token',
				typeOptions: {
					minValue: -2,
					maxValue: 2,
					numberStepSize: 0.1,
				},
			},
			{
				displayName: 'Max Tools Iterations',
				name: 'maxToolsIterations',
				type: 'number',
				default: 15,
				description: 'Maximum number of tool call iterations',
				typeOptions: {
					minValue: 0,
					maxValue: 50,
				},
			},
		],
	},
];

const displayOptions = {
	show: {
		operation: ['message'],
		resource: ['text'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

function getToolCalls(response: GenerateContentResponse) {
	return response.candidates
		?.flatMap((candidate) => candidate.content.parts)
		?.filter((part) => 'functionCall' in part)
		?.map((part) => (part as any).functionCall) ?? [];
}

export async function execute(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const model = this.getNodeParameter('modelId', i, '', { extractValue: true }) as string;
	const messages = this.getNodeParameter('messages.values', i, []) as Array<{
		content: string;
		role: string;
	}>;
	const simplify = this.getNodeParameter('simplify', i, true) as boolean;
	const jsonOutput = this.getNodeParameter('jsonOutput', i, false) as boolean;
	const options = this.getNodeParameter('options', i, {});

	const generationConfig = {
		frequencyPenalty: options.frequencyPenalty,
		maxOutputTokens: options.maxOutputTokens,
		candidateCount: options.candidateCount,
		presencePenalty: options.presencePenalty,
		temperature: options.temperature,
		topP: options.topP,
		topK: options.topK,
		responseMimeType: jsonOutput ? 'application/json' : undefined,
	};

	const tools: Tool[] = [];

	if (options.codeExecution) {
		tools.push({
			codeExecution: {},
		});
	}

	const contents: Content[] = messages.map((m) => ({
		parts: [{ text: m.content }],
		role: m.role,
	}));
	const body = {
		tools,
		contents,
		generationConfig,
		systemInstruction: options.systemMessage
			? { parts: [{ text: options.systemMessage }] }
			: undefined,
	};

	let response = (await apiRequest.call(this, 'POST', `/v1beta/${model}:generateContent`, {
		body,
	})) as GenerateContentResponse;

	if (simplify) {
		return response.candidates.map((candidate) => ({
			json: candidate,
			pairedItem: { item: i },
		}));
	}

	return [
		{
			json: { ...response },
			pairedItem: { item: i },
		},
	];
}
