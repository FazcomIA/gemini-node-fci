import { NodeOperationError, type IExecuteFunctions, type INodeExecutionData } from 'n8n-workflow';

import * as audio from './audio';
import * as document from './document';
import * as file from './file';
import * as image from './image';
import * as text from './text';
import * as video from './video';

export async function router(this: IExecuteFunctions) {
	const returnData: INodeExecutionData[] = [];

	const items = this.getInputData();
	const resource = this.getNodeParameter('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	let execute: any;
	switch (resource) {
		case 'audio':
			execute = (audio as any)[operation]?.execute;
			break;
		case 'document':
			execute = (document as any)[operation]?.execute;
			break;
		case 'file':
			execute = (file as any)[operation]?.execute;
			break;
		case 'image':
			execute = (image as any)[operation]?.execute;
			break;
		case 'text':
			execute = (text as any)[operation]?.execute;
			break;
		case 'video':
			execute = (video as any)[operation]?.execute;
			break;
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The resource "${resource}" is not known!`,
			);
	}

	if (!execute) {
		throw new NodeOperationError(
			this.getNode(),
			`The operation "${operation}" is not supported for resource "${resource}"!`,
		);
	}

	for (let i = 0; i < items.length; i++) {
		try {
			const responseData = await execute.call(this, i);
			returnData.push(...responseData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				continue;
			}

			throw new NodeOperationError(this.getNode(), error as Error, {
				itemIndex: i,
				description: (error as any).description,
			});
		}
	}

	return returnData;
}
