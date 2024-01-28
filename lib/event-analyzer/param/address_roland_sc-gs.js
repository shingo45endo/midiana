import {splitArrayByN} from '../utilities.js';
import {makeResolvedJson} from '../json_refs.js';
import {makeAddressParser, makeAddressRegexp, makeParamParser} from './address_common.js';
import {formatters} from '../formatters.js';

import jsonGs from './address_41_42_gs.json' assert {type: 'json'};
import jsonLcd from './address_41_45_sc-lcd.json' assert {type: 'json'};
//import jsonDevice from './address_41_45_sc-device.json' assert {type: 'json'};

const parserGs = makeAddressParser(makeResolvedJson(jsonGs));
const parserLcd = makeAddressParser(makeResolvedJson(jsonLcd));
//const parserDevice = makeAddressParser(makeResolvedJson(jsonDevice));

const additionalParsersGs = [
	{
		regexp: makeAddressRegexp('40 01 10'),	// Patch Common > Voice Reserve
		size: 16,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 16);
				const sum = values.reduce((p, c) => p + c);
				return `${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15].map((e) => String(values[e])).join(', ')} (sum: ${sum})`;
			},
			renderer: (() => {
				const thsHtml = [...new Array(17)].fill().map((_, i) => `<th>${(i < 16) ? String(i + 1) : 'sum'}</th>`).join('');
				return (...values) => {
					console.assert(values.length === 16);
					const sum = values.reduce((p, c) => p + c);
					const tdsHtml = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, -1].map((e) => `<td>${(e >= 0) ? values[e] : sum}</td>`).join('');
					return `<table><thead><tr>${thsHtml}</tr></thead><tbody><tr>${tdsHtml}</tr></tbody></table>`;
				};
			})(),
		},
	},
	{
		regexp: makeAddressRegexp([
			'[45]0 1. 40',  // Patch Part > Part 1-16 > Scale Tuning
			'2[46] 0. 40',  // User Patch Part 1/2 > #1-16 > Scale Tuning
		]),
		size: 12,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 12);
				return values.map((e) => formatters.excess64(e)).join(', ');
			},
			renderer: (() => {
				const thsHtml = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((e) => `<th>${e}</th>`).join('');
				return (...values) => {
					console.assert(values.length === 12);
					const tdsHtml = values.map((e) => `<td>${formatters.excess64(e)}</td>`).join('');
					return `<table><thead><tr>${thsHtml}</tr></thead><tbody><tr>${tdsHtml}</tr></tbody></table>`;
				};
			})(),
		},
	},
	{
		regexp: makeAddressRegexp([
			'[4-7]8 01 1[46]',  // Bulk Dump > Patch Part > Part 10 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 02 7[46]',  // Bulk Dump > Patch Part > Part  1 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 04 5[46]',  // Bulk Dump > Patch Part > Part  2 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 06 3[46]',  // Bulk Dump > Patch Part > Part  3 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 08 1[46]',  // Bulk Dump > Patch Part > Part  4 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 09 7[46]',  // Bulk Dump > Patch Part > Part  5 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 0b 5[46]',  // Bulk Dump > Patch Part > Part  6 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 0d 3[46]',  // Bulk Dump > Patch Part > Part  7 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 0f 1[46]',  // Bulk Dump > Patch Part > Part  8 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 10 7[46]',  // Bulk Dump > Patch Part > Part  9 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 12 5[46]',  // Bulk Dump > Patch Part > Part 11 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 14 3[46]',  // Bulk Dump > Patch Part > Part 12 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 16 1[46]',  // Bulk Dump > Patch Part > Part 13 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 17 7[46]',  // Bulk Dump > Patch Part > Part 14 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 19 5[46]',  // Bulk Dump > Patch Part > Part 15 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
			'[4-7]8 1b 3[46]',  // Bulk Dump > Patch Part > Part 16 > Rx. NRPN/PB/CAf/PC/CC/PAf/Note/Soft/Sos/Por/Hold/Exp/Pan/Vol/Mod/RPN
		]),
		replacer: {
			formatter: (value) => (new Array(8)).fill().map((_, i) => formatters.onOff1((value >> (7 - i)) & 0x01)).join('/'),
		},
	},
	{
		regexp: makeAddressRegexp([
			'[4-7]8 01 40', // Bulk Dump > Patch Part > Part 10 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 03 20', // Bulk Dump > Patch Part > Part  1 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 05 00', // Bulk Dump > Patch Part > Part  2 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 06 60', // Bulk Dump > Patch Part > Part  3 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 08 40', // Bulk Dump > Patch Part > Part  4 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 0a 20', // Bulk Dump > Patch Part > Part  5 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 0c 00', // Bulk Dump > Patch Part > Part  6 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 0d 60', // Bulk Dump > Patch Part > Part  7 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 0f 40', // Bulk Dump > Patch Part > Part  8 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 11 20', // Bulk Dump > Patch Part > Part  9 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 13 00', // Bulk Dump > Patch Part > Part 11 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 14 60', // Bulk Dump > Patch Part > Part 12 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 16 40', // Bulk Dump > Patch Part > Part 13 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 18 20', // Bulk Dump > Patch Part > Part 14 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 1a 00', // Bulk Dump > Patch Part > Part 15 > Rx. Bank Select MSB/LSB, Tone Remain
			'[4-7]8 1b 60', // Bulk Dump > Patch Part > Part 16 > Rx. Bank Select MSB/LSB, Tone Remain
		]),
		replacer: {
			formatter: (value) => `${formatters.onOff1(((value & 0x01) === 0) ? 1 : 0)}/${formatters.onOff1(((value & 0x02) === 0) ? 1 : 0)}/${formatters.onOff1((value & 0x04) >> 2)}`,
		},
	},
	{
		regexp: makeAddressRegexp([
			'[4-7]8 01 1a', // Bulk Dump > Patch Part > Part 10 > Mono/Poly, Assign, Rhythm
			'[4-7]8 02 7a', // Bulk Dump > Patch Part > Part  1 > Mono/Poly, Assign, Rhythm
			'[4-7]8 04 5a', // Bulk Dump > Patch Part > Part  2 > Mono/Poly, Assign, Rhythm
			'[4-7]8 06 3a', // Bulk Dump > Patch Part > Part  3 > Mono/Poly, Assign, Rhythm
			'[4-7]8 08 1a', // Bulk Dump > Patch Part > Part  4 > Mono/Poly, Assign, Rhythm
			'[4-7]8 09 7a', // Bulk Dump > Patch Part > Part  5 > Mono/Poly, Assign, Rhythm
			'[4-7]8 0b 5a', // Bulk Dump > Patch Part > Part  6 > Mono/Poly, Assign, Rhythm
			'[4-7]8 0d 3a', // Bulk Dump > Patch Part > Part  7 > Mono/Poly, Assign, Rhythm
			'[4-7]8 0f 1a', // Bulk Dump > Patch Part > Part  8 > Mono/Poly, Assign, Rhythm
			'[4-7]8 10 7a', // Bulk Dump > Patch Part > Part  9 > Mono/Poly, Assign, Rhythm
			'[4-7]8 12 5a', // Bulk Dump > Patch Part > Part 11 > Mono/Poly, Assign, Rhythm
			'[4-7]8 14 3a', // Bulk Dump > Patch Part > Part 12 > Mono/Poly, Assign, Rhythm
			'[4-7]8 16 1a', // Bulk Dump > Patch Part > Part 13 > Mono/Poly, Assign, Rhythm
			'[4-7]8 17 7a', // Bulk Dump > Patch Part > Part 14 > Mono/Poly, Assign, Rhythm
			'[4-7]8 19 5a', // Bulk Dump > Patch Part > Part 15 > Mono/Poly, Assign, Rhythm
			'[4-7]8 1b 3a', // Bulk Dump > Patch Part > Part 16 > Mono/Poly, Assign, Rhythm
		]),
		replacer: {
			formatter: (value) => {
				const monoPolyMode = ['Mono', 'Poly'][(value & 0x80) >> 7];
				const assignMode   = ['Single', 'Limited-Multi', 'Full-Multi'][value & 0x03] ?? 'Unknown';
				const partMode     = {0b000: 'Normal', 0b011: 'Drum 1', 0b101: 'Drum 2'}[(value & 0x70) >> 4] ?? 'Unknown';
				return `${monoPolyMode}/${assignMode}/${partMode}`;
			},
		},
	},
	{
		regexp: makeAddressRegexp([
			'[4-7]9 [01][cd] .[02468ace]',  // Bulk Dump > Drum Setup > Drum Map 1/2 > Rx. Note On/Off > Key #0-127
			'29 [01]6 ..',                  // Bulk Dump (User Drum Set) > Prog #65/66 > Rx. Note On/Off > Key #0-127
		]),
		replacer: {
			formatter: (value) => `${formatters.onOff1((value & 0x10) >> 4)}/${formatters.onOff1(value & 0x01)}`,
		},
	},
];

const additionalParsersLcd = [
	{
		regexp: makeAddressRegexp('10 0[1-5] [04]0'),	// Displayed Dot Data > Page 1-10
		size: 64,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 64);
				const dataBytes = values.map((value) => value & 0x1f);
				const dotBits = [...new Array(16)].map((_, i) => (dataBytes[i] << 11) | (dataBytes[i + 16] << 6) | (dataBytes[i + 32] << 1) | (dataBytes[i + 48] >> 4));
				const strs = [];
				for (let y = 0; y < 16; y += 4) {
					const codePoints = [];
					for (let x = 0; x < 16; x += 2) {
						const maskL = 1 << (15 - x);
						const maskR = 1 << (15 - x - 1);
						const codePoint = 0x2800 +
							(((dotBits[y]     & maskL) !== 0) ? 0x01 : 0) +
							(((dotBits[y]     & maskR) !== 0) ? 0x08 : 0) +
							(((dotBits[y + 1] & maskL) !== 0) ? 0x02 : 0) +
							(((dotBits[y + 1] & maskR) !== 0) ? 0x10 : 0) +
							(((dotBits[y + 2] & maskL) !== 0) ? 0x04 : 0) +
							(((dotBits[y + 2] & maskR) !== 0) ? 0x20 : 0) +
							(((dotBits[y + 3] & maskL) !== 0) ? 0x40 : 0) +
							(((dotBits[y + 3] & maskR) !== 0) ? 0x80 : 0);
						codePoints.push(codePoint);
					}
					strs.push(String.fromCodePoint(...codePoints));
				}
				return strs.join('\n');
			},
			renderer: (() => {
				const BARS_WIDTH  = 710;
				const BARS_HEIGHT = 290;
				const RATIO = BARS_HEIGHT / BARS_WIDTH;
				const INTERVAL = BARS_WIDTH / 16;
				const GAP = INTERVAL * 0.05;
				const DOT_WIDTH  = INTERVAL - GAP;
				const DOT_HEIGHT = INTERVAL * RATIO - GAP;
				const OPACITY_ON  = 0.75;
				const OPACITY_OFF = 0.125;

				const barRectsSvg = [...new Array(16 * 16)].map((_, i) => {
					const x = INTERVAL * (i % 16);
					const y = INTERVAL * Math.trunc(i / 16) * RATIO;
					return `<rect id="dot-${i}" x="${x}" y="${y}" width="${DOT_WIDTH}" height="${DOT_HEIGHT}" />`;
				}).join('');

				return (...values) => {
					console.assert(values.length === 64);
					const dataBytes = values.map((value) => value & 0x1f);
					const dotBits = [...new Array(16)].map((_, i) => (dataBytes[i] << 11) | (dataBytes[i + 16] << 6) | (dataBytes[i + 32] << 1) | (dataBytes[i + 48] >> 4));
					const dotStr = dotBits.map((e) => e.toString(2).padStart(16, '0')).join('');
					const idStr = [...new Set([...dotStr].map((e, i) => (e === '1') ? `#dot-${i}` : '#dummy'))].join(',');
					return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BARS_WIDTH} ${BARS_HEIGHT}"><style type="text/css">rect {opacity: ${OPACITY_OFF}} ${idStr} {opacity: ${OPACITY_ON}}</style><g fill="currentColor">${barRectsSvg}</g></svg>`;
				};
			})(),
		},
	},
	{
		regexp: makeAddressRegexp('20 0. ..'),	// LCD Full Graphics > Line 1-64
		size: 108,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 108);
				const codePoints = [];
				for (let x = 0; x < 160; x += 2) {
					const index = Math.trunc(x / 6);
					const maskL = 1 << (5 - x % 6);
					const maskR = 1 << (5 - x % 6 - 1);
					const codePoint = 0x2800 +
						(((values[index]      & maskL) !== 0) ? 0x01 : 0) +
						(((values[index]      & maskR) !== 0) ? 0x08 : 0) +
						(((values[index + 27] & maskL) !== 0) ? 0x02 : 0) +
						(((values[index + 27] & maskR) !== 0) ? 0x10 : 0) +
						(((values[index + 54] & maskL) !== 0) ? 0x04 : 0) +
						(((values[index + 54] & maskR) !== 0) ? 0x20 : 0) +
						(((values[index + 81] & maskL) !== 0) ? 0x40 : 0) +
						(((values[index + 81] & maskR) !== 0) ? 0x80 : 0);
					codePoints.push(codePoint);
				}
				return String.fromCodePoint(...codePoints);
			},
			renderer: (() => {
				const WIDTH  = 800;
				const HEIGHT = 320 / 16;
				const INTERVAL = WIDTH / 160;
				const GAP = INTERVAL * 0.2;
				const DOT_WIDTH  = INTERVAL - GAP;
				const OPACITY_ON  = 0.75;
				const OPACITY_OFF = 0.125;

				const barRectsSvg = [...new Array(160 * 4)].map((_, i) => {
					const x = INTERVAL * (i % 160);
					const y = INTERVAL * Math.trunc(i / 160);
					return `<rect id="dot-${i}" x="${x}" y="${y}" width="${DOT_WIDTH}" height="${DOT_WIDTH}" />`;
				}).join('');

				return (...values) => {
					console.assert(values.length === 108);
					const dotStr = splitArrayByN(values, 27).map((bits) => bits.map((e) => (e & 0x3f).toString(2).padStart(6, '0')).join('').slice(0, 160)).join('');
					console.assert(dotStr.length === 160 * 4);
					const idStr = [...new Set([...dotStr].map((e, i) => (e === '1') ? `#dot-${i}` : '#dummy'))].join(',');
					return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}"><style type="text/css">rect {opacity: ${OPACITY_OFF}} ${idStr} {opacity: ${OPACITY_ON}}</style><g fill="currentColor">${barRectsSvg}</g></svg>`;
				};
			})(),
		},
	},
];

export const supportedIds = Object.freeze([jsonGs, jsonLcd].map((json) => json._idKeys).flat());
export const parseParam = Object.freeze(makeParamParser((idKey, address, _) => {
	switch (idKey) {
	case '41 42':
		return {parser: parserGs, additionalParsers: additionalParsersGs};

	case '41 45':
		if (address.length === 3) {
			return {parser: parserLcd, additionalParsers: additionalParsersLcd};
//		} else if (address.length === 4) {
//			return {parser: parserDevice};
		} else {
			return {};
		}

	default:
		return {};
	}
}));
