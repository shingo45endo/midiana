import {getParamParser} from './param/param_parsers.js';

export function analyzeParams(idKey, params, values) {
	const parser = getParamParser(idKey);
	if (!parser) {
		return null;
	}

	return parser(idKey, params, values);
}

export function analyzeSysExParams(mes) {
	const {_idKey: idKey, _paramKeys: paramKeys, _valueKeys: valueKeys, requiredSize} = mes;
	if (!idKey || !paramKeys) {
		return null;
	}

	const params = (paramKeys ?? []).map((key) => canonicalize(mes[key])).flat();
	const values = (valueKeys ?? []).map((key) => canonicalize(mes[key])).flat();

	if (!valueKeys && requiredSize) {
		// For request-type SysExs, passes dummy data equal to the specified data size.
		const infoLists = analyzeParams(idKey, params, [...new Array(Math.min(requiredSize, 256)).fill(0)]);
		// Picks only the top-level info and removes any information related to values.
		const {values, rawValues, valueText, valueHtml, ...rest} = infoLists?.[0] ?? {};

		return [rest];

	} else {
		return analyzeParams(idKey, params, values);
	}

	function canonicalize(array) {
		return (!Array.isArray(array) && 'length' in array) ? Array.from(array) : array;
	}
}
