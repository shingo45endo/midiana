import {bytesToHex, stripEnclosure, calcCheckSumRol, isCheckSumValid} from '../utilities.js';
import {as14bitBE} from '../converters.js';

const mfrIdHex = '43';

export function makeYamahaXgParser(modelProp) {
	const {modelId, subModelId, modelName, address} = modelProp;

	console.assert(Array.isArray(modelId) && modelId.slice(0, modelId.length - 1).every((e) => e === 0x7f));
	console.assert(address === undefined || typeof address === 'string' || (Array.isArray(address) && address.length > 0 && address.every((e) => typeof e === 'string')));

	const modelIdHex = bytesToHex(modelId);
	const subModelIdHex = (subModelId) ? bytesToHex([subModelId]) : '';
	const addrReStr = (typeof address === 'string') ? address : (Array.isArray(address)) ? `(?:${address.join('|')})` : '.. .. ..';

	const commandNames = {
		0x00: 'Bulk Dump',
		0x10: 'Parameter Change',
		0x20: 'Bulk Dump Request',
		0x30: 'Parameter Request',
	};

	const parsers = [];
	for (const commandId of modelProp.commands) {
		const commandReStr = `${bytesToHex([commandId])[0]}.`;

		let regexp, handler;
		switch (commandId) {
		case 0x00: // Bulk Dump
			regexp = new RegExp(String.raw`^f0 43 ${commandReStr} ${modelIdHex} .. ..${(subModelIdHex) ? ` ${subModelIdHex}` : ''} ${addrReStr} (?:.. )+.. f7$`, 'u');
			handler = ((modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandName) => {
				const subModelObj = (subModelIdHex) ? {subModelId, subModelIdHex} : {};
				const idKey = ((subModelId) ? [mfrIdHex, modelIdHex, subModelIdHex] : [mfrIdHex, modelIdHex]).join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x43 && (deviceId & 0xf0) === commandId);
					index += 3 + modelId.length;

					const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

					const dataSize = as14bitBE(...bytes.slice(index, index + 2));
					index += 2;

					if (subModelId) {
						console.assert(bytes[index] === subModelId);
						index++;
					}

					const address = bytes.slice(index, index + 3);
					index += 3;

					const rawValues = bytes.slice(index, -2);
					const checkSum = bytes[bytes.length - 2];

					return {
						mfrId, deviceId, modelId, modelIdHex, ...subModelObj, modelName, commandName, address, dataSize, rawValues, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: idKey, _paramKeys: ['address'], _valueKeys: ['rawValues'],
					};
				};
			})(modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x10: // Parameter Change
			regexp = new RegExp(String.raw`^f0 43 ${commandReStr} ${modelIdHex}${(subModelIdHex) ? ` ${subModelIdHex}` : ''} ${addrReStr} (?:.. )+f7$`, 'u');
			handler = ((modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandName) => {
				const subModelObj = (subModelIdHex) ? {subModelId, subModelIdHex} : {};
				const idKey = ((subModelId) ? [mfrIdHex, modelIdHex, subModelIdHex] : [mfrIdHex, modelIdHex]).join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x43 && (deviceId & 0xf0) === commandId);
					index += 3 + modelId.length;

					if (subModelId) {
						console.assert(bytes[index] === subModelId);
						index++;
					}

					const address = bytes.slice(index, index + 3);
					index += 3;

					const rawValues = bytes.slice(index, -1);

					return {
						mfrId, deviceId, modelId, ...subModelObj, modelName, commandName, address, rawValues,
						_idKey: idKey, _paramKeys: ['address'], _valueKeys: ['rawValues'],
					};
				};
			})(modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x20: // Bulk Dump Request
		case 0x30: // Parameter Request
			regexp = new RegExp(String.raw`^f0 43 ${commandReStr} ${modelIdHex}${(subModelIdHex) ? ` ${subModelIdHex}` : ''} .. .. .. f7$`, 'u');
			handler = ((modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandName) => {
				const subModelObj = Number.isInteger(subModelId) ? {subModelId} : {};
				const idKey = ((subModelId) ? [mfrIdHex, modelIdHex, subModelIdHex] : [mfrIdHex, modelIdHex]).join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x43 && (deviceId & 0xf0) === commandId);
					index += 3 + modelId.length;

					if (subModelId) {
						console.assert(bytes[index] === subModelId);
						index++;
					}

					const address = bytes.slice(index, index + 3);

					return {
						mfrId, deviceId, modelId, ...subModelObj, modelName, commandName, address,
						_idKey: idKey, _paramKeys: ['address'],
					};
				};
			})(modelId, modelIdHex, subModelId, subModelIdHex, modelName, commandNames[commandId]);
			break;

		default:
			continue;
		}

		const key = regexp.source.replace(addrReStr, '.. .. ..').replace(/ \.\..*$/u, '').replace('.', '0').replace(/[^0-9a-f ]/ug, '');
		parsers.push({key, regexp, handler});
	}

	return parsers;
}
