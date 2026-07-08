import {bytesToHex, stripEnclosure, calcCheckSumRol, isCheckSumValid} from '../utilities.js';

const modelProps = [
	// [1991-12-14 (Ver.1.00)] Yamaha TG100 (Tone Generator)
	{
		modelName: 'TG100',
		modelId: 0x27, commands: [0x10],
	},
	// [1993-10-05 (Ver.1.0)] Yamaha TG300 (Tone Generator)
	{
		modelName: 'TG300',
		modelId: 0x2b, commands: [0x10, 0x30],
	},
	// [1994-07-27 (Ver.1.00)] Yamaha MU5 (Tone Generator)
	{
		modelName: 'MU5',
		modelId: 0x44, commands: [0x10, 0x30],
	},
];

function makeYamahaGmParser(modelProp) {
	const {modelId, modelName, address} = modelProp;

	console.assert(address === undefined || typeof address === 'string' || (Array.isArray(address) && address.length > 0 && address.every((e) => typeof e === 'string')));

	const mfrIdHex = '43';
	const modelIdHex = bytesToHex([modelId]);
	const addrReStr = (typeof address === 'string') ? address : (Array.isArray(address)) ? `(?:${address.join('|')})` : '.. .. ..';

	const commandNames = {
		0x10: 'Parameter Change',
		0x30: 'Bulk Dump Request',
	};

	const parsers = [];
	for (const commandId of modelProp.commands) {
		const commandReStr = `${bytesToHex([commandId])[0]}.`;

		let regexp, handler;
		switch (commandId) {
		case 0x10: // Parameter Change
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandReStr} ${modelIdHex} ${addrReStr} (?:.. )+.. f7$`, 'u');
			handler = ((modelId, modelName, commandName) => {
				const idKey = [mfrIdHex, bytesToHex([modelId])].join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId, modelId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x43 && (deviceId & 0xf0) === commandId);
					index += 4;

					const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

					const address = bytes.slice(index, index + 3);
					index += 3;

					const rawValues = bytes.slice(index, -2);
					const checkSum = bytes[bytes.length - 2];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName, address, rawValues, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: idKey, _paramKeys: ['address'], _valueKeys: ['rawValues'],
					};
				};
			})(modelId, modelName, commandNames[commandId]);
			break;

		case 0x30: // Bulk Dump Request
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandReStr} ${modelIdHex} .. .. .. f7$`, 'u');
			handler = ((modelId, modelName, commandName) => {
				const idKey = [mfrIdHex, bytesToHex([modelId])].join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId, modelId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x43 && (deviceId & 0xf0) === commandId);
					index += 4;

					const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

					const address = bytes.slice(index, index + 3);
					index += 3;

					const dataSize = bytes.slice(index, index + 3);
					index += 3;

					const checkSum = bytes[index];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, deviceId, modelId, modelName, commandId, commandName, address, dataSize, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: idKey, _paramKeys: ['address'],
					};
				};
			})(modelId, modelName, commandNames[commandId]);
			break;

		default:
			continue;
		}

		const key = regexp.source.replace(addrReStr, '.. .. ..').replace(/ \.\..*$/u, '').replace('.', '0').replace(/[^0-9a-f ]/ug, '');
		parsers.push({key, regexp, handler});
	}

	return parsers;
}

export const sysExParsers = Object.freeze([
	...modelProps.map((modelProp) => makeYamahaGmParser(modelProp)).flat(),
	...Object.values(modelProps.reduce((p, c) => {
		// Counts the number of parsers for each model ID.
		const key = String(c.modelId);
		if (!p[key]) {
			p[key] = [];
		}
		p[key].push(c);
		return p;
	}, {})).map((modelProps) => {
		const parsers = [];
		const {modelName, modelId} = modelProps[0];
		const commands = [...new Set(modelProps.map((e) => e.commands).flat())];
		// If multiple parsers exist for each model ID and all of them handles limited "address" range, add an additional parser to handle whole address.
		if (modelProps.length > 1 && modelProps.every((modelProp) => 'address' in modelProp)) {
			parsers.push(...makeYamahaGmParser({modelName, modelId, commands}));
		}
		return parsers;
	}).flat(),
]);
