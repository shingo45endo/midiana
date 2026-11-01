const decoders = new Map();

// windows-1252 maps 80h-9Fh to typographic characters (WHATWG). Node's TextDecoder (ICU) leaves them as C1 controls, so they are
// mapped here when the runtime does that. Browsers are not affected. 81h, 8Dh, 8Fh, 90h and 9Dh stay as they are (undefined).
const tableWindows1252C1Chars = {
	0x80: '€',
	0x82: '‚',
	0x83: 'ƒ',
	0x84: '„',
	0x85: '…',
	0x86: '†',
	0x87: '‡',
	0x88: 'ˆ',
	0x89: '‰',
	0x8a: 'Š',
	0x8b: '‹',
	0x8c: 'Œ',
	0x8e: 'Ž',
	0x91: '‘',
	0x92: '’',
	0x93: '“',
	0x94: '”',
	0x95: '•',
	0x96: '–',
	0x97: '—',
	0x98: '˜',
	0x99: '™',
	0x9a: 'š',
	0x9b: '›',
	0x9c: 'œ',
	0x9e: 'ž',
	0x9f: 'Ÿ',
};
const isWindows1252C1Broken = (new TextDecoder('windows-1252').decode(new Uint8Array([0x92])) !== '’');

// NEC PC-98 dependent characters (CP932 8540h-86FFh) that are not in the decoder
const tablePc98DependentChars = {
	0x857b: '¥',	// YEN SIGN
	0x859e: '‾',	// OVERLINE

	0x85de: 'ヰ',
	0x85df: 'ヱ',
	0x85e0: 'ヮ',
	0x85e1: 'ヵ',
	0x85e2: 'ヶ',
	0x85e3: 'ヴ',
	0x85e4: 'ガ',
	0x85e5: 'ギ',
	0x85e6: 'グ',
	0x85e7: 'ゲ',
	0x85e8: 'ゴ',
	0x85e9: 'ザ',
	0x85ea: 'ジ',
	0x85eb: 'ズ',
	0x85ec: 'ゼ',
	0x85ed: 'ゾ',
	0x85ee: 'ダ',
	0x85ef: 'ヂ',
	0x85f0: 'ヅ',
	0x85f1: 'デ',
	0x85f2: 'ド',
	0x85f3: 'バ',
	0x85f4: 'パ',
	0x85f5: 'ビ',
	0x85f6: 'ピ',
	0x85f7: 'ブ',
	0x85f8: 'プ',
	0x85f9: 'ベ',
	0x85fa: 'ペ',
	0x85fb: 'ボ',
	0x85fc: 'ポ',
};

function getDecoder(encoding) {
	if (!decoders.has(encoding)) {
		decoders.set(encoding, new TextDecoder(encoding));
	}
	return decoders.get(encoding);
}

// Decodes Shift_JIS text that may contain the NEC PC-98 dependent characters and the PC-98 user-defined characters.
function decodeNec932(bytes) {
	const decoder = getDecoder('shift_jis');

	// Checks whether the bytes seem to contain PC-98 dependent or user-defined characters.
	if ([...bytes].some((e, i, a) => (i > 0) && (isPc98DependentChars((a[i - 1] << 8) | e) || isPc98UserDefinedChars((a[i - 1] << 8) | e)))) {	// It allows false positive.
		// Separates from the bytes to each character code according to Shift_JIS encoding.
		let leadingByte = -1;
		const charArrays = [...bytes].reduce((p, c) => {
			if (leadingByte >= 0) {
				p.push([leadingByte, c]);
				leadingByte = -1;
			} else if ((0x81 <= c && c <= 0x9f) || (0xe0 <= c && c <= 0xfc)) {
				leadingByte = c;
			} else {
				p.push([c]);
			}
			return p;
		}, []);

		// Replaces PC-98 dependent characters into Unicode's ones.
		return charArrays.map((e) => {
			const cp932code = e.reduce((p, c) => (p << 8) | c);
			if (tablePc98DependentChars[cp932code]) {
				return tablePc98DependentChars[cp932code];
			} else if ((0x86a2 <= cp932code && cp932code <= 0x86ee)) {	// PC-98 dependent full-width box drawing
				return String.fromCodePoint(cp932code - 0x61a2);
			} else if (0x8643 <= cp932code && cp932code <= 0x868f) {	// PC-98 dependent multi-byte half-width box drawing
				return String.fromCodePoint(cp932code - 0x6143);
			} else if (0x859f <= cp932code && cp932code <= 0x85dd) {	// PC-98 dependent multi-byte half-width katakana
				return String.fromCodePoint(cp932code + 0x79c2);
			} else if (0x8540 <= cp932code && cp932code <= 0x859e) {	// PC-98 dependent multi-byte half-width JIS X 0201
				return String.fromCodePoint(cp932code - 0x851f);
			} else if (isPc98UserDefinedChars(cp932code)) {	// PC-98 user-defined character
				return '�';
			} else {
				return decoder.decode(new Uint8Array(e));
			}
		}).join('');

	} else {
		return decoder.decode(bytes);
	}

	function isPc98DependentChars(cp932code) {
		return (0x8540 <= cp932code && cp932code <= 0x86ff);
	}

	// PC-98 user-defined characters (JIS rows 85-94, lead byte EBh-EFh) that have no mapping in CP932.
	// A browser re-reads the ASCII trail byte of an unmapped pair as a letter ("ECh 78h" becomes "�x"), so such a pair is replaced as a whole.
	function isPc98UserDefinedChars(cp932code) {
		const trailByte = cp932code & 0xff;
		if (!(0xeb00 <= cp932code && cp932code <= 0xefff) || !((0x40 <= trailByte && trailByte <= 0x7e) || (0x80 <= trailByte && trailByte <= 0xfc))) {
			return false;
		}
		return (decoder.decode(new Uint8Array([cp932code >> 8, trailByte])).codePointAt(0) === 0xfffd);
	}
}

// Decodes one text string of a MIDI file with the given encoding (WHATWG encoding label).
export function decodeTextString(bytes, encoding, options = {}) {
	console.assert(bytes instanceof Uint8Array);
	console.assert(typeof encoding === 'string');

	// Cuts the bytes at the first NUL. Some sequencers put NUL and garbage after the text. (UTF-16 has NUL in every Latin character.)
	const isUtf16 = (encoding === 'utf-16le' || encoding === 'utf-16be' || encoding === 'utf-16');
	let target = bytes;
	if (isUtf16 && target.length % 2 !== 0) {
		target = target.subarray(0, target.length - 1);	// A wide string cut at a byte limit loses the last byte
	}
	if (!options.isNulKept && !isUtf16) {
		const index = bytes.indexOf(0x00);
		if (index >= 0) {
			target = bytes.subarray(0, index);
		}
	}

	// Removes the BOM.
	if (encoding === 'utf-8' && target.length >= 3 && target[0] === 0xef && target[1] === 0xbb && target[2] === 0xbf) {
		target = target.subarray(3);
	} else if (isUtf16 && target.length >= 2 &&
		((target[0] === 0xff && target[1] === 0xfe) || (target[0] === 0xfe && target[1] === 0xff))) {
		target = target.subarray(2);
	}

	let text;
	if (encoding === 'shift_jis' || encoding === 'windows-31j') {
		text = decodeNec932(target);
	} else {
		const decoder = getDecoder(encoding);
		text = decoder.decode(target);
		if (decoder.encoding === 'windows-1258') {
			text = text.normalize('NFC');	// The tone marks are combining characters
		}
		if (isWindows1252C1Broken && decoder.encoding === 'windows-1252') {
			text = text.replace(/[\u0080-\u009f]/gu, (e) => tableWindows1252C1Chars[e.charCodeAt(0)] ?? e);
		}
	}

	const isLossy = text.includes('�');
	return {text, isLossy};
}
