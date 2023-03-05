import {as14bitLE} from './converters.js';

const systemMessageNames = {
	0xf1: 'MIDI Time Code Quarter Frame',
	0xf2: 'Song Position Pointer',
	0xf3: 'Song Select',
	0xf5: 'Port Select',	// unofficial
	0xf6: 'Tune Request',
	0xf7: 'End of System Exclusive',
	0xf8: 'Timing Clock',
	0xfa: 'Start',
	0xfb: 'Continue',
	0xfc: 'Stop',
	0xfe: 'Active Sensing',
	0xff: 'System Reset',
};

export function analyzeSystemMessage(bytes) {
	console.assert(bytes?.length);

	const statusByte = bytes[0];

	const mes = {
		kind: 'f',
		commandName: systemMessageNames[statusByte],
	};

	switch (statusByte) {
	case 0xf1:	// MIDI Time Code Quarter Frame
	case 0xf3:	// Song Select
		if (bytes.length !== 2) {
			return null;
		}
		mes.value = bytes[1];
		break;
	case 0xf2:	// Song Position Pointer
		if (bytes.length !== 3) {
			return null;
		}
		mes.value = as14bitLE(bytes[1], bytes[2]);
		break;
	case 0xf5:	// (Port Select)
		if (bytes.length > 1) {
			mes.value = bytes[1];
		}
		break;
	case 0xf6:	// Tune Request
	case 0xf7:	// End of System Exclusive
	case 0xf8:	// Timing Clock
	case 0xfa:	// Start
	case 0xfb:	// Continue
	case 0xfc:	// Stop
	case 0xfe:	// Active Sensing
	case 0xff:	// System Reset
		if (bytes.length !== 1) {
			return null;
		}
		break;
	case 0xf4:
	case 0xf9:
	case 0xfd:
		break;
	default:
		return null;
	}

	return mes;
}
