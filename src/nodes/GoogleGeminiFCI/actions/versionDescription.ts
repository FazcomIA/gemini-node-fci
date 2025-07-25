/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { type INodeTypeDescription } from 'n8n-workflow';

import * as audio from './audio';
import * as document from './document';
import * as file from './file';
import * as image from './image';
import * as text from './text';
import * as video from './video';

export const versionDescription: INodeTypeDescription = {
	displayName: 'Google Gemini - FCI',
	name: 'googleGeminiFCI',
	icon: 'file:icons/gemini.svg',
	group: ['transform'],
	version: 1,
	subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	description: 'Interact with Google Gemini AI models using direct URL and API Key',
	defaults: {
		name: 'Google Gemini - FCI',
	},
	usableAsTool: true,
	codex: {
		alias: ['LangChain', 'video', 'document', 'audio', 'transcribe', 'assistant'],
		categories: ['AI'],
		subcategories: {
			AI: ['Agents', 'Miscellaneous', 'Root Nodes'],
		},
		resources: {
			primaryDocumentation: [
				{
					url: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.googlegemini/',
				},
			],
		},
	},
	inputs: `={{
		(() => {
			const resource = $parameter.resource;
	  	const operation = $parameter.operation;
			if (resource === 'text' && operation === 'message') {
				return [{ type: 'main' }, { type: 'ai_tool', displayName: 'Tools' }];
			}

			return ['main'];
		})()
	}}`,
	outputs: `={{
		(() => {
			const resource = $parameter.resource;
			const operation = $parameter.operation;
			if (resource === 'text' && operation === 'message') {
				return ['main'];
			}
			return ['main'];
		})()
	}}`,
	properties: [
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'string',
			default: 'https://generativelanguage.googleapis.com',
			placeholder: 'https://generativelanguage.googleapis.com',
			description: 'URL da API do Google Gemini',
			required: true,
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: { password: true },
			description: 'Chave da API do Google Gemini',
			required: true,
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Audio',
					value: 'audio',
				},
				{
					name: 'Document',
					value: 'document',
				},
				{
					name: 'File',
					value: 'file',
				},
				{
					name: 'Image',
					value: 'image',
				},
				{
					name: 'Text',
					value: 'text',
				},
				{
					name: 'Video',
					value: 'video',
				},
			],
			default: 'text',
		},
		...audio.description,
		...document.description,
		...file.description,
		...image.description,
		...text.description,
		...video.description,
	],
};
