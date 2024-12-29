import {makeResolvedJson} from '../json_refs.js';
import {makeAddressParser, makeAddressRegexp, makeParamParser} from './address_common.js';

import jsonXg from './address_43_4c_xg.json' with {type: 'json'};

const parsers = {
	'43 4c': makeAddressParser(makeResolvedJson(jsonXg)),
};

const additionalParsers = [
	...(new Array(48)).fill().map((_, begin) => {
		const sizes = (new Array(48 - begin)).fill().map((_, i) => 48 - begin - i);
		return sizes.map((size) => {
			const BARS_WIDTH  = 220;
			const BARS_HEIGHT = 120;
			const RATIO = BARS_HEIGHT / BARS_WIDTH;
			const INTERVAL = BARS_WIDTH / 16;
			const GAP = INTERVAL * 0.1;
			const DOT_WIDTH  = INTERVAL - GAP;
			const DOT_HEIGHT = INTERVAL * RATIO - GAP;
			const OPACITY_ON  = 0.75;
			const OPACITY_OFF = 0.125;

			const barRectsSvgs = [...new Array(48)].map((_, i) => {
				const baseX = Math.trunc(i / 16) * 7;
				const baseY = i % 16;
				return (new Array(Math.min(7, 16 - baseX))).fill().map((_, j) => {
					const x = INTERVAL * (baseX + j);
					const y = INTERVAL * baseY * RATIO;
					return `<rect id="dot-${baseX + j + baseY * 16}" x="${x}" y="${y}" width="${DOT_WIDTH}" height="${DOT_HEIGHT}" />`;
				}).join('');
			});

			return {
				regexp: makeAddressRegexp(`07 00 ${begin.toString(16).padStart(2, '0')}`),	// Display Bitmap Data
				size,
				replacer: {
					formatter: (...values) => {
						const dataBytes = (new Array(48)).fill().map((_, i) => (begin <= i && i < begin + size) ? (values[i - begin] & 0x7f) : 0x00);
						const dotBits = [...new Array(16)].map((_, i) => (dataBytes[i] << 9) | (dataBytes[i + 16] << 2) | (dataBytes[i + 32] >> 5));
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
					renderer: (...values) => {
						const isInRanges = (new Array(48)).fill().map((_, i) => (begin <= i && i < begin + size));
						const dataBytes = isInRanges.map((e, i) => (e) ? (values[i - begin] & 0x7f) : 0x00);
						const dotBits = [...new Array(16)].map((_, i) => (dataBytes[i] << 9) | (dataBytes[i + 16] << 2) | (dataBytes[i + 32] >> 5));
						const dotStr = dotBits.map((e) => e.toString(2).padStart(16, '0')).join('');
						const idStr = [...new Set([...dotStr].map((e, i) => (e === '1') ? `#dot-${i}` : '#dummy'))].join(',');
						return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BARS_WIDTH} ${BARS_HEIGHT}"><style type="text/css">rect {opacity: ${OPACITY_OFF}} ${idStr} {opacity: ${OPACITY_ON}}</style><g fill="currentColor">${barRectsSvgs.filter((e, i) => isInRanges[i]).join('')}</g></svg>`;
					},
				},
			};
		});
	}).flat(),
];

export const supportedIds = Object.freeze([jsonXg].map((json) => json._idKeys).flat());
export const parseParam = Object.freeze(makeParamParser((idKey) => {
	switch (idKey) {
	case '43 4c':
		return {parser: parsers[idKey], additionalParsers};

	default:
		return {parser: parsers[idKey]};
	}
}));
