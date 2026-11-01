// Guesses the encoding (a WHATWG label) of the text strings of a MIDI file: the MIDI-specific layer on chardetng_port.js.
import {assembleTextStream, isPlausibleCodePoint} from './text_collector.js';
import {
	pureCandidates, pureSettings, candidateLabels, scoreCandidate, CJK_BASE_SCORE, CJK_SECONDARY_BASE_SCORE, SHIFT_JIS_SCORE_PER_KANA,
} from './chardetng_port.js';

// The default preferences, like Accept-Language: the order breaks ties, and `q` scales the positive scores of a candidate.
// The order is how often the encodings appear in MIDI files, the most common first. KOI8-U and IBM866 are not in the list.
// The caller can give its own list in `options.preferences`.
export const defaultPreferences = Object.freeze([
	{encoding: 'windows-1252', q: 1},
	{encoding: 'shift_jis',    q: 1},
	{encoding: 'windows-1258', q: 0.8},	// 27 times rarer than windows-1252: near ties go to windows-1252
	{encoding: 'big5',         q: 0.8},
	{encoding: 'windows-1251', q: 0.6},
	{encoding: 'gbk',          q: 0.8},
	{encoding: 'euc-kr',       q: 0.8},
	{encoding: 'windows-1253', q: 0.8},
	{encoding: 'windows-874',  q: 0.8},
].map((e) => Object.freeze(e)));

// Hint adjustment (chardetng: score_adjustment for a TLD). A candidate that does not match the hint loses score / divisor + constant.
const hintDivisor = 50;
const hintConstant = 60;

// The settings for MIDI files. `mode: 'pure'` turns all of them off to reproduce chardetng.
const midiDefaults = {
	// Before scoring and for all the candidates
	preferences:                         defaultPreferences,
	isUtf8PlausibilityChecked:           true,	// Valid UTF-8 must also be plausible text

	// CJK multi-byte encodings (Shift_JIS, EUC-KR, GBK, Big5)
	musicSymbolScore:                    CJK_BASE_SCORE,	// A music symbol ("♪ ♯ ♭") scores like a common kanji
	isTruncatedCharacterTolerated:       true,	// A 2-byte character cut before a control byte or the end of a string is not an error

	// Shift_JIS
	isLostByteTolerated:                 true,	// FDh-FFh is a lost byte: no score, and the next non-ASCII byte is the rest of the character
	isExtensionPenaltyReduced:           true,	// An unmapped pair below F0h: -220 (0 in the PC-98 user-defined area) instead of -820
	isUpperCaseAdjacencyAllowed:         true,	// An uppercase ASCII letter next to a Japanese character is not penalized
	isPendingScoreKeptAtLineEnd:         true,	// The pending score of a kanji is kept at the end of a line (CR, LF) or of the stream
	isNec932Allowed:                     true,	// NEC PC-98 dependent characters (8540h-86FFh) are not errors
	necRow13Score:                       SHIFT_JIS_SCORE_PER_KANA,	// NEC row 13 (8740h-879Ch: circled numbers, Roman numerals, units) scores like a kana
	fullWidthAlphanumericScore:          SHIFT_JIS_SCORE_PER_KANA,	// Full-width digits and Latin letters score like a kana

	// Shift_JIS: half-width katakana
	isHalfWidthPunctuationScored:        true,	// Half-width "｡｢｣､･" are punctuation, not kana
	isInitialHalfWidthKatakanaPenalized: false,	// No penalty for the first half-width katakana
	isIsolatedKanaIgnored:               true,	// A single half-width katakana in text without a kana run gives no score
	isDetachedHalfWidthMarkIgnored:      true,	// "ｰ" "ﾞ" "ﾟ" that do not follow a kana get no score and no penalty
	halfWidthKatakanaScore:              SHIFT_JIS_SCORE_PER_KANA,	// A half-width katakana scores like other kana

	// Single-byte encodings
	isRepeatedByteIgnored:               true,	// A run of one 8-bit byte (a decoration such as A4h x 32) is not scored as letter pairs
	isInnerPunctuationTokenIgnored:      true,	// A token with a C1 punctuation byte ("‚" "„" "‹") between letters gives no score (2-byte characters read as single bytes)

	// Latin encodings (windows-1252, windows-1258)
	isCopyrightBonusExtended:            true,	// "©" or "®" gets the copyright bonus also before a letter or digit, and also when glued to a word
	isNonAsciiTokenIgnored:              true,	// A Latin token with as many non-ASCII bytes as ASCII letters gives no score

	// Cyrillic and Greek encodings
	isOneLetterWordChecked:              true,	// A one-letter Cyrillic or Greek word that is not a real word is implausible
};

const decoderUtf8Fatal = new TextDecoder('utf-8', {fatal: true});

function isValidUtf8(bytes) {
	try {
		decoderUtf8Fatal.decode(bytes);
		return true;
	} catch (_) {
		return false;
	}
}

// Whether the characters of valid UTF-8 are in the blocks expected in MIDI files
function isPlausibleUtf8(bytes) {
	let total = 0;
	let plausible = 0;
	let kanaLike = 0;

	// A 2-byte sequence whose bytes are both in A1h-DFh is also a pair of half-width katakana in Shift_JIS ("ﾈｺ" = C8 BA).
	for (let i = 0; i + 1 < bytes.length; i++) {
		if (bytes[i] >= 0xc2 && bytes[i] <= 0xdf && bytes[i + 1] >= 0xa1 && bytes[i + 1] <= 0xbf) {
			kanaLike++;
		}
	}

	for (const char of decoderUtf8Fatal.decode(bytes)) {
		const codePoint = char.codePointAt(0);
		if (codePoint < 0x80) {
			continue;
		}
		total++;
		if (isPlausibleCodePoint(codePoint)) {
			plausible++;
		}
	}

	if (total < 4 && kanaLike >= total) {
		return false;	// Too little evidence. Half-width katakana in Shift_JIS is more likely in MIDI files.
	}
	return (plausible >= total * 0.8);
}

function hasIso2022Escape(bytes) {
	for (let i = 0; i + 2 < bytes.length; i++) {
		if (bytes[i] === 0x1b && (bytes[i + 1] === 0x24 || bytes[i + 1] === 0x28)) {	// ESC $ or ESC (
			return true;
		}
	}

	return false;
}

function hasKrDesignation(bytes) {
	for (let i = 0; i + 3 < bytes.length; i++) {
		if (bytes[i] === 0x1b && bytes[i + 1] === 0x24 && bytes[i + 2] === 0x29 && bytes[i + 3] === 0x43) {	// ESC $ ) C
			return true;
		}
	}

	return false;
}

// preferences: strings or {encoding, q}. '*' stands for the default candidates that are not named. q = 0 removes a candidate.
function normalizePreferences(preferences) {
	console.assert(Array.isArray(preferences));
	const normalizedPreferences = [];

	for (const preference of preferences) {
		const encoding = (typeof preference === 'string') ? preference : preference.encoding;
		const q = Math.max(0, Math.min(1, preference.q ?? 1));
		if (encoding === '*') {
			for (const defaultPreference of defaultPreferences) {
				if (!preferences.some((e) => ((e.encoding ?? e) === defaultPreference.encoding))) {
					normalizedPreferences.push({encoding: defaultPreference.encoding, q});
				}
			}

			continue;
		}
		console.assert(pureCandidates.includes(encoding), `Unknown candidate: ${encoding}`);
		if (q > 0 && !normalizedPreferences.some((e) => (e.encoding === encoding))) {
			normalizedPreferences.push({encoding, q});
		}
	}

	return normalizedPreferences;
}

// strings: the result of collectTextStrings(), an array of Uint8Array, or one Uint8Array (an already assembled stream)
export function guessEncoding(strings, options = {}) {
	const settings = {...((options.mode === 'pure') ? pureSettings : midiDefaults), ...options};
	const preferences = normalizePreferences(settings.preferences);
	const candidateNames = preferences.map((e) => e.encoding);

	let bytes;
	let segments = [];
	let utf16Count = 0;
	if (strings instanceof Uint8Array) {
		bytes = strings;
	} else {
		console.assert(Array.isArray(strings));
		// UTF-16 strings are decided per string (text_collector.js) and left out of the stream.
		({bytes, segments, utf16Count} = assembleTextStream(strings));
	}

	const stats = {byteCount: bytes.length, highByteCount: 0, segmentCount: segments.length, utf16StringCount: utf16Count};
	let firstNonAscii = -1;
	let hasEscape = false;

	for (let i = 0; i < bytes.length; i++) {
		if (bytes[i] >= 0x80) {
			stats.highByteCount++;
			if (firstNonAscii < 0) {
				firstNonAscii = i;
			}
		} else if (bytes[i] === 0x1b) {
			hasEscape = true;
		}
	}

	const result = {encoding: 'utf-8', confidence: 1, reason: 'ascii', candidates: [], stats, isAscii: true, hints: []};

	// 7-bit stateful encodings: ESC sequences without any 8-bit byte
	if (stats.highByteCount === 0 && hasEscape && hasIso2022Escape(bytes)) {
		const encoding = (hasKrDesignation(bytes)) ? 'iso-2022-kr' : 'iso-2022-jp';
		return {...result, encoding, confidence: 0.9, reason: 'iso-2022 escape sequence', isAscii: false};
	}

	if (stats.highByteCount === 0) {
		return result;
	}
	result.isAscii = false;

	// UTF-8 takes precedence if the stream is valid UTF-8 (and the characters are plausible, in MIDI mode).
	if (isValidUtf8(bytes) && (!settings.isUtf8PlausibilityChecked || isPlausibleUtf8(bytes))) {
		return {...result, encoding: 'utf-8', confidence: 1, reason: 'valid utf-8'};
	}

	// chardetng skips the ASCII prefix except the last 2 bytes (they matter for "n.º").
	const start = (firstNonAscii >= 2) ? firstNonAscii - 2 : 0;

	const candidates = [];

	for (const encoding of candidateNames) {
		const scoreResult = scoreCandidate(encoding, bytes, start, settings);
		// chardetng: Candidate::score (a cased non-Latin candidate needs a word of 2 letters or more)
		const isShortWord = (scoreResult !== null && scoreResult.longestWord < 2);
		candidates.push({
			encoding,
			score:   (scoreResult === null) ? null : scoreResult.score,
			isValid: (scoreResult !== null && !isShortWord),
			reason:  (scoreResult === null) ? 'invalid sequence' : (isShortWord) ? 'no word of 2 letters' : null,
		});
	}

	// Hints given by the caller (encoding labels)
	const hints = (options.hints ?? []).map((e) => ((typeof e === 'string') ? e : e.encoding));
	result.hints = hints;

	for (const candidate of candidates) {
		if (!candidate.isValid) {
			continue;
		}
		// A candidate that matches a hint keeps its score (+1 wins the ties) whatever the preferences say.
		candidate.isHinted = hints.includes(candidateLabels[candidate.encoding] ?? candidate.encoding);
		if (candidate.isHinted) {
			candidate.score += 1;
			continue;
		}
		// Preferences: the positive score is scaled by q. A negative score (next to invalid) stays.
		const {q} = preferences.find((e) => (e.encoding === candidate.encoding));
		if (candidate.score > 0 && q < 1) {
			candidate.rawScore = candidate.score;
			candidate.score = Math.round(candidate.score * q);
		}
		// chardetng: score_adjustment (the TLD adjustment)
		if (hints.length > 0 && candidate.score >= 1) {
			candidate.score -= Math.trunc(candidate.score / hintDivisor) + hintConstant;
		}
	}

	// chardetng: EncodingDetector::guess. The highest score wins, and ties go to the first candidate.
	const validCandidates = candidates.filter((e) => e.isValid);
	validCandidates.sort((a, b) => b.score - a.score);	// Stable sort keeps the order of the preferences for equal scores.
	result.candidates = [...validCandidates, ...candidates.filter((e) => !e.isValid)];

	const bestCandidate = validCandidates[0];
	if (!bestCandidate || bestCandidate.score <= 0) {
		// chardetng falls back to windows-1252 when nothing scores above 0.
		result.encoding = 'windows-1252';
		result.confidence = 0;
		result.reason = 'fallback';
		return result;
	}

	const secondCandidate = validCandidates[1];
	const margin = bestCandidate.score - ((secondCandidate && secondCandidate.score > 0) ? secondCandidate.score : 0);
	result.encoding = candidateLabels[bestCandidate.encoding] ?? bestCandidate.encoding;
	result.confidence = Math.max(0, Math.min(1, margin / (stats.highByteCount * CJK_SECONDARY_BASE_SCORE)));
	result.reason = 'score';
	return result;
}
