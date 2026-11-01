// Maps languages (Accept-Language style) to the preferences of the encoding guesser. Only this file knows both languages and encodings.
import {defaultPreferences} from './encoding_guesser.js';

// Languages written in the windows-1252 repertoire
const latinLanguages = new Set([
	'af', 'br', 'ca', 'co', 'cy', 'da', 'de', 'en', 'es', 'eu', 'fi', 'fo', 'fr', 'ga', 'gd', 'gl', 'id', 'is', 'it', 'la',
	'lb', 'ms', 'nb', 'nl', 'nn', 'no', 'oc', 'pt', 'rm', 'sq', 'sv', 'sw', 'tl', 'wa',
]);
// Languages written in the windows-1251 repertoire (KOI8-U and IBM866 are not mapped from a language; give them by encoding)
const cyrillicLanguages = new Set(['be', 'bg', 'mk', 'ru', 'sr', 'uk']);
const simplifiedChineseRegions = new Set(['cn', 'my', 'sg']);
const traditionalChineseRegions = new Set(['hk', 'mo', 'tw']);

// Encodings of a language tag ("zh-Hant", "sr-Latn", "pt-BR"). An empty array: no candidate of the guesser.
function toEncodings(languageTag) {
	const subtags = languageTag.toLowerCase().split('-');
	const [language] = subtags;
	const script = subtags.find((e) => (e.length === 4));
	const region = subtags.find((e) => (e.length === 2 && e !== language));

	switch (language) {
	case 'ja':
		return ['shift_jis'];
	case 'vi':
		return ['windows-1258'];
	case 'zh':
		if (script === 'hant' || (!script && traditionalChineseRegions.has(region))) {
			return ['big5'];
		}
		if (script === 'hans' || (!script && simplifiedChineseRegions.has(region))) {
			return ['gbk'];
		}
		return ['gbk', 'big5'];	// A bare "zh" is read as Simplified Chinese first
	case 'ko':
		return ['euc-kr'];
	case 'el':
		return ['windows-1253'];
	case 'th':
		return ['windows-874'];
	default:
		if (latinLanguages.has(language)) {
			return ['windows-1252'];
		}
		return (cyrillicLanguages.has(language) && script !== 'latn') ? ['windows-1251'] : [];
	}
}

// Parses an Accept-Language value: "ja, en;q=1, ru;q=0.6, *;q=0.5". Returns [{language, q}].
function parseAcceptLanguage(text) {
	const entries = [];

	for (const part of text.split(',')) {
		const [tag, ...parameters] = part.split(';').map((e) => e.trim());
		if (tag.length === 0) {
			continue;
		}
		let q = 1;

		for (const parameter of parameters) {
			const qMatch = (/^q=([0-9.]+)$/iu).exec(parameter);
			if (qMatch) {
				q = Number.parseFloat(qMatch[1]);
			}
		}

		entries.push({language: tag, q});
	}

	return entries;
}

// acceptLanguage: an Accept-Language string, or an array of {language, q} (q is 1 when omitted).
// Returns {preferences, warnings}. preferences: [{encoding, q}] for guessEncoding(), ordered by q and then by first appearance.
// "*" stands for the default candidates that are not named. Languages without a candidate encoding are reported in warnings.
export function toEncodingPreferences(acceptLanguage) {
	const entries = (typeof acceptLanguage === 'string') ? parseAcceptLanguage(acceptLanguage) : acceptLanguage;
	console.assert(Array.isArray(entries));

	const encodingQs = new Map();	// encoding -> q (the maximum of the languages that map to it)
	const warnings = [];
	let wildcardQ = null;

	for (const entry of entries) {
		const language = (typeof entry === 'string') ? entry : entry.language;
		const q = Math.max(0, Math.min(1, entry.q ?? 1));
		if (!Number.isFinite(q)) {
			warnings.push(`Invalid q for language: ${language}`);
			continue;
		}
		if (language === '*') {
			wildcardQ = Math.max(wildcardQ ?? 0, q);
			continue;
		}
		const encodings = toEncodings(language);
		if (encodings.length === 0) {
			warnings.push(`No encoding candidate for language: ${language}`);
			continue;
		}

		for (const encoding of encodings) {
			encodingQs.set(encoding, Math.max(encodingQs.get(encoding) ?? 0, q));
		}
	}

	if (wildcardQ !== null) {
		for (const {encoding} of defaultPreferences) {
			if (!encodingQs.has(encoding)) {
				encodingQs.set(encoding, wildcardQ);
			}
		}
	}

	// A stable sort by q keeps the order of appearance for equal q: that order breaks ties in the guesser.
	const preferences = [...encodingQs.entries()].map(([encoding, q]) => ({encoding, q})).filter((e) => (e.q > 0));
	preferences.sort((a, b) => b.q - a.q);
	return {preferences, warnings};
}
