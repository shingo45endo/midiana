import {makeWarn} from './chunk_parser.js';

// Data types in the first 4 bytes of the v000 chunk in 'ins' chunk. The MU2000 firmware accepts only these values.
const dataTypesVoice = Object.freeze([0x00010002, 0x00010102]);
const dataTypesKit   = Object.freeze([0x00010000, 0x00010100, 0x00010101]);

// v000: Yamaha MU Sampling Extension
export function parseV000(buf, tag, parentTags = [], logs = []) {
	console.assert(buf instanceof Uint8Array);
	console.assert(tag === 'v000');

	const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
	const tagPath = parentTags.join('/');
	if (tagPath.endsWith('ins /YMHM/MU00')) {	// Tone parameter
		const dataType = (buf.byteLength >= 4) ? view.getUint32(0, true) : null;
		if (dataTypesKit.includes(dataType)) {
			return {dataType};
		}
		if (!dataTypesVoice.includes(dataType) || buf.byteLength < 358) {
			logs.push(makeWarn(`Unexpected content of ${tag} chunk in 'ins' chunk`, buf));
			return null;
		}

		// Number of key ranges of each element.
		const keyRangeCounts = [...buf.subarray(4, 8)];
		const elementSwitch = buf[8];
		const voiceLevel = buf[9];
		const voiceName = String.fromCharCode(...buf.subarray(10, 10 + 8));
		const [rawByte18, rawByte19, rawByte20, rawByte21] = buf.subarray(18, 22);
		const elements = [];
		for (let i = 22; i < 358; i += 84) {
			const param = buf.subarray(i, i + 84);
			elements.push({
				waveNo:                      (param[0] << 7) | param[1],
				noteLimitLow:                param[2],
				noteLimitHigh:               param[3],
				velocityLimitLow:            param[4],
				velocityLimitHigh:           param[5],
				filterEgVelocityCurve:       param[6],
				lfoWaveSelect:               param[7],
				lfoPhaseInitialize:          param[8],
				lfoSpeed:                    param[9],
				lfoDelay:                    param[10],
				lfoFadeTime:                 param[11],
				lfoPmdDepth:                 param[12],
				lfoFmdDepth:                 param[13],
				lfoAmdDepth:                 param[14],
				noteShift:                   param[15],
				detune:                      param[16],
				pitchScaling:                param[17],
				pitchScalingCenterNote:      param[18],
				pitchEgDepth:                param[19],
				velocityPegLevelSensitivity: param[20],
				velocityPegRateSensitivity:  param[21],
				pegRateScaling:              param[22],
				pegRateScalingCenterNote:    param[23],
				pegRate1:                    param[24],
				pegRate2:                    param[25],
				pegRate3:                    param[26],
				pegRate4:                    param[27],
				pegLevel0:                   param[28],
				pegLevel1:                   param[29],
				pegLevel2:                   param[30],
				pegLevel3:                   param[31],
				pegLevel4:                   param[32],
				filterResonance:             param[33],
				velocitySensitivity:         param[34],
				cutoffFrequency:             param[35],
				cutoffScalingBreakPoint1:    param[36],
				cutoffScalingBreakPoint2:    param[37],
				cutoffScalingBreakPoint3:    param[38],
				cutoffScalingBreakPoint4:    param[39],
				cutoffScalingOffset1:        param[40],
				cutoffScalingOffset2:        param[41],
				cutoffScalingOffset3:        param[42],
				cutoffScalingOffset4:        param[43],
				velocityFegLevelSensitivity: param[44],
				velocityFegRateSensitivity:  param[45],
				fegRateScaling:              param[46],
				fegRateScalingCenterNote:    param[47],
				fegRate1:                    param[48],
				fegRate2:                    param[49],
				fegRate3:                    param[50],
				fegRate4:                    param[51],
				fegLevel0:                   param[52],
				fegLevel1:                   param[53],
				fegLevel2:                   param[54],
				fegLevel3:                   param[55],
				fegLevel4:                   param[56],
				elementLevel:                param[57],
				levelScalingBreakPoint1:     param[58],
				levelScalingBreakPoint2:     param[59],
				levelScalingBreakPoint3:     param[60],
				levelScalingBreakPoint4:     param[61],
				levelScalingOffset1:         param[62],
				levelScalingOffset2:         param[63],
				levelScalingOffset3:         param[64],
				levelScalingOffset4:         param[65],
				velocityCurve:               param[66],
				pan:                         param[67],
				aegRateScaling:              param[68],
				aegRateScalingCenterNote:    param[69],
				aegKeyOnDelay:               param[70],
				aegAttackRate:               param[71],
				aegDecay1Rate:               param[72],
				aegDecay2Rate:               param[73],
				aegReleaseRate:              param[74],
				aegDecay1Level:              param[75],
				aegDecay2Level:              param[76],
				addressOffset:               (param[77] << 7) | param[78],
				resonanceSensitivity:        param[79],
				highPassFilterCutoffFreq:    param[80],
				aegInitialLevel:             param[81],
				fegDepth:                    param[82],
				fegDepthVelSens:             param[83],
			});
		}

		return {dataType, keyRangeCounts, elementSwitch, voiceLevel, voiceName, rawByte18, rawByte19, rawByte20, rawByte21, elements};

	} else if (tagPath.endsWith('rgn /YMHM/MU00') && buf.byteLength === 20) {	// Sample slot of voice
		return {
			elementIndex: view.getUint32(0, true),
			attenuation:  buf[4],
			rootKey:      buf[5],
			fineTune:     view.getInt8(6),
			highKey:      buf[7],
			...parseSampleRegs(buf.subarray(8, 20)),
		};

	} else if (tagPath.endsWith('rgn /YMHM/MU00')) {	// Drum parameter
		if (buf.byteLength < 50) {
			logs.push(makeWarn(`Unexpected content of ${tag} chunk in 'rgn' chunk`, buf));
			return null;
		}

		const instName = String.fromCharCode(...buf.subarray(0, 8));
		const param = buf.subarray(8);
		const drumSetup = {
			pitchCoarse:              param[0],
			pitchFine:                param[1],
			level:                    param[2],
			alternateGroup:           param[3],
			pan:                      param[4],
			reverbSend:               param[5],
			chorusSend:               param[6],
			variationSend:            param[7],
			keyAssign:                param[8],
			rcvNoteOff:               param[9],
			rcvNoteOn:                param[10],
			filterCutoffFrequency:    param[11],
			filterResonance:          param[12],
			egAttackRate:             param[13],
			egDecay1Rate:             param[14],
			egDecay2Rate:             param[15],
			eqBassGain:               param[16],
			eqTrebleGain:             param[17],
			eqBassFrequency:          param[18],
			eqTrebleFrequency:        param[19],
			highPassFilterCutoffFreq: param[20],
			velocitySensePitch:       param[21],
			velocitySenseLpfCutoff:   param[22],
			basePitch:                param[23],
			drumVoiceIndex:           (param[24] << 8) | param[25],	// Upper byte 0xff: Uses its own sample
			rootKey:                  param[26],
			noteShiftTg300b:          view.getInt8(8 + 27),
			noteShiftXg:              view.getInt8(8 + 28),
			levelOffsetXg:            view.getInt8(8 + 29),
			...parseSampleRegs(param.subarray(30, 42)),
		};

		return {instName, drumSetup};

	} else if (tagPath.endsWith('wave/YMHM/MU00')) {	// Sample
		if (buf.byteLength < 20) {
			logs.push(makeWarn(`Unexpected content of ${tag} chunk in 'wave' chunk`, buf));
			return null;
		}

		return {
			sampleNo:           view.getUint32(0, true),
			stereoPairSampleNo: view.getInt32(4, true),
			startPoint:         view.getUint32(8, true),
			endPoint:           view.getUint32(12, true),
			leadingPaddingNum:  buf[16],
			trailingPaddingNum: buf[17],
			isLoopOn:           (buf[18] !== 0),
			rawByte19:          buf[19],
		};
	}

	return null;
}

// wddc: Yamaha MU Sampling Extension (The MU2000 writes it only for samples of a special format.)
export function parseWddc(buf, tag, parentTags = [], logs = []) {
	console.assert(buf instanceof Uint8Array);
	console.assert(tag === 'wddc');

	if (!parentTags.join('/').endsWith('YMHM/SwpX') || buf.byteLength < 78) {
		logs.push(makeWarn(`Unexpected content of ${tag} chunk`, buf));
		return null;
	}

	// The MU2000 writes 0 to the other bytes.
	return {
		rawByte71:  buf[71],
		loopAdjust: buf[72],	// The firmware uses bit 0-5.
		formatBits: buf[73],	// The firmware uses bit 1-5 (shift amount and compression mode).
	};
}

// Registers of the SWP30 for a sample. The address points to the loop point, relative to the start of the sample.
function parseSampleRegs(bytes) {
	console.assert(bytes instanceof Uint8Array && bytes.byteLength === 12);

	return {
		isLoopOff:       ((bytes[0] & 0x40) !== 0),
		loopAdjust:      bytes[0] & 0x3f,
		preLoopLength:   (bytes[1] << 16) | (bytes[2] << 8) | bytes[3],
		isBackward:      ((bytes[4] & 0x80) !== 0),
		fineAdjust:      ((bytes[4] & 0x7f) << 25) >> 25,
		loopLength:      (bytes[5] << 16) | (bytes[6] << 8) | bytes[7],
		sampleFormat:    bytes[8] >> 6,
		shiftAmount:     (bytes[8] >> 3) & 0x07,
		compressionMode: (bytes[8] >> 1) & 0x03,
		loopAddress:     ((bytes[8] & 0x01) << 24) | (bytes[9] << 16) | (bytes[10] << 8) | bytes[11],
	};
}
