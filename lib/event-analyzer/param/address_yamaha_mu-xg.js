import {makeResolvedJson} from '../json_refs.js';
import {makeAddressParser, makeAddressRegexp, makeParamParser} from './address_common.js';

import jsonXg from './address_43_4c_xg.json' with {type: 'json'};
import jsonMuNative from './address_43_49_mu-native.json' with {type: 'json'};
import jsonQs300 from './address_43_4b_qs300.json' with {type: 'json'};
import jsonP50m from './address_43_55_p50-m.json' with {type: 'json'};
import jsonVl70m from './address_43_57_vl70-m.json' with {type: 'json'};
import jsonPlgSg from './address_43_5d_plg-sg.json' with {type: 'json'};
import jsonPlgDx from './address_43_62_plg-dx.json' with {type: 'json'};

const parsers = {
	'43 4c': makeAddressParser(makeResolvedJson(jsonXg)),
	'43 49': makeAddressParser(makeResolvedJson(jsonMuNative)),
	'43 4b': makeAddressParser(makeResolvedJson(jsonQs300)),
	'43 55': makeAddressParser(makeResolvedJson(jsonP50m)),
	'43 57': makeAddressParser(makeResolvedJson(jsonVl70m)),
	'43 5d': makeAddressParser(makeResolvedJson(jsonPlgSg)),
	'43 62': makeAddressParser(makeResolvedJson(jsonPlgDx)),
};

const additionalParsersXg = [
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

const tableSyllables = {
	'あ':     [0x01],
	'い':     [0x02],
	'う':     [0x03],
	'え':     [0x04],
	'お':     [0x05],
	'か':     [0x7a, 0x06, 0x01],
	'き':     [0x7a, 0x07, 0x02],
	'く':     [0x7a, 0x08, 0x03],
	'け':     [0x7a, 0x09, 0x04],
	'こ':     [0x7a, 0x0a, 0x05],
	'くぁ':   [0x7a, 0x0c, 0x3f, 0x01],
	'くぃ':   [0x7a, 0x0c, 0x40, 0x02],
	'くぇ':   [0x7a, 0x0c, 0x41, 0x04],
	'くぉ':   [0x7a, 0x0c, 0x42, 0x05],
	'さ':     [0x0d, 0x01],
	'すぃ':   [0x0e, 0x02],
	'す':     [0x0f, 0x03],
	'せ':     [0x10, 0x04],
	'そ':     [0x11, 0x05],
	'しゃ':   [0x12, 0x35, 0x01],
	'し':     [0x12, 0x02],
	'しゅ':   [0x12, 0x36, 0x03],
	'しぇ':   [0x12, 0x37, 0x04],
	'しょ':   [0x12, 0x38, 0x05],
	'た':     [0x7a, 0x13, 0x01],
	'てぃ':   [0x7a, 0x14, 0x02],
	'とぅ':   [0x7a, 0x15, 0x03],
	'て':     [0x7a, 0x16, 0x04],
	'と':     [0x7a, 0x17, 0x05],
	'ちゃ':   [0x7a, 0x18, 0x19, 0x35, 0x01],
	'ち':     [0x7a, 0x18, 0x19, 0x02],
	'ちゅ':   [0x7a, 0x18, 0x19, 0x36, 0x03],
	'ちぇ':   [0x7a, 0x18, 0x19, 0x37, 0x04],
	'ちょ':   [0x7a, 0x18, 0x19, 0x38, 0x05],
	'つぁ':   [0x7a, 0x1a, 0x1b, 0x01],
	'つぃ':   [0x7a, 0x1a, 0x1b, 0x02],
	'つ':     [0x7a, 0x1a, 0x1b, 0x03],
	'つぇ':   [0x7a, 0x1a, 0x1b, 0x04],
	'つぉ':   [0x7a, 0x1a, 0x1b, 0x05],
	'な':     [0x1c, 0x01],
	'に':     [0x1d, 0x02],
	'ぬ':     [0x1e, 0x03],
	'ね':     [0x1f, 0x04],
	'の':     [0x20, 0x05],
	'ナ':     [0x1c, 0x01],
	'ニ':     [0x1d, 0x02],
	'ヌ':     [0x1e, 0x03],
	'ネ':     [0x1f, 0x04],
	'ノ':     [0x20, 0x05],
	'は':     [0x23, 0x01],
	'ひ':     [0x24, 0x02],
	'ほぅ':   [0x25, 0x03],
	'へ':     [0x26, 0x04],
	'ほ':     [0x27, 0x05],
	'ふぁ':   [0x29, 0x01],
	'ふぃ':   [0x2a, 0x02],
	'ふ':     [0x2b, 0x03],
	'ふぇ':   [0x2c, 0x04],
	'ふぉ':   [0x2d, 0x05],
	'ま':     [0x2e, 0x01],
	'み':     [0x2f, 0x02],
	'む':     [0x30, 0x03],
	'め':     [0x31, 0x04],
	'も':     [0x32, 0x05],
	'マ':     [0x2e, 0x01],
	'ミ':     [0x2f, 0x02],
	'ム':     [0x30, 0x03],
	'メ':     [0x31, 0x04],
	'モ':     [0x32, 0x05],
	'や':     [0x35, 0x01],
	'ゆ':     [0x36, 0x03],
	'いぇ':   [0x37, 0x04],
	'よ':     [0x38, 0x05],
	'ら':     [0x39, 0x01],
	'り':     [0x3a, 0x02],
	'る':     [0x3b, 0x03],
	'れ':     [0x3c, 0x04],
	'ろ':     [0x3d, 0x05],
	'わ':     [0x3f, 0x01],
	'うぃ':   [0x40, 0x02],
	'うぇ':   [0x41, 0x04],
	'を':     [0x42, 0x05],
	'うぉ':   [0x42, 0x05],
	'が':     [0x7b, 0x43, 0x01],
	'ぎ':     [0x7b, 0x44, 0x02],
	'ぐ':     [0x7b, 0x45, 0x03],
	'げ':     [0x7b, 0x46, 0x04],
	'ご':     [0x7b, 0x47, 0x05],
	'ぐぁ':   [0x7b, 0x49, 0x3f, 0x01],
	'ぐぃ':   [0x7b, 0x49, 0x40, 0x02],
	'ぐぇ':   [0x7b, 0x49, 0x41, 0x04],
	'ぐぉ':   [0x7b, 0x49, 0x42, 0x05],
	'ざ':     [0x4a, 0x01],
	'ずぃ':   [0x4b, 0x02],
	'ず':     [0x4c, 0x03],
	'ぜ':     [0x4d, 0x04],
	'ぞ':     [0x4e, 0x05],
	'じゃ':   [0x7b, 0x4f, 0x01],
	'じ':     [0x7b, 0x50, 0x02],
	'じゅ':   [0x7b, 0x51, 0x03],
	'じぇ':   [0x7b, 0x52, 0x04],
	'じょ':   [0x7b, 0x53, 0x05],
	'だ':     [0x7b, 0x55, 0x01],
	'でぃ':   [0x7b, 0x56, 0x02],
	'どぅ':   [0x7b, 0x57, 0x03],
	'で':     [0x7b, 0x58, 0x04],
	'ど':     [0x7b, 0x59, 0x05],
	'ば':     [0x7b, 0x5b, 0x01],
	'び':     [0x7b, 0x5c, 0x02],
	'ぶ':     [0x7b, 0x5d, 0x03],
	'べ':     [0x7b, 0x5e, 0x04],
	'ぼ':     [0x7b, 0x5f, 0x05],
	'ヴぁ':   [0x61, 0x01],
	'ヴぃ':   [0x62, 0x02],
	'ヴ':     [0x63, 0x03],
	'ヴぇ':   [0x64, 0x04],
	'ヴぉ':   [0x65, 0x05],
	'ぱ':     [0x7a, 0x66, 0x01],
	'ぴ':     [0x7a, 0x67, 0x02],
	'ぷ':     [0x7a, 0x68, 0x03],
	'ぺ':     [0x7a, 0x69, 0x04],
	'ぽ':     [0x7a, 0x6a, 0x05],
	'きゃ':   [0x7a, 0x0b, 0x35, 0x01],
	'きゅ':   [0x7a, 0x0b, 0x36, 0x03],
	'きぇ':   [0x7a, 0x0b, 0x37, 0x04],
	'きょ':   [0x7a, 0x0b, 0x38, 0x05],
	'にゃ':   [0x21, 0x35, 0x01],
	'にゅ':   [0x21, 0x36, 0x03],
	'にぇ':   [0x21, 0x37, 0x04],
	'にょ':   [0x21, 0x38, 0x05],
	'ニャ':   [0x21, 0x35, 0x01],
	'ニュ':   [0x21, 0x36, 0x03],
	'ニェ':   [0x21, 0x37, 0x04],
	'ニョ':   [0x21, 0x38, 0x05],
	'ひゃ':   [0x28, 0x35, 0x01],
	'ひゅ':   [0x28, 0x36, 0x03],
	'ひぇ':   [0x28, 0x37, 0x04],
	'ひょ':   [0x28, 0x38, 0x05],
	'みゃ':   [0x33, 0x35, 0x01],
	'みゅ':   [0x33, 0x36, 0x03],
	'みぇ':   [0x33, 0x37, 0x04],
	'みょ':   [0x33, 0x38, 0x05],
	'ミャ':   [0x33, 0x35, 0x01],
	'ミュ':   [0x33, 0x36, 0x03],
	'ミェ':   [0x33, 0x37, 0x04],
	'ミョ':   [0x33, 0x38, 0x05],
	'りゃ':   [0x3e, 0x35, 0x01],
	'りゅ':   [0x3e, 0x36, 0x03],
	'りぇ':   [0x3e, 0x37, 0x04],
	'りょ':   [0x3e, 0x38, 0x05],
	'ぎゃ':   [0x7b, 0x48, 0x35, 0x01],
	'ぎゅ':   [0x7b, 0x48, 0x36, 0x03],
	'ぎぇ':   [0x7b, 0x48, 0x37, 0x04],
	'ぎょ':   [0x7b, 0x48, 0x38, 0x05],
	'でゃ':   [0x7b, 0x5a, 0x35, 0x01],
	'でゅ':   [0x7b, 0x5a, 0x36, 0x03],
	'でぇ':   [0x7b, 0x5a, 0x37, 0x04],
	'でょ':   [0x7b, 0x5a, 0x38, 0x05],
	'じぃゃ': [0x7b, 0x54, 0x35, 0x01],
	'じぃゅ': [0x7b, 0x54, 0x36, 0x03],
	'じぃぇ': [0x7b, 0x54, 0x37, 0x04],
	'じぃぉ': [0x7b, 0x54, 0x38, 0x05],
	'びゃ':   [0x7b, 0x60, 0x35, 0x01],
	'びゅ':   [0x7b, 0x60, 0x36, 0x03],
	'びぇ':   [0x7b, 0x60, 0x37, 0x04],
	'びょ':   [0x7b, 0x60, 0x38, 0x05],
	'ぴゃ':   [0x7a, 0x6b, 0x35, 0x01],
	'ぴゅ':   [0x7a, 0x6b, 0x36, 0x03],
	'ぴぇ':   [0x7a, 0x6b, 0x37, 0x04],
	'ぴょ':   [0x7a, 0x6b, 0x38, 0x05],
	'ガ':     [0x7b, 0x6c, 0x01],
	'ギ':     [0x7b, 0x6d, 0x02],
	'グ':     [0x7b, 0x6e, 0x03],
	'ゲ':     [0x7b, 0x6f, 0x04],
	'ゴ':     [0x7b, 0x70, 0x05],
	'ギャ':   [0x7b, 0x71, 0x35, 0x01],
	'ギュ':   [0x7b, 0x71, 0x36, 0x03],
	'ギェ':   [0x7b, 0x71, 0x37, 0x04],
	'ギョ':   [0x7b, 0x71, 0x38, 0x05],
	'ん':     [0x22],
	'ン(m)':  [0x34],
	'ン(ng)': [0x72],
	'キ':     [0x7a, 0x07],
	'ク':     [0x7a, 0x08],
	'クィ':   [0x7a, 0x0c, 0x79, 0x74],
	'スィ':   [0x0e, 0x74],
	'ス':     [0x0f],
	'シ':     [0x12],
	'シュ':   [0x12, 0x78, 0x75],
	'ティ':   [0x7a, 0x14, 0x74],
	'トゥ':   [0x7a, 0x15, 0x75],
	'チ':     [0x7a, 0x18, 0x19],
	'チュ':   [0x7a, 0x18, 0x19, 0x78, 0x75],
	'ツィ':   [0x7a, 0x1a, 0x1b, 0x74],
	'ツ':     [0x7a, 0x1a, 0x1b, 0x75],
	'ヒ':     [0x24],
	'フ':     [0x2b],
	'ピ':     [0x7a, 0x67, 0x74],
	'プ':     [0x7a, 0x68, 0x75],
	'キャ':   [0x7a, 0x0b, 0x78, 0x73],
	'キュ':   [0x7a, 0x0b, 0x78, 0x75],
	'ヒャ':   [0x28, 0x78, 0x73],
	'ヒュ':   [0x28, 0x78, 0x75],
	'ピャ':   [0x7a, 0x6b, 0x78, 0x73],
	'ピュ':   [0x7a, 0x6b, 0x78, 0x75],
	'っ':     [0x7a],
	'▼':     [0x7e],
	'(EoS)':  [0x7f],
};

function getLylicLetter(bytes) {
	let allPhones = bytes.filter((_, i) => (i % 2 === 0));
	let letterStr = '';
	while (allPhones.length > 0) {
		let isMatched = false;
		for (const [letter, phones] of Object.entries(tableSyllables)) {
			if (phones.every((e, i) => (e === allPhones[i]))) {
				letterStr += letter;
				allPhones = allPhones.slice(phones.length);
				isMatched = true;
				break;
			}
		}
		if (!isMatched) {
			allPhones.shift();			
		}
	}

	return letterStr;
}

const additionalParsersPlgSg = [
	...(new Array(127)).fill().map((_, i) => ({
		regexp: makeAddressRegexp('03 0. 00'),	// PhoneSEQ
		size: i + 2,
		replacer: {
			formatter: (...values) => {
				return getLylicLetter(values);
			},
			renderer: (...values) => {
				let tdPhHtml = '';
				let tdDurHtml = '';
				let totalDuration = 0;
				for (let i = 0; i < Math.trunc((values.length + 1) / 2) * 2; i++) {
					if (i % 2 === 0) {
						tdPhHtml += `<td>${jsonPlgSg.tablePhoneme[values[i]]}</td>`;
					} else {
						if (i < values.length) {
							totalDuration += values[i];
							tdDurHtml += `<td title="${values[i]}">${values[i] * 7.5}</td>`;
						} else {
							tdDurHtml += `<td>-</td>`;
						}
					}
				}
				tdPhHtml = `<td>${getLylicLetter(values)}</td>` + tdPhHtml;
				tdDurHtml = `<td>${values.filter((_, i) => (i % 2 === 1)).every((e) => (e !== 0)) ? totalDuration : ''}</td>` + tdDurHtml;
				return `<table><tbody><tr>${tdPhHtml}</tr><tr>${tdDurHtml}</tr></tbody></table>`;
			},
		},
	})).flat(),
];

export const supportedIds = Object.freeze([jsonXg, jsonMuNative, jsonQs300, jsonP50m, jsonVl70m, jsonPlgSg, jsonPlgDx].map((json) => json._idKeys).flat());
export const parseParam = Object.freeze(makeParamParser((idKey) => {
	switch (idKey) {
	case '43 4c':
		return {parser: parsers[idKey], additionalParsers: additionalParsersXg};

	case '43 5d':
		return {parser: parsers[idKey], additionalParsers: additionalParsersPlgSg};

	default:
		return {parser: parsers[idKey]};
	}
}));
