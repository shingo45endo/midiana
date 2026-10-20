export function makeTempoMap(song) {
	console.assert(song?.MThd && Array.isArray(song?.MTrks));

	// Picks and sorts the timestamps from all the events.
	const ticks = [...new Set(song.MTrks.map((mtrk) => mtrk.events).flat().sort((a, b) => a.tick - b.tick).map((event) => event.tick))];

	// Makes an empty tempo map.
	const tempoMap = new Map(ticks.map((e) => [e, {}]));
	if (!tempoMap.has(0)) {
		tempoMap.set(0, {});
	}

	console.assert('division' in song.MThd);
	if ((song.MThd.division & 0x8000) === 0) {
		// [Normal mode]
		const division = song.MThd.division;

		// Sets an initial value.
		tempoMap.get(0).usecPerBeat = 500000;
		tempoMap.get(0).timeSignature = {numerator: 4, denominator: 4};

		// Picks up all the Tempo meta events and Time Signature meta events.
		for (const mtrk of song.MTrks) {
			console.assert(Array.isArray(mtrk.events));
			for (const event of mtrk.events) {
				const {tick, bytes} = event;
				console.assert(tempoMap.has(tick));
				console.assert(Array.isArray(bytes));

				// Tempo meta event
				if (bytes.length === 6 && bytes[0] === 0xff && bytes[1] === 0x51 && bytes[2] === 0x03) {
					const usecPerBeat = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
					Object.assign(tempoMap.get(tick), {usecPerBeat});
				}
				// Time Signature meta event
				if (bytes.length === 7 && bytes[0] === 0xff && bytes[1] === 0x58 && bytes[2] === 0x04) {
					const numerator = bytes[3];
					const denominator = 2 ** bytes[4];
					Object.assign(tempoMap.get(tick), {timeSignature: {numerator, denominator}});
				}
			}
		}

		// No time base. MBT and elapsed time are not added. (The measure length would be 0 and the loop below would not end.)
		if (division === 0) {
			return tempoMap;
		}

		// Adds MBT information to each event.
		const getMeasureTicks = (timeSignature) => {
			const {numerator, denominator} = (timeSignature.denominator > 256) ? {numerator: 4, denominator: 4} : timeSignature;	// Ignores abnormal time signature.
			const beatTick = division / (denominator / 4);
			return {beatTick, measureTick: beatTick * (numerator || denominator)};
		};
		let measureStartTick = 0;
		let measureNo = 1;
		let {beatTick, measureTick} = getMeasureTicks(tempoMap.get(0).timeSignature);
		let nextMeasureTicks = {beatTick, measureTick};
		for (const tick of [...tempoMap.keys()].sort((a, b) => (a - b))) {
			const obj = tempoMap.get(tick);

			// Goes to the measure which contains this tick.
			if (tick >= measureStartTick + measureTick) {
				// Ends the current measure. Its length can differ from the following ones.
				measureStartTick += measureTick;
				measureNo++;
				({beatTick, measureTick} = nextMeasureTicks);

				// Skips the measures without events at once.
				const skippedMeasureNum = Math.floor((tick - measureStartTick) / measureTick);
				measureStartTick += skippedMeasureNum * measureTick;
				measureNo += skippedMeasureNum;
			}

			// A time signature at the beginning of a measure applies from this measure.
			if (obj.timeSignature) {
				nextMeasureTicks = getMeasureTicks(obj.timeSignature);
				if (tick === measureStartTick) {
					({beatTick, measureTick} = nextMeasureTicks);
				}
			}

			obj.mbt = {
				meas: measureNo,
				beat: Math.trunc((tick - measureStartTick) / beatTick) + 1,
				tick: (tick - measureStartTick) % beatTick,
			};
		}

		// Adds elapsed time to each event.
		let baseTick = 0;
		let baseObj = tempoMap.get(baseTick);
		baseObj.usec = 0;
		for (const [tick, obj] of tempoMap.entries()) {
			obj.usec = baseObj.usec + (tick - baseTick) * baseObj.usecPerBeat / division;

			if (obj.usecPerBeat) {
				baseTick = tick;
				baseObj = tempoMap.get(baseTick);
			}
		}

	} else {
		// [Time-code-based mode]
		// Note: In case of time-code-based mode, this implementation ignores SMPTE Offset meta events.
		// The "tempo map" assumes that the time management is common in the whole tracks.
		// But, to take care of SMPTE Offset, the time flow might be different from track to track.
		const frameRate = -(new Int8Array([song.MThd.division >> 8]))[0];
		console.assert(frameRate >= 0);
		const subFrameRate = song.MThd.division & 0xff;
		const tickPerSec = frameRate * subFrameRate;

		// No time base. SMPTE time code and elapsed time are not added.
		if (tickPerSec === 0) {
			return tempoMap;
		}

		// Adds SMPTE time code to each event.
		for (const [tick, obj] of tempoMap) {
			const sec = Math.trunc(tick / tickPerSec);
			Object.assign(obj, {
				smpte: {
					hours:            Math.trunc(sec / 60 / 60),
					minutes:          Math.trunc(sec / 60) % 60,
					seconds:          sec % 60,
					frames:           Math.trunc((tick % tickPerSec) / subFrameRate),
					fractionalFrames: tick % subFrameRate,
				},
				usec: tick * 1000 * 1000 / tickPerSec,
			});
		}
	}

	return tempoMap;
}
