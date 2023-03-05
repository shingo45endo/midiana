import {bytesToHex} from './utilities.js';

const seqS = [...new Array(11)].fill().map((_, i) => i + 4);	// 4, 5, 6, ..., 13, 14
const seqE = [...new Array(11)].fill().map((_, i) => 1 << (i + 3));	// 8, 16, 32, ..., 4096, 8192

const calculatorsSignedN = Object.fromEntries(seqS.map((n) => [`signed${n}`, ((max, msb, mask) => (value) => {
	console.assert(0 <= value && value < max);
	return ((value & msb) === 0) ? value : -((value ^ mask) + 1);
})(1 << n, 1 << (n - 1), (1 << n) - 1)]));

const calculatorsExcessN = Object.fromEntries(seqE.map((n) => [`excess${n}`, ((n, max) => (value) => {
	console.assert(0 <= value && value < max);
	return value - n;
})(n, n * 2)]));

export const [
	toSigned4,
	toSigned5,
	toSigned6,
	toSigned7,
	toSigned8,
	toSigned9,
	toSigned10,
	toSigned11,
	toSigned12,
	toSigned13,
	toSigned14,
] = Object.values(calculatorsSignedN);

export const [
	toExcess8,
	toExcess16,
	toExcess32,
	toExcess64,
	toExcess128,
	toExcess256,
	toExcess512,
	toExcess1024,
	toExcess2048,
	toExcess4096,
	toExcess8192,
] = Object.values(calculatorsExcessN);

function formatSigned(value) {
	console.assert(Number.isFinite(value));
	return `${'-±+'[Math.sign(value) + 1]}${Math.abs(value)}`;
}

const formattersSignedN = Object.fromEntries(seqS.map((n) => [`signed${n}`, ((max, toSignedN) => (value) => {
	if (value < 0 || max <= value) {
		return value;
	}
	const v = toSignedN(value);
	return formatSigned(v);
})(1 << n, calculatorsSignedN[`signed${n}`])]));

const formattersExcessN = Object.fromEntries(seqE.map((n) => [`excess${n}`, ((max, toExcessN) => (value) => {
	if (value < 0 || max <= value) {
		return value;
	}
	const v = toExcessN(value);
	return formatSigned(v);
})(n * 2, calculatorsExcessN[`excess${n}`])]));

export const [
	formatSigned4,
	formatSigned5,
	formatSigned6,
	formatSigned7,
	formatSigned8,
	formatSigned9,
	formatSigned10,
	formatSigned11,
	formatSigned12,
	formatSigned13,
	formatSigned14,
] = Object.values(formattersSignedN);

export const [
	formatExcess8,
	formatExcess16,
	formatExcess32,
	formatExcess64,
	formatExcess128,
	formatExcess256,
	formatExcess512,
	formatExcess1024,
	formatExcess2048,
	formatExcess4096,
	formatExcess8192,
] = Object.values(formattersExcessN);

export function formatPanpot(value) {
	if (value < 0 || 128 <= value) {
		return value;
	}
	return formatExcess64(value).replace(/^-/u, 'L').replace(/^\+/u, 'R');
}

export function formatPanpotR(value) {
	return (value !== 0) ? formatPanpot(value) : 'RND';
}

export function formatOnOff64(value) {
	if (value < 0 || 128 <= value) {
		return value;
	}
	return ((value & 0x40) !== 0) ? 'On' : 'Off';
}

export function formatOnOff1(value) {
	if (value !== 0 && value !== 1) {
		return value;
	}
	return (value !== 0) ? 'On' : 'Off';
}

export function formatNoteNo(value) {
	if (value < 0 || 128 <= value) {
		return value;
	}
	const octave = Math.trunc(value / 12) - 1;
	const name = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][value % 12];
	return `${name}${octave}`;
}

export function formatAscii(...values) {
	const str = String.fromCharCode(...values);
	if (!/^[\x00-\x7f]*$/u.test(str)) {
		return values;
	}
	return str;
}

export function formatAsciiA(...values) {
	const str = String.fromCharCode(...values);
	if (!/^[\x00-\x7f]*$/u.test(str)) {
		return values;
	}
	return str.replace(/\x7e/ug, '→').replace(/\x7f/ug, '←');
}

export function formatHex(...values) {
	if (values.some((value) => (value < 0 || 256 <= value))) {
		return values;
	}
	return bytesToHex(values);
}

export function makeFormatterFromTable(table) {
	if (Array.isArray(table)) {
		return ((table) => (value) => {
			if (value < 0 || table.length <= value) {
				return value;
			}
			return table[value];
		})(table.map((e) => String(e)));
	} else {
		return ((table) => (value) => table[value] ?? value)(Object.fromEntries(Object.entries(table).map(([k, v]) => [k, String(v)])));
	}
}

export const makeFormatterFromResolution = (() => {
	const calculators = {
		...calculatorsSignedN,
		...calculatorsExcessN,
	};
	const formattersFromResolution = {};

	return (resolution, format) => {
		console.assert(Number.isFinite(resolution));

		const key = [resolution, format].toString();
		if (formattersFromResolution[key]) {
			return formattersFromResolution[key];
		}

		const formatter = ((resolution, format) => {
			const calculator = calculators[format] ?? ((value) => value);
			const isSigned = format in calculators;

			return (value) => {
				const v = calculator(value) * resolution;
				const vStr1 = String(v);
				const vStr2 = v.toPrecision(5);
				const vStr = (vStr2.length < vStr1.length && /[\d.-]+/u.test(vStr2)) ? vStr2 : vStr1;
				const ret = vStr.replace(/0{2,}$/u, '');

				if (!isSigned) {
					return ret;
				} else {
					if (ret === '0') {
						return '±0';
					} else if (ret.startsWith('-')) {
						return ret;
					} else {
						return `+${ret}`;
					}
				}
			};
		})(resolution, format);

		formattersFromResolution[key] = formatter;
		return formatter;
	};
})();

export const formatters = Object.freeze({
	...formattersSignedN,
	...formattersExcessN,
	panpot:  formatPanpot,
	panpotR: formatPanpotR,
	onOff64: formatOnOff64,
	onOff1:  formatOnOff1,
	noteNo:  formatNoteNo,
	ascii:   formatAscii,
	asciiA:  formatAsciiA,
	hex:     formatHex,
});
