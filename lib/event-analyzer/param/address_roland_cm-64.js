import {makeResolvedJson} from '../json_refs.js';
import {makeAddressParser, makeAddressRegexp, makeParamParser} from './address_common.js';

import json from './address_41_16_cm-64.json' assert {type: 'json'};

const parser = makeAddressParser(makeResolvedJson(json));

const additionalParsers = [
	{
		regexp: makeAddressRegexp('10 00 04'),	// System Area (LA) > Partial Reserve
		size: 9,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 9);
				const sum = values.reduce((p, c) => p + c);
				return `${values.map((e) => String(e)).join(', ')} (sum: ${sum})`;
			},
			renderer: (() => {
				const thsHtml = [...new Array(10)].fill().map((_, i) => `<th>${(i < 9) ? String(i + 1) : 'sum'}</th>`).join('');
				return (...values) => {
					console.assert(values.length === 9);
					const sum = values.reduce((p, c) => p + c);
					const tdsHtml = [...values, -1].map((e) => `<td>${(e >= 0) ? e : sum}</td>`).join('');
					return `<table><thead><tr>${thsHtml}</tr></thead><tbody><tr>${tdsHtml}</tr></tbody></table>`;
				};
			})(),
		},
	},
	{
		regexp: makeAddressRegexp('52 00 04'),	// System Area (PCM) > Partial Reserve
		size: 6,
		replacer: {
			formatter: (...values) => {
				console.assert(values.length === 6);
				const sum = values.reduce((p, c) => p + c);
				return `${values.map((e) => String(e)).join(', ')} (sum: ${sum})`;
			},
			renderer: (() => {
				const thsHtml = [...new Array(7)].fill().map((_, i) => `<th>${(i < 6) ? String(i + 1) : 'sum'}</th>`).join('');
				return (...values) => {
					console.assert(values.length === 6);
					const sum = values.reduce((p, c) => p + c);
					const tdsHtml = [...values, -1].map((e) => `<td>${(e >= 0) ? e : sum}</td>`).join('');
					return `<table><thead><tr>${thsHtml}</tr></thead><tbody><tr>${tdsHtml}</tr></tbody></table>`;
				};
			})(),
		},
	},
];

export const supportedIds = Object.freeze(json._idKeys);
export const parseParam = Object.freeze(makeParamParser(() => ({parser, additionalParsers})));
