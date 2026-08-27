import {bytesToHex, stripEnclosure} from '../utilities.js';

const modelProps = [
	// Synthesizer Group
	// [1986-01-?? (Ver.1.0)] Kawai K3 (Digital Wave Memory Synthesizer)
	// [1986-09-?? (Ver.1.0)] Kawai K3m (6-Voice Synthesizer Module)
	{
		modelId: [0x00, 0x01],
		modelName: 'K3',
		commands: [0x00, 0x01, 0x10, 0x20, 0x21, 0x40, 0x41, 0x42, 0x60, 0x61],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 01) (?<rawParams>..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 01) (?<rawParams>..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 01) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 01) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 01) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1987-03-?? (Ver.1.0)] Kawai K5 (Digital Multi-Dimensional Synthesizer)
	// [1987-03-?? (Ver.1.0)] Kawai K5m (Digital Multi-Dimensional Synthesizer Module)
	{
		modelId: [0x00, 0x02],
		modelName: 'K5',
		commands: [0x00, 0x01, 0x10, 0x20, 0x21, 0x30, 0x40, 0x41, 0x42, 0x43, 0x60, 0x61],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 02) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 02) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 02) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 02) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 02) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>00 02) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1988-03-?? (Ver.1.0)] Kawai K1 (Digital Synthesizer)
	// [1988-03-?? (Ver.1.0)] Kawai K1m (Digital Synthesizer Module)
	// [1988-10-?? (Ver.1.0)] Kawai K1r (Digital Synthesizer Module)
	// [1989-03-?? (Ver.1.0)] Kawai K1II (Digital Synthesizer)
	{
		modelId: [0x00, 0x03],
		modelName: 'K1',
		commands: [0x00, 0x01, 0x10, 0x20, 0x21, 0x40, 0x41, 0x42, 0x43, 0x60, 0x61],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 03) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 03) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 03) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 03) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 03) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
		isMixedParameterAndValue: true,
	},
	// [1989-08-?? (Ver.1.0)] Kawai K4 (Digital Synthesizer)
	// [1989-08-?? (Ver.1.0)] Kawai K4r (Digital Synthesizer Module)
	{
		modelId: [0x00, 0x04],
		modelName: 'K4',
		commands: [0x00, 0x01, 0x02, 0x10, 0x20, 0x21, 0x22, 0x23, 0x30, 0x40, 0x41, 0x42, 0x43],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 04) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 04) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>02) (?<modelId>00 04) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>00 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>23) (?<modelId>00 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>00 04) (?<rawParams>..) f7$',
		],
		isMixedParameterAndValue: true,
	},
	// [1990-06-?? (Ver.1.0)] Kawai KC10 (Digital Synthesizer)
	// [1991-07-?? (Ver.1.0)] Kawai XS-1 (Digital Synthesizer Module)
	{
		modelId: [0x00, 0x05],
		modelName: 'XS-1',
		commands: [0x00, 0x01, 0x02, 0x20, 0x21, 0x22],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 05) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 05) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>02) (?<modelId>00 05) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 05) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 05) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>00 05) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1990-01-?? (Ver.1.0)] Kawai XD-5 (Percussion Synthesizer)
	{
		modelId: [0x00, 0x06],
		modelName: 'XD-5',
		commands: [0x00, 0x01, 0x02, 0x10, 0x20, 0x21, 0x22, 0x30, 0x40, 0x41, 0x42, 0x43],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 06) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 06) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>02) (?<modelId>00 06) (?<rawParams>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 06) (?<rawParams>(?:[01].|2[0-9a-c]|3e) ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 06) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 06) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>00 06) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>00 06) (?<rawParams>.. ..) f7$',
		],
		isMixedParameterAndValue: true,
	},
	{
		modelId: [0x00, 0x06],
		modelName: 'XD-5',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 06) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1993-01-20 (Ver.1.0)] Kawai K11 (Digital Synthesizer)
	{
		modelId: [0x00, 0x08],
		modelName: 'K11',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>02 02 ..) (?<rawValues>(?:.. )+)f7$',
				// [A-6] Performance Patch Name
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>0[df] .. ..) (?<rawValues>(?:.. )+)f7$',
				// [A-5] System
				// [D-8] Performance Patch Data
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>10 ..) (?<rawValues>(?:.. )+)f7$',
				// [D-9] Performance Patch Name
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>0e) (?<rawValues>(?:.. )+)f7$',
				// [D-7] System Functions
		],
	},
	// [1992-06-10 (Ver.002)] Kawai GMega (Synthesizer Module)
	// [1993-??-?? (Ver.?.?)] Kawai GMega L (Synthesizer Module)
	{
		modelId: [0x00, 0x08],
		modelName: 'GMega',
		commands: [0x01, 0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>0[0-5] .. ..) (?<rawValues>(?:.. )+)f7$',
				// [A-1] System Functions
				// [A-2] Section Functions
				// [B-1] Single Name
				// [B-2] Percussion Name
				// [A-3] Single Functions
				// [A-4] Percussion Functions
				// [B-3] Percussion Assign Map
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>0[89ab] ..) (?<rawValues>(?:.. )+)f7$',
				// [D-2] Section Functions
				// [D-4] Single Functions
				// [D-5] Percussion Functions
				// [D-6] Percussion Assign Map
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 08) (?<rawParams>0[67c]) (?<rawValues>(?:.. )+)f7$',
				// [C-1] Single 1/2 Source Map
				// [D-1] System
				// [D-3] System Reserved Parameters
		],
	},
	// [1993-08-01 (Ver.1.0)] Kawai KC20 (GM Sound Keyboard)
	{
		modelId: [0x00, 0x09],
		modelName: 'KC20',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 09) (?<rawParams>01) f7$',
				// [D-2] Performance Mode Data Request
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 09) (?<rawParams>00 0[5-7ab] ..) (?<rawValues>(?:.. )+)f7$',
				// [A-1] System Functions
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 09) (?<rawParams>0[12] .. ..) (?<rawValues>(?:.. )+)f7$',
				// [A-2] Performance Mode Section Functions
				// [A-3] Performance Mode Setting Functions
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 09) (?<rawParams>0[12]) f7$',
				// [B-2] Dump Performance Mode Section Functions
				// [B-3] Dump Performance Mode Setting Functions
		],
	},
	// [1993-??-?? (Ver.?.?)] Kawai GMega LX (GM Sound Module)
	{
		modelId: [0x00, 0x09],
		modelName: 'GMegaLX',
		commands: [0x00, 0x01, 0x10, 0x20, 0x21, 0x41, 0x60, 0x61],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 09) (?<rawParams>..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 09) (?<rawParams>.. .. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 09) (?<rawParams>..) f7$',
		],
	},
	// [1994-07-?? (Ver.1.0)] Kawai GMouse (GM Sound Module)
	// [1994-11-?? (Ver.1.0)] Kawai GMCAT (GM Sound Keyboard)
	// [1995-06-?? (Ver.1.0)] Kawai DPR-10 (Digital Recorder / Player)
	// [1995-10-?? (Ver.1.0)] Kawai ACR-20 (Digital Accompaniment Center)
	{
		modelId: [0x00, 0x0a],	// Note: Same as K5000
		modelName: 'GMouse',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>.. .. ..) (?<rawValues>.. ..) f7$',
		],
	},
	// [1997-01-20 (Ver.2.0)] Kawai K5000W (Advanced Additive Workstation)
	{
		modelId: [0x00, 0x0a],
		modelName: 'K5000W',
		commands: [0x00, 0x10, 0x11, 0x20, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 0a) (?<rawParams>11 00) (?<rawValues>(?:.. )+)f7$',
				// g': One Drum Inst Dump Request (User Inst U1-32)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>00 00 00 00 ..) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>00 01 .. 00 ..) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>03 00 06 00 ..) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>10 00 00 00 ..) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>10 01 00 00 ..) (?<rawValues>.. ..) f7$',
				// 3.2 Parameter Change
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>11) (?<modelId>00 0a) (?<rawParams>00 ..) (?<rawValues>(?:.. )+)f7$',
				// 3.3.1 Track Control (Effect Path Change)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>00 01 ..) (?<rawValues>(?:.. )+)f7$',
				// d: One Single Dump (PCM, B70-116)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>10) (?<rawValues>(?:.. )+)f7$',
				// e: Drum Kit Dump (B117)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>11 ..) (?<rawValues>(?:.. )+)f7$',
				// g: One Drum Inst Dump (User Inst U1-32)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0a) (?<rawParams>00 01) (?<rawValues>(?:.. )+)f7$',
				// c: Block Single Dump (PCM, All of B70-116)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0a) (?<rawParams>11) (?<rawValues>(?:.. )+)f7$',
				// f: Block Drum Inst Dump (All of User Inst U1-32)
		],
	},
	// [1997-01-20 (Ver.2.0)] Kawai K5000S (Advanced Additive Synthesizer)
	// [1997-01-20 (Ver.2.0)] Kawai K5000R (Advanced Additive Synthesizer Module)
	{
		modelId: [0x00, 0x0a],
		modelName: 'K5000S/R',
		commands: [0x00, 0x11, 0x10, 0x20, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 0a) (?<rawParams>00 02 ..) f7$',
				// k': One Single Dump Request (Add., D1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 0a) (?<rawParams>00 02 00) f7$',
				// j': Block Single Dump Request (Add., All of enable patch in D1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>01 00 00 00 (?:1[6-9a-f]|2[0-9])) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>04 01 .. 00 0a) (?<rawValues>.. ..) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>60 .. 00 00 ..) (?<rawValues>.. ..) f7$',
				// 3.2 Parameter Change
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>00 02 ..) (?<rawValues>(?:.. )+)f7$',
				// k: One Single Dump (Add., D1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0a) (?<rawParams>00 02) (?<rawValues>(?:.. )+)f7$',
				// j: Block Single Dump (Add., All of enable patch in D1-128)
		],
	},
	{
		modelId: [0x00, 0x0a],
		modelName: 'K5000',
		commands: [0x00, 0x01, 0x10, 0x11, 0x20, 0x21, 0x31, 0x32, 0x40, 0x41, 0x42, 0x44, 0x45, 0x60, 0x61],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 0a) (?<rawParams>00 0[34] ..) f7$',
				// m': One Single Dump Request (Add., E1-128)
				// o': One Single Dump Request (Add., F1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>00) (?<modelId>00 0a) (?<rawParams>20 00 ..) f7$',
				// i': One Combi/Multi Dump Request (C1-64)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 0a) (?<rawParams>00 0[34] 00) f7$',
				// l': Block Single Dump Request (Add., All of enable patch in E1-128)
				// n': Block Single Dump Request (Add., All of enable patch in F1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>01) (?<modelId>00 0a) (?<rawParams>20 00 00) f7$',
				// h': Block Combi/Multi Dump Request (All of C1-64)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 0a) (?<rawParams>.. .. .. .. ..) (?<rawValues>(?:.. )+)f7$',
				// 3.2 Parameter Change
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>00 0[034] ..) (?<rawValues>(?:.. )+)f7$',
				// b: One Single Dump (Add., A1-128)
				// m: One Single Dump (Add., E1-128)
				// o: One Single Dump (Add., F1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0a) (?<rawParams>20 ..) (?<rawValues>(?:.. )+)f7$',
				// i: One Combi/Multi Dump (C1-64)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0a) (?<rawParams>00 0[034]) (?<rawValues>(?:.. )+)f7$',
				// a: Block Single Dump (Add., All of enable patch in A1-128)
				// l: Block Single Dump (Add., All of enable patch in E1-128)
				// n: Block Single Dump (Add., All of enable patch in F1-128)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0a) (?<rawParams>20) (?<rawValues>(?:.. )+)f7$',
				// h: Block Combi/Multi Dump (All of C1-64)
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>31) (?<modelId>00 0a) (?<rawValues>(?:.. )+)f7$',
				// 3.3.4 To Single Mode
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>32) (?<modelId>00 0a) (?<rawValues>(?:.. )+)f7$',
				// 3.3.3 Back Up/Reset
		],
	},
	// [1998-08-?? (Ver.1.0)] Kawai MP9000 (Stage Piano)
	{
		modelId: [0x00, 0x0b],
		modelName: 'MP9000',
		commands: [0x20, 0x21, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0b) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0b) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>00 0b) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2001-12-10 (Ver.1.0)] Kawai MP9500 (Stage Piano)
	{
		modelId: [0x00, 0x0c],
		modelName: 'MP9500',
		commands: [0x20, 0x21, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0c) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0c) (?<rawParams>4[01]) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>00 0c) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2005-03-?? (Ver.1.0)] Kawai MP4 (Stage Piano)
	{
		modelId: [0x00, 0x0d],
		modelName: 'MP4',
		commands: [0x20, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0d) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0d) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2005-08-01 (Ver.1.0)] Kawai MP8 (Stage Piano)
	{
		modelId: [0x00, 0x0e],
		modelName: 'MP8',
		commands: [0x20, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>00 0e) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>00 0e) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2007-04-?? (Ver.1.0)] Kawai MP8II (Stage Piano)
	// [2008-01-?? (Ver.1.1)] Kawai MP5 (Stage Piano)
	{
		modelId: [0x00, 0x0e],
		modelName: 'MP8II',
		commands: [0x20, 0x21, 0x22, 0x23],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>00 0e) (?<rawParams>0[12]) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>00 0e) (?<rawParams>7b) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>23) (?<modelId>00 0e) (?<rawParams>0[12]) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>23) (?<modelId>00 0e) (?<rawParams>7b) f7$',
		],
	},
	// [2013-12-?? (Ver.1.0)] Kawai MP7 (Stage Piano)
	{
		modelId: [0x00, 0x11],
		modelName: 'MP7',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 11) (?<rawParams>.. .. ..) (?<dataSize>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2013-10-?? (Ver.1.0)] Kawai MP11 (Stage Piano)
	{
		modelId: [0x00, 0x12],
		modelName: 'MP11',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 12) (?<rawParams>.. .. ..) (?<dataSize>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2017-06-?? (Ver.1.0)] Kawai MP7SE (Stage Piano)
	{
		modelId: [0x00, 0x13],
		modelName: 'MP7SE',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 13) (?<rawParams>.. .. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2017-06-?? (Ver.1.0)] Kawai MP11SE (Stage Piano)
	{
		modelId: [0x00, 0x14],
		modelName: 'MP11SE',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>00 14) (?<rawParams>.. .. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1999-01-?? (Ver.1.0)] Kawai CP150/130 (Digital Piano)
	// [1999-10-?? (Ver.1.0)] Kawai CP200/180/170 (Digital Piano)
	{
		modelId: [0x00, 0x42],
		modelName: 'CP150',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<channelNo>..) (?<commandId>10) (?<modelId>00 42) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},

	// Drum Machine Group
	// [????-??-?? (Ver.1.0)] Kawai R-100 (Digital Drum Machine)
	{
		modelId: [0x02, 0x01],
		modelName: 'R-100',
		commands: [0x10, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>02 01) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>02 01) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1987-11-?? (Ver.1.0)] Kawai R-50 (Digital Drum Machine)
	{
		modelId: [0x02, 0x02],
		modelName: 'R-50',
		commands: [0x10, 0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>02 02) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>02 02) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1991-01-?? (Ver.1.0)] Kawai GB-2 (Session Trainer)
	{
		modelId: [0x02, 0x03],
		modelName: 'GB-2',
		commands: [0x21],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>02 03) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1994-11-?? (Ver.1.0)] Kawai GB-4 (Session Trainer)
	{
		modelId: [0x02, 0x04],
		modelName: 'GB-4',
		commands: [0x20],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>20) (?<modelId>02 04) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},

	// Digital Piano Group
	// [1997-07-15 (Ver.1.0)] Kawai PW750 (Digital Piano)
	// [1997-07-15 (Ver.1.0)] Kawai PN250 (Digital Piano)
	// [1997-08-01 (Ver.1.0)] Kawai CA550 (Digital Piano)
	// [1997-08-25 (Ver.1.0)] Kawai CA950/750 (Digital Piano)
	// [1997-09-?? (Ver.1.0)] Kawai PW950 (Digital Piano)
	// [1999-07-25 (Ver.1.0)] Kawai CA970/770 (Digital Piano)
	// [1999-07-25 (Ver.1.0)] Kawai CN470 (Digital Piano)
	// [2001-08-?? (Ver.1.0)] Kawai KD25 (Digital Piano)
	// [2001-12-?? (Ver.1.0)] Kawai CA1200/1000 (Digital Piano)
	// [2004-01-?? (Ver.1.0)] Kawai CA9/7 (Digital Piano)
	// [2004-04-?? (Ver.1.0)] Kawai CA5 (Digital Piano)
	// [2004-12-?? (Ver.1.0)] Kawai CN3 (Digital Piano)
	// [2006-08-?? (Ver.1.0)] Kawai CA91/71/51 (Digital Piano)
	// [2006-11-?? (Ver.1.0)] Kawai CN31 (Digital Piano)
	// [2008-11-?? (Ver.1.0)] Kawai CN32 (Digital Piano)
	// [2008-11-?? (Ver.1.0)] Kawai CN33 (Digital Piano)
	// [2011-08-?? (Ver.1.0)] Kawai CE220 (Digital Piano)
	// [2012-03-?? (Ver.1.0)] Kawai CA95/65 (Digital Piano)
	// [2012-03-?? (Ver.1.0)] Kawai CS7 (Digital Piano)
	// [2012-03-?? (Ver.1.0)] Kawai ES7 (Digital Piano)
	// [2012-06-?? (Ver.1.0)] Kawai CN34 (Digital Piano)
	// [2012-06-?? (Ver.1.0)] Kawai CN340GP (Digital Piano)
	// [2012-12-?? (Ver.1.0)] Kawai CS10 (Digital Piano)
	// [2014-11-?? (Ver.1.0)] Kawai CA97/67 (Digital Piano)
	// [2015-11-?? (Ver.1.0)] Kawai CS11/8 (Digital Piano)
	// [2017-08-?? (Ver.1.0)] Kawai CA98/78 (Digital Piano)
	// [2017-09-?? (Ver.1.0)] Kawai AURES (Hybrid Digital Piano)
	// [2017-09-?? (Ver.1.0)] Kawai NV10 (Hybrid Digital Piano)
	// [2019-03-?? (Ver.1.0)] Kawai NV5 (Hybrid Digital Piano)
	{
		modelId: [0x04, 0x02],
		modelName: 'CA1200',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 02) (?<rawParams>19) (?<rawValues>(?:.. )+)f7$',
		],
	},
	{
		modelId: [0x04, 0x02],
		modelName: 'CN32',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 02) (?<rawParams>22) (?<rawValues>(?:.. )+)f7$',
		],
	},
	{
		modelId: [0x04, 0x02],
		modelName: 'CA95',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 02) (?<rawParams>0f) (?<rawValues>(?:.. )+)f7$',
		],
	},
	{
		modelId: [0x04, 0x02],
		modelName: 'CN34',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 02) (?<rawParams>27) (?<rawValues>(?:.. )+)f7$',
		],
	},
	{
		modelId: [0x04, 0x02],
		modelName: 'Digital Piano',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 02) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 02) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [1999-01-?? (Ver.1.0)] Kawai CP150/130 (Digital Piano)
	// [1999-10-?? (Ver.1.0)] Kawai CP200/180/170 (Digital Piano)
	{
		modelId: [0x04, 0x04],
		modelName: 'CP150',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<channelNo>..) (?<commandId>10) (?<modelId>04 04) (?<rawParams>.. ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2003-04-?? (Ver.1.0)] Kawai CP205/185/175/155 (Digital Piano)
	{
		modelId: [0x04, 0x06],
		modelName: 'CP205',
		commands: [0x33],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>0[13]) f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>[12]0 .. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>21 00 .. .. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>21 01 ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>40 .. ..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>41) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>..) (?<commandId>33) (?<modelId>04 06) (?<rawParams>4[23] ..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2008-12-?? (Ver.1.0)] Kawai CN42 (Digital Piano)
	{
		modelId: [0x04, 0x08],
		modelName: 'CN42',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 08) (?<rawParams>22) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2005-03-?? (Ver.1.0)] Kawai CN4 (Digital Piano)
	// [2007-03-?? (Ver.1.0)] Kawai CN41 (Digital Piano)
	// [2010-09-?? (Ver.1.0)] Kawai CN43 (Digital Piano)
	{
		modelId: [0x04, 0x08],
		modelName: 'CN4',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 08) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 08) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2014-06-?? (Ver.1.0)] Kawai CN35 (Digital Piano)
	// [2014-06-?? (Ver.1.0)] Kawai CN350GP (Digital Piano)
	{
		modelId: [0x04, 0x0b],
		modelName: 'CN35',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 0b) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 0b) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2015-03-?? (Ver.1.0)] Kawai ES8 (Digital Piano)
	{
		modelId: [0x04, 0x0c],
		modelName: 'ES8',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 0c) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 0c) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2016-08-?? (Ver.1.0)] Kawai CN37 (Digital Piano)
	// [2017-??-?? (Ver.1.0)] Kawai CN370GP (Digital Piano)
	// [2019-02-?? (Ver.1.0)] Kawai CN39 (Digital Piano)
	// [2020-06-?? (Ver.1.0)] Kawai DG30 (Digital Piano)
	{
		modelId: [0x04, 0x13],
		modelName: 'CN37',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 13) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 13) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2019-03-?? (Ver.1.0)] Kawai CN39 (Digital Piano)
	{
		modelId: [0x04, 0x1c],
		modelName: 'CN39',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 1c) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 1c) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2020-05-?? (Ver.1.0)] Kawai ES520 (Digital Piano)
	{
		modelId: [0x04, 0x20],
		modelName: 'ES520',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 20) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 20) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2020-02-?? (Ver.1.0)] Kawai ES920 (Digital Piano)
	{
		modelId: [0x04, 0x21],
		modelName: 'ES920',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 21) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 21) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2022-05-?? (Ver.1.0)] Kawai CN301 (Digital Piano)
	{
		modelId: [0x04, 0x26],
		modelName: 'CN301',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 26) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 26) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [2023-02-?? (Ver.1.0)] Kawai CA501 (Digital Piano)
	{
		modelId: [0x04, 0x2a],
		modelName: 'CA501',
		commands: [0x10, 0x30],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>04 2a) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>30) (?<modelId>04 2a) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},

	// Single Keyboard Group
	// [????-??-?? (Ver.?.?)] Kawai MK20 (Personal Keyboard)
	{
		modelId: [0x05, 0x01],
		modelName: 'MK20',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>05 01) (?<rawValues>(?:.. )+)f7$',
		],
	},
	// [????-??-?? (Ver.?.?)] Kawai MK10 (Personal Keyboard)
	{
		modelId: [0x05, 0x02],
		modelName: 'MK10',
		commands: [0x10],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>10) (?<modelId>05 02) (?<rawValues>(?:.. )+)f7$',
		],
	},

	// Others Group
	// [1990-10-?? (Ver.1.0)] Kawai MM-16 (MIDI Mixer)
	{
		modelId: [0x07, 0x00],
		modelName: 'MM-16',
		commands: [0x21, 0x22],
		reStrs: [
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>21) (?<modelId>07 00) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
			'^f0 (?<mfrId>40) (?<deviceId>0.) (?<commandId>22) (?<modelId>07 00) (?<rawParams>..) (?<rawValues>(?:.. )+)f7$',
		],
	},
];

function makeKawaiParser(modelProp) {
	const {modelName, modelId} = modelProp;

	const mfrIdHex = '40';
	const modelIdHex = bytesToHex(modelId);

	const commandNames = {
		0x00: 'One Block Data Request',
		0x01: 'All Block Data Request',
		0x02: 'All Patch Data Request',
		0x10: 'Parameter Send',
		0x11: 'Track Control',
		0x20: 'One Block Data Dump',
		0x21: 'All Block Data Dump',
		0x22: 'All Patch Data Dump',
		0x30: 'Program Send',
		0x31: 'To Single Mode',
		0x32: 'Back Up/Reset',
		0x33: 'Common Parameter',
		0x40: 'Write Complete',
		0x41: 'Write Error',
		0x42: 'Write Error (Protect)',
		0x43: 'Write Error (No Card)',
		0x44: 'Write Error (Memory Full)',
		0x45: 'Write Error (No Expansion Board)',
		0x60: 'Machine ID Request',
		0x61: 'Machine ID Acknowledge',
	};

	const parsers = [];
	for (const reStr of modelProp.reStrs ?? []) {
		const {commandId, commandIdHex} = analyzeReStr(reStr);

		const handler = ((regexp, modelIdHex, modelName, commandName) => {
			const convertParamsAndValues = (!(modelProp.isMixedParameterAndValue && commandIdHex === '10')) ? (props) => props :
				(props) => {
					const {rawParams, rawValues} = props;
					console.assert(rawParams?.length > 0);
					console.assert(rawValues?.length > 0);
					const params = [...rawParams];
					const values = [...rawValues];
					values[0] |= (params.at(-1) & 0x01) << 7;
					params[params.length - 1] &= 0x7e;
					return {...props, params, values};
				};

			return (bytes) => {
				const [mfrId, deviceId, commandId, modelId0, modelId1] = stripEnclosure(bytes);
				console.assert(mfrId === 0x40);
				const modelId = [modelId0, modelId1];

				const additionalProps = convertParamsAndValues(parseNamedCapturing(regexp, bytesToHex(bytes)) ?? {});

				return {
					mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName, ...additionalProps,
					_idKey: [mfrIdHex, modelIdHex].join(' '), _commandKeys: ['commandId'], ...makeMetaKeys(additionalProps),
				};
			};
		})(new RegExp(reStr, 'u'), modelIdHex, modelName, commandNames[commandId]);

		parsers.push({
			key: `f0 ${mfrIdHex} 00 ${commandIdHex} ${modelIdHex}`,
			regexp: new RegExp(reStr.replace(/\(\?<[^>]+>/ug, '(?:'), 'u'),
			handler,
		});
	}

	for (const commandId of modelProp.commands) {
		const commandIdHex = bytesToHex([commandId]);

		let key, regexp, handler;
		switch (commandId) {
		case 0x40:	// Write Complete
		case 0x41:	// Write Error
		case 0x42:	// Write Error (Protect)
		case 0x43:	// Write Error (No Card)
		case 0x44:	// Write Error (Memory Full)
		case 0x45:	// Write Error (No Expansion Board)
		case 0x60:	// Machine ID Request
		case 0x61: 	// Machine ID Acknowledge
			key = `f0 ${mfrIdHex} 00 ${commandIdHex} ${modelIdHex}`;
			regexp = new RegExp(String.raw`^f0 ${mfrIdHex} 0. ${commandIdHex} ${modelIdHex} f7$`, 'u');
			handler = ((modelName, commandName) => {
				return (bytes) => {
					const [mfrId, deviceId, commandId, modelId0, modelId1] = stripEnclosure(bytes);
					console.assert(mfrId === 0x40);
					const modelId = [modelId0, modelId1];

					return {
						mfrId, mfrIdHex, deviceId, modelId, modelIdHex, modelName, commandId, commandName,
						_idKey: [mfrIdHex, modelIdHex].join(' '), _commandKeys: ['commandId'],
					};
				};
			})(modelName, commandNames[commandId]);
			break;

		default:
			continue;
		}

		parsers.push({key, regexp, handler});
	}

	return parsers;

	function analyzeReStr(str) {
		return Object.fromEntries(str.match(/\(\?<\w+>[\da-f ]+\)/ug).map((e) => {
			const m = e.match(/\(\?<(\w+)>([\da-f ]+)\)/u);
			const [_, key, value] = m;
			return [[key, value.trim().split(' ').map((e) => parseInt(e, 16))], [`${key}Hex`, value]];
		}).flat());
	}

	function parseNamedCapturing(regexp, str) {
		const m = str.match(regexp);
		if (!m) {
			return null;
		}
		return Object.fromEntries(Object.entries(m.groups).map(([key, value]) => {
			console.assert(/[\da-f ]+/u.test(value));
			return [key, value.trim().split(' ').map((e) => parseInt(e, 16))];
		}));
	}

	function makeMetaKeys(props) {
		const keys = Object.keys(props);
		const metaKeys = {};

		if (keys.includes('params')) {
			metaKeys._paramKeys = ['params'];
		} else if (keys.includes('rawParams')) {
			metaKeys._paramKeys = ['rawParams'];
		}
		if (keys.includes('values')) {
			metaKeys._valueKeys = ['values'];
		} else if (keys.includes('rawValues')) {
			metaKeys._valueKeys = ['rawValues'];
		}

		// In Kawai's SysEx system, the 3rd byte always contains the "Channel No.";
		// this is not a "MIDI channel" but is used to distinguish the device to which the SysEx is sent.
		// For this reason, this SysEx parser treats it as "deviceId". (Not "channelNo")
		// However, some models treat this value as an actual "MIDI channel" (or a part associated with the channel).
		// For those models, the 3rd byte is treated as part of _paramsKeys under the name "channelNo".
		if (keys.includes('channelNo')) {
			console.assert(Array.isArray(metaKeys._paramKeys));
			metaKeys._paramKeys.push('channelNo');
		}

		return metaKeys;
	}
}

export const sysExParsers = Object.freeze(modelProps.map((modelProp) => makeKawaiParser(modelProp)).flat());
