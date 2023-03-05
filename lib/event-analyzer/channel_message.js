import {toExcess8192} from './formatters.js';
import {as14bitLE} from './converters.js';

const channelMessageNames = {
	0x80: 'Note Off',
	0x90: 'Note On',
	0xa0: 'Polyphonic Key Pressure',
	0xb0: 'Control Change',
	0xc0: 'Program Change',
	0xd0: 'Channel Pressure',
	0xe0: 'Pitch Bend Change',
};

const controllerNames = {
	0x00: 'Bank Select (MSB)',
	0x01: 'Modulation (MSB)',
	0x02: 'Breath Controller (MSB)',
	0x04: 'Foot Controller (MSB)',
	0x05: 'Portamento Time (MSB)',
	0x06: 'Data Entry (MSB)',
	0x07: 'Channel Volume (MSB)',
	0x08: 'Balance (MSB)',
	0x0a: 'Pan (MSB)',
	0x0b: 'Expression (MSB)',
	0x0c: 'Effect Control 1 (MSB)',
	0x0d: 'Effect Control 2 (MSB)',
	0x10: 'General Purpose Controller #1 (MSB)',
	0x11: 'General Purpose Controller #2 (MSB)',
	0x12: 'General Purpose Controller #3 (MSB)',
	0x13: 'General Purpose Controller #4 (MSB)',

	0x20: 'Bank Select (LSB)',
	0x21: 'Modulation (LSB)',
	0x22: 'Breath Controller (LSB)',
	0x24: 'Foot Controller (LSB)',
	0x25: 'Portamento Time (LSB)',
	0x26: 'Data Entry (LSB)',
	0x27: 'Channel Volume (LSB)',
	0x28: 'Balance (LSB)',
	0x2a: 'Pan (LSB)',
	0x2b: 'Expression (LSB)',
	0x2c: 'Effect Control 1 (LSB)',
	0x2d: 'Effect Control 2 (LSB)',
	0x30: 'General Purpose Controller #1 (LSB)',
	0x31: 'General Purpose Controller #2 (LSB)',
	0x32: 'General Purpose Controller #3 (LSB)',
	0x33: 'General Purpose Controller #4 (LSB)',

	0x40: 'Damper Pedal',
	0x41: 'Portamento On/Off',
	0x42: 'Sostenuto',
	0x43: 'Soft Pedal',
	0x44: 'Legato Footswitch',
	0x45: 'Hold 2',

	0x46: 'Sound Variation',
	0x47: 'Timbre/Harmonic Intensity',
	0x48: 'Release Time',
	0x49: 'Attack Time',
	0x4a: 'Brightness',
	0x4b: 'Decay Time',
	0x4c: 'Vibrato Rate',
	0x4d: 'Vibrato Depth',
	0x4e: 'Vibrato Delay',
	0x4f: 'Sound Controller #10',

	0x50: 'General Purpose Controller #5',
	0x51: 'General Purpose Controller #6',
	0x52: 'General Purpose Controller #7',
	0x53: 'General Purpose Controller #8',

	0x54: 'Portamento Control',

	0x5b: 'Reverb Send Level',
	0x5c: 'Effect 2 Depth',
	0x5d: 'Chorus Send Level',
	0x5e: 'Effect 4 Depth',
	0x5f: 'Effect 5 Depth',

	0x60: 'Data Increment',
	0x61: 'Data Decrement',
	0x62: 'Non-Registered Parameter Number (LSB)',
	0x63: 'Non-Registered Parameter Number (MSB)',
	0x64: 'Registered Parameter Number (LSB)',
	0x65: 'Registered Parameter Number (MSB)',

	// (including channel mode messages)
	0x78: 'All Sound Off',
	0x79: 'Reset All Controllers',
	0x7a: 'Local Control',
	0x7b: 'All Notes Off',
	0x7c: 'Omni Off',
	0x7d: 'Omni On',
	0x7e: 'Mono On',
	0x7f: 'Poly On',
};

const channelMessageLen = {
	0x80: 3,
	0x90: 3,
	0xa0: 3,
	0xb0: 3,
	0xc0: 2,
	0xd0: 2,
	0xe0: 3,
};

export function analyzeChannelMessage(bytes) {
	console.assert(bytes?.length);

	const statusByte = bytes[0] & 0xf0;
	if (bytes.length !== channelMessageLen[statusByte]) {
		return null;
	}

	const mes = {
		kind: statusByte.toString(16)[0],
		channelNo: bytes[0] & 0x0f,
		commandName: channelMessageNames[statusByte],
	};

	switch (statusByte) {
	case 0x80:	// Note Off
	case 0x90:	// Note On
		mes.noteNo   = bytes[1];
		mes.velocity = bytes[2];
		break;

	case 0xb0:	// Control Change
		mes.subCommandName = controllerNames[bytes[1]] ?? `Undefined (CC#${bytes[1]})`;
		mes.ccNo  = bytes[1];
		mes.value = bytes[2];
		break;

	case 0xe0:	// Pitch Bend Change
		mes.pitchBend = toExcess8192(as14bitLE(bytes[1], bytes[2]));
		break;

	case 0xc0:	// Program Change
		mes.progNo = bytes[1];
		break;

	case 0xd0:	// Channel Pressure
		mes.value = bytes[1];
		break;

	case 0xa0:	// Polyphonic Key Pressure
		mes.noteNo = bytes[1];
		mes.value  = bytes[2];
		break;

	default:
		return null;
	}

	return mes;
}
