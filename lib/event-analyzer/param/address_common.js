import {formatters, makeFormatterFromTable, makeFormatterFromResolution} from '../formatters.js';
import {converters} from '../converters.js';
import {bytesToHex} from '../utilities.js';

function formatPlainValues(...values) {
	return values.map((value) => String(value)).join(', ');
}

function formatSummary(...values) {
	return String(values.length);
}

export function makeAddressParser(json) {
	console.assert(Array.isArray(json?._addrCarries), '"_addrCarries" not found');
	console.assert(json._addrCarries.length <= 5, 'Address digits too large');

	const addrBitNums = json._addrCarries.map((e) => (e) ? 7 : 10);
	function addr2int(digits) {
		let integer = 0;
		let shift = 0;
		for (let i = 0; i < digits.length && i < addrBitNums.length; i++) {
			integer |= digits[digits.length - 1 - i] << shift;
			shift += addrBitNums[addrBitNums.length - 1 - i];
		}
		return integer;
	}
	function int2addr(integer) {
		return addrBitNums.map((bit, i) => {
			const mask = (1 << bit) - 1;
			const shift = addrBitNums.slice(i + 1).reduce((p, c) => p + c, 0);
			return (integer >> shift) & mask;
		});
	}

	const addrInfo = {};
	const recurse = (obj, beginAddr, paramNames, parentProps) => {
		console.assert(typeof obj === 'object', 'Invalid data');
		console.assert(!(obj._content && obj.size), '"_content" and "size" cannot be mixed in an object');

		const props = Object.fromEntries(Object.entries({...parentProps, ...obj}).filter(([k, _]) => ['format', 'unit', 'resolution', 'table'].includes(k)));

		let endAddr = beginAddr + 1;
		let isIndividual = true;
		for (const key of [...Object.keys(obj).sort()]) {
			if (/^[0-9a-f ]+$/ui.test(key)) {
				const offset = addr2int(key.split(' ').map((e) => parseInt(e, 16)));
				const newParamNames = (obj[key].name) ? [...paramNames, obj[key].name] : paramNames;
				endAddr = recurse(obj[key], beginAddr + offset, newParamNames, props);
				isIndividual = false;
			} else if (key === '_content') {
				endAddr = recurse(obj._content, beginAddr, paramNames, props);
				isIndividual = false;
			} else if (key === 'size') {
				console.assert(endAddr <= beginAddr + obj.size);
				endAddr = beginAddr + obj.size;
			}
		}

		if ('_isIndividual' in obj) {
			isIndividual = obj._isIndividual;
		}

		const address = int2addr(beginAddr);
		const size = endAddr - beginAddr;
		console.assert(size > 0);

		if (!addrInfo[beginAddr]) {
			addrInfo[beginAddr] = [];
		}
		if (!addrInfo[beginAddr].some((info) => info.beginAddr === beginAddr && info.size === size)) {
			const {type, format, unit, resolution, table, _isVarLen: isVarLen} = {...props, ...obj};

			// Determines the format of the parameter.
			let formatter;
			if (Number.isFinite(resolution)) {
				formatter = makeFormatterFromResolution(resolution, format);
			} else if (table) {
				formatter = makeFormatterFromTable(table);
			} else {
				formatter = formatters[format];
			}
			if (!formatter) {
				formatter = formatPlainValues;
			}
			console.assert(formatter);

			// Registers the area if it is independent.
			if (isIndividual) {
				if (!isVarLen) {
					addrInfo[beginAddr].push({beginAddr, endAddr, size, address, paramNames, formatter, type, format, unit, resolution});
				} else {
					// If the area is variable length, registers for each length pattern.
					for (let s = size; s > 0; s--) {
						addrInfo[beginAddr].push({
							beginAddr,
							endAddr: beginAddr + s,
							size: s,
							address, paramNames, formatter, type, format, unit, resolution,
						});
					}
				}
			}

			// If the area consists of multi-byte elements, registers each element as alternate parser.
			const elemSize = converters[type]?.elemSize ?? 1;
			if (elemSize > 1 && obj.size > elemSize) {
				console.assert(obj.size % elemSize === 0);
				for (let i = (isVarLen) ? elemSize : 0; i < size; i += elemSize) {
					const addr = beginAddr + i;
					if (!addrInfo[addr]) {
						addrInfo[addr] = [];
					}
					addrInfo[addr].push({
						beginAddr: addr,
						endAddr:   addr + elemSize,
						size:      elemSize,
						address,
						paramNames: [...paramNames, `[${i}:${i + elemSize}]`],
						formatter, type, format,
					});
				}
			}

			// If the area contains multiple bytes, registers each byte as alternate parser.
			if (obj.size > 1) {
				const subFormat = (converters[type]) ? 'hex' : format;
				const subFormatter = formatters[subFormat] ?? formatPlainValues;
				for (let i = (isVarLen) ? 1 : 0; i < size; i++) {
					const addr = beginAddr + i;
					if (!addrInfo[addr]) {
						addrInfo[addr] = [];
					}
					addrInfo[addr].push({
						beginAddr: addr,
						endAddr:   addr + 1,
						size:      1,
						address,
						paramNames: [...paramNames, `[${i}]`],
						formatter: subFormatter,
						format: subFormat,
					});
				}
			}
		}

		return endAddr;
	};
	recurse(json, 0, [], {});

	return (address, values) => {
		console.assert(Array.isArray(address) && Array.isArray(values));
		console.assert(address.length === addrBitNums.length);

		const beginAddr = addr2int(address);

		const infoLists = [];
		for (const info of addrInfo[beginAddr] ?? []) {
			if (values.length === info.size) {
				infoLists.push({...info, rawValues: [...values]});
//				break;	// TODO: Consider that it is OK.
			}
		}

		if (infoLists.length === 0 && values.length > 1) {
			const endAddr = beginAddr + values.length;
			let addr = beginAddr;
			while (addr < endAddr) {
				let isFound = false;
				for (const info of addrInfo[addr] ?? []) {
					if (info.size <= endAddr - addr) {
						infoLists.push({...info, address: int2addr(addr), rawValues: values.slice(addr - beginAddr, addr - beginAddr + info.size)});
						addr += info.size;
						isFound = true;
						break;
					}
				}
				if (!isFound) {
					addr++;
				}
			}

			if (infoLists.length > 1) {
				const maxLen = Math.min(...infoLists.map((info) => info.paramNames.length));
				let matchLen = maxLen;
				for (let i = 0; i < maxLen; i++) {
					if (!infoLists.map((info) => info.paramNames[i]).every((e, _, a) => e === a[0])) {
						matchLen = i;
						break;
					}
				}

				// Makes a dummy item as a "summary" and pretends it.
				infoLists.unshift({
					size: values.length,
					address,
					paramNames: infoLists[0].paramNames.slice(0, matchLen),
					formatter: formatSummary,
					unit: 'byte',
					rawValues: [...values],
				});
			}
		}

		return infoLists.map((info) => {
			const {beginAddr: _beginAddr, endAddr: _endAddr, ...rest} = info;
			const makeArray = converters[info.type]?.makeArray;
			const values = (makeArray) ? makeArray(...info.rawValues) : [...info.rawValues];
			return Object.fromEntries(Object.entries({
				...rest,
				values,
			}).filter(([_, v]) => (v !== undefined)));
		});
	};
}

export function makeAddressRegexp(address) {
	console.assert(typeof address === 'string' || Array.isArray(address));
	const reStr = (typeof address === 'string') ? address : `(?:${address.join('|')})`;
	return new RegExp(String.raw`^${reStr}$`, 'u');
}

export function makeParamParser(getParsers) {
	return (idKey, address, values) => {
		const {parser, additionalParsers} = getParsers(idKey, address, values);
		if (!parser) {
			return null;
		}

		const infoLists = parser(address, values);
		if (additionalParsers) {
			infoLists.forEach((info) => {
				const addrStr = bytesToHex(address);
				for (const parser of additionalParsers) {
					if (parser.regexp.test(addrStr) && (parser.size ?? 1) === info.values.length) {
						Object.assign(info, parser.replacer);
						break;
					}
				}
			});
		}

		return infoLists.map((info) => {
			const {formatter, renderer, ...rest} = info;
			const {values} = rest;
			rest.valueText = formatter(...values);
			if (renderer) {
				rest.valueHtml = renderer(...values);
			}
			return rest;
		});
	};
}
