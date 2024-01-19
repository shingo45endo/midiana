import {bytesToHex, stripEnclosure, convert7to8bits, calcCheckSumRol, isCheckSumValid} from '../utilities.js';

export function makeRolandParsers(modelProp) {
	const {deviceIdReStr, modelId, addrLen, address} = modelProp;

	console.assert(typeof deviceIdReStr === 'string');
	console.assert(Array.isArray(modelId));
	console.assert(0 <= addrLen && addrLen <= 5);
	console.assert(address === undefined || typeof address === 'string' || (Array.isArray(address) && address.length > 0 && address.every((e) => typeof e === 'string')));

	const modelIdHex = bytesToHex(modelId);
	console.assert(/^(?:00 )*[0-7][0-9a-f]$/u.test(modelIdHex));
	const modelIdLen = modelId.length;
	const addrReStr = (typeof address === 'string') ? address : (Array.isArray(address)) ? `(?:${address.join('|')})` : [...new Array(addrLen)].fill('..').join(' ');
	const deviceIdRegexp = new RegExp(deviceIdReStr, 'u');

	const deviceIdHexs = (deviceIdReStr === '..') ? ['7f'] : [0x10, 0x00].map((deviceId) => bytesToHex([deviceId])).filter((deviceIdHex) => deviceIdRegexp.test(deviceIdHex));
	if (deviceIdHexs.length === 0) {
		for (let deviceId = 0x00; deviceId < 0x80; deviceId++) {
			const deviceIdHex = bytesToHex([deviceId]);
			if (deviceIdRegexp.test(deviceIdHex)) {
				deviceIdHexs.push(deviceIdHex);
				break;
			}
		}
	}
	console.assert(deviceIdHexs.length > 0);

	const commandNames = {
		0x11: 'Data Request 1 (RQ1)',
		0x12: 'Data Set 1 (DT1)',
		0x40: 'Want to Send Data (WSD)',
		0x41: 'Data Request (RQD)',
		0x42: 'Data Set (DAT)',
		0x43: 'Acknowledge (ACK)',
		0x45: 'End of Data (EOD)',
		0x4e: 'Communication Error (ERR)',
		0x4f: 'Rejection (RJC)',
	};

	const parsers = [];
	for (const commandId of modelProp.commands) {
		const commandHex = bytesToHex([].concat(commandId));

		let regexp, handler;
		switch (commandId) {
		case 0x11:	// RQ1
		case 0x40:	// WSD
		case 0x41:	// RQD
			regexp = new RegExp(String.raw`^f0 41 ${deviceIdReStr} ${modelIdHex} ${commandHex} ${addrReStr} ${[...new Array(addrLen)].fill('..').join(' ')} .. f7$`, 'u');
			handler = ((modelIdHex, modelIdLen, modelName, commandName, addrLen) => {
				const mfrIdHex = '41';
				const idKey = [mfrIdHex, modelIdHex].join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);
					index += 3;

					const modelId = bytes.slice(index, index + modelIdLen);
					index += modelIdLen;

					const commandId = bytes[index];
					index++;

					const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

					const address = bytes.slice(index, index + addrLen);
					console.assert(address.length === addrLen);
					index += addrLen;

					const dataSize = bytes.slice(index, index + addrLen);
					console.assert(dataSize.length === addrLen);
					index += addrLen;

					const checkSum = bytes[index];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName, address, dataSize, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: idKey, _paramKeys: ['address'],
					};
				};
			})(modelIdHex, modelIdLen, modelProp.modelName, commandNames[commandId], addrLen);
			break;

		case 0x12:	// DT1
		case 0x42:	// DAT
			regexp = new RegExp(String.raw`^f0 41 ${deviceIdReStr} ${modelIdHex} ${commandHex} ${addrReStr} (?:.. )+.. f7$`, 'u');
			handler = ((modelIdHex, modelIdLen, modelName, commandName, addrLen) => {
				const mfrIdHex = '41';
				const idKey = [mfrIdHex, modelIdHex].join(' ');
				return (bytes) => {
					let index = 0;
					const [mfrId, deviceId] = stripEnclosure(bytes);
					console.assert(mfrId === 0x41);
					index += 3;

					const modelId = bytes.slice(index, index + modelIdLen);
					index += modelIdLen;

					const commandId = bytes[index];
					index++;

					const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
					const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

					const address = bytes.slice(index, index + addrLen);
					console.assert(address.length === addrLen);
					index += addrLen;

					const rawValues = bytes.slice(index, -2);
					const checkSum = bytes[bytes.length - 2];
					console.assert(isCheckSumError || checkSum === expectedCheckSum);

					return {
						mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName, address, rawValues, checkSum, expectedCheckSum, isCheckSumError,
						_idKey: idKey, _paramKeys: ['address'], _valueKeys: ['rawValues'],
					};
				};
			})(modelIdHex, modelIdLen, modelProp.modelName, commandNames[commandId], addrLen);
			break;

		case 0x43:	// ACK
		case 0x45:	// EOD
		case 0x4e:	// ERR
		case 0x4f:	// RJC
			regexp = new RegExp(String.raw`^f0 41 ${deviceIdReStr} ${modelIdHex} ${commandHex} f7$`, 'u');
			handler = ((modelIdHex, modelName, commandName) => (bytes) => {
				const [mfrId, deviceId, modelId, commandId] = stripEnclosure(bytes);
				console.assert(mfrId === 0x41);

				// Note: The length of the module IDs which can deal with "handshake communication" commands are 1-byte.
				// No one has a multi-byte model ID with any 0x00 as prefix.
				console.assert(modelId !== 0x00);

				return {mfrId, mfrIdHex: '41', deviceId, modelId, modelIdHex, modelName, commandId, commandName};
			})(modelIdHex, modelProp.modelName, commandNames[commandId]);
			break;

		default:
			// Firmware Update command
			if (Array.isArray(commandId) && commandId[0] === 0x00 && commandId[1] === 0x12) {
				regexp = new RegExp(String.raw`^f0 41 ${deviceIdReStr} ${modelIdHex} ${commandHex} ${addrReStr} (?:.. )+.. f7$`, 'u');
				handler = ((modelIdHex, modelIdLen, modelName, commandName, addrLen) => {
					const mfrIdHex = '41';
					const idKey = [mfrIdHex, modelIdHex].join(' ');
					return (bytes) => {
						let index = 0;
						const [mfrId, deviceId] = stripEnclosure(bytes);
						console.assert(mfrId === 0x41);
						index += 3;

						const modelId = bytes.slice(index, index + modelIdLen);
						index += modelIdLen;

						const commandId = bytes.slice(index, index + 2);
						console.assert(commandId[0] === 0x00 && commandId[1] === 0x12);
						index += 2;

						const isCheckSumError = !isCheckSumValid(bytes.slice(index, -1));
						const expectedCheckSum = calcCheckSumRol(bytes.slice(index, -2));

						const address = bytes.slice(index, index + addrLen);
						console.assert(address.length === addrLen);
						index += addrLen;

						const rawValues = bytes.slice(index, -2);
						const values = convert7to8bits([...rawValues]);
						const checkSum = bytes[bytes.length - 2];
						console.assert(isCheckSumError || checkSum === expectedCheckSum);

						return {
							mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName, address, rawValues, values, checkSum, expectedCheckSum, isCheckSumError,
							_idKey: idKey, _paramKeys: ['address'], _valueKeys: ['values'],
						};
					};
				})(modelIdHex, modelIdLen, modelProp.modelName, 'Firmware Update', addrLen);
			} else {
				console.assert(false);	// Unexpected case
				return null;
			}
			break;
		}

		for (const deviceIdHex of deviceIdHexs) {
			const key = `f0 41 ${deviceIdHex} ${modelIdHex} ${commandHex}`;
			parsers.push({key, regexp, handler});
		}
	}

	return parsers;
}
