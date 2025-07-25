import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

type RequestParameters = {
	headers?: IDataObject;
	body?: IDataObject | string;
	qs?: IDataObject;
	option?: IDataObject;
};

export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	parameters?: RequestParameters,
) {
	const { body, qs, option, headers } = parameters ?? {};

	const serverUrl = this.getNodeParameter('serverUrl', 0) as string || 'https://generativelanguage.googleapis.com';
	const apiKey = this.getNodeParameter('apiKey', 0) as string;

	if (!apiKey) {
		throw new Error('API Key é obrigatória');
	}

	const url = `${serverUrl}${endpoint}`;

	const options = {
		headers: {
			'Content-Type': 'application/json',
			...headers,
		},
		method,
		body,
		qs: {
			key: apiKey,
			...qs,
		},
		url,
		json: true,
	};

	if (option && Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	return await this.helpers.httpRequest(options);
}
