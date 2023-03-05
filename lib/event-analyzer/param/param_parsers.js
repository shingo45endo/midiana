import {isValid7bitHex} from '../utilities.js';

import {supportedIds as supportedIdsForRolandScGs, parseParam as parseParamForRolandScGs} from './address_roland_sc-gs.js';
import {supportedIds as supportedIdsForRolandSc7,  parseParam as parseParamForRolandSc7}  from './address_roland_sc-7.js';
import {supportedIds as supportedIdsForRolandCm64, parseParam as parseParamForRolandCm64} from './address_roland_cm-64.js';

const parsers = [
	[supportedIdsForRolandScGs, parseParamForRolandScGs],
	[supportedIdsForRolandSc7,  parseParamForRolandSc7],
	[supportedIdsForRolandCm64, parseParamForRolandCm64],

].reduce((p, [idKeys, parser]) => {
	console.assert(Array.isArray(idKeys));
	for (const idKey of idKeys) {
		console.assert(isValid7bitHex(idKey));
		if (p[idKey]) {
			console.warn(`Parser for '${idKey}' already exists.`);
		}
		p[idKey] = parser;
	}
	return p;
}, {});

export function getParamParser(idKey) {
	console.assert(isValid7bitHex(idKey));
	return parsers[idKey];
}
