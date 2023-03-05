export function bytesToHex(bytes) {
	console.assert(bytes?.length);
	return [...bytes].map((e) => `0${Number(e).toString(16)}`.slice(-2)).join(' ');
}

export function splitArrayByN(elems, num) {
	console.assert(elems?.length && num > 0);
	return elems.reduce((p, _, i, a) => {
		if (i % num === 0) {
			p.push(a.slice(i, i + num));
			console.assert(p[p.length - 1].length === num, `The length of array must be multiple of ${num}.`);
		}
		return p;
	}, []);
}

export function stripEnclosure(bytes) {
	console.assert(bytes?.length);
	console.assert(isValidSysEx(bytes));

	return bytes.slice(1, -1);
}

export function convert7to8bits(bytes) {
	console.assert(bytes?.length);

	const packets = [...bytes].reduce((p, _, i, a) => {
		if (i % 8 === 0) {
			p.push(a.slice(i, i + 8));
		}
		return p;
	}, []);
	const decodedBytes = packets.reduce((p, c) => {
		const msbs = c.shift();
		const bytes = c.map((e, i) => e | (((msbs & (1 << i)) !== 0) ? 0x80 : 0x00));
		p.push(...bytes);
		return p;
	}, []);

	return decodedBytes;
}

export function calcCheckSumRol(bytes) {
	console.assert(bytes?.length);
	return (0x80 - calcCheckSum(bytes)) % 0x80;
}

export function calcCheckSum(bytes) {
	console.assert(bytes?.length);
	return bytes.reduce((p, c) => p + c) % 0x80;
}

export function calcCheckXor(bytes) {
	console.assert(bytes?.length);
	return bytes.reduce((p, c) => p ^ c);
}

export function isCheckSumValid(bytes) {
	console.assert(bytes?.length);
	return ((calcCheckSum(bytes)) % 0x80 === 0);
}

export function isCheckXorValid(bytes) {
	console.assert(bytes?.length);
	return (calcCheckXor(bytes) === 0);
}

export function isIn7bitRange(byte) {
	console.assert(Number.isInteger(byte));
	return ((0x00 <= byte) && (byte <= 0x7f));
}

export function isIn8bitRange(byte) {
	console.assert(Number.isInteger(byte));
	return ((0x00 <= byte) && (byte <= 0xff));
}

export function isValid7bitHex(hexStr) {
	console.assert(typeof hexStr === 'string');
	return /^(?:[0-7][0-9a-f](?: |$))+$/u.test(hexStr);
}

export function isValidSysEx(bytes) {
	console.assert(bytes?.length);

	// Is the SysEx start with "f0" and end with "f7"?
	if (bytes.length < 3 || bytes[0] !== 0xf0 || bytes[bytes.length - 1] !== 0xf7) {
		return false;
	}

	// Are the data bytes are within 7-bit?
	if (bytes.slice(1, -1).some((e) => !isIn7bitRange(e))) {
		return false;
	}

	// Is there any valid payload? ("2": f0 and f7)
	if (bytes.length - 2 - ((bytes[1] !== 0x00) ? 1 : 3) <= 0) {
		return false;
	}

	return true;
}
