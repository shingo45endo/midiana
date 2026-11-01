const utf16Decoders = {'utf-16le': new TextDecoder('utf-16le'), 'utf-16be': new TextDecoder('utf-16be')};

// In UTF-16 text of one script, the high-order bytes are mostly the same (00h for Latin, 04h for Cyrillic, 30h for kana) or NUL.
function hasUniformHighBytes(bytes, highByteOffset) {
	const counts = new Map();
	let total = 0;

	for (let i = highByteOffset; i < bytes.length; i += 2) {
		counts.set(bytes[i], (counts.get(bytes[i]) ?? 0) + 1);
		total++;
	}

	if (total < 2) {
		return false;
	}
	const mostCommon = Math.max(...counts.values());
	const nulCount = counts.get(0x00) ?? 0;
	return (mostCommon + ((nulCount === mostCommon) ? 0 : nulCount)) >= total * 0.7;
}

// Unicode blocks expected in the text of MIDI files, to check that a decoding (UTF-8, UTF-16) gives plausible text and not just a valid byte sequence
const plausibleCodePointRanges = [
	[0x00a0, 0x017f],	// Latin-1 Supplement (from NO-BREAK SPACE), Latin Extended-A
	[0x01a0, 0x01b0],	// Latin Extended-B (the part from O WITH HORN to U WITH HORN, for Vietnamese)
	[0x0300, 0x036f],	// Combining Diacritical Marks
	[0x0370, 0x03ff],	// Greek and Coptic
	[0x0400, 0x04ff],	// Cyrillic
	[0x1e00, 0x1eff],	// Latin Extended Additional (Vietnamese letters with tone marks)
	[0x2000, 0x206f],	// General Punctuation
	[0x20a0, 0x20cf],	// Currency Symbols
	[0x2100, 0x214f],	// Letterlike Symbols (TRADE MARK SIGN and so on)
	[0x2190, 0x21ff],	// Arrows
	[0x2460, 0x24ff],	// Enclosed Alphanumerics (circled numbers)
	[0x2500, 0x257f],	// Box Drawing
	[0x25a0, 0x26ff],	// Geometric Shapes, Miscellaneous Symbols (music symbols)
	[0x3000, 0x30ff],	// CJK Symbols and Punctuation, Hiragana, Katakana
	[0x3130, 0x318f],	// Hangul Compatibility Jamo
	[0x3400, 0x4dbf],	// CJK Unified Ideographs Extension A
	[0x4e00, 0x9fff],	// CJK Unified Ideographs
	[0xac00, 0xd7af],	// Hangul Syllables
	[0xff00, 0xffef],	// Halfwidth and Fullwidth Forms
];
console.assert(plausibleCodePointRanges.every(([from, to]) => (from <= to)));

// ASCII is always plausible. Control characters other than TAB, LF and CR are not.
export function isPlausibleCodePoint(codePoint) {
	console.assert(Number.isInteger(codePoint));
	if (codePoint < 0x80) {
		return (codePoint >= 0x20 || codePoint === 0x09 || codePoint === 0x0a || codePoint === 0x0d);
	}
	return plausibleCodePointRanges.some(([from, to]) => (from <= codePoint && codePoint <= to));
}

// Whether the decoded text is plausible: no replacement character, no NUL, 80% of the characters in the expected blocks.
function isPlausibleUtf16(bytes, label) {
	let total = 0;
	let plausible = 0;

	for (const char of utf16Decoders[label].decode(bytes)) {
		const codePoint = char.codePointAt(0);
		if (codePoint === 0xfffd || codePoint === 0x00) {
			return false;
		}
		total++;
		if (isPlausibleCodePoint(codePoint)) {
			plausible++;
		}
	}

	return (total > 0 && plausible >= total * 0.8);
}

// Detects a UTF-16 string: a BOM, or NUL (or a uniform high byte) at every other position. Returns 'utf-16le', 'utf-16be' or null.
// Decided per string: a file can have UTF-16 track names (wide strings of a Windows tool) next to ASCII or 8-bit lyrics.
export function detectUtf16String(bytes) {
	console.assert(bytes instanceof Uint8Array);

	if (bytes.length % 2 !== 0) {
		bytes = bytes.subarray(0, bytes.length - 1);	// A wide string cut at a byte limit loses the last byte
	}
	if (bytes.length < 4) {
		return null;
	}

	if (bytes[0] === 0xff && bytes[1] === 0xfe) {
		const body = bytes.subarray(2);
		return (hasUniformHighBytes(body, 1) && isPlausibleUtf16(body, 'utf-16le')) ? 'utf-16le' : null;
	}
	if (bytes[0] === 0xfe && bytes[1] === 0xff) {
		const body = bytes.subarray(2);
		return (hasUniformHighBytes(body, 0) && isPlausibleUtf16(body, 'utf-16be')) ? 'utf-16be' : null;
	}
	// Without a BOM, a NUL at every other position is required (plain Latin text; the common case: wide strings of Windows tools)
	let oddNuls = 0;
	let evenNuls = 0;

	for (let i = 0; i < bytes.length; i++) {
		if (bytes[i] === 0x00) {
			if (i % 2 === 0) {
				evenNuls++;
			} else {
				oddNuls++;
			}
		}
	}

	const pairCount = bytes.length / 2;
	if (oddNuls >= pairCount * 0.7 && evenNuls === 0 && isPlausibleUtf16(bytes, 'utf-16le')) {
		return 'utf-16le';
	}
	if (evenNuls >= pairCount * 0.7 && oddNuls === 0 && isPlausibleUtf16(bytes, 'utf-16be')) {
		return 'utf-16be';
	}
	return null;
}

// Collects the text strings (raw bytes) from the result of parseMidiFile(). `utf16` is the UTF-16 label of a string, or null.
export function collectTextStrings(content) {
	console.assert(content && Array.isArray(content.chunks));

	const strings = [];
	let trackNo = -1;

	for (const chunk of content.chunks) {
		const {tag, content: chunkContent} = chunk;
		if (!chunkContent || typeof chunkContent !== 'object') {
			continue;
		}
		if (tag === 'MTrk') {
			trackNo++;
		}

		if (Array.isArray(chunkContent.events)) {
			// Track-like chunks: MTrk, XFIH, XFKM and so on.
			for (const event of chunkContent.events) {
				const {bytes} = event;
				if (!bytes || bytes[0] !== 0xff || !(0x01 <= bytes[1] && bytes[1] <= 0x0f)) {	// Meta types 01h-0Fh are reserved for text
					continue;
				}
				const data = readMetaEventData(bytes);
				if (!data) {
					continue;
				}
				const metaType = bytes[1];
				const obj = {
					bytes:  data,
					source: `${tag}:${metaType.toString(16).padStart(2, '0')}`,
					tag, metaType, tick: event.tick,
					utf16:  detectUtf16String(data),
				};
				if (tag === 'MTrk') {
					obj.trackNo = trackNo;
				}
				strings.push(obj);
			}

		} else if (chunkContent.rawString instanceof Uint8Array) {
			// String chunks: RIFF INFO (INAM, ICOP, ...), DISP (CF_TEXT), Yamaha Style File (Sdec, Mnam, ...)
			strings.push({bytes: chunkContent.rawString, source: tag, tag, utf16: detectUtf16String(chunkContent.rawString)});
		}
	}

	return strings;
}

// The data of a meta event ("FF type length data"; the length is a variable-length quantity). Returns null when the event is malformed.
function readMetaEventData(bytes) {
	let length = 0;
	let index = 2;
	for (; index < bytes.length && index < 6; index++) {
		length = (length << 7) | (bytes[index] & 0x7f);
		if ((bytes[index] & 0x80) === 0) {
			break;
		}
	}
	if (index >= bytes.length || (bytes[index] & 0x80) !== 0 || bytes.length !== index + 1 + length) {
		return null;
	}
	return new Uint8Array(bytes.slice(index + 1));	// The events of parseMidiFile hold plain arrays
}

function cutAtNul(bytes) {
	const index = bytes.indexOf(0x00);
	return (index >= 0) ? bytes.subarray(0, index) : bytes;
}

// A string filled with FDh-FFh is uninitialized memory (seen in RCP memo lines), not text.
function isGarbage(bytes) {
	let count = 0;

	for (const byte of bytes) {
		if (byte >= 0xfd) {
			count++;
		}
	}

	return (bytes.length >= 4 && count * 2 >= bytes.length);
}

// Joins the collected strings into one byte stream for the guesser. UTF-16 strings are left out (they are decided per string).
// Syllable-like runs (many short strings of the same kind in a row: lyrics, 1-character text, RCP memo lines) are concatenated
// without a separator to restore words and split 2-byte characters. Other strings are separated by LF.
export function assembleTextStream(strings, options = {}) {
	console.assert(Array.isArray(strings));

	const maxSyllableLength = options.maxSyllableLength ?? 6;
	const minSyllableRun = options.minSyllableRun ?? 3;

	// Normalizes each string and keeps its origin.
	const items = [];
	let utf16Count = 0;

	for (const string of strings) {
		const raw = (string instanceof Uint8Array) ? string : string.bytes;
		if (!(raw instanceof Uint8Array)) {
			continue;
		}
		const utf16 = (string instanceof Uint8Array) ? detectUtf16String(raw) : (string.utf16 ?? null);
		if (utf16) {
			utf16Count++;
			continue;
		}
		const bytes = cutAtNul(raw);
		if (bytes.length === 0 || isGarbage(bytes)) {
			continue;
		}
		// Plain arrays (tests) are one kind
		const groupKey = (string instanceof Uint8Array) ? 'raw' : `${string.tag}:${string.metaType}:${string.trackNo}`;
		items.push({bytes, source: string.source ?? null, groupKey});
	}

	// Splits into runs of the same kind.
	const runs = [];

	for (const item of items) {
		const lastRun = runs[runs.length - 1];
		if (lastRun && lastRun.groupKey === item.groupKey) {
			lastRun.items.push(item);
		} else {
			runs.push({groupKey: item.groupKey, items: [item]});
		}
	}

	// Decides whether each run is syllable-like.
	for (const run of runs) {
		const lengths = run.items.map((e) => e.bytes.length).sort((a, b) => a - b);
		const median = lengths[Math.floor(lengths.length / 2)];
		run.isSyllables = (run.items.length >= minSyllableRun && median <= maxSyllableLength);
	}

	// Builds the stream.
	const chunks = [];
	const segments = [];
	let offset = 0;
	let lastBytes = null;

	for (const run of runs) {
		for (const [itemIndex, item] of run.items.entries()) {
			const isJoined = (itemIndex > 0 && run.isSyllables);
			if (lastBytes && !isJoined) {
				chunks.push(new Uint8Array([0x0a]));	// LF
				offset++;
			}
			segments.push({offset, length: item.bytes.length, source: item.source, isSyllable: run.isSyllables});
			chunks.push(item.bytes);
			offset += item.bytes.length;
			lastBytes = item.bytes;
		}
	}

	const bytes = new Uint8Array(offset);
	let index = 0;

	for (const chunk of chunks) {
		bytes.set(chunk, index);
		index += chunk.length;
	}

	return {bytes, segments, ignoredCount: strings.length - items.length - utf16Count, utf16Count};
}
