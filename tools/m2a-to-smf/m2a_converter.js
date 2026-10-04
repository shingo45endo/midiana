import {parseChunk} from '../../lib/file-parser/chunk_parser.js';

export const defaultSettings = Object.freeze({
	deviceNo:     0,
	isInitSent:   true,
	initWait:     1000,	// in milliseconds
	bytesPerSec:  2800,	// A little slower than MIDI (3125 bytes/s) to leave a margin.
	songDivision: 480,	// Used only when the file has no song.
});

// Model ID of the MU2000 for the sampling data.
const modelIdSampling = 0x68;

// The sampling memory of the MU2000 without the expansion.
const maxWordNum = 0x100000;

const dataTypesVoice = Object.freeze([0x00010002, 0x00010102]);
const dataTypesKit   = Object.freeze([0x00010000, 0x00010100, 0x00010101]);

export function convertM2aToSmfs(bytes, settings = defaultSettings, logs = []) {
	console.assert(bytes instanceof Uint8Array);

	const m2a = parseM2a(bytes, logs);
	const song = parseSmf(m2a.songBytes, logs);
	const division = song?.division ?? settings.songDivision;

	const sysExs = makeSamplingSysExs(m2a, settings, logs);
	const samplingEvents = makeSamplingEvents(sysExs, division, settings);
	const samplingSmf = makeSmf(0, division, [makeTrack(samplingEvents)]);

	if (!song) {
		return {samplingSmf, songSmf: null, combinedSmf: null};
	}
	const combinedSmf = makeCombinedSmf(samplingEvents, song);

	return {samplingSmf, songSmf: m2a.songBytes, combinedSmf};
}

function parseM2a(bytes, logs) {
	const chunks = parseChunk(bytes, [], logs);
	const root = makeChunkTree(chunks);
	const rmid = findChild(root, 'RMID');
	if (!rmid) {
		throw new Error('Not an RMID file');
	}
	const ycvf = findChild(rmid, 'YCVF');
	if (!ycvf) {
		throw new Error('No sampling data (LIST YCVF)');
	}

	const waves = parseWaves(findChild(ycvf, 'wvpl'), findChild(ycvf, 'ptbl'), logs);
	const instruments = findChildren(findChild(ycvf, 'lins'), 'ins ').map((e) => parseInstrument(e));

	return {
		songBytes: findChild(rmid, 'data')?.payload ?? null,
		title:     getName(rmid),
		waves,
		instruments,
	};
}

// Remakes the tree of RIFF chunks from the flat list. A container comes just before its children.
function makeChunkTree(chunks) {
	const root = {tag: '', tags: [], children: []};
	const nodes = [root];
	for (const chunk of chunks) {
		const parentPath = chunk.tags.slice(0, -1).join('/');
		while (nodes.length > 1 && nodes[nodes.length - 1].tags.join('/') !== parentPath) {
			nodes.pop();
		}
		const node = {...chunk, children: []};
		nodes[nodes.length - 1].children.push(node);
		if (!('content' in chunk)) {
			nodes.push(node);
		}
	}
	return root;
}

function findChild(node, tag) {
	return node?.children.find((e) => (e.tag === tag)) ?? null;
}

function findChildren(node, tag) {
	return node?.children.filter((e) => (e.tag === tag)) ?? [];
}

function findV000(node) {
	return findChild(findChild(findChild(node, 'YMHM'), 'MU00'), 'v000');
}

function getName(node) {
	const inam = findChild(findChild(node, 'INFO'), 'INAM');
	return (inam?.content.rawString) ? String.fromCharCode(...inam.content.rawString) : '';
}

function parseWaves(wvpl, ptbl, logs) {
	const waves = findChildren(wvpl, 'wave').map((node, index) => {
		const fmt = findChild(node, 'fmt ')?.content;
		const v000 = findV000(node)?.content;
		const data = findChild(node, 'data')?.payload ?? new Uint8Array();
		const name = getName(node);
		if (!v000) {
			logs.push({message: `Wave ${index} (${name}) has no v000 chunk. Uses ${index} as its sample number.`});
		}
		return {
			name,
			format:             fmt,
			sampleLoops:        findChild(node, 'wsmp')?.content.wavesampleLoops ?? [],
			sampleNo:           v000?.sampleNo ?? index,
			stereoPairSampleNo: v000?.stereoPairSampleNo ?? -1,
			startPoint:         v000?.startPoint ?? 0,
			endPoint:           v000?.endPoint ?? 0,
			leadingPaddingNum:  v000?.leadingPaddingNum ?? 0,
			trailingPaddingNum: v000?.trailingPaddingNum ?? 0,
			isLoopOn:           v000?.isLoopOn ?? false,
			rawByte19:          v000?.rawByte19 ?? 0,
			data,
			// Offset of 'LIST' of this wave from the data of 'LIST wvpl'.
			poolOffset:         node.payload.byteOffset - 12 - wvpl.payload.byteOffset,
		};
	});

	// Sorts the waves in the order of the pool table.
	if (!ptbl) {
		return waves;
	}
	const offsets = ptbl.content.poolcues.map((e) => e.ulOffset);
	// Some files have the wave indices instead of the offsets.
	const isIndexTable = (offsets.some((offset) => !waves.some((e) => (e.poolOffset === offset))) &&
		offsets.every((offset) => (offset < waves.length)));
	if (isIndexTable) {
		return offsets.map((index) => waves[index]);
	}
	return offsets.map((offset) => {
		const wave = waves.find((e) => (e.poolOffset === offset));
		if (!wave) {
			logs.push({message: `No wave at the offset ${offset} in the pool table`});
		}
		return wave ?? null;
	});
}

function parseInstrument(node) {
	const insh = findChild(node, 'insh')?.content;
	const v000 = findV000(node);
	const bank = insh?.ulBankLocale ?? 0;
	return {
		name:       getName(node),
		isDrum:     ((bank & 0x80000000) !== 0),
		bankMsb:    (bank >> 8) & 0x7f,
		bankLsb:    bank & 0x7f,
		programNo:  (insh?.ulInstrumentLocale ?? 0) & 0x7f,
		dataType:   v000?.content.dataType ?? null,
		voiceBytes: (v000?.payload.byteLength >= 358) ? v000.payload.subarray(8, 358) : null,
		regions:    findChildren(findChild(node, 'lrgn'), 'rgn ').map((e) => parseRegion(e)),
	};
}

function parseRegion(node) {
	const rgnh = findChild(node, 'rgnh')?.content;
	const v000 = findV000(node)?.payload ?? new Uint8Array();
	return {
		keyLow:    rgnh?.usLowRangeKey ?? 0,
		keyHigh:   rgnh?.usHighRangeKey ?? 127,
		waveIndex: findChild(node, 'wlnk')?.content.ulTableIndex ?? null,
		instName:  (v000.byteLength === 50) ? String.fromCharCode(...v000.subarray(0, 8)) : null,
		instBytes: (v000.byteLength === 50) ? v000.subarray(8, 50) : null,
		slotBytes: (v000.byteLength === 20) ? v000.subarray(4, 20) : null,
	};
}

function makeSamplingSysExs(m2a, settings, logs) {
	const {deviceNo} = settings;
	const sysExs = [];
	const addBulkDump = (addr, data) => sysExs.push({bytes: makeBulkDump(deviceNo, addr, data), wait: 0});

	// Initializes all the sampling data.
	if (settings.isInitSent) {
		sysExs.push({bytes: makeParamChange(deviceNo, [0x00, 0x00, 0x7f], [0x00]), wait: settings.initWait});
	}

	// Places the waves in the sampling memory without gaps.
	const waves = m2a.waves.filter((e) => e);
	let wordNum = 0;
	for (const wave of waves) {
		if (wave.format?.wFormatTag !== 1 || wave.format.nChannels !== 1 || ![8, 16].includes(wave.format.wBitsPerSample)) {
			logs.push({message: `Wave ${wave.sampleNo} (${wave.name}) is not 8-bit or 16-bit mono PCM. Skipped.`});
			wave.isSkipped = true;
			continue;
		}
		wave.startWord = wordNum;
		wave.wordNum = Math.ceil(wave.data.byteLength / 4);
		wordNum += wave.wordNum;
	}
	if (wordNum > maxWordNum) {
		logs.push({message: `The waves (${wordNum * 4} bytes) exceed the sampling memory of the MU2000 without expansion (${maxWordNum * 4} bytes).`});
	}

	// Sends the waves to the sampling memory from its top.
	const memory = new Uint8Array(Math.ceil(wordNum / 16) * 64);
	for (const wave of waves.filter((e) => (!e.isSkipped))) {
		memory.set(convertPcm(wave.data, wave.format.wBitsPerSample), wave.startWord * 4);
	}
	addBulkDump([0x00, 0x00, 0x00], [0x00, 0x00, 0x00, 0x00]);
	for (let pos = 0; pos < memory.byteLength; pos += 64) {
		addBulkDump([0x00, 0x01, 0x00], packPcmBytes(memory.subarray(pos, pos + 64)));
	}

	// Moves the start of the free area to the end of the waves.
	addBulkDump([0x00, 0x00, 0x10], toSevenBits5(wordNum));

	// Sets the samples.
	for (const wave of waves.filter((e) => (!e.isSkipped))) {
		const addrHigh = 0x10 | (wave.sampleNo >> 7);
		const addrMid  = wave.sampleNo & 0x7f;
		addBulkDump([addrHigh, addrMid, 0x00], makeSampleBytes(wave));
		addBulkDump([addrHigh, addrMid, 0x70], toNameBytes(wave.name));
	}

	// Sets the sampling kits before the voices because a drum inst copies the slot only when the sample is assigned.
	const sentSlots = new Map();
	const voiceSlots = new Map();
	for (const instrument of m2a.instruments) {
		if (!dataTypesVoice.includes(instrument.dataType) && !dataTypesKit.includes(instrument.dataType)) {
			logs.push({message: `Instrument ${instrument.name} has an unknown data type. Skipped.`});
		}
	}
	for (const instrument of m2a.instruments.filter((e) => dataTypesKit.includes(e.dataType))) {
		addKit(instrument);
	}
	for (const instrument of m2a.instruments.filter((e) => dataTypesVoice.includes(e.dataType))) {
		addVoice(instrument);
	}

	// Sets the slots of the samples used by no voices and no insts.
	for (const wave of waves.filter((e) => (!e.isSkipped && !sentSlots.has(e)))) {
		setSlot(wave, makeDefaultSlot(wave));
	}

	return sysExs;

	function setSlot(wave, slotBytes) {
		const prevSlotBytes = sentSlots.get(wave);
		if (prevSlotBytes && prevSlotBytes.every((e, i) => (e === slotBytes[i]))) {
			return;
		}
		addBulkDump([0x10 | (wave.sampleNo >> 7), wave.sampleNo & 0x7f, 0x20], makeSlotBytes(slotBytes, wave.startWord));
		sentSlots.set(wave, slotBytes);
	}

	function addVoice(instrument) {
		if (instrument.isDrum || instrument.bankMsb !== 16 || instrument.bankLsb > 1) {
			logs.push({message: `Voice ${instrument.name} is not in the sampling voice banks. Skipped.`});
			return;
		}
		if (instrument.dataType !== 0x00010102 || instrument.regions.length !== 1) {
			logs.push({message: `Voice ${instrument.name} has more than one region. It is not supported. Skipped.`});
			return;
		}
		const voiceBytes = instrument.voiceBytes.slice();

		// Element 1 plays the wave of the region.
		const region = instrument.regions[0];
		const wave = m2a.waves[region.waveIndex];
		if (wave && !wave.isSkipped) {
			voiceBytes[14] = 0x40 | (wave.sampleNo >> 7);
			voiceBytes[15] = wave.sampleNo & 0x7f;
			if (region.slotBytes) {
				// A sample has only one slot for all the voices. The last one is used like the MU2000 does when it loads an M2A file.
				const prevSlotBytes = voiceSlots.get(wave);
				if (prevSlotBytes && !prevSlotBytes.every((e, i) => (e === region.slotBytes[i]))) {
					logs.push({message: `Wave ${wave.sampleNo} (${wave.name}) is used by 2 or more voices with different settings. Uses the last one.`});
				}
				voiceSlots.set(wave, region.slotBytes);
				setSlot(wave, region.slotBytes);
			}
		}

		const addrHigh = 0x40 | (instrument.bankLsb << 4);
		const addrMid = instrument.programNo;
		for (let elementNo = 1; elementNo <= 4; elementNo++) {
			const begin = 14 + 84 * (elementNo - 1);
			addBulkDump([addrHigh + elementNo, addrMid, 0x00], voiceBytes.subarray(begin, begin + 84));
		}
		// Sends the common part after the elements because the MU2000 breaks byte 0 of the common part when it receives an element.
		addBulkDump([addrHigh, addrMid, 0x00], [0x00, voiceBytes[0], voiceBytes[1], ...voiceBytes.subarray(2, 10)]);
		addBulkDump([addrHigh, addrMid, 0x10], [voiceBytes[12]]);
	}

	function addKit(instrument) {
		const kitIndex = instrument.programNo - 112;
		if (!instrument.isDrum || ![0, 126].includes(instrument.bankMsb) || kitIndex < 0 || kitIndex > 3) {
			logs.push({message: `Kit ${instrument.name} is not in the sampling kits. Skipped.`});
			return;
		}
		addBulkDump([0x30, kitIndex, 0x00], toNameBytes(instrument.name));

		for (const region of instrument.regions) {
			const wave = m2a.waves[region.waveIndex];
			if (!region.instBytes || !wave || wave.isSkipped) {
				continue;
			}
			for (let noteNo = region.keyLow; noteNo <= region.keyHigh; noteNo++) {
				if (noteNo < 13 || noteNo > 91) {
					logs.push({message: `Kit ${instrument.name} has an inst out of the range (note ${noteNo}). Skipped.`});
					continue;
				}
				// Assigns the sample first because it overwrites the other parameters.
				setSlot(wave, makeSlotFromInst(region.instBytes));
				const addr = [0x31 + kitIndex, noteNo];
				addBulkDump([...addr, 0x60], [0x01, 0x00, wave.sampleNo >> 7, wave.sampleNo & 0x7f, 0x00, 0x00, 0x00, 0x00]);
				addBulkDump([...addr, 0x00], makeInstBytes(region.instBytes));
				addBulkDump([...addr, 0x70], toNameBytes(region.instName));
			}
		}
	}
}

// Sample: flags, format, stereo partner, sample rate, start and end in 32-bit words, and padding numbers.
function makeSampleBytes(wave) {
	const isStereo = (wave.stereoPairSampleNo >= 0);
	const flags = 0x40 | ((isStereo) ? 0x10 : 0x00) | ((wave.isLoopOn) ? 0x02 : 0x00) | (wave.rawByte19 & 0x01);
	const format = (wave.format.wBitsPerSample === 16) ? 0 : 2;
	const stereoPairSampleNo = (isStereo) ? wave.stereoPairSampleNo : 0x3fff;
	return [
		flags, format, 0x00, stereoPairSampleNo >> 7, stereoPairSampleNo & 0x7f,
		...toSevenBits5(wave.format.nSamplesPerSec),
		...toSevenBits5(wave.startWord),
		...toSevenBits5(wave.startWord + wave.wordNum),
		wave.leadingPaddingNum, wave.trailingPaddingNum,
	];
}

// Sample slot: converts 16 bytes of the slot to 24 bytes. The address is relative to the start of the wave.
function makeSlotBytes(slotBytes, startWord) {
	const fineTune = (slotBytes[2] << 24) >> 24;
	const address = (((slotBytes[12] & 0x01) << 24) | (slotBytes[13] << 16) | (slotBytes[14] << 8) | slotBytes[15]) + startWord;
	return [
		slotBytes[0], slotBytes[3] & 0x7f, slotBytes[1],
		((fineTune < 0) ? 0x01 : 0x00) | (((slotBytes[3] & 0x80) !== 0) ? 0x40 : 0x00), Math.min(Math.abs(fineTune), 0x7f),
		...toSevenBits5(address),
		...toSevenBits5((slotBytes[9] << 16) | (slotBytes[10] << 8) | slotBytes[11]),
		...toSevenBits5((slotBytes[5] << 16) | (slotBytes[6] << 8) | slotBytes[7]),
		slotBytes[8] >> 7, slotBytes[8] & 0x7f,
		slotBytes[4] >> 7, slotBytes[4] & 0x7f,
	];
}

// The MU2000 copies the slot to the drum inst with the root key + 4.
function makeSlotFromInst(instBytes) {
	return new Uint8Array([0x00, instBytes[26] - 4, 0x00, 0x7f, ...instBytes.subarray(30, 42)]);
}

// Slot of a wave used by no voices and no insts.
function makeDefaultSlot(wave) {
	const samplesPerWord = (wave.format.wBitsPerSample === 16) ? 2 : 4;
	const pitch = Math.floor((60 + 12 * Math.log2(44100 / wave.format.nSamplesPerSec)) * 256);
	const rootKey = pitch >> 8;
	const fineTune = -(((pitch & 0xff) * 100) >> 8);
	const loop = wave.sampleLoops[0];
	const [isLoopOff, preLoopLength, loopLength] = (wave.isLoopOn && loop) ?
		[false, loop.ulLoopStart - wave.startPoint, loop.ulLoopLength] :
		[true, 0, wave.endPoint - wave.startPoint + 1];
	const address = Math.floor((wave.leadingPaddingNum + wave.startPoint + preLoopLength) / samplesPerWord);
	const format = (wave.format.wBitsPerSample === 16) ? 0x00 : 0x80;
	return new Uint8Array([
		0x00, rootKey, fineTune & 0xff, 0x7f,
		(isLoopOff) ? 0x40 : 0x00, preLoopLength >> 16, (preLoopLength >> 8) & 0xff, preLoopLength & 0xff,
		0x00, loopLength >> 16, (loopLength >> 8) & 0xff, loopLength & 0xff,
		format | (address >> 24), (address >> 16) & 0xff, (address >> 8) & 0xff, address & 0xff,
	]);
}

// Inst: the first byte carries the note shift (XG) instead of the coarse pitch.
function makeInstBytes(instBytes) {
	const noteShift = (instBytes[28] << 24) >> 24;
	return [Math.max(Math.min(0x40 + noteShift, 0x7f), 0x00), ...instBytes.subarray(1, 24)];
}

// Converts the PCM of a WAVE file to the sampling memory: 8-bit to signed, and then swaps each 2 bytes for both 8-bit and 16-bit.
function convertPcm(data, bitsPerSample) {
	const bytes = data.slice();
	if (bitsPerSample === 8) {
		for (let i = 0; i < bytes.byteLength; i++) {
			bytes[i] ^= 0x80;
		}
	}
	for (let i = 0; i + 1 < bytes.byteLength; i += 2) {
		[bytes[i], bytes[i + 1]] = [bytes[i + 1], bytes[i]];
	}
	return bytes;
}

// Packs 64 bytes into 74 bytes: 7 bytes and their MSBs (first byte in bit 6) × 9, and the last byte in 2 bytes.
function packPcmBytes(bytes) {
	console.assert(bytes.byteLength === 64);
	const packedBytes = [];
	for (let i = 0; i < 63; i += 7) {
		let msbs = 0;
		for (let j = 0; j < 7; j++) {
			packedBytes.push(bytes[i + j] & 0x7f);
			msbs |= (bytes[i + j] >> 7) << (6 - j);
		}
		packedBytes.push(msbs);
	}
	packedBytes.push(bytes[63] & 0x7f, bytes[63] >> 7);
	return packedBytes;
}

// 32-bit value in 5 bytes: 4 bits and 7 bits × 4.
function toSevenBits5(value) {
	return [(value >>> 28) & 0x0f, (value >>> 21) & 0x7f, (value >>> 14) & 0x7f, (value >>> 7) & 0x7f, value & 0x7f];
}

function toNameBytes(name) {
	return [...name.padEnd(8, ' ').slice(0, 8)].map((e) => {
		const code = e.charCodeAt(0);
		return (code >= 0x20 && code <= 0x7e) ? code : 0x20;
	});
}

function makeBulkDump(deviceNo, addr, data) {
	console.assert(addr.length === 3 && data.length > 0);
	const body = [data.length >> 7, data.length & 0x7f, ...addr, ...data];
	const sum = body.reduce((p, e) => p + e, 0);
	return new Uint8Array([0xf0, 0x43, deviceNo, modelIdSampling, ...body, (-sum) & 0x7f, 0xf7]);
}

function makeParamChange(deviceNo, addr, data) {
	console.assert(addr.length === 3 && data.length > 0);
	return new Uint8Array([0xf0, 0x43, 0x10 | deviceNo, modelIdSampling, ...addr, ...data, 0xf7]);
}

// Makes the events of the sampling data. One tick is one millisecond.
function makeSamplingEvents(sysExs, division, settings) {
	const tempo = division * 1000;
	const events = [
		{tick: 0, bytes: [0xff, 0x7f, 0x04, 0x43, 0x00, 0x01, 0x00]},	// Port A
		{tick: 0, bytes: [0xff, 0x51, 0x03, (tempo >> 16) & 0xff, (tempo >> 8) & 0xff, tempo & 0xff]},
	];
	let tick = 0;
	for (const sysEx of sysExs) {
		events.push({tick, bytes: [0xf0, ...toVlq(sysEx.bytes.byteLength - 1), ...sysEx.bytes.subarray(1)]});
		tick += Math.ceil(sysEx.bytes.byteLength * 1000 / settings.bytesPerSec) + sysEx.wait;
	}
	events.push({tick, bytes: [0xff, 0x2f, 0x00]});
	return events;
}

// Puts the sampling data before the song. The song starts after the sampling data.
function makeCombinedSmf(samplingEvents, song) {
	const endTick = samplingEvents[samplingEvents.length - 1].tick;
	const tracks = song.tracks.map((track, i) => {
		if (i === 0) {
			const events = samplingEvents.slice(0, -1);
			if (!hasTempoAtStart(track)) {
				events.push({tick: endTick, bytes: [0xff, 0x51, 0x03, 0x07, 0xa1, 0x20]});
			}
			return concatBytes([makeTrack(events, false), delayTrack(track, endTick - events[events.length - 1].tick)]);
		} else {
			return delayTrack(track, endTick);
		}
	});
	return makeSmf(song.format, song.division, tracks);
}

function parseSmf(bytes, logs) {
	if (!bytes || bytes.byteLength < 14 || String.fromCharCode(...bytes.subarray(0, 4)) !== 'MThd') {
		logs.push({message: 'No song in the file'});
		return null;
	}
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const format = view.getUint16(8);
	const division = view.getUint16(12);
	if ((division & 0x8000) !== 0) {
		logs.push({message: 'The song uses SMPTE time. Cannot combine the sampling data with it.'});
		return null;
	}

	const tracks = [];
	for (let pos = 8 + view.getUint32(4); pos + 8 <= bytes.byteLength;) {
		const len = view.getUint32(pos + 4);
		if (String.fromCharCode(...bytes.subarray(pos, pos + 4)) === 'MTrk') {
			tracks.push(bytes.subarray(pos + 8, pos + 8 + len));
		}
		pos += 8 + len;
	}
	// Skips a song with only an empty track.
	if (tracks.every((e) => (e.byteLength <= 4))) {
		logs.push({message: 'The song is empty'});
		return null;
	}
	return {format, division, tracks};
}

function hasTempoAtStart(track) {
	for (let pos = 0; pos < track.byteLength;) {
		const [delta, deltaLen] = fromVlq(track, pos);
		if (delta > 0) {
			return false;
		}
		pos += deltaLen;
		const status = track[pos];
		if (status === 0xff) {
			if (track[pos + 1] === 0x51) {
				return true;
			}
			const [len, lenLen] = fromVlq(track, pos + 2);
			pos += 2 + lenLen + len;
		} else if (status === 0xf0 || status === 0xf7) {
			const [len, lenLen] = fromVlq(track, pos + 1);
			pos += 1 + lenLen + len;
		} else {
			// Channel messages at the start of the song come after the tempo, if any.
			return false;
		}
	}
	return false;
}

function delayTrack(track, tick) {
	const [delta, deltaLen] = fromVlq(track, 0);
	return concatBytes([toVlq(delta + tick), track.subarray(deltaLen)]);
}

function makeTrack(events, hasEnd = true) {
	const bytes = [];
	let prevTick = 0;
	for (const event of events) {
		console.assert(event.tick >= prevTick);
		bytes.push(...toVlq(event.tick - prevTick), ...event.bytes);
		prevTick = event.tick;
	}
	console.assert(!hasEnd || events[events.length - 1].bytes[1] === 0x2f);
	return new Uint8Array(bytes);
}

function makeSmf(format, division, tracks) {
	const header = [0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, format, tracks.length >> 8, tracks.length & 0xff, division >> 8, division & 0xff];
	return concatBytes([
		new Uint8Array(header),
		...tracks.map((e) => concatBytes([new Uint8Array([0x4d, 0x54, 0x72, 0x6b, ...toUint32Bytes(e.byteLength)]), e])),
	]);
}

function toVlq(value) {
	const bytes = [value & 0x7f];
	for (let rest = value >>> 7; rest > 0; rest >>>= 7) {
		bytes.unshift((rest & 0x7f) | 0x80);
	}
	return bytes;
}

function fromVlq(bytes, pos) {
	let value = 0;
	for (let i = 0; i < 4; i++) {
		value = (value << 7) | (bytes[pos + i] & 0x7f);
		if ((bytes[pos + i] & 0x80) === 0) {
			return [value, i + 1];
		}
	}
	return [value, 4];
}

function toUint32Bytes(value) {
	return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

function concatBytes(arrays) {
	const bytes = new Uint8Array(arrays.reduce((p, e) => p + e.length, 0));
	let pos = 0;
	for (const array of arrays) {
		bytes.set(array, pos);
		pos += array.length;
	}
	return bytes;
}
