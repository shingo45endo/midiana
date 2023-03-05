import {isValidSysEx, stripEnclosure} from './utilities.js';
import {getManufacturersNames} from './manufacturers.js';
import {getSysExParser} from './sysex/sysex_parsers.js';

export function analyzeSysExBase(bytes) {
	console.assert(bytes?.length);

	// Checks if the SysEx bytes are valid or not.
	if (!isValidSysEx(bytes)) {
		return {isInvalid: true};
	}

	// Gets a manufacturer's ID.
	const [mfrId0, mfrId1, mfrId2] = stripEnclosure(bytes);
	const mfrId = (mfrId0 !== 0x00) ? mfrId0 : [mfrId0, mfrId1, mfrId2];

	return {
		mfrId, ...(getManufacturersNames(mfrId) ?? {}),
	};
}

export function analyzeSysEx(bytes) {
	// Analyzes the SysEx.
	const mes = analyzeSysExBase(bytes);
	if (mes?.isInvalid) {
		return mes;
	}

	// Analyzes the SysEx for specific models.
	const parser = getSysExParser(bytes);
	if (parser) {
		Object.assign(mes, parser(bytes));
	}

	return mes;
}
