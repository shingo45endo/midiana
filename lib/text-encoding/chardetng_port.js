// A port of the scoring of chardetng (https://github.com/hsivonen/chardetng, Apache-2.0 / MIT), limited to the encodings of MIDI files.
// The rules follow lib.rs of commit 4a53a99e07e418ceb91e0049580e6bbcb2df0591. The tables are in chardetng_data.js (CC0).
// The branches on `settings` marked "MIDI mode" are the deviations for MIDI files. encoding_guesser.js defines their values.
import * as data from './chardetng_data.js';

// The order of chardetng: the first candidate wins when the scores are equal.
// 'windows-1252-icelandic' is chardetng's second windows-1252 model (Icelandic letters such as "Þ" and "ð"); it reports windows-1252.
export const pureCandidates = Object.freeze([
	'gbk', 'euc-kr', 'shift_jis', 'big5', 'windows-1252', 'windows-1251', 'windows-1252-icelandic', 'windows-874', 'windows-1253', 'koi8-u', 'ibm866', 'windows-1258',
]);

export const candidateLabels = Object.freeze({'windows-1252-icelandic': 'windows-1252'});
console.assert(Object.keys(candidateLabels).every((e) => pureCandidates.includes(e)));

// Constants of chardetng (lib.rs)
const LATIN_ADJACENCY_PENALTY                   = -50;
const IMPLAUSIBILITY_PENALTY                    = -220;
const ORDINAL_BONUS                             = 300;
const COPYRIGHT_BONUS                           = 222;
const IMPLAUSIBLE_LATIN_CASE_TRANSITION_PENALTY = -180;

const NON_LATIN_CAPITALIZATION_BONUS = 40;
const NON_LATIN_ALL_CAPS_PENALTY     = -40;
const NON_LATIN_MIXED_CASE_PENALTY   = -20;

export const CJK_BASE_SCORE           = 41;
export const CJK_SECONDARY_BASE_SCORE = 20;
const CJK_LATIN_ADJACENCY_PENALTY     = -CJK_BASE_SCORE;
const CJ_PUNCTUATION                  = Math.trunc(CJK_BASE_SCORE / 2);
const CJK_OTHER                       = Math.trunc(CJK_SECONDARY_BASE_SCORE / 4);

export const SHIFT_JIS_SCORE_PER_KANA               = 20;
const SHIFT_JIS_SCORE_PER_LEVEL_1_KANJI             = CJK_BASE_SCORE;
const SHIFT_JIS_SCORE_PER_LEVEL_2_KANJI             = CJK_SECONDARY_BASE_SCORE;
const SHIFT_JIS_INITIAL_HALF_WIDTH_KATAKANA_PENALTY = -75;
const HALF_WIDTH_KATAKANA_SCORE                     = 1;
const HALF_WIDTH_KATAKANA_VOICING_SCORE             = 10;
const SHIFT_JIS_PUA_PENALTY                         = -(CJK_BASE_SCORE * 10);
const SHIFT_JIS_EXTENSION_PENALTY                   = SHIFT_JIS_PUA_PENALTY * 2;
const SHIFT_JIS_SINGLE_BYTE_EXTENSION_PENALTY       = SHIFT_JIS_EXTENSION_PENALTY;

const BIG5_SCORE_PER_LEVEL_1_HANZI       = CJK_BASE_SCORE;
const BIG5_SCORE_PER_OTHER_HANZI         = CJK_SECONDARY_BASE_SCORE;
const BIG5_PUA_PENALTY                   = -(CJK_BASE_SCORE * 30);
const BIG5_SINGLE_BYTE_EXTENSION_PENALTY = -(CJK_BASE_SCORE * 40);

const GBK_SCORE_PER_LEVEL_1             = CJK_BASE_SCORE;
const GBK_SCORE_PER_LEVEL_2             = CJK_SECONDARY_BASE_SCORE;
const GBK_SCORE_PER_NON_EUC             = Math.trunc(CJK_SECONDARY_BASE_SCORE / 4);
const GBK_PUA_PENALTY                   = -(CJK_BASE_SCORE * 10);
const GBK_SINGLE_BYTE_EXTENSION_PENALTY = GBK_PUA_PENALTY * 4;

const EUC_KR_SCORE_PER_EUC_HANGUL          = CJK_BASE_SCORE + 1;
const EUC_KR_SCORE_PER_NON_EUC_HANGUL      = Math.trunc(CJK_SECONDARY_BASE_SCORE / 5);
const EUC_KR_SCORE_PER_HANJA               = Math.trunc(CJK_SECONDARY_BASE_SCORE / 2);
const EUC_KR_HANJA_AFTER_HANGUL_PENALTY    = -(CJK_BASE_SCORE * 10);
const EUC_KR_LONG_WORD_PENALTY             = -6;
const EUC_KR_PUA_PENALTY                   = GBK_PUA_PENALTY - 1;
const EUC_KR_MAC_KOREAN_PENALTY            = EUC_KR_PUA_PENALTY * 2;
const EUC_KR_SINGLE_BYTE_EXTENSION_PENALTY = EUC_KR_MAC_KOREAN_PENALTY;

const LATIN_LETTER = 1;
const ASCII_DIGIT  = 100;

// chardetng's own behaviour (the values of the MIDI-mode settings that reproduce it). encoding_guesser.js defines the MIDI defaults.
export const pureSettings = Object.freeze({
	preferences:                         pureCandidates.map((e) => ({encoding: e, q: 1})),
	isUtf8PlausibilityChecked:           false,
	musicSymbolScore:                    CJK_OTHER,
	necRow13Score:                       CJK_OTHER,
	fullWidthAlphanumericScore:          CJK_OTHER,
	isTruncatedCharacterTolerated:       false,
	isLostByteTolerated:                 false,
	isExtensionPenaltyReduced:           false,
	isUpperCaseAdjacencyAllowed:         false,
	isPendingScoreKeptAtLineEnd:         false,
	isNec932Allowed:                     false,
	isHalfWidthPunctuationScored:        false,
	isInitialHalfWidthKatakanaPenalized: true,
	isIsolatedKanaIgnored:               false,
	isDetachedHalfWidthMarkIgnored:      false,
	halfWidthKatakanaScore:              HALF_WIDTH_KATAKANA_SCORE,
	isRepeatedByteIgnored:               false,
	isInnerPunctuationTokenIgnored:      false,
	isCopyrightBonusExtended:            false,
	isNonAsciiTokenIgnored:              false,
	isOneLetterWordChecked:              false,
});

function isAsciiLetter(byte) {
	return (0x41 <= byte && byte <= 0x5a) || (0x61 <= byte && byte <= 0x7a);
}

// A space-like byte of the C1 area of windows-125x ("‚ „ … ‹ › “ ”" and so on), except the single quotation marks ("‘ ’") that are used inside words
function isC1Punctuation(byte, caselessClass) {
	return ((0x80 <= byte && byte <= 0x9f) && caselessClass === 0 && byte !== 0x91 && byte !== 0x92);
}

// Music symbols (U+2669-U+266F: "♩ ♪ ♫ ♬ ♭ ♮ ♯"). Shift_JIS has "♯ ♭ ♪" (JIS X 0208 row 2), EUC-KR has "♩ ♪ ♬ ♭ ♯".
function isMusicSymbol(u) {
	return (0x2669 <= u && u <= 0x266f);
}

// chardetng: compute_index (data.rs)
function computePairIndex(x, y, asciiClasses, nonAsciiClasses) {
	if (x === 0 && y === 0) {
		return -1;
	}
	if (x < asciiClasses && y < asciiClasses) {
		return -1;
	}
	if (y >= asciiClasses) {
		return (asciiClasses * nonAsciiClasses) + (asciiClasses + nonAsciiClasses) * (y - asciiClasses) + x;
	}
	return y * nonAsciiClasses + x - asciiClasses;
}

const PLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE = 0;
const IMPLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE = 1;
const IMPLAUSIBLE_BEFORE_ALPHABETIC = 2;
const IMPLAUSIBLE_AFTER_ALPHABETIC = 3;
const PLAUSIBLE_NEXT_TO_NON_ASCII_ALPHABETIC_ON_EITHER_SIDE = 4;
const PLAUSIBLE_NEXT_TO_ASCII_ALPHABETIC_ON_EITHER_SIDE = 5;

// Real one-letter words of Russian and Ukrainian, and of Greek
const oneLetterWords = {cyrillic: new Set([...'авеєжзійкосуюя']), greek: new Set([...'οηήω'])};

const pairDecoders = new Map();

const pairCache = new Map();

// Decodes a byte sequence as the encoding without fatal errors. Results are cached per encoding.
function decodeBytes(label, bytes) {
	console.assert(typeof label === 'string' && Array.isArray(bytes));

	const key = `${label}:${bytes.join(',')}`;
	if (pairCache.has(key)) {
		return pairCache.get(key);
	}
	if (!pairDecoders.has(label)) {
		pairDecoders.set(label, new TextDecoder(label));
	}
	const text = pairDecoders.get(label).decode(new Uint8Array(bytes));
	pairCache.set(key, text);
	return text;
}

// chardetng: SingleByteData (data.rs): classify, is_latin_alphabetic, is_non_latin_alphabetic, score
class SingleByteModel {
	constructor(label, lower, upper, probabilities, classes) {
		console.assert(lower.length === 128 && upper.length === 128);
		console.assert(probabilities.length === classes.nonAscii * (2 * classes.ascii + classes.nonAscii));

		this.label = label;
		this.lower = lower;
		this.upper = upper;
		this.probabilities = probabilities;
		this.ascii = classes.ascii;
		this.nonAscii = classes.nonAscii;
	}

	classify(byte) {
		return (byte < 0x80) ? this.lower[byte] : this.upper[byte & 0x7f];
	}

	// Whether the byte is a letter that forms a real one-letter word (MIDI mode, cased non-Latin models only)
	isOneLetterWord(byte) {
		if (!this.oneLetterWordBytes) {
			const words = (this.label === 'windows-1253') ? oneLetterWords.greek : oneLetterWords.cyrillic;
			this.oneLetterWordBytes = new Set();

			for (let b = 0x80; b <= 0xff; b++) {
				if (words.has(decodeBytes(this.label, [b]).toLowerCase())) {
					this.oneLetterWordBytes.add(b);
				}
			}
		}
		return this.oneLetterWordBytes.has(byte);
	}

	isLatinAlphabetic(caselessClass) {
		return (caselessClass > 0 && caselessClass < this.ascii + this.nonAscii);
	}

	isNonLatinAlphabetic(caselessClass) {
		return (caselessClass > 1 && caselessClass < this.ascii + this.nonAscii);
	}

	score(currentClass, previousClass) {
		const boundary = this.ascii + this.nonAscii;
		if (currentClass < boundary) {
			if (previousClass < boundary) {
				// Both below
				const index = computePairIndex(previousClass, currentClass, this.ascii, this.nonAscii);
				if (index < 0) {
					return 0;
				}
				const b = this.probabilities[index];
				return (b === 255) ? IMPLAUSIBILITY_PENALTY : b;
			}
			if (currentClass === 0 || currentClass === ASCII_DIGIT) {
				return 0;	// Current is space-like
			}
			// Previous is a symbol class (stored above the boundary), current is alphabetic
			switch (previousClass - boundary) {
			case PLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE:
				return 0;
			case IMPLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE:
				return IMPLAUSIBILITY_PENALTY;
			case IMPLAUSIBLE_BEFORE_ALPHABETIC:
				return IMPLAUSIBILITY_PENALTY;
			case IMPLAUSIBLE_AFTER_ALPHABETIC:
				return 0;
			case PLAUSIBLE_NEXT_TO_NON_ASCII_ALPHABETIC_ON_EITHER_SIDE:
				return (currentClass < this.ascii) ? IMPLAUSIBILITY_PENALTY : 0;
			case PLAUSIBLE_NEXT_TO_ASCII_ALPHABETIC_ON_EITHER_SIDE:
				return (currentClass < this.ascii) ? 0 : IMPLAUSIBILITY_PENALTY;
			default:
				return 0;	// previous is ASCII digit
			}
		}
		if (previousClass < boundary) {
			if (previousClass === 0 || previousClass === ASCII_DIGIT) {
				return 0;	// Previous is space-like
			}
			// Current is a symbol class, previous is alphabetic
			switch (currentClass - boundary) {
			case PLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE:
				return 0;
			case IMPLAUSIBLE_NEXT_TO_ALPHABETIC_ON_EITHER_SIDE:
				return IMPLAUSIBILITY_PENALTY;
			case IMPLAUSIBLE_BEFORE_ALPHABETIC:
				return 0;
			case IMPLAUSIBLE_AFTER_ALPHABETIC:
				return IMPLAUSIBILITY_PENALTY;
			case PLAUSIBLE_NEXT_TO_NON_ASCII_ALPHABETIC_ON_EITHER_SIDE:
				return (previousClass < this.ascii) ? IMPLAUSIBILITY_PENALTY : 0;
			case PLAUSIBLE_NEXT_TO_ASCII_ALPHABETIC_ON_EITHER_SIDE:
				return (previousClass < this.ascii) ? 0 : IMPLAUSIBILITY_PENALTY;
			default:
				return 0;	// current is ASCII digit
			}
		}
		if (currentClass === ASCII_DIGIT || previousClass === ASCII_DIGIT) {
			return 0;
		}
		return IMPLAUSIBILITY_PENALTY;	// Both symbols
	}
}

const singleByteModels = {
	'windows-1252': new SingleByteModel('windows-1252', data.latinAscii,    data.windows1252, data.western,  data.westernClasses),
	'windows-1252-icelandic': new SingleByteModel('windows-1252', data.latinAscii, data.windows1252Icelandic, data.icelandic, data.icelandicClasses),
	'windows-1251': new SingleByteModel('windows-1251', data.nonLatinAscii, data.windows1251, data.cyrillic, data.cyrillicClasses),
	'koi8-u':       new SingleByteModel('koi8-u',       data.nonLatinAscii, data.koi8u,       data.cyrillic, data.cyrillicClasses),
	'ibm866':       new SingleByteModel('ibm866',       data.nonLatinAscii, data.ibm866,      data.cyrillic, data.cyrillicClasses),
	'windows-1258': new SingleByteModel('windows-1258', data.latinAscii,    data.windows1258, data.vietnamese, data.vietnameseClasses),
	'windows-1253': new SingleByteModel('windows-1253', data.nonLatinAscii, data.windows1253, data.greek,      data.greekClasses),
	'windows-874':  new SingleByteModel('windows-874',  data.nonLatinAscii, data.windows874,  data.thai,       data.thaiClasses),
};

console.assert(Object.keys(singleByteModels).every((e) => pureCandidates.includes(e)));

// windows-1252. chardetng: LatinCandidate::feed (with LatinCaseState and OrdinalState)
function scoreLatin(bytes, start, model, isWindows1252, settings) {
	const stateSpace   = 0;
	const stateUpper   = 1;
	const stateLower   = 2;
	const stateAllCaps = 3;

	let caseState = stateSpace;
	let prev = 0;
	let prevNonAscii = 0;
	let ordinalState = 'space';
	let tokenStartScore = 0;
	let tokenNonAsciiCount = 0;
	let tokenAsciiLetterCount = 0;
	let isAfterInnerPunctuation = false;
	let hasInnerPunctuation = false;
	let prevByte = -1;
	let runLength = 0;
	let score = 0;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		const klass = model.classify(b);
		runLength = (b === prevByte) ? runLength + 1 : 1;
		prevByte = b;
		const isRun = (settings.isRepeatedByteIgnored && b >= 0x80 && runLength >= 3);
		if (klass === 255) {
			return null;
		}
		const caselessClass = klass & 0x7f;
		const ascii = (b < 0x80);
		const asciiPair = (prevNonAscii === 0 && ascii);
		// Not a letter, digit, ' - _
		const isTokenBoundary = (ascii && !isAsciiLetter(b) && !(0x30 <= b && b <= 0x39) && b !== 0x27 && b !== 0x2d && b !== 0x5f);
		const isSpaceLike = (caselessClass === 0);
		if (!ascii) {
			tokenNonAsciiCount++;
		} else if (isAsciiLetter(b)) {
			tokenAsciiLetterCount++;
		}
		// MIDI mode: isInnerPunctuationTokenIgnored (encoding_guesser.js). Letter, C1 punctuation ("‚" "„" "‹" "“"; not "‘" "’"), letter
		if (isC1Punctuation(b, caselessClass) && model.isLatinAlphabetic(prev)) {
			isAfterInnerPunctuation = true;
		} else if (isAfterInnerPunctuation && model.isLatinAlphabetic(caselessClass)) {
			hasInnerPunctuation = true;
		}

		if (prevNonAscii === 3) {
			score -= 5;
		} else if (prevNonAscii === 4) {
			score -= 20;
		} else if (prevNonAscii > 4) {
			score -= 200;
		}

		if (!model.isLatinAlphabetic(caselessClass)) {
			caseState = stateSpace;
		} else if ((klass >> 7) === 0) {
			if (caseState === stateAllCaps && !asciiPair) {
				score += IMPLAUSIBLE_LATIN_CASE_TRANSITION_PENALTY;
			}
			caseState = stateLower;
		} else if (caseState === stateSpace) {
			caseState = stateUpper;
		} else if (caseState === stateUpper || caseState === stateAllCaps) {
			caseState = stateAllCaps;
		} else {	// Lower
			if (!asciiPair) {
				score += IMPLAUSIBLE_LATIN_CASE_TRANSITION_PENALTY;
			}
			caseState = stateUpper;
		}

		// MIDI mode: isCopyrightBonusExtended (encoding_guesser.js). A copyright sign glued to a word ("NAME©M.FERRE") is a boundary.
		const isCopyrightSign = (settings.isCopyrightBonusExtended && (b === 0xa9 || b === 0xae));
		const asciiIshPair = asciiPair || (ascii && prev === 0) || (caselessClass === 0 && prevNonAscii === 0);
		if (!asciiIshPair && !isCopyrightSign && !isRun) {
			score += model.score(caselessClass, prev);
		}

		// State machine for " º " " ª " "n.º1" " © " and so on (windows-1252 only)
		switch ((isWindows1252) ? ordinalState : 'none') {
		case 'other':
			if (isSpaceLike) {
				ordinalState = 'space';
			}
			break;
		case 'space':
			if (isSpaceLike) {
				/* EMPTY */
			} else if (b === 0xaa || b === 0xba) {
				ordinalState = 'ordinalExpectingSpace';
			} else if (b === 0x4d || b === 0x44 || b === 0x53) {	// M D S
				ordinalState = 'feminineAbbreviationStartLetter';
			} else if (b === 0x4e) {	// N
				ordinalState = 'upperN';
			} else if (b === 0x6e) {	// n
				ordinalState = 'lowerN';
			} else if (caselessClass === ASCII_DIGIT) {
				ordinalState = 'digit';
			} else if (caselessClass === 9 || caselessClass === 22 || caselessClass === 24) {	// I V X
				ordinalState = 'roman';
			// MIDI mode: isCopyrightBonusExtended (encoding_guesser.js)
			} else if (b === 0xa9 || (settings.isCopyrightBonusExtended && b === 0xae)) {
				ordinalState = 'copyright';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'ordinalExpectingSpace':
			if (isSpaceLike) {
				score += ORDINAL_BONUS;
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'ordinalExpectingSpaceUndoImplausibility':
			if (isSpaceLike) {
				score += ORDINAL_BONUS - IMPLAUSIBILITY_PENALTY;
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'ordinalExpectingSpaceOrDigit':
			if (isSpaceLike) {
				score += ORDINAL_BONUS;
				ordinalState = 'space';
			} else if (caselessClass === ASCII_DIGIT) {
				score += ORDINAL_BONUS;
				ordinalState = 'other';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'ordinalExpectingSpaceOrDigitUndoImplausibily':
			if (isSpaceLike) {
				score += ORDINAL_BONUS - IMPLAUSIBILITY_PENALTY;
				ordinalState = 'space';
			} else if (caselessClass === ASCII_DIGIT) {
				score += ORDINAL_BONUS - IMPLAUSIBILITY_PENALTY;
				ordinalState = 'other';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'upperN':
			if (b === 0xaa) {
				ordinalState = 'ordinalExpectingSpaceUndoImplausibility';
			} else if (b === 0xba) {
				ordinalState = 'ordinalExpectingSpaceOrDigitUndoImplausibily';
			} else if (b === 0x2e) {
				ordinalState = 'periodAfterN';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'lowerN':
			if (b === 0xba) {
				ordinalState = 'ordinalExpectingSpaceOrDigitUndoImplausibily';
			} else if (b === 0x2e) {
				ordinalState = 'periodAfterN';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'feminineAbbreviationStartLetter':
			if (b === 0xaa) {
				ordinalState = 'ordinalExpectingSpaceUndoImplausibility';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'digit':
			if (b === 0xaa || b === 0xba) {
				ordinalState = 'ordinalExpectingSpace';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else if (caselessClass !== ASCII_DIGIT) {
				ordinalState = 'other';
			}
			break;
		case 'roman':
			if (b === 0xaa || b === 0xba) {
				ordinalState = 'ordinalExpectingSpaceUndoImplausibility';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else if (!(caselessClass === 9 || caselessClass === 22 || caselessClass === 24)) {
				ordinalState = 'other';
			}
			break;
		case 'periodAfterN':
			if (b === 0xba) {
				ordinalState = 'ordinalExpectingSpaceOrDigit';
			} else if (isSpaceLike) {
				ordinalState = 'space';
			} else {
				ordinalState = 'other';
			}
			break;
		case 'copyright':
			if (isSpaceLike) {
				score += COPYRIGHT_BONUS;
				ordinalState = 'space';
			// MIDI mode: isCopyrightBonusExtended (encoding_guesser.js)
			} else if (settings.isCopyrightBonusExtended && (isAsciiLetter(b) || caselessClass === ASCII_DIGIT)) {
				score += COPYRIGHT_BONUS;	// followed by a letter or a digit: "©1998", "©Yamaha"
				ordinalState = 'other';
			} else {
				ordinalState = 'other';
			}
			break;
		default:
			break;
		}
		if (isCopyrightSign) {
			ordinalState = 'copyright';
		}

		// MIDI mode: a token (a run between whitespace or ASCII punctuation) with at least as many non-ASCII bytes as ASCII letters
		// is not Latin text (2-byte characters read as Latin: "Œ´‹È"). Such a token gives no score.
		// A token with a C1 punctuation byte between letters ("‚Ì‹F‚è": hiragana read as Latin) is not Latin text either.
		if (isTokenBoundary) {
			// MIDI mode: isNonAsciiTokenIgnored, isInnerPunctuationTokenIgnored (encoding_guesser.js)
			const isNonAsciiToken = (settings.isNonAsciiTokenIgnored && tokenNonAsciiCount >= 2 && tokenNonAsciiCount >= tokenAsciiLetterCount);
			if ((isNonAsciiToken || (settings.isInnerPunctuationTokenIgnored && hasInnerPunctuation)) && score > tokenStartScore) {
				score = tokenStartScore;
			}
			tokenStartScore = score;
			tokenNonAsciiCount = 0;
			tokenAsciiLetterCount = 0;
			isAfterInnerPunctuation = false;
			hasInnerPunctuation = false;
		}

		prevNonAscii = (ascii) ? 0 : prevNonAscii + 1;
		prev = (isCopyrightSign) ? 0 : caselessClass;
	}

	return {score, longestWord: Infinity};
}

// windows-1251, koi8-u, ibm866. chardetng: NonLatinCasedCandidate::feed (with NonLatinCaseState)
function scoreNonLatinCased(bytes, start, model, isIbm866, isKoi8u, settings) {
	const stateSpace      = 0;
	const stateUpper      = 1;
	const stateLower      = 2;
	const stateUpperLower = 3;
	const stateAllCaps    = 4;
	const stateMix        = 5;

	let caseState = stateSpace;
	let prev = 0;
	let prevAscii = true;
	let currentWordLength = 0;
	let wordFirstByte = 0;
	let longestWord = 0;
	let prevWasA0 = false;
	let tokenStartScore = 0;
	let isAfterInnerPunctuation = false;
	let hasInnerPunctuation = false;
	let prevByte = -1;
	let runLength = 0;
	let score = 0;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		const klass = model.classify(b);
		runLength = (b === prevByte) ? runLength + 1 : 1;
		prevByte = b;
		const isRun = (settings.isRepeatedByteIgnored && b >= 0x80 && runLength >= 3);
		if (klass === 255) {
			return null;
		}
		const caselessClass = klass & 0x7f;
		const ascii = (b < 0x80);
		const asciiPair = (prevAscii && ascii);
		const nonAsciiAlphabetic = model.isNonLatinAlphabetic(caselessClass);

		if (caselessClass === LATIN_LETTER) {
			caseState = stateMix;
		} else if (!nonAsciiAlphabetic) {
			// Space-like: settles the word
			if (caseState === stateUpperLower) {
				score += NON_LATIN_CAPITALIZATION_BONUS;
			} else if (caseState === stateAllCaps) {
				if (isKoi8u) {
					score += NON_LATIN_ALL_CAPS_PENALTY;
				}
			} else if (caseState === stateMix) {
				score += NON_LATIN_MIXED_CASE_PENALTY * currentWordLength;
			}
			caseState = stateSpace;
		} else if ((klass >> 7) === 0) {
			// Lower case
			if (caseState === stateSpace) {
				caseState = stateLower;
			} else if (caseState === stateUpper) {
				caseState = stateUpperLower;
			} else if (caseState === stateAllCaps) {
				caseState = stateMix;
			}
		} else if (caseState === stateSpace) {
			// Upper case
			caseState = stateUpper;
		} else if (caseState === stateUpper) {
			caseState = stateAllCaps;
		} else if (caseState === stateLower || caseState === stateUpperLower) {
			caseState = stateMix;
		}

		if (nonAsciiAlphabetic) {
			if (currentWordLength === 0) {
				wordFirstByte = b;
			}
			currentWordLength++;
		} else {
			if (currentWordLength > longestWord) {
				longestWord = currentWordLength;
			}
			// MIDI mode: a one-letter word is plausible only for the real one-letter words and abbreviations ("г.").
			if (settings.isOneLetterWordChecked && currentWordLength === 1 && b !== 0x2e && !model.isOneLetterWord(wordFirstByte)) {
				score += IMPLAUSIBILITY_PENALTY;
			}
			currentWordLength = 0;
		}

		const isA0 = (b === 0xa0);
		if (!asciiPair && !isRun) {
			// A0h is no-break space in other encodings: not scored in IBM866 next to itself or a space-like byte.
			if (!(isIbm866 && ((isA0 && (prevWasA0 || prev === 0)) || (caselessClass === 0 && prevWasA0)))) {
				score += model.score(caselessClass, prev);
			}
			if (prev === LATIN_LETTER && nonAsciiAlphabetic) {
				score += LATIN_ADJACENCY_PENALTY;
			} else if (caselessClass === LATIN_LETTER && model.isNonLatinAlphabetic(prev)) {
				score += LATIN_ADJACENCY_PENALTY;
			}
		}

		// MIDI mode: isInnerPunctuationTokenIgnored (encoding_guesser.js). A token (a run between whitespace or ASCII punctuation) with
		// a C1 punctuation byte between letters ("Њх‚Ж‚Ж": hiragana read as Cyrillic) is not text. Such a token gives no score.
		const isLetter = (nonAsciiAlphabetic || caselessClass === LATIN_LETTER);
		if (isC1Punctuation(b, caselessClass) && (model.isNonLatinAlphabetic(prev) || prev === LATIN_LETTER)) {
			isAfterInnerPunctuation = true;
		} else if (isAfterInnerPunctuation && isLetter) {
			hasInnerPunctuation = true;
		}
		const isTokenBoundary = (ascii && !isAsciiLetter(b) && !(0x30 <= b && b <= 0x39) && b !== 0x27 && b !== 0x2d && b !== 0x5f);
		if (isTokenBoundary) {
			if (settings.isInnerPunctuationTokenIgnored && hasInnerPunctuation && score > tokenStartScore) {
				score = tokenStartScore;
			}
			tokenStartScore = score;
			isAfterInnerPunctuation = false;
			hasInnerPunctuation = false;
		}

		prevAscii = ascii;
		prev = caselessClass;
		prevWasA0 = isA0;
	}

	return {score, longestWord};
}

// windows-874. chardetng: CaselessCandidate::feed
function scoreCaseless(bytes, start, model, settings) {
	let prev = 0;
	let prevAscii = true;
	let prevByte = -1;
	let runLength = 0;
	let currentWordLength = 0;
	let longestWord = 0;
	let score = 0;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		const klass = model.classify(b);
		if (klass === 255) {
			return null;
		}
		const caselessClass = klass & 0x7f;
		const ascii = (b < 0x80);
		const asciiPair = (prevAscii && ascii);
		const nonAsciiAlphabetic = model.isNonLatinAlphabetic(caselessClass);
		if (nonAsciiAlphabetic) {
			currentWordLength++;
		} else {
			if (currentWordLength > longestWord) {
				longestWord = currentWordLength;
			}
			currentWordLength = 0;
		}
		// MIDI mode: isRepeatedByteIgnored (encoding_guesser.js). A run of one byte is a decoration, not words.
		runLength = (b === prevByte) ? runLength + 1 : 1;
		prevByte = b;
		const isRun = (settings.isRepeatedByteIgnored && !ascii && runLength >= 3);
		if (!asciiPair && !isRun) {
			score += model.score(caselessClass, prev);
			if (prev === LATIN_LETTER && nonAsciiAlphabetic) {
				score += LATIN_ADJACENCY_PENALTY;
			} else if (caselessClass === LATIN_LETTER && model.isNonLatinAlphabetic(prev)) {
				score += LATIN_ADJACENCY_PENALTY;
			}
		}
		prevAscii = ascii;
		prev = caselessClass;
	}

	return {score, longestWord};
}

// Code point of a 2-byte (or 4-byte) sequence: U+FFFD when the encoding does not map it, -1 when the runtime decoder lacks the mapping
// (Node's TextDecoder is ICU-based and lacks some WHATWG mappings, such as the CP949 extension of EUC-KR and HKSCS of Big5).
function decodeCodePoint(label, bytes) {
	const text = decodeBytes(label, bytes);
	return (text.length > 0) ? text.codePointAt(0) : -1;
}

// chardetng: cjk_extra_score
function cjkExtraScore(u, table) {
	const pos = table.indexOf(u);
	return (pos >= 0) ? Math.trunc((128 - pos) / 16) : 0;
}

// chardetng: problematic_lead
function isProblematicLead(b) {
	return (0x91 <= b && b <= 0x97) || b === 0x9a || b === 0x8a || b === 0x9b || b === 0x8b || b === 0x9e || b === 0x8e || b === 0xb0;
}

// chardetng: more_problematic_lead
function isMoreProblematicLead(b) {
	return isProblematicLead(b) || b === 0x82 || b === 0x84 || b === 0x85 || b === 0xa0;
}

function isHalfWidthKatakanaByte(b) {
	return (0xa1 <= b && b <= 0xdf);
}

function isLowerOrUpperAsciiLetter(u) {
	return (0x61 <= u && u <= 0x7a) || (0x41 <= u && u <= 0x5a);
}

const cjPunctuationJapanese = new Set([0x3000, 0x3001, 0x3002, 0xff08, 0xff09]);
const cjPunctuationChinese  = new Set([0x3000, 0x3001, 0x3002, 0xff08, 0xff09, 0xff01, 0xff0c, 0xff1b, 0xff1f]);

const prevAsciiLetter = 1;
const prevCj = 2;
const prevOther = 3;

// Shift_JIS. chardetng: ShiftJisCandidate::feed and maybe_set_as_pending (the characters are classified by byte ranges here)
function scoreShiftJis(bytes, start, settings) {
	const dakutenForbidden           = 0;
	const dakutenAllowed             = 1;
	const dakutenOrHandakutenAllowed = 2;

	let halfWidthKatakanaSeen = false;
	let halfWidthKatakanaState = dakutenForbidden;
	let prev = prevOther;
	let prevByte = 0;
	let isPrevLetterUpper = false;
	let isPrevHalfWidthMark = false;
	let isPrevHalfWidthKana = false;
	// Whether 2 bytes of A1h-DFh appear in a row: a run of half-width katakana (or the trail byte of a 2-byte character followed by one)
	let hasKanaRun = false;

	for (let i = start + 1; i < bytes.length && !hasKanaRun; i++) {
		hasKanaRun = (isHalfWidthKatakanaByte(bytes[i - 1]) && isHalfWidthKatakanaByte(bytes[i]));
	}

	// Half-width corner brackets as a pair ("｢ TITLE ｣") are Japanese typography even around ASCII text; "¢" and "£" do not pair like this.
	const hasCornerBracketPair = (bytes.indexOf(0xa2, start) >= 0 && bytes.indexOf(0xa3, bytes.indexOf(0xa2, start)) > 0);
	let pendingScore = null;
	let score = 0;

	// Penalty for a byte outside Shift_JIS (A0h, FDh-FFh)
	function singleByteExtensionPenalty(b) {
		// MIDI mode: isLostByteTolerated (encoding_guesser.js)
		if (b >= 0xfd && settings.isLostByteTolerated) {
			return 0;
		}
		// MIDI mode: isExtensionPenaltyReduced (encoding_guesser.js)
		return (settings.isExtensionPenaltyReduced) ? IMPLAUSIBILITY_PENALTY : SHIFT_JIS_SINGLE_BYTE_EXTENSION_PENALTY;
	}

	function flushPending() {
		if (pendingScore !== null) {
			score += pendingScore;
			pendingScore = null;
		}
	}

	// Penalty for a Japanese character right after an ASCII letter (MIDI mode: not after an uppercase letter, "BEND幅")
	function latinAdjacencyPenalty() {
		// MIDI mode: isUpperCaseAdjacencyAllowed (encoding_guesser.js)
		return (prev === prevAsciiLetter && !(settings.isUpperCaseAdjacencyAllowed && isPrevLetterUpper)) ? CJK_LATIN_ADJACENCY_PENALTY : 0;
	}

	function maybeSetAsPending(s) {
		console.assert(pendingScore === null);
		if (prev === prevCj || !isProblematicLead(prevByte)) {
			return s;
		}
		pendingScore = s;
		return 0;
	}

	// Scores one decoded character. `b` is the last byte of it. `isIsolatedKana`: a half-width katakana without a kana neighbor.
	function scoreChar(u, b, isIsolatedKana = false) {
		const prevKatakanaState = halfWidthKatakanaState;
		halfWidthKatakanaState = dakutenForbidden;
		const isAfterHalfWidthMark = isPrevHalfWidthMark;
		isPrevHalfWidthMark = false;
		isPrevHalfWidthKana = false;
		if (isLowerOrUpperAsciiLetter(u)) {
			pendingScore = null;
			const isUpper = (u <= 0x5a);
			// MIDI mode: isUpperCaseAdjacencyAllowed (encoding_guesser.js)
			if (prev === prevCj && !(settings.isUpperCaseAdjacencyAllowed && isUpper)) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = prevAsciiLetter;
			isPrevLetterUpper = isUpper;
		// MIDI mode: isHalfWidthPunctuationScored (encoding_guesser.js)
		} else if (settings.isHalfWidthPunctuationScored && u === 0xff65) {
			// Half-width "･": a separator used inside ASCII text as well ("A･Piano"), not kana
			flushPending();
			score += CJ_PUNCTUATION;
			prev = prevOther;
		} else if (0xff61 <= u && u <= 0xff9f) {
			if (!halfWidthKatakanaSeen) {
				halfWidthKatakanaSeen = true;
				// MIDI mode: isInitialHalfWidthKatakanaPenalized (encoding_guesser.js)
				if (settings.isInitialHalfWidthKatakanaPenalized) {
					score += SHIFT_JIS_INITIAL_HALF_WIDTH_KATAKANA_PENALTY;
				}
			}
			pendingScore = null;
			isPrevHalfWidthKana = true;
			// MIDI mode: isIsolatedKanaIgnored (encoding_guesser.js)
			if (settings.isIsolatedKanaIgnored && isIsolatedKana && !hasKanaRun && !(hasCornerBracketPair && (u === 0xff62 || u === 0xff63))) {
				// A lone half-width katakana in text without any kana run: probably a symbol of a single-byte encoding. No score; adjacency as in chardetng.
				if (prev === prevAsciiLetter) {
					score += CJK_LATIN_ADJACENCY_PENALTY;
				}
				prev = prevOther;
				return;
			}
			// MIDI mode: isHalfWidthPunctuationScored (encoding_guesser.js)
			if (settings.isHalfWidthPunctuationScored && u <= 0xff64) {
				// Half-width "｡｢｣､": punctuation, not kana
				flushPending();
				score += CJ_PUNCTUATION;
				prev = prevOther;
				return;
			}
			const isHalfWidthMark = (u === 0xff70 || u === 0xff9e || u === 0xff9f);
			// MIDI mode: isDetachedHalfWidthMarkIgnored (encoding_guesser.js)
			if (settings.isDetachedHalfWidthMarkIgnored && isHalfWidthMark && (prev !== prevCj || isAfterHalfWidthMark)) {
				// "ｰ" "ﾞ" "ﾟ" that do not follow a kana (or follow another mark): a part of an emoticon such as "(ﾟｰﾟ)", not a kana. No score, no penalty.
				isPrevHalfWidthMark = true;
				prev = prevOther;
				return;
			}
			isPrevHalfWidthMark = isHalfWidthMark;
			// MIDI mode: halfWidthKatakanaScore (encoding_guesser.js)
			score += settings.halfWidthKatakanaScore;
			if ((0xff76 <= u && u <= 0xff84) || u === 0xff73) {
				halfWidthKatakanaState = dakutenAllowed;
			} else if (0xff8a <= u && u <= 0xff8e) {
				halfWidthKatakanaState = dakutenOrHandakutenAllowed;
			} else if (u === 0xff9e) {
				score += (prevKatakanaState === dakutenForbidden) ? IMPLAUSIBILITY_PENALTY : HALF_WIDTH_KATAKANA_VOICING_SCORE;
			} else if (u === 0xff9f) {
				score += (prevKatakanaState !== dakutenOrHandakutenAllowed) ? IMPLAUSIBILITY_PENALTY : HALF_WIDTH_KATAKANA_VOICING_SCORE;
			}
			score += latinAdjacencyPenalty();
			prev = prevCj;
		} else if (0x3040 <= u && u < 0x3100) {
			flushPending();
			score += SHIFT_JIS_SCORE_PER_KANA;
			score += latinAdjacencyPenalty();
			prev = prevCj;
		} else if ((0x3400 <= u && u < 0xa000) || (0xf900 <= u && u < 0xfb00)) {
			flushPending();
			if (prevByte < 0x98 || (prevByte === 0x98 && b < 0x73)) {
				score += maybeSetAsPending(SHIFT_JIS_SCORE_PER_LEVEL_1_KANJI + cjkExtraScore(u, data.frequentKanji));
			} else {
				score += maybeSetAsPending(SHIFT_JIS_SCORE_PER_LEVEL_2_KANJI);
			}
			score += latinAdjacencyPenalty();
			prev = prevCj;
		} else if (0xe000 <= u && u < 0xf900) {
			flushPending();
			score += SHIFT_JIS_PUA_PENALTY;
			prev = prevOther;
		} else if (cjPunctuationJapanese.has(u)) {
			flushPending();
			score += CJ_PUNCTUATION;
			prev = prevOther;
		} else if ((0xff10 <= u && u <= 0xff19) || (0xff21 <= u && u <= 0xff3a) || (0xff41 <= u && u <= 0xff5a)) {
			flushPending();
			// MIDI mode: fullWidthAlphanumericScore (encoding_guesser.js)
			score += settings.fullWidthAlphanumericScore;
			prev = prevOther;
		} else if (prevByte === 0x87) {
			// NEC row 13 (8740h-879Ch): circled numbers, Roman numerals, units, "㈱" and so on
			flushPending();
			// MIDI mode: necRow13Score (encoding_guesser.js)
			score += settings.necRow13Score;
			prev = prevOther;
		} else if (u <= 0x7f) {
			// MIDI mode: isPendingScoreKeptAtLineEnd (encoding_guesser.js)
			if (settings.isPendingScoreKeptAtLineEnd && (u === 0x0a || u === 0x0d)) {	// LF, CR
				flushPending();	// The end of a string is not evidence of Latin text
			} else {
				pendingScore = null;
			}
			prev = prevOther;
		} else if (u === 0x80) {
			pendingScore = null;
			score += IMPLAUSIBILITY_PENALTY;
			prev = prevOther;
		} else {
			flushPending();
			// MIDI mode: musicSymbolScore (encoding_guesser.js)
			score += (isMusicSymbol(u)) ? settings.musicSymbolScore : CJK_OTHER;
			prev = prevOther;
		}
	}

	let lead = -1;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
		if (lead >= 0 && b < 0x20 && settings.isTruncatedCharacterTolerated) {
			lead = -1;	// A 2-byte character cut at the end of a fixed-width string
		}
		if (lead >= 0) {
			const isTrailInRange = (0x40 <= b && b <= 0x7e) || (0x80 <= b && b <= 0xfc);
			if (isTrailInRange) {
				const code = (lead << 8) | b;
				// MIDI mode: isNec932Allowed (encoding_guesser.js)
				if (settings.isNec932Allowed && (0x8540 <= code && code <= 0x86ff)) {
					// NEC PC-98 dependent character: treated like other symbols
					flushPending();
					score += CJK_OTHER;
					prev = prevOther;
				} else {
					const u = decodeCodePoint('shift_jis', [lead, b]);
					if (u !== 0xfffd) {
						scoreChar((u < 0) ? 0x3003 : u, b);	// -1: mapped by WHATWG but not by this runtime. Scored as a symbol.
					} else if (!((lead === 0x82 && b >= 0xfa) || (lead === 0x84 && ((0xdd <= b && b <= 0xe4) || b >= 0xfb)) ||
						(lead === 0x86 && (0xf2 <= b && b <= 0xfa)) || (lead === 0x87 && (0x77 <= b && b <= 0x7d)) || (lead === 0xfc && b >= 0xf5))) {
						// Unmapped pair: Shift_JIS2004 or MacJapanese.
						// MIDI mode: the PC-98 user-defined area (lead EBh-EFh) is neutral; other pairs below F0h are implausible.
						flushPending();
						// MIDI mode: isExtensionPenaltyReduced (encoding_guesser.js)
						if (settings.isExtensionPenaltyReduced && lead < 0xf0) {
							score += (lead >= 0xeb) ? 0 : IMPLAUSIBILITY_PENALTY;
						} else {
							score += SHIFT_JIS_EXTENSION_PENALTY;
						}
						if (lead < 0x87) {
							prev = prevOther;
						} else {
							score += latinAdjacencyPenalty();
							prev = prevCj;
						}
					} else if (b === 0xa0 || b >= 0xfd) {
						pendingScore = null;
						score += singleByteExtensionPenalty(b);
						prev = prevOther;
					} else {
						return null;
					}
				}
			} else if (b === 0xa0 || b >= 0xfd) {
				// The lead byte is malformed, and the byte itself is a single-byte extension
				pendingScore = null;
				score += singleByteExtensionPenalty(b);
				prev = prevOther;
			} else {
				return null;
			}
			prevByte = b;
			lead = -1;
			continue;
		}

		if (b < 0x80) {
			scoreChar(b, b);
		} else if (b === 0x80) {
			scoreChar(0x80, b);
		} else if (0xa1 <= b && b <= 0xdf) {
			const next = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
			const isIsolatedKana = (!isPrevHalfWidthKana && !(0xa1 <= next && next <= 0xdf));
			scoreChar(0xff61 + (b - 0xa1), b, isIsolatedKana);
		} else if ((0x81 <= b && b <= 0x9f) || (0xe0 <= b && b <= 0xfc)) {
			lead = b;
		} else {
			// 0xa0, 0xfd-0xff
			pendingScore = null;
			score += singleByteExtensionPenalty(b);
			prev = prevOther;
			isPrevHalfWidthKana = false;
			// MIDI mode: isLostByteTolerated (encoding_guesser.js)
			if (b >= 0xfd && settings.isLostByteTolerated && i + 1 < bytes.length && bytes[i + 1] >= 0x80 && bytes[i + 1] <= 0xfc) {
				i++;	// The rest of the lost 2-byte character
			}
		}
		prevByte = b;
	}

	// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
	if (lead >= 0 && !settings.isTruncatedCharacterTolerated) {
		return null;
	}
	// MIDI mode: isPendingScoreKeptAtLineEnd (encoding_guesser.js)
	if (settings.isPendingScoreKeptAtLineEnd) {
		flushPending();
	}
	return {score, longestWord: Infinity};
}

// EUC-KR (CP949 superset as in WHATWG). chardetng: EucKrCandidate::feed and maybe_set_as_pending
function scoreEucKr(bytes, start, settings) {
	const korAsciiLetter = 1;
	const korHangul      = 2;
	const korHanja       = 3;
	const korOther       = 4;

	let prev = korOther;
	let prevByte = 0;
	let prevWasEucRange = false;
	let currentWordLength = 0;
	let pendingScore = null;
	let score = 0;

	function flushPending() {
		if (pendingScore !== null) {
			score += pendingScore;
			pendingScore = null;
		}
	}

	function maybeSetAsPending(s) {
		if (prev === korHangul || !isMoreProblematicLead(prevByte)) {
			return s;
		}
		pendingScore = s;
		return 0;
	}

	function scoreChar(u, inEucRange) {
		if (isLowerOrUpperAsciiLetter(u)) {
			pendingScore = null;
			if (prev === korHangul || prev === korHanja) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = korAsciiLetter;
			currentWordLength = 0;
		} else if (0xac00 <= u && u <= 0xd7a3) {
			flushPending();
			if (prevWasEucRange && inEucRange) {
				score += EUC_KR_SCORE_PER_EUC_HANGUL + cjkExtraScore(u, data.frequentHangul);
			} else {
				score += maybeSetAsPending(EUC_KR_SCORE_PER_NON_EUC_HANGUL);
			}
			if (prev === korAsciiLetter) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = korHangul;
			currentWordLength++;
			if (currentWordLength > 5) {
				score += EUC_KR_LONG_WORD_PENALTY;
			}
		} else if ((0x4e00 <= u && u < 0xac00) || (0xf900 <= u && u <= 0xfa0b)) {
			flushPending();
			score += EUC_KR_SCORE_PER_HANJA;
			if (prev === korAsciiLetter) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			} else if (prev === korHangul) {
				score += EUC_KR_HANJA_AFTER_HANGUL_PENALTY;
			}
			prev = korHanja;
			currentWordLength++;
			if (currentWordLength > 5) {
				score += EUC_KR_LONG_WORD_PENALTY;
			}
		} else {
			if (u >= 0x80) {
				flushPending();
				// MIDI mode: musicSymbolScore (encoding_guesser.js)
				score += (isMusicSymbol(u)) ? settings.musicSymbolScore : CJK_OTHER;
			} else {
				pendingScore = null;
			}
			prev = korOther;
			currentWordLength = 0;
		}
	}

	function scoreHanjaLike() {
		if (prev === korAsciiLetter) {
			score += CJK_LATIN_ADJACENCY_PENALTY;
		} else if (prev === korHangul) {
			score += EUC_KR_HANJA_AFTER_HANGUL_PENALTY;
		}
		prev = korHanja;
		currentWordLength++;
		if (currentWordLength > 5) {
			score += EUC_KR_LONG_WORD_PENALTY;
		}
	}

	let lead = -1;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		const inEucRange = (0xa1 <= b && b <= 0xfe);
		// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
		if (lead >= 0 && b < 0x20 && settings.isTruncatedCharacterTolerated) {
			lead = -1;	// A 2-byte character cut at the end of a fixed-width string
		}
		if (lead >= 0) {
			let isHandled = false;
			// The CP949 extension (lead 0x81-0xc6 with trail 0x41-0x5a, 0x61-0x7a, 0x81-0xfe outside the KS X 1001 area) is all Hangul syllables.
			const isExtensionTrail = (0x41 <= b && b <= 0x5a) || (0x61 <= b && b <= 0x7a) || (0x81 <= b && b <= 0xa0) || (lead < 0xa1 && (0xa1 <= b && b <= 0xfe));
			if (lead <= 0xc6 && isExtensionTrail && !(lead === 0xc6 && b > 0x52 && b < 0xa1)) {
				scoreChar(0xac00, false);	// Any Hangul syllable: the frequency bonus applies only to the KS X 1001 area.
				isHandled = true;
			} else if (lead >= 0xa1 && (0xa1 <= b && b <= 0xfe)) {
				if (0xb0 <= lead && lead <= 0xc8) {
					const u = decodeCodePoint('euc-kr', [lead, b]);
					scoreChar((u < 0 || u === 0xfffd) ? 0xac00 : u, true);
					isHandled = true;
				} else if (0xca <= lead && lead <= 0xfd) {
					scoreChar(0x4e00, true);	// Hanja
					isHandled = true;
				} else if (lead <= 0xac) {
					const u = decodeCodePoint('euc-kr', [lead, b]);
					if (u !== 0xfffd) {	// Symbols. Unmapped code points are errors (the rows have gaps).
						scoreChar((u < 0) ? 0x3003 : u, true);
						isHandled = true;
					}
				}
			}
			if (!isHandled) {
				if ((lead === 0xc9 || lead === 0xfe) && inEucRange) {
					flushPending();
					score += EUC_KR_PUA_PENALTY;	// Code page 949 EUDC
					scoreHanjaLike();
				} else if ((lead === 0xa1 || (0xa3 <= lead && lead <= 0xa8) || (0xaa <= lead && lead <= 0xad)) && (0x7b <= b && b <= 0x7d)) {
					flushPending();
					score += EUC_KR_MAC_KOREAN_PENALTY;
					prev = korOther;
					currentWordLength = 0;
				} else if ((0x81 <= lead && lead <= 0x84) && (b <= 0x80 || b === 0xff)) {
					pendingScore = null;
					score += EUC_KR_SINGLE_BYTE_EXTENSION_PENALTY;
					if (isAsciiLetter(b)) {
						prev = korAsciiLetter;
					} else if (b === 0x80 || b === 0xff) {
						score += EUC_KR_SINGLE_BYTE_EXTENSION_PENALTY;
						prev = korOther;
					} else {
						prev = korOther;
					}
					currentWordLength = 0;
				} else if (b === 0x80 || b === 0xff) {
					pendingScore = null;
					score += EUC_KR_SINGLE_BYTE_EXTENSION_PENALTY;
					prev = korOther;
					currentWordLength = 0;
				} else {
					return null;
				}
			}
			prevWasEucRange = inEucRange;
			prevByte = b;
			lead = -1;
			continue;
		}

		if (b < 0x80) {
			scoreChar(b, false);
		} else if (0x81 <= b && b <= 0xfe) {
			lead = b;
		} else {
			// 0x80, 0xff: MacKorean single-byte extensions
			pendingScore = null;
			score += EUC_KR_SINGLE_BYTE_EXTENSION_PENALTY;
			prev = korOther;
			currentWordLength = 0;
		}
		prevWasEucRange = inEucRange;
		prevByte = b;
	}

	// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
	if (lead >= 0 && !settings.isTruncatedCharacterTolerated) {
		return null;
	}
	return {score, longestWord: Infinity};
}

const gb18030RequiredPua = new Set([0xe81e, 0xe826, 0xe82b, 0xe82c, 0xe831, 0xe832, 0xe83b, 0xe843, 0xe854, 0xe855, 0xe864]);

// GBK (the WHATWG decoder is the GB18030 decoder, so 4-byte sequences are possible). chardetng: GbkCandidate::feed and maybe_set_as_pending
function scoreGbk(bytes, start, settings) {
	let prev = prevOther;
	let prevByte = 0;
	let pendingScore = null;
	let score = 0;

	function flushPending() {
		if (pendingScore !== null) {
			score += pendingScore;
			pendingScore = null;
		}
	}

	function maybeSetAsPending(s) {
		if (prev === prevCj || !isMoreProblematicLead(prevByte)) {
			return s;
		}
		pendingScore = s;
		return 0;
	}

	function scoreChar(u, b) {
		if (isLowerOrUpperAsciiLetter(u)) {
			pendingScore = null;
			if (prev === prevCj) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = prevAsciiLetter;
		} else if (u === 0x20ac) {
			pendingScore = null;
			prev = prevOther;
		} else if (0x4e00 <= u && u <= 0x9fa5) {
			flushPending();
			if (0xa1 <= b && b <= 0xfe) {
				if (0xa1 <= prevByte && prevByte <= 0xd7) {
					score += GBK_SCORE_PER_LEVEL_1 + cjkExtraScore(u, data.frequentSimplified);
				} else if (0xd8 <= prevByte && prevByte <= 0xfe) {
					score += GBK_SCORE_PER_LEVEL_2;
				} else {
					score += GBK_SCORE_PER_NON_EUC;
				}
			} else {
				score += maybeSetAsPending(GBK_SCORE_PER_NON_EUC);
			}
			if (prev === prevAsciiLetter) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = prevCj;
		} else if ((0x3400 <= u && u < 0xa000) || (0xf900 <= u && u < 0xfb00)) {
			flushPending();
			if (prev === prevAsciiLetter) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = prevCj;
		} else if (0xe000 <= u && u < 0xf900) {
			flushPending();
			if ((0xe78d <= u && u <= 0xe796) || (0xe816 <= u && u <= 0xe818) || gb18030RequiredPua.has(u)) {
				score += GBK_SCORE_PER_NON_EUC;
				if (prev === prevAsciiLetter) {
					score += CJK_LATIN_ADJACENCY_PENALTY;
				}
				prev = prevCj;
			} else {
				score += GBK_PUA_PENALTY;
				prev = prevOther;
			}
		} else if (u >= 0x10000) {
			// Astral: supplementary PUA or SIP ideographs
			flushPending();
			if (u >= 0xf0000) {
				score += GBK_PUA_PENALTY;
				prev = prevOther;
			} else if (0x20000 <= u && u < 0x30000) {
				score += GBK_SCORE_PER_NON_EUC;
				if (prev === prevAsciiLetter) {
					score += CJK_LATIN_ADJACENCY_PENALTY;
				}
				prev = prevCj;
			} else {
				score += CJK_OTHER;
				prev = prevOther;
			}
		} else if (cjPunctuationChinese.has(u)) {
			flushPending();
			score += CJ_PUNCTUATION;
			prev = prevOther;
		} else if (u <= 0x7f) {
			pendingScore = null;
			prev = prevOther;
		} else {
			flushPending();
			score += CJK_OTHER;
			prev = prevOther;
		}
	}

	let i = start;

	while (i < bytes.length) {
		const b = bytes[i];
		if (b < 0x80) {
			scoreChar(b, b);
			prevByte = b;
			i++;
			continue;
		}
		if (b === 0x80) {
			scoreChar(0x20ac, b);
			prevByte = b;
			i++;
			continue;
		}
		if (b === 0xff) {
			pendingScore = null;
			score += GBK_SINGLE_BYTE_EXTENSION_PENALTY;
			prev = prevOther;
			prevByte = b;
			i++;
			continue;
		}
		// Lead byte 0x81-0xfe
		// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
		if (settings.isTruncatedCharacterTolerated && (i + 1 >= bytes.length || bytes[i + 1] < 0x20)) {
			prevByte = b;	// A 2-byte character cut at the end of a fixed-width string
			i++;
			continue;
		}
		if (i + 1 >= bytes.length) {
			return null;
		}
		const secondByte = bytes[i + 1];
		if (0x30 <= secondByte && secondByte <= 0x39) {
			// 4-byte sequence
			if (i + 3 >= bytes.length) {
				return null;
			}
			const thirdByte = bytes[i + 2];
			const fourthByte = bytes[i + 3];
			if (thirdByte < 0x81 || thirdByte > 0xfe || fourthByte < 0x30 || fourthByte > 0x39) {
				return null;
			}
			const text = decodeBytes('gbk', [b, secondByte, thirdByte, fourthByte]);
			const u = text.codePointAt(0);
			if (u === 0xfffd) {
				return null;
			}
			prevByte = thirdByte;
			scoreChar(u, fourthByte);
			prevByte = fourthByte;
			i += 4;
			continue;
		}
		const isTrailInRange = (0x40 <= secondByte && secondByte <= 0x7e) || (0x80 <= secondByte && secondByte <= 0xfe);
		let isHandled = false;
		if (isTrailInRange) {
			// Every pair in the range is mapped by WHATWG (GB18030). The user-defined areas map to the PUA.
			const isUserDefined = ((0xaa <= b && b <= 0xaf) && secondByte >= 0xa1) || ((0xf8 <= b && b <= 0xfe) && secondByte >= 0xa1) ||
				((0xa1 <= b && b <= 0xa7) && secondByte <= 0xa0);
			const decoded = (isUserDefined) ? 0xe000 : decodeCodePoint('gbk', [b, secondByte]);
			const u = (decoded < 0 || decoded === 0xfffd) ? 0x2e80 : decoded;	// Not mapped by this runtime: scored as a symbol
			prevByte = b;
			scoreChar(u, secondByte);
			isHandled = true;
		}
		if (!isHandled) {
			if ((b === 0xa0 || b === 0xfe || b === 0xfd) && (secondByte < 0x80 || secondByte === 0xff)) {
				// Mac OS Chinese Simplified single-byte that conflicts with a lead byte
				pendingScore = null;
				score += GBK_SINGLE_BYTE_EXTENSION_PENALTY;
				if (isAsciiLetter(secondByte)) {
					prev = prevAsciiLetter;
				} else if (secondByte === 0xff) {
					score += GBK_SINGLE_BYTE_EXTENSION_PENALTY;
					prev = prevOther;
				} else {
					prev = prevOther;
				}
			} else {
				return null;
			}
		}
		prevByte = secondByte;
		i += 2;
	}

	return {score, longestWord: Infinity};
}

// Big5 (WHATWG Big5-HKSCS superset). chardetng: Big5Candidate::feed and maybe_set_as_pending
function scoreBig5(bytes, start, settings) {
	let prev = prevOther;
	let prevByte = 0;
	let pendingScore = null;
	let score = 0;

	function flushPending() {
		if (pendingScore !== null) {
			score += pendingScore;
			pendingScore = null;
		}
	}

	function maybeSetAsPending(s) {
		if (prev === prevCj || !isProblematicLead(prevByte)) {
			return s;
		}
		pendingScore = s;
		return 0;
	}

	function scoreHanzi(s) {
		flushPending();
		score += maybeSetAsPending(s);
		if (prev === prevAsciiLetter) {
			score += CJK_LATIN_ADJACENCY_PENALTY;
		}
		prev = prevCj;
	}

	function scoreChar(u) {
		if (isLowerOrUpperAsciiLetter(u)) {
			pendingScore = null;
			if (prev === prevCj) {
				score += CJK_LATIN_ADJACENCY_PENALTY;
			}
			prev = prevAsciiLetter;
		} else if ((0x3400 <= u && u < 0xa000) || (0xf900 <= u && u < 0xfb00)) {
			scoreHanzi((0xa4 <= prevByte && prevByte <= 0xc6) ? BIG5_SCORE_PER_LEVEL_1_HANZI : BIG5_SCORE_PER_OTHER_HANZI);
		} else if (u >= 0x10000) {
			scoreHanzi(BIG5_SCORE_PER_OTHER_HANZI);
		} else if (cjPunctuationChinese.has(u)) {
			flushPending();
			score += CJ_PUNCTUATION;
			prev = prevOther;
		} else if (u <= 0x7f) {
			pendingScore = null;
			prev = prevOther;
		} else {
			flushPending();
			score += CJK_OTHER;
			prev = prevOther;
		}
	}

	let lead = -1;

	for (let i = start; i < bytes.length; i++) {
		const b = bytes[i];
		// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
		if (lead >= 0 && b < 0x20 && settings.isTruncatedCharacterTolerated) {
			lead = -1;	// A 2-byte character cut at the end of a fixed-width string
		}
		if (lead >= 0) {
			const isTrailInRange = (0x40 <= b && b <= 0x7e) || (0xa1 <= b && b <= 0xfe);
			if (isTrailInRange) {
				const text = decodeBytes('big5', [lead, b]);
				let u = (text.length > 0) ? text.codePointAt(0) : -1;
				if (0xe000 <= u && u < 0xf900) {
					u = -1;	// ICU maps unmapped pairs to the PUA. WHATWG does not.
				}
				if (u < 0) {
					// Not mapped by this runtime (ICU lacks HKSCS): classified by the byte ranges of WHATWG's index.
					if (lead <= 0x86) {
						u = 0xfffd;	// Unmapped in WHATWG as well
					} else if (lead <= 0xa0 || lead >= 0xfa || (lead === 0xc6 && b >= 0xa1) || lead === 0xc7 || lead === 0xc8 || (lead === 0xf9 && b >= 0xd6)) {
						u = 0x4e00;	// HKSCS and ETEN extensions: mostly Hanzi
					} else if (lead <= 0xa3) {
						u = 0x3003;	// Symbols
					} else {
						u = 0xfffd;
					}
				}
				if (u === 0xfffd) {
					// Unmapped pair in the Big5 range: Big5-UAO and so on
					flushPending();
					score += BIG5_PUA_PENALTY;
					if (prev === prevAsciiLetter) {
						score += CJK_LATIN_ADJACENCY_PENALTY;
					}
					prev = prevCj;
				} else if (text.length === 2 && u < 0x10000) {
					// "Ê̄" and so on: 2 code units
					flushPending();
					score += CJK_OTHER;
					prev = prevOther;
				} else {
					scoreChar(u);
				}
			} else if ((lead === 0xa0 || lead === 0xfd || lead === 0xfe) && (b < 0x80 || b === 0xff)) {
				pendingScore = null;
				score += BIG5_SINGLE_BYTE_EXTENSION_PENALTY;
				if (isAsciiLetter(b)) {
					prev = prevAsciiLetter;
				} else if (b === 0xff) {
					score += BIG5_SINGLE_BYTE_EXTENSION_PENALTY;
					prev = prevOther;
				} else {
					prev = prevOther;
				}
			} else {
				return null;
			}
			prevByte = b;
			lead = -1;
			continue;
		}

		if (b < 0x80) {
			scoreChar(b);
		} else if (0x81 <= b && b <= 0xfe) {
			lead = b;
		} else {
			// 0x80: error in WHATWG Big5. 0xff: Mac OS Chinese Traditional single-byte extension
			if (b !== 0xff) {
				return null;
			}
			pendingScore = null;
			score += BIG5_SINGLE_BYTE_EXTENSION_PENALTY;
			prev = prevOther;
		}
		prevByte = b;
	}

	// MIDI mode: isTruncatedCharacterTolerated (encoding_guesser.js)
	if (lead >= 0 && !settings.isTruncatedCharacterTolerated) {
		return null;
	}
	return {score, longestWord: Infinity};
}

// chardetng: InnerCandidate::feed with `last` (the end of the stream is a space for the single-byte candidates)
export function scoreCandidate(encoding, bytes, start, settings) {
	console.assert(bytes instanceof Uint8Array);
	console.assert(0 <= start && start <= bytes.length);
	console.assert(typeof settings === 'object');

	// chardetng treats the end of the stream as a space for the single-byte candidates (it settles the last word).
	const withEof = () => {
		const array = new Uint8Array(bytes.length - start + 1);
		array.set(bytes.subarray(start));
		array[array.length - 1] = 0x20;
		return array;
	};
	switch (encoding) {
	case 'shift_jis':
		return scoreShiftJis(bytes, start, settings);
	case 'euc-kr':
		return scoreEucKr(bytes, start, settings);
	case 'gbk':
		return scoreGbk(bytes, start, settings);
	case 'big5':
		return scoreBig5(bytes, start, settings);
	case 'windows-1252':
		return scoreLatin(withEof(), 0, singleByteModels[encoding], true, settings);
	case 'windows-1252-icelandic':
		return scoreLatin(withEof(), 0, singleByteModels[encoding], false, settings);
	case 'windows-1251':
		return scoreNonLatinCased(withEof(), 0, singleByteModels[encoding], false, false, settings);
	case 'koi8-u':
		return scoreNonLatinCased(withEof(), 0, singleByteModels[encoding], false, true, settings);
	case 'ibm866':
		return scoreNonLatinCased(withEof(), 0, singleByteModels[encoding], true, false, settings);
	case 'windows-1258':
		return scoreLatin(withEof(), 0, singleByteModels[encoding], false, settings);
	case 'windows-1253':
		return scoreNonLatinCased(withEof(), 0, singleByteModels[encoding], false, false, settings);
	case 'windows-874':
		return scoreCaseless(withEof(), 0, singleByteModels[encoding], settings);
	default:
		console.assert(false, `Unknown candidate: ${encoding}`);
		return null;
	}
}
