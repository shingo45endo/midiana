import {bytesToHex, isValidSysEx} from '../utilities.js';
import {sysExParsers as sysExParsersRoland} from './sysex_41_roland.js';

const sysExKeyMap = new Map();
let maxKeyLength = 0;

addSysExParsers([
	...sysExParsersRoland,
]);

function addSysExParsers(parsers) {
	console.assert(Array.isArray(parsers));

	for (const parser of parsers) {
		const {key, regexp, handler} = parser;
		console.assert(/^[0-9a-f ]+$/u.test(key) && /^(?:.. )+..$/u.test(key));
		console.assert(typeof regexp?.test === 'function');
		console.assert(typeof handler === 'function');

		// Keeps the maximum length of all the keys.
		const strs = key.split(' ');
		if (maxKeyLength < strs.length) {
			maxKeyLength = strs.length;
		}

		// Registers parsers to the map with various length of keys.
		for (let i = 0; i < strs.length; i++) {
			const key = strs.slice(0, i + 1).join(' ');
			if (!sysExKeyMap.has(key)) {
				sysExKeyMap.set(key, []);
			}
			const array = sysExKeyMap.get(key);
			console.assert(Array.isArray(array));
			array.push({regexp, handler});
		}
	}
}

export function getSysExParser(bytes) {
	console.assert(bytes?.length);
	console.assert(isValidSysEx(bytes));

	// Gets the array of parsers for this SysEx bytes.
	const hexStr = bytesToHex(bytes);
	for (let i = Math.min(bytes.length, maxKeyLength) - 1; i >= 2; i--) {	// "i >= 2" means that sysExKeyMap.get('f0') won't be a target.
		const key = bytesToHex(bytes.slice(0, i));
		if (!sysExKeyMap.has(key)) {
			continue;
		}

		// Searches the SysEx parser which can handle this SysEx bytes.
		const parsers = sysExKeyMap.get(key);
		for (const parser of parsers) {
			if (parser.regexp && parser.regexp.test(hexStr)) {
				return parser.handler;
			}
		}
	}

	return null;
}
