import {bytesToHex, stripEnclosure, convert7to8bits, calcCheckSumRol, isCheckSumValid} from '../utilities.js';

const modelProps = [
	// [1984-02-?? (Ver.?.?)] Roland JUNO-106 (6-Voice Synthesizer)
	// [1985-07-?? (Ver.1.00)] Roland MKS-7 (Sound Module)
	{
		modelName: 'JUNO-106',
		commands: [0x30, 0x31, 0x32],
	},

	// [1983-10-?? (Ver.?.?)] Roland TR-909 (Rhythm Machine)
	{
		modelName: 'TR-909',
		modelId: 0x01,
		commands: [0x51, 0x52, 0x53],
	},
	// [1984-07-?? (Ver.?.?)] Roland MKS-80 (8-Voice Sound Module)
	{
		modelName: 'MKS-80',
		modelId: 0x20,
		commands: [0x34, 0x35, 0x36, 0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
	},
	// [1984-11-?? (Ver.?.?)] Roland SBX-80 (Sync Box)
	{
		modelName: 'SBX-80',
		modelId: 0x60,
		commands: [0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
	},
	// [1984-??-?? (Ver.1.0)] Roland MSQ-100 (Digital Keyboard Recorder)
	{
		modelName: 'MSQ-100',
		modelId: 0x70,		// Although the manual states that 0x70 represents "Data Type (7-8 conversion)", but treats this as a model ID
		commands: [0x57],	// and treats command 0x57 as 7-8 conversion data transmission.
	},
	// [1985-02-?? (Ver.?.?)] Roland TR-707 (Rhythm Machine)
	// [1985-02-?? (Ver.?.?)] Roland TR-727 (Rhythm Machine)
	{
		modelName: 'TR-707/727',
		modelId: 0x02,
		commands: [0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x70, 0x71],
	},
	// [1985-03-?? (Ver.?.?)] Roland JX-8P (6-Voice Polyphonic Synthesizer)
	{
		modelName: 'JX-8P',
		modelId: 0x21,
		commands: [0x34, 0x35, 0x36],
	},
	// [1985-04-?? (Ver.?.?)] Roland DDR-30 (Digital Drums)
	{
		modelName: 'DDR-30',
		modelId: 0x22,
		commands: [0x34, 0x35, 0x36, 0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
	},
	// [1986-??-?? (Ver.?.?)] Roland JU-1 (6-Voice Polyphonic Synthesizer)
	// [1986-01-27 (Ver.1.1)] Roland JU-2 (6-Voice Polyphonic Synthesizer)
	// [1986-01-27 (Ver.1.1)] Roland HS-10 (6-Voice Polyphonic Synthesizer)
	// [1986-04-03 (Ver.1.0)] Roland HS-80 (6-Voice Polyphonic Synthesizer)
	{
		modelName: 'JU-1/2',
		modelId: 0x23,
		commands: [0x35, 0x36, 0x37, 0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
		reStrs: {
			0x35: '^f0 41 35 0. 23 20 .. (?:.. )+f7$',
			0x36: '^f0 41 36 0. 23 20 .. .. (?:.. )+f7$',
			0x37: '^f0 41 37 0. 23 20 .. .. (?:.. )+f7$',
		},
	},
	// [1986-09-05 (Ver.1.0)] Roland MKS-50 (6-Voice Sound Module)
	{
		modelName: 'MKS-50',
		modelId: 0x23,
		commands: [0x35, 0x36, 0x37, 0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
		reStrs: {
			0x35: '^f0 41 35 0. 23 [34]0 .. (?:.. )+f7$',
			0x36: '^f0 41 36 0. 23 30 .. .. (?:.. )+f7$',
			0x37: '^f0 41 37 0. 23 [34]0 .. .. (?:.. )+f7$',
		},
	},
	// [1986-02-19 (Ver.1.00)] Roland JX-10 (12-Voice Polyphonic Synthesizer)
	{
		modelName: 'JX-10',
		modelId: 0x24,
		commands: [0x40, 0x41, 0x42, 0x43, 0x45, 0x46, 0x47],
	},
	// [1986-09-06 (Ver.1.00)] Roland MKS-70 (12-Voice Sound Module)
	{
		modelName: 'MKS-70',
		modelId: 0x24,
		commands: [0x34, 0x35, 0x36, 0x37],
	},
	// [1986-07-15 (Ver.1.0)] Roland DEP-5 (Digital Effects Processor)
	{
		modelName: 'DEP-5',
		modelId: 0x52,
		commands: [0x34, 0x35, 0x37],
	},
];

function makeRolandOldParsers(modelProp) {
	const {modelName, modelId} = modelProp;

	const mfrIdHex = '41';
	const modelIdHex = (modelId) ? bytesToHex([modelId]) : null;

	const commandNames = {
		0x30: 'Tone Change Mode',
		0x31: 'Tone Change Mode (Manual)',
		0x32: 'Tone Parameter Change',
		0x34: 'Program Number (PGR)',
		0x35: 'All Tone/Patch Parameters (APR)',
		0x36: 'Individual Tone/Patch Parameter (IPR)',
		0x37: 'Bulk Dump (BLD)',
		0x40: 'Want to Send a File (WSF)',
		0x41: 'Request a File (RQF)',
		0x42: 'Data (DAT)',
		0x43: 'Acknowledge (ACK)',
		0x45: 'End of File (EOF)',
		0x46: 'Communication Error (ERR)',
		0x47: 'Rejection (RJC)',
		0x50: 'Want to Send a File (WSF)',
		0x51: 'Request a File (RQF)',
		0x52: 'Data (DAT)',
		0x53: 'Acknowledge (PAS)',
		0x54: 'Continue (CNT)',
		0x55: 'End of File (EOF)',
		0x57: 'Data (7-8 Conversion)',
		0x70: 'Rejection (RJC)',
		0x71: 'Communication Error (ERR)',
	};

	const parsers = [];
	for (const commandId of modelProp.commands) {
		const commandIdHex = bytesToHex([commandId]);

		let key, regexp, handler;
		switch (commandId) {
		case 0x30:	// Tone Change Mode
		case 0x31:	// Tone Change Mode (Manual)
		case 0x32:	// Tone Parameter Change
			key = `f0 ${mfrIdHex} ${commandIdHex} 00`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandIdHex} 0. .. (?:.. )+f7$`, 'u');
			handler = ((modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, deviceId, param, ...rawValues] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					const rawParams = [param];

					return {
						mfrId, mfrIdHex, commandId, commandName, deviceId, modelName, rawParams, rawValues,
						_idKey: mfrIdHex, _paramKeys: ['rawParams'], _valueKeys: ['rawValues'],
					};
				};
			})(modelName, commandNames[commandId]);
			break;

		case 0x34:	// Program Number (PGR)
		case 0x36:	// Individual Tone/Patch Parameter (IPR)
		case 0x37:	// Bulk Dump (BLD)
			key = `f0 ${mfrIdHex} ${commandIdHex} 00 ${modelIdHex}`;
			regexp = new RegExp(modelProp?.reStrs?.[commandId] ?? String.raw`^f0 ${mfrIdHex} ${commandIdHex} 0. ${modelIdHex} .. .. .. (?:.. )+f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, deviceId, modelId, param0, param1, param2, ...rawValues] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					const rawParams = [param0, param1, param2];

					return {
						mfrId, mfrIdHex, commandId, commandName, deviceId, modelId, modelIdHex, modelName, rawParams, rawValues,
						_idKey: [mfrIdHex, modelIdHex].join(' '), _paramKeys: ['rawParams'], _valueKeys: ['rawValues'],
					};
				};
			})(modelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x35:	// All Tone/Patch Parameters
			key = `f0 ${mfrIdHex} ${commandIdHex} 00 ${modelIdHex}`;
			regexp = new RegExp(modelProp?.reStrs?.[commandId] ?? String.raw`^f0 ${mfrIdHex} ${commandIdHex} 0. ${modelIdHex} .. .. (?:.. )+f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, deviceId, modelId, param0, param1, ...rawValues] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					const rawParams = [param0, param1];

					return {
						mfrId, mfrIdHex, commandId, commandName, deviceId, modelId, modelIdHex, modelName, rawParams, rawValues,
						_idKey: [mfrIdHex, modelIdHex].join(' '), _paramKeys: ['rawParams'], _valueKeys: ['rawValues'],
					};
				};
			})(modelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x40:	// Want to Send a File (WSF)
		case 0x41:	// Request a File (RQF)
		case 0x42:	// Data (DAT)
			key = `f0 ${mfrIdHex} ${commandIdHex} 00 ${modelIdHex}`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandIdHex} 0. ${modelIdHex} (?:.. )+.. f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, deviceId, modelId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					const isCheckSumError = !isCheckSumValid(bytes.slice(5, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(5, -2));

					const rawValues = bytes.slice(5, -2);
					const checkSum = bytes[bytes.length - 2];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, mfrIdHex, commandId, commandName, deviceId, modelId, modelIdHex, modelName, rawValues, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: [mfrIdHex, modelIdHex].join(' '), _valueKeys: ['rawValues'],
					};
				};
			})(modelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x43:	// Acknowledge (ACK)
		case 0x45:	// End of File (EOF)
		case 0x46:	// Communication Error (ERR)
		case 0x47:	// Rejection (RJC)
			key = `f0 ${mfrIdHex} ${commandIdHex} 00 ${modelIdHex}`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandIdHex} 0. ${modelIdHex} f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, deviceId, modelId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					return {
						mfrId, mfrIdHex, commandId, commandName, deviceId, modelId, modelIdHex, modelName,
						_idKey: [mfrIdHex, modelIdHex].join(' '),
					};
				};
			})(modelIdHex, modelName, commandNames[commandId]);
			break;

		case 0x50:	// Want to Send a File (WSF)
		case 0x51:	// Request a File (RQF)
		case 0x53:	// Acknowledge (PAS)
		case 0x54:	// Continue (CNT)
		case 0x55:	// End of File (EOF)
		case 0x70:	// Rejection (RJC)
		case 0x71:	// Communication Error (ERR)
			key = `f0 ${mfrIdHex} ${commandIdHex}`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandIdHex} f7$`, 'u');
			handler = ((modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					return {
						mfrId, mfrIdHex, commandId, commandName, modelName,
						_idKey: mfrIdHex,
					};
				};
			})(modelName, commandNames[commandId]);
			break;

		case 0x52:	// Data (DAT)
		case 0x57:	// Data (7-8 Conversion)	// TODO: Support conversion
			key = `f0 ${mfrIdHex} ${commandIdHex} ${modelIdHex}`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} ${commandIdHex} ${modelIdHex} .. (?:.. )+.. f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => {
				return (bytes) => {
					const [mfrId, commandId, modelId, param] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);

					const rawParams = [param];

					const isCheckSumError = !isCheckSumValid(bytes.slice(5, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(5, -2));

					const rawValues = bytes.slice(5, -2);
					const checkSum = bytes[bytes.length - 2];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, mfrIdHex, modelId, modelIdHex, modelName, commandId, commandName, rawParams, rawValues, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: [mfrIdHex, modelIdHex].join(' '), _paramKeys: ['rawParams'], _valueKeys: ['rawValues'],
					};
				};
			})(modelIdHex, modelName, commandNames[commandId]);
			break;

		default:
			console.assert(false);
			continue;
		}

		parsers.push({key, regexp, handler});
	}

	return parsers;
}

export const sysExParsers = Object.freeze([
	...modelProps.map((modelProp) => makeRolandOldParsers(modelProp)).flat(),
	...Object.values(modelProps.reduce((p, c) => {
		// Counts the number of parsers for each model ID.
		if ('modelId' in c) {
			const key = String(c.modelId);
			if (!p[key]) {
				p[key] = [];
			}
			p[key].push(c);
		}
		return p;
	}, {})).map((modelProps) => {
		const parsers = [];
		// If multiple parsers exist for each model ID
		if (modelProps.length > 1) {
			const {modelName, modelId} = modelProps[0];
			for (const command of [...new Set(modelProps.map((e) => e.commands).flat())]) {
				// and all of them handles limited "reStrs" for each command, add an additional parser to handle the command.
				if (modelProps.every((modelProp) => modelProp.reStrs?.[command])) {
					parsers.push(...makeRolandOldParsers({
						modelId,
						modelName: `${modelName}?`,
						commands: [command],
					}));
				}
			}
		}
		return parsers;
	}).flat(),
]);
