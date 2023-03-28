
import {getParamParser} from './param/param_parsers.js';

export function analyzeParams(idKey, params, values) {
	const parser = getParamParser(idKey);
	if (!parser) {
		return null;
	}

	return parser(idKey, params, values);
}

export function analyzeSysExParams(mes) {
	const {_idKey: idKey, _paramKeys: paramKeys, _valueKeys: valueKeys} = mes;
	if (!idKey || !paramKeys) {
		return null;
	}

	const params = paramKeys.map((key) => canonicalize(mes[key])).flat();
	const values = valueKeys.map((key) => canonicalize(mes[key])).flat();

	return analyzeParams(idKey, params, values);

	function canonicalize(array) {
		return (!Array.isArray(array) && 'length' in array) ? Array.from(array) : array;
	}
}
