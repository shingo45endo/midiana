import {makeRolandParsers} from './sysex_common_roland.js';

const modelProps = [
	// [1986-09-?? (Ver.2.00)] Roland S-10 (Digital Sampling Keyboard)
	// [1986-10-18 (Ver.1.00)] Roland MKS-100 (Digital Sampler)
	// [1987-04-30 (Ver.1.00)] Roland S-220 (Digital Sampler)
	{
		modelName: 'S-10',
		modelIdHex: '10', deviceIdReStr: '0.', commands: [0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: [
			'00 0[0-3] (?:[0-2].|3[0-7])',  // Temporary Wave Parameters
			'00 08 (?:0.|1[0-8])',          // Performance Parameters
			'00 09 0.',                     // Structure # of Temporary Wave Parameter Blocks
			'00 10 0[0-3]',                 // Commands
			'01 0[0-28] ..',                // Sample Data
			'(?:0[2-9a-f]|1[0-2]) .. ..',   // Wave Data
		],
	},
	{
		modelName: 'S-220',
		modelIdHex: '10', deviceIdReStr: '0.', commands: [0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: [
			'00 0[0-3] (?:[0-2].|3[0-9ab])',    // Temporary Wave Parameters
			'00 08 (?:[0-2].|3[01])',           // Performance Parameters
			'00 09 [0-3].',                     // Status
			'00 10 0[0-6]',                     // Commands
			'00 11 [0-2].',                     // Edit Control
			'01 0[0-289] ..',                   // Sample Data
			'(?:0[2-9a-f]|1[0-2]) .. ..',       // Wave Data
		],
	},
	// [1986-11-11 (Ver.1.00)] Roland GM-70 (Guitar-MIDI Interface)
	{
		modelName: 'GM-70',
		modelIdHex: '11', deviceIdReStr: '0.', commands: [0x12], addrLen: 3,
	},
	// [1987-01-05 (Ver.1.00)] Roland DEP-3 (Digital Effects Processor)
	{
		modelName: 'DEP-3',
		modelIdHex: '12', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1987-01-29 (Ver.1.00)] Roland GP-8 (Guitar Effects Processor)
	{
		modelName: 'GP-8',
		modelIdHex: '13', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [1987-02-06 (Ver.1.00)] Roland PG-1000 (Linear Synthesizer Programmer)
	// [1987-02-07 (Ver.1.00)] Roland D-50 (Linear Synthesizer)
	// [1987-06-05 (Ver.2.10)] Roland D-50 (Linear Synthesizer)
	// [1987-07-27 (Ver.1.00)] Roland D-550 (Linear Synthesizer)
	// [2004-03-31 (Ver.1.00)] Roland VC-1 (V-Card "D-50 for V-Synth/VariOS")
	// [2017-09-09 (Ver.1.00)] Roland D-05 (Linear Synthesizer)
	{
		modelName: 'D-50',
		modelIdHex: '14', deviceIdReStr: '0.', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
	},
	// [1987-07-09 (Ver.1.00)] Roland MT-32 (Multi Timbre Sound Module)
	// [1987-12-21 (Ver.1.00)] Roland D-10 (Multi Timbral Linear Synthesizer)
	// [1988-02-13 (Ver.1.00)] Roland D-110 (Multi Timbral Sound Module)
	// [1988-03-03 (Ver.1.00)] Roland D-20 (Multi Timbral Linear Synthesizer / Multi Track Sequencer)
	// [1988-06-?? (Ver.1.00)] Roland E-20 (Intelligent Synthesizer)
	// [1988-07-25 (Ver.2.00)] Roland MT-32 (Multi Timbre Sound Module)
	// [1988-08-22 (Ver.1.00)] Roland MT-100 (Digital Sequencer and Sound Module)
	// [1988-08-?? (Ver.1.00)] Roland E-10 (Intelligent Synthesizer)
	// [1988-10-30 (Ver.1.00)] Roland GR-50 (Guitar Synthesizer)
	// [1989-01-31 (Ver.1.00)] Roland D-5 (Multi Timbral Linear Synthesizer)
	// [1989-03-30 (Ver.1.00)] Roland LAPC-I (LA Sound Card)
	// [1989-04-11 (Ver.1.00)] Roland RA-50 (Realtime Arranger)
	// [1989-04-18 (Ver.1.00)] Roland CM-32P (PCM Sound Module)
	// [1989-04-18 (Ver.1.00)] Roland CM-64 (LA/PCM Sound Module)
	// [1989-07-31 (Ver.1.00)] Roland CM-32L (LA Sound Module)
	// [1990-12-20 (Ver.1.00)] Roland LAPC-N (LA Sound Board)
	// [1991-??-?? (Ver.?.??)] Roland CM-32LN (LA Sound Module / MIDI Processing Unit)
	{
		modelName: 'MT-32',
		modelIdHex: '16', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: '(?:0[0123458]|10|20|7f) .. ..',
	},
	{
		modelName: 'MT-32 Ver.2',
		modelIdHex: '16', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: '(?:0[23458]|10|20|40|7f) .. ..',
	},
	{
		modelName: 'CM-32P',
		modelIdHex: '16', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '(?:5[012]|7f) .. ..',
	},
	{
		modelName: 'D-10',
		modelIdHex: '16', deviceIdReStr: '1.', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: '(?:0[0-9ac]|10|20|40) .. ..',
	},
	{
		modelName: 'D-5',
		modelIdHex: '16', deviceIdReStr: '1.', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
		address: '(?:0[0-9d]|10|20|40) .. ..',
	},
	{
		modelName: 'LA Synth',
		modelIdHex: '16', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
	},
	// [1987-03-30 (Ver.2.00)] Roland S-50 Ver.2.00 (Digital Sampling Keyboard)
	{
		modelName: 'S-50 Ver.2',
		modelIdHex: '18', deviceIdReStr: '0.', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
	},
	// [1987-06-08 (Ver.1.00)] Roland PM-16 (Pad MIDI Interface)
	{
		modelName: 'PM-16',
		modelIdHex: '19', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1987-05-01 (Ver.1.10)] Roland HP-600/700/800 (Digital Piano)
	// [1988-01-14 (Ver.1.00)] Roland C-50/20 (Digital Harpsichord)
	// [1988-07-08 (Ver.1.00)] Roland RP-80 (Digital Piano)
	// [1988-07-18 (Ver.1.00)] Roland KR-33 (Digital Keyboard)
	// [1988-08-01 (Ver.1.00)] Roland HP-3500S/4000SL/5000S/5000SL (Digital Piano)
	// [1989-01-23 (Ver.1.00)] Roland HP-2500S/2500SL (Digital Piano)
	// [1989-07-01 (Ver.1.00)] Roland HP-1000S/1000SL (Digital Piano)
	// [1989-12-06 (Ver.1.00)] Roland KR-55 (Digital Keyboard)
	// [1989-12-22 (Ver.1.10)] Rodgers C-220 (Classic Keyboards)
	// [1990-05-02 (Ver.1.00)] Roland HP-3700/2700 (Digital Piano)
	// [1990-07-11 (Ver.1.00)] Roland HP-900/900L/1700L (Digital Piano)
	// [1990-12-03 (Ver.1.00)] Roland FP-8 (Digital Piano)
	// [1992-08-07 (Ver.1.00)] Roland HP-3800/2800 (Digital Piano)
	// [1994-08-22 (Ver.1.00)] Roland FP-1 (Digital Piano)
	// [1994-09-19 (Ver.1.00)] Roland HP-2880 (Digital Piano)
	// [1995-10-01 (Ver.1.00)] Roland HP-530/330 (Digital Piano)
	// [1997-10-?? (Ver.1.00)] Roland HP-126 (Digital Piano)
	// [1997-12-01 (Ver.1.00)] Roland HP-245 (Digital Piano)
	// [1998-05-01 (Ver.1.00)] Roland HP-145 (Digital Piano)
	// [1998-06-15 (Ver.1.00)] Roland FP-9 (Digital Piano)
	// [1998-09-01 (Ver.1.00)] Roland C-80 (Digital Harpsichord)
	// [2000-02-01 (Ver.1.01)] Roland HP-237/237R (Digital Piano)
	// [2000-02-01 (Ver.1.00)] Roland HP-147 (Digital Piano)
	// [2000-10-05 (Ver.1.00)] Roland HP-147R (Digital Piano)
	// [2001-05-01 (Ver.1.00)] Roland F-90 (Digital Piano)
	// [2001-12-20 (Ver.1.00)] Roland HP-2/3/7 (Digital Piano)
	// [2002-10-08 (Ver.1.00)] Roland F-100 (Digital Piano)
	// [2002-10-08 (Ver.1.00)] Roland F-30 (Digital Piano)
	// [2003-06-10 (Ver.1.00)] Roland DP-900/700 (Digital Piano)
	// [2003-10-01 (Ver.1.00)] Roland F-50 (Digital Piano)
	// [2005-09-01 (Ver.1.00)] Roland DP-970 (Digital Piano)
	{
		modelName: 'HP-600/700/800',
		modelIdHex: '1a', deviceIdReStr: '00', commands: [0x12], addrLen: 2,
		address: '00 00',
	},
	{
		modelName: 'C-50/20',
		modelIdHex: '1a', deviceIdReStr: '00', commands: [0x12], addrLen: 2,
		address: '00 0[0-5]',
	},
	{
		modelName: 'RP-80',
		modelIdHex: '1a', deviceIdReStr: '00', commands: [0x12], addrLen: 2,
		address: '00 (?:0[06-9a]|1[023])',
	},
	{
		modelName: 'HP-1000S/1000SL',
		modelIdHex: '1a', deviceIdReStr: '00', commands: [0x12], addrLen: 2,
		address: '00 (?:00|1[0a-d])',
	},
	{
		modelName: 'KR-55',
		modelIdHex: '1a', deviceIdReStr: '10', commands: [0x12], addrLen: 2,
		address: '00 (?:1[ef]|2[0-9a]|[3-5].|6[0-6])',
	},
	{
		modelName: 'C-220',
		modelIdHex: '1a', deviceIdReStr: '10', commands: [0x12], addrLen: 2,
		address: '00 (?:1[ef]|2[012569a]|[45].|6[0-6]|7[0-7])',
	},
	{
		modelName: 'HP-3700/2700',
		modelIdHex: '1a', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
		address: '(?:00 0[015]|01 0[0-5])',
	},
	{
		modelName: 'FP-8',
		modelIdHex: '1a', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
		address: '01 0[67]',
	},
	{
		modelName: 'FP-1',
		modelIdHex: '1a', deviceIdReStr: '1.', commands: [0x12], addrLen: 2,
		address: '01 0[89]',
	},
	{
		modelName: 'HP-530/330',
		modelIdHex: '1a', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
		address: '(?:00 05|01 (?:0[136ab]|01 1.))',
	},
	{
		modelName: 'C-80',
		modelIdHex: '1a', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
		address: '(?:00 0[25]|01 (?:05|2[0-2]))',
	},
	{
		modelName: 'Digital Piano',
		modelIdHex: '1a', deviceIdReStr: '[01].', commands: [0x12], addrLen: 2,
	},
	// [1988-09-14 (Ver.1.00)] Roland R-880 (Digital Reverb)
	{
		modelName: 'R-880',
		modelIdHex: '1b', deviceIdReStr: '(?:0.|7f)', commands: [0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
	},
	// [1988-08-25 (Ver.1.00)] Roland GC-8 (Graphic Controller)
	{
		modelName: 'GC-8',
		modelIdHex: '1c', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1987-08-18 (Ver.1.00)] Roland TR-626 (Rhythm Composer)
	{
		modelName: 'TR-626',
		modelIdHex: '1d', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1987-09-09 (Ver.1.00)] Roland S-550 (Digital Sampler)
	// [1988-06-12 (Ver.1.00)] Roland S-330 (Digital Sampler)
	{
		modelName: 'S-550',
		modelIdHex: '1e', deviceIdReStr: '0.', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
	},
	// [1987-12-22 (Ver.1.00)] Boss ME-5 (Guitar Multiple Effects)
	{
		modelName: 'ME-5',
		modelIdHex: '1f', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [1988-07-12 (Ver.1.00)] Roland A-880 (MIDI Patcher/Mixer)
	{
		modelName: 'A-880',
		modelIdHex: '20', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 1,
	},
	// [1987-03-07 (Ver.1.00)] Roland P-330 (Digital Piano)
	{
		modelName: 'P-330',
		modelIdHex: '22', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1988-07-28 (Ver.1.00)] Roland U-110 (PCM Sound Module)
	{
		modelName: 'U-110',
		modelIdHex: '23', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1988-05-18 (Ver.1.00)] Roland E-660 (Parametric Equalizer)
	{
		modelName: 'E-660',
		modelIdHex: '24', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1988-06-01 (Ver.1.00)] Roland PAD-80 (MIDI Pad Controller)
	{
		modelName: 'PAD-80',
		modelIdHex: '25', deviceIdReStr: '0.', commands: [0x12], addrLen: 3,
	},
	// [1988-12-27 (Ver.1.00)] Roland GS-6 (Guitar Sound System)
	{
		modelName: 'GS-6',
		modelIdHex: '26', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [1988-10-20 (Ver.1.00)] Roland A-50 (MIDI Keyboard Controller)
	// [1989-01-05 (Ver.1.00)] Roland A-80 (MIDI Keyboard Controller)
	{
		modelName: 'A-50',
		modelIdHex: '27', deviceIdReStr: '00', commands: [0x12], addrLen: 3,
	},
	// [1988-09-30 (Ver.1.00)] Roland R-8 (Human Rhythm Composer)
	{
		modelName: 'R-8',
		modelIdHex: '28', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1989-01-25 (Ver.1.00)] Roland FC-100mkII (Foot Controller)
	{
		modelName: 'FC-100mkII',
		modelIdHex: '29', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 1,
	},
	// [1989-08-21 (Ver.1.01)] Roland GP-16 (Guitar Effects Processor)
	{
		modelName: 'GP-16',
		modelIdHex: '2a', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1989-04-05 (Ver.1.00)] Roland U-20 (RS-PCM Keyboard)
	// [1989-07-25 (Ver.1.00)] Roland U-220 (RS-PCM Sound Module)
	{
		modelName: 'U-20',
		modelIdHex: '2b', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1989-03-25 (Ver.1.00)] Roland R-5 (Human Rhythm Composer)
	{
		modelName: 'R-5',
		modelIdHex: '2c', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1989-04-11 (Ver.1.00)] Roland RA-50 (Realtime Arranger)
	// [1989-08-11 (Ver.1.00)] Roland CA-30 (Intelligent Arranger)
	{
		modelName: 'RA-50',
		modelIdHex: '2d', deviceIdReStr: '1f', commands: [0x11, 0x12], addrLen: 3,
		address: '([126]0) .. ..',
	},
	{
		modelName: 'CA-30',
		modelIdHex: '2d', deviceIdReStr: '1f', commands: [0x11, 0x12], addrLen: 3,
		address: '([1246]0) .. ..',
	},
	// [1989-06-01 (Ver.1.00)] Roland KR-500 (Digital Keyboard)
	{
		modelName: 'KR-500',
		modelIdHex: '2e', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1991-07-15 (Ver.1.0)] Rodgers C-445E
	// [1992-05-26 (Ver.1.0)] Rodgers 550/580/685
	// [1993-04-12 (Ver.1.0)] Rodgers 690
	// [1993-05-17 (Ver.1.0)] Rodgers 595
	// [1993-05-17 (Ver.1.0)] Rodgers 610
	// [1994-07-01 (Ver.1.0)] Rodgers 520/530
	// [1995-01-01 (Ver.1.0)] Rodgers 702
	// [1996-07-?? (Ver.1.0)] Rodgers 525/535
	// [1998-??-?? (Ver.1.0)] Rodgers 751/790/795
	// [1999-??-?? (Ver.1.0)] Rodgers 790C
	// [2001-02-?? (Ver.1.00)] Rodgers 527
	// [2003-01-?? (Ver.1.00)] Rodgers 537 (insignia)
	// [2007-05-?? (Ver.1.00)] Rodgers 538/i548 (insignia)
	{
		modelName: 'C-445E',
		modelIdHex: '30', deviceIdReStr: '00', commands: [0x12], addrLen: 2,
	},
	{
		modelName: '550/580/685',
		modelIdHex: '30', deviceIdReStr: '[01].', commands: [0x12], addrLen: 2,
	},
	// [????-??-?? (Ver.?.??)] Roland PRO-E (Intelligent Arranger)
	{
		modelName: 'PRO-E',
		modelIdHex: '31', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1989-??-?? (Ver.1.00)] Roland E-5 (Intelligent Synthesizer)
	// [1990-??-?? (Ver.1.00)] Roland KR-100 (Digital Keyboard)
	{
		modelName: 'E-5',
		modelIdHex: '32', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [????-??-?? (Ver.1.00)] Roland E-30 (Intelligent Synthesizer)
	{
		modelName: 'E-30',
		modelIdHex: '33', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1990-01-19 (Ver.1.00)] Roland S-770 (Digital Sampler)
	// [1992-09-28 (Ver.1.00)] Roland SP-700 (16-bit Sample Player)
	// [1993-11-18 (Ver.1.00)] Roland S-760 (Digital Sampler)
	{
		modelName: 'S-770',
		modelIdHex: '34', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
		address: '00 .. .. ..',
	},
	{
		modelName: 'SP-700',
		modelIdHex: '34', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
		address: '(00 .. .. ..|01 00 .. ..)',
	},
	{
		modelName: 'S-760',
		modelIdHex: '34', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
		address: '(00 .. .. ..|01 0[02-5] .. ..)',
	},
	// [1989-08-25 (Ver.1.00)] Rhodes Model 660 (RS-PCM Keyboard)
	// [1989-11-17 (Ver.1.00)] Rhodes Model 760 (RS-PCM Keyboard)
	{
		modelName: 'Model 660',
		modelIdHex: '35', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 3,
		address: '(?:00 00 ..|0[189a-c] .. ..|10 00 [01].)',
	},
	{
		modelName: 'Model 760',
		modelIdHex: '35', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 3,
		address: '(?:00 01 ..|0[129a-c] .. ..|10 00 [0-4].)',
	},
	// [1989-10-23 (Ver.1.00)] Roland R-8M (Total Percussion Sound Module)
	{
		modelName: 'R-8M',
		modelIdHex: '36', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1990-07-18 (Ver.1.00)] Boss SE-50 (Stereo Effects Processor)
	{
		modelName: 'SE-50',
		modelIdHex: '37', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1991-03-11 (Ver.1.00)] Roland RSP-550 (Stereo Signal Processor)
	{
		modelName: 'RSP-550',
		modelIdHex: '38', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1990-01-18 (Ver.1.00)] Roland D-70 (Super LA Synthesizer)
	{
		modelName: 'D-70',
		modelIdHex: '39', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 3,
	},
	// [1997-10-30 (Ver.1.00)] Roland MC-505 (groovebox)
	// [1998-03-06 (Ver.1.00)] Roland JX-305 (groovesynth)
	// [1999-10-27 (Ver.1.00)] Roland MC-307 (groovebox)
	// [2001-03-08 (Ver.1.00)] Roland D2 (groovebox)
	{
		modelName: 'Quick SysEx',
		modelIdHex: '3a', deviceIdReStr: '1.', commands: [0x12], addrLen: 2,
	},
	// [1990-01-18 (Ver.1.00)] Roland SPD-8 (Total Percussion Pad)
	{
		modelName: 'SPD-8',
		modelIdHex: '3b', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1991-02-01 (Ver.1.00)] Roland JD-800 (Programmable Synthesizer)
	// [1993-01-20 (Ver.1.00)] Roland JD-990 (Super JD Synthesizer Module)
	{
		modelName: 'JD-800',
		modelIdHex: '3d', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1990-11-15 (Ver.1.00)] Roland JX-1 (Performance Synthesizer)
	{
		modelName: 'JX-1',
		modelIdHex: '3e', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1991-01-?? (Ver.1.00)] Roland E-70 (Intelligent Synthesizer)
	// [1991-04-?? (Ver.1.00)] Roland E-35 (Intelligent Synthesizer)
	{
		modelName: 'E-70',
		modelIdHex: '3f', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1991-06-?? (Ver.1.00)] Roland E-15 (Intelligent Synthesizer)
	{
		modelName: 'E-15',
		modelIdHex: '40', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [????-??-?? (Ver.1.00)] Roland LVC-1 (Lyrics Video Converter)
	{
		modelName: 'LVC-1',
		modelIdHex: '41', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1991-01-24 (Ver.1.00)] Roland SC-55 (MIDI Sound Generator)
	// [1991-01-?? (Ver.1.00)] Roland E-70 (Intelligent Synthesizer)
	// [1991-04-?? (Ver.1.00)] Roland E-35 (Intelligent Synthesizer)
	// [1991-05-?? (Ver.1.00)] Roland RA-90 (Realtime Arranger)
	// [1991-06-?? (Ver.1.00)] Roland E-15 (Intelligent Synthesizer)
	// [1991-07-15 (Ver.1.00)] Roland SCC-1 (GS Sound Card)
	// [1991-07-31 (Ver.1.00)] Roland FG-10 (Music Timer)
	// [1991-07-31 (Ver.1.00)] Roland FG-1000 (Music Timer)
	// [1991-09-12 (Ver.1.00)] Roland CM-500 (GS/LA Sound Module)
	// [1991-09-13 (Ver.1.00)] Roland CM-300 (GS Sound Module)
	// [1991-12-16 (Ver.1.00)] Roland SC-155 (MIDI Sound Generator)
	// [1992-01-06 (Ver.1.01)] Roland JV-30 (16 Part Multi Timbral Synthesizer)
	// [1992-01-09 (Ver.1.00)] Roland KR-5500 (Intelligent Piano)
	// [1992-01-09 (Ver.1.00)] Roland KR-4500 (Intelligent Piano)
	// [1992-01-09 (Ver.1.00)] Roland KR-650 (Intelligent Piano)
	// [1992-03-18 (Ver.1.00)] Roland KR-3500 (Intelligent Piano)
	// [1992-06-05 (Ver.1.00)] Roland SC-33 (Sound Module)
	// [1992-06-05 (Ver.1.00)] Boss DS-330 (Dr. Synth)
	// [1992-11-06 (Ver.1.00)] Roland SD-35 (MIDI Player)
	// [1992-11-06 (Ver.1.01)] Roland JW-50 (Music Workstation)
	// [1992-02-06 (Ver.1.00)] Roland MT-200 (Digital Sequencer and Sound Module)
	// [1993-01-01 (Ver.1.03)] Roland PR-300 (Digital Sequencer and Sound Module)
	// [1993-01-18 (Ver.1.00)] Roland SK-50 (Multi Timbral Keyboard)
	// [1993-02-?? (Ver.1.00)] Roland E-56 (Intelligent Synthesizer)
	// [1993-03-01 (Ver.1.00)] Roland SC-55mkII (MIDI Sound Generator)
	// [1993-08-01 (Ver.1.01)] Roland E-86 (Intelligent Synthesizer)
	// [1993-08-03 (Ver.1.00)] Roland MT-120 (Digital Sequencer and Sound Module)
	// [1993-10-15 (Ver.1.00)] Roland JV-50/35 (Expandable Synthesizer)
	// [1993-11-01 (Ver.1.00)] Roland GPPC-NA (GS Sound Board)
	// [1993-11-19 (Ver.1.00)] Roland KR-4700/5000 (Digital Intelligent Piano)
	// [1993-12-01 (Ver.1.00)] Roland SC-50 (MIDI Sound Generator)
	// [1993-12-?? (Ver.1.00)] Roland E-36 (Intelligent Synthesizer)
	// [1994-01-?? (Ver.1.00)] Roland E-66 (Intelligent Synthesizer)
	// [1994-02-16 (Ver.1.00)] Roland AT-70/50 (Music Atelier)
	// [1994-03-?? (Ver.1.00)] Roland SC-88 (MIDI Sound Generator)
	// [1994-05-01 (Ver.1.00)] Roland SCB-55 (GS Daughter Board)
	// [1994-08-30 (Ver.1.00)] Roland E-40 OR (Intelligent Synthesizer)
	// [1995-01-18 (Ver.1.00)] Roland KR-4300 (Digital Intelligent Piano)
	// [1995-01-?? (Ver.1.00)] Roland RA-95 (Realtime Arranger)
	// [1995-02-08 (Ver.1.00)] Roland RA-30 (Realtime Arranger)
	// [1995-03-?? (Ver.1.00)] Roland SC-55ST (MIDI Sound Generator)
	// [1995-04-?? (Ver.1.00)] Roland SC-88VL (MIDI Sound Generator)
	// [1995-05-02 (Ver.1.00)] Roland E-96 (Intelligent Synthesizer)
	// [1995-05-02 (Ver.1.00)] Roland G-800 (Arranger Workstation)
	// [1995-06-01 (Ver.1.00)] Roland SCP-55 (Sound Canvas PC Card)
	// [1995-06-?? (Ver.1.00)] Roland M-GS64 (MIDI Sound Generator)
	// [1995-06-16 (Ver.1.00)] Roland XP-10 (Multitimbral Synthesizer)
	// [1995-06-28 (Ver.1.00)] Roland AT-30 (Music Atelier)
	// [1995-08-?? (Ver.1.0)] Roland E-38 (Intelligent Keyboard)
	// [1995-08-25 (Ver.1.00)] Roland AT-90 (Music Atelier)
	// [1995-10-31 (Ver.1.00)] Roland MT-80s (Music Player)
	// [1995-12-12 (Ver.1.00)] Roland HP 550G (Digital Piano)
	// [1996-01-25 (Ver.1.00)] Roland KR-370 (Digital Piano)
	// [1996-02-07 (Ver.1.00)] Roland KR-570 (Digital Piano)
	// [1996-02-19 (Ver.1.10)] Roland PMA-5 (Personal Music Assistant)
	// [1996-05-?? (Ver.1.00)] Roland RA-800 (Realtime Arranger)
	// [1996-06-01 (Ver.1.00)] Roland E-68 (Intelligent Keyboard)
	// [1996-06-01 (Ver.1.00)] Roland E-28 (Intelligent Keyboard)
	// [1996-09-?? (Ver.1.00)] Roland SC-88ST (MIDI Sound Generator)
	// [1996-09-?? (Ver.1.00)] Roland SC-88Pro (MIDI Sound Generator)
	// [1996-10-01 (Ver.1.00)] Roland KR-770 (Digital Piano)
	// [1996-10-01 (Ver.1.00)] Roland AT-80 (Music Atelier)
	// [1996-10-01 (Ver.1.00)] Roland PR-300S (Digital Sequencer and Sound Module)
	// [1997-02-?? (Ver.1.00)] Roland E-500 (Intelligent Keyboard)
	// [1997-02-?? (Ver.1.00)] Roland G-600 (Arranger Workstation)
	// [1997-02-?? (Ver.1.00)] Roland ep-95/85/75 (Digital Piano)
	// [1997-02-?? (Ver.1.00)] Roland HP-130 (Digital Piano)
	// [1997-03-01 (Ver.1.00)] Roland KR-1070 (Digital Piano)
	// [1997-06-?? (Ver.1.00)] Roland SC-55K (MIDI Sound Generator)
	// [1997-10-01 (Ver.1.00)] Roland SK-88Pro (Sound Canvas)
	// [1997-10-?? (Ver.1.00)] Roland SC-88ST Pro (MIDI Sound Generator)
	// [1997-11-14 (Ver.1.00)] Roland HP 535/335 (Digital Piano)
	// [1998-01-01 (Ver.1.00)] Roland HP 555G (Digital Piano)
	// [1998-01-01 (Ver.1.00)] Roland MT-300/300s (Music Player)
	// [1998-01-01 (Ver.1.00)] Roland SC-880 (64 Voice Synthesizer Module)
	// [1998-03-?? (Ver.1.00)] Roland E-300 (Intelligent Keyboard)
	// [1998-10-27 (Ver.1.01)] Roland MT-300 (Music Player)
	// [1998-03-01 (Ver.1.00)] Roland KR-375 (Digital Piano)
	// [1998-04-01 (Ver.1.00)] Roland KR-575 (Digital Piano)
	// [1998-04-?? (Ver.1.00)] Roland KR-75 (Digital Intelligent Piano)
	// [1998-04-?? (Ver.1.00)] Roland G-1000 (Arranger Workstation)
	// [1998-09-?? (Ver.1.00)] Roland EM-2000 (Creative Keyboard)
	// [1998-10-?? (Ver.1.00)] Roland EG-101 (groovekeyboard)
	// [1998-11-?? (Ver.1.00)] Roland EM-50/30 (Creative Keyboard)
	// [1998-12-01 (Ver.1.00)] Roland AT-20R (Music Atelier)
	// [1998-12-01 (Ver.1.00)] Roland AT-30R (Music Atelier)
	// [1998-12-01 (Ver.1.00)] Roland AT-90R (Music Atelier)
	// [1999-02-01 (Ver.1.00)] Roland AT-80R (Music Atelier)
	// [1999-02-04 (Ver.1.00)] Roland E-600 (Intelligent Keyboard)
	// [1999-03-01 (Ver.1.00)] Roland AT-60R (Music Atelier)
	// [1999-04-?? (Ver.1.00)] Roland EM-20/10 (Creative Keyboard)
	// [1999-05-?? (Ver.1.00)] Roland SC-8850 (Sound Canvas)
	// [1999-10-?? (Ver.1.00)] Roland SC-8820 (Sound Canvas)
	// [1999-12-09 (Ver.1.00)] Roland HP 337 (Digital Piano)
	// [2000-03-01 (Ver.1.00)] Roland KF-90 (Digital Intelligent Piano)
	// [2000-04-01 (Ver.1.00)] Roland KR-1077/977/577 (Digital Piano)
	// [2000-05-01 (Ver.1.00)] Roland KR-277 (Digital Piano)
	// [2000-05-01 (Ver.1.00)] Roland KR-377 (Digital Piano)
	// [2000-05-01 (Ver.1.00)] Roland HP-557R (Digital Piano)
	// [2000-09-01 (Ver.1.00)] Roland MT-90s (Music Player)
	// [2000-09-01 (Ver.1.00)] Roland HP 337R (Digital Piano)
	// [2000-10-?? (Ver.1.00)] Roland SC-D70 (Sound Canvas Digital)
	// [2000-??-?? (Ver.?.??)] Roland SK-500 (64 Voice Synthesizer)
	// [2000-10-?? (Ver.1.00)] Roland VA-3 (V-Arranger Keyboard)
	// [2001-??-?? (Ver.?.??)] Roland VA-7/5 (V-Arranger Keyboard)
	// [2001-01-?? (Ver.1.00)] Roland VA-76 (V-Arranger Keyboard)
	// [2001-02-01 (Ver.1.00)] Roland AT-10S (Music Atelier)
	// [2001-??-?? (Ver.?.??)] Roland KR-777/177 (Digital Piano)
	// [2001-03-?? (Ver.1.00)] Roland EM-25/15 (Creative Keyboard)
	// [2001-06-01 (Ver.1.00)] Roland AT-90S/80S/60S/20S (Music Atelier)
	// [2001-07-01 (Ver.1.00)] Roland AT-20S (Music Atelier)
	// [2001-09-01 (Ver.1.00)] Roland HPi-5 (Digital Piano)
	// [2001-09-18 (Ver.1.00)] Roland SD-90 (Studio Canvas)
	// [2001-10-?? (Ver.1.00)] Roland EM-55 (Creative Keyboard)
	// [2002-04-01 (Ver.1.00)] Roland KR-7/5 (Digital Intelligent Piano)
	// [2002-??-?? (Ver.?.??)] Roland KR-3 (Digital Intelligent Piano)
	// [2002-05-01 (Ver.1.00)] Roland SD-80 (Studio Canvas)
	// [2002-06-01 (Ver.1.00)] Roland SD-20 (Studio Canvas)
	// [2002-06-?? (Ver.1.00)] Roland DisCover 5 (Real Time Orchestrator)
	// [2002-10-01 (Ver.1.00)] Roland KF-7 (Digital Piano)
	// [2002-12-01 (Ver.1.00)] Roland KR-17/15 (Digital Intelligent Piano)
	// [2003-07-01 (Ver.1.00)] Roland AT-5 (Music Atelier)
	// [2003-07-01 (Ver.1.10)] Roland AT-15 (Music Atelier)
	// [2003-11-?? (Ver.1.01)] Roland E-200/100 (Intelligent Keyboard)
	// [2003-11-?? (Ver.1.01)] Roland EXR-5/3 (Interactive Arranger)
	// [2004-03-01 (Ver.1.00)] Roland AT-45 (Music Atelier)
	// [2004-04-?? (Ver.1.00)] Roland EXR-7 (Interactive Arranger)
	// [2004-08-01 (Ver.2.00)] Roland AT-90S/80S Ver.2.00 (Music Atelier)
	// [2004-09-01 (Ver.1.00)] Roland HPi-7S (Digital Piano)
	// [2004-11-?? (Ver.1.00)] Roland G-70 (Music Workstation)
	// [2005-01-25 (Ver.1.01)] Roland GW-7 (Workstation)
	// [2005-02-01 (Ver.1.00)] Roland RG-7 (Digital Piano)
	// [2005-03-01 (Ver.1.00)] Roland KR107 (Digital Intelligent Piano)
	// [2005-04-?? (Ver.1.01)] Roland EXR-5s/3s (Interactive Arranger)
	// [2005-05-?? (Ver.1.01)] Roland EXR-40 OR (Interactive Arranger)
	// [2005-09-30 (Ver.1.00)] Roland E-09 (Interactive Arranger)
	// [2005-10-01 (Ver.1.00)] Roland HPi-6 (Digital Piano)
	// [2006-01-01 (Ver.1.00)] Roland KR117/115 (Digital Intelligent Piano)
	// [2006-04-?? (Ver.1.01)] Roland EXR-7s (Interactive Arranger)
	// [2006-05-?? (Ver.1.00)] Roland E-80 (Music Workstation)
	// [2006-05-?? (Ver.1.00)] Roland E-60/50 (Music Workstation)
	// [2006-06-01 (Ver.1.00)] Roland RK-100 (Digital Keyboard)
	// [2006-06-01 (Ver.1.00)] Roland RK-500 (Recreational Keyboard)
	// [2006-08-01 (Ver.1.00)] Roland RG-3 (Digital Piano)
	// [2006-09-?? (Ver.1.01)] Roland EXR-46 OR (Interactive Arranger)
	// [2006-10-01 (Ver.1.00)] Roland FP-7/4 (Digital Piano)
	// [2006-10-01 (Ver.1.00)] Roland HP207 (Digital Piano)
	// [2006-10-01 (Ver.1.00)] Roland HP205/203 (Digital Piano)
	// [2007-04-01 (Ver.1.00)] Roland RG-3M (Digital Piano)
	// [2007-06-01 (Ver.1.00)] Roland HPi-7S (Digital Piano)
	// [2007-06-01 (Ver.1.00)] Roland HPi-6S (Digital Piano)
	// [2007-07-01 (Ver.1.00)] Roland AT-900/900C (Music Atelier)
	// [2007-07-01 (Ver.1.00)] Roland AT-800 (Music Atelier)
	// [2007-09-01 (Ver.1.00)] Roland DP-990 (Digital Piano)
	// [2007-09-01 (Ver.1.00)] Roland KR107R (Digital Intelligent Piano)
	// [2008-02-01 (Ver.1.00)] Roland RG-1 (Digital Piano)
	// [2008-02-01 (Ver.1.00)] Roland MT-90U (Music Player)
	// [2008-05-01 (Ver.1.00)] Roland AT-100/300 (Music Atelier)
	// [2008-09-01 (Ver.1.00)] Roland AT-500 (Music Atelier)
	// [2008-09-01 (Ver.1.00)] Roland AT-75 (Music Atelier)
	// [2008-09-01 (Ver.1.00)] Roland RK-300 (Recreational Keyboard)
	// [2008-10-01 (Ver.1.00)] Roland LX-10 (Digital Piano)
	// [2009-03-01 (Ver.1.00)] Roland F-110 (Digital Piano)
	// [2009-06-?? (Ver.1.00)] Roland JM-8 (VIMA)
	// [2009-09-01 (Ver.1.00)] Roland HP307 (Digital Piano)
	// [2009-09-01 (Ver.1.00)] Roland HP305/302 (Digital Piano)
	// [2009-09-01 (Ver.1.00)] Roland RP201 (Digital Piano)
	// [2010-01-05 (Ver.1.00)] Roland SD-50 (Mobile Studio Canvas)
	// [2010-09-01 (Ver.1.00)] Roland DP990F/RF (Digital Piano)
	// [2010-09-01 (Ver.1.00)] Roland HPi-7F (Digital Piano)
	// [2010-09-01 (Ver.1.00)] Roland HPi-6F (Digital Piano)
	// [2010-09-01 (Ver.1.00)] Roland LX-10F (Digital Piano)
	// [2010-09-01 (Ver.1.00)] Roland RG-3F/1F (Digital Piano)
	// [2011-01-01 (Ver.1.00)] Roland FP-7F (Digital Piano)
	// [2011-01-01 (Ver.1.00)] Roland FP-4F (Digital Piano)
	// [2011-04-01 (Ver.1.00)] Roland AT-350C (Music Atelier)
	// [2011-01-?? (Ver.1.00)] Roland BK-7m (Backing Module)
	// [2011-07-?? (Ver.1.00)] Roland JM-5 (VIMA)
	// [2011-09-01 (Ver.1.00)] Roland F-120 (Digital Piano)
	// [2011-09-01 (Ver.1.00)] Roland RP301 (Digital Piano)
	// [2011-11-01 (Ver.1.00)] Roland LX-15 (Digital Piano)
	// [2011-11-?? (Ver.1.00)] Roland BK-5 (Backing Keyboard)
	// [2012-02-01 (Ver.1.00)] Roland HP507 (Digital Piano)
	// [2012-02-01 (Ver.1.00)] Roland HP505/503 (Digital Piano)
	// [2012-06-01 (Ver.1.00)] Roland DP90/DP90S (Digital Piano)
	// [2012-11-01 (Ver.1.00)] Roland HPi-50 (Digital Piano)
	// [2013-01-01 (Ver.1.00)] Roland BK-3 (Backing Keyboard)
	// [2013-02-?? (Ver.1.00)] Roland BK-9 (Backing Keyboard)
	// [2013-04-01 (Ver.1.00)] Roland FP-80 (Digital Piano)
	// [2013-04-01 (Ver.1.00)] Roland FP-50 (Digital Piano)
	// [2013-10-01 (Ver.1.00)] Roland F-20 (Digital Piano)
	// [2013-10-01 (Ver.1.00)] Roland HP508/506/504 (Digital Piano)
	// [2014-02-01 (Ver.1.00)] Roland HPi-50e (Digital Piano)
	// [2014-03-01 (Ver.1.01)] Roland DP90e/DP90Se (Digital Piano)
	// [2014-03-01 (Ver.1.01)] Roland LX-15e (Digital Piano)
	// [2014-06-01 (Ver.1.00)] Roland F-130R (Digital Piano)
	// [2014-06-01 (Ver.1.00)] Roland RP401R (Digital Piano)
	// [2015-??-?? (Ver.?.??)] Roland F-140R (Digital Piano)
	// [2015-11-20 (Ver.1.00)] Roland E-A7 (Expandable Arranger)
	// [2016-08-01 (Ver.1.00)] Roland FP-30 (Digital Piano)
	// [2016-??-?? (Ver.?.??)] Roland RP501R (Digital Piano)
	{
		modelName: 'GS',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'40 00 (?:0[0-6]|7f)',                      // System Parameters
			'40 01 (?:0.|3[0-589a-f])',                 // Patch Common Parameters
			'40 1. (?:[01].|2[0-2]|3[0-7]|4[0-9ab])',   // Patch Part Parameters
			'40 2. [0-5][0-9a]',                        // Patch Part Parameters (2x)
			'41 (?:[01]0 0[0-9ab]|[01][1-8] ..)',       // Drum Setup Parameters
			'48 (?:0. ..|1[0-9a-c] ..|1d 0.)',          // Bulk Dump (System/Patch)
			'49 (?:[01]. ..|[01][0-9a-e] ..)',          // Bulk Dump (Drum Setup)
		],
	},
	{
		modelName: 'SC-55',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'40 00 7e',         // LGC Controller Number
			'40 01 1.',         // Voice Reserve
			'40 01 20',         // Assigner Separate Wall
			'40 01 36',         // Reverb Send Level to Chorus
			'40 30 [01].',      // System Information
			'40 3[0-2] [23].',  // Wave ROM Information
		],
	},
	{
		modelName: 'FG-10/1000',
		modelIdHex: '42', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '4f 40 ..',    // Test Mode
	},
	{
		modelName: 'SC-55mkII',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: '40 1. 23',    // Rx.Bank Select
	},
	{
		modelName: 'SC-88',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 00 7f',                                     // System Mode Set
			'00 01 [01].',                                  // Channel Msg Rx Port (A-B Port)
			'[45]0 01 37',                                  // Reverb Pre-Delay Time
			'[45]0 01 40',                                  // Chorus Send Level to Delay
			'[45]0 01 5[0-9a]',                             // Delay
			'[45]0 02 0[0-3]',                              // EQ
			'[45]0 1. 2[4a-c]',                             // Patch Part Parameters
			'[45]0 1. 38',                                  // Tone Modify 9 (Attack Delay)
			'[45]0 1. 5[0-9ab]',                            // Tone Name
			'[45]0 4. (?:0[01]|20)',                        // Patch Part Parameters (4x)
			'[45]0 4. 3[0-8]',                              // User Inst Modify Temp.
			'41 [01]9 ..',                                  // Drum Setup Parameters
			'50 00 (?:0[0-6]|7f)',                          // System Parameters
			'50 01 (?:0.|3[0-589a-f])',                     // Patch Common Parameters
			'50 1. (?:[01].|2[0-2]|3[0-7]|4[0-9ab])',       // Patch Part Parameters
			'50 2. [0-5][0-9a]',                            // Patch Part Parameters (2x)
			'20 [01][0-9a] ..',                             // User Instrument
			'21 (?:[01]0 0[0-9ab]|[01][1-9a-c] ..)',        // User Drum Set
			'[45]8 (?:1d [1-7].|1[ef] ..|2[0-5] ..|26 0.)', // Bulk Dump (Patch Extension)
			'[45]9 [01]f ..',                               // Bulk Dump (Drum Setup)
			'58 (?:0. ..|1[0-9a-c] ..|1d 0.)',              // Bulk Dump (System/Patch B)
			'59 (?:[01]. ..|[01][0-9a-e] ..)',              // Bulk Dump (Drum Setup B)
			'08 00 ..',                                     // Bulk Dump (Setup)
			'28 [01][0-9a] ..',                             // Bulk Dump (User Tone Bank)
			'29 (?:[01][0-9a] ..|[01]b 0.)',                // Bulk Dump (User Drum Set)
			'0c 00 0[1-3]',                                 // Bulk Dump Request (List)
		],
	},
	{
		modelName: 'G-800',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: '40 1. 6[0-9ab]',  // Scale Tuning Range
	},
	{
		modelName: 'HP 550G',
		modelIdHex: '42', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '40 1. 25',    // Tone Remain
	},
	{
		modelName: 'M-GS64',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 00 05',     // System Output Assign
			'40 4. 21',     // Output Assign
		],
	},
	{
		modelName: 'SC-88Pro',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'[45]0 03 [01].',                       // EFX
			'[45]0 4. 22',                          // Part EFX Assign
			'22 (?:0. ..|1[0-6] ..)',               // User Effect
			'23 .. (?:[0-2].|3[0-7]|[45].)',        // User Patch Common
			'2[45] 0. (?:[01].|2[0-4a-c]|3[0-7]|4[0-9ab]|[5-7][0-9a])',
			'2[67] 0. (?:[0-2][0-9a]|3[013-5])',    // User Patch Part
			'2a 0. ..',                             // Bulk Dump (User EFX)
			'2b [0-5]. ..',                         // Bulk Dump (User Patch)
			'0c 00 0[45]',                          // Bulk Dump Request (List)
		],
	},
	{
		modelName: 'SC-8850',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 01 [23].',                                  // Channel Msg Rx Port (C-D Port)
			'08 01 ..',                                     // Bulk Dump (Setup C/D)
			'[67]8 (?:1d [1-7].|1[ef] ..|2[0-5] ..|26 0.)', // Bulk Dump (Patch Extension C/D)
			'[67]8 (?:0. ..|1[0-9a-c] ..|1d 0.)',           // Bulk Dump (System/Patch C/D)
			'[67]9 [01]. ..',                               // Bulk Dump (Drum Setup C/D)
		],
	},
	{
		modelName: 'KR-575',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'40 4. 2[356]',     // Part EFX
			'40 4. 5[1-9ab]',   // Footage
		],
	},
	{
		modelName: 'VA-76',
		modelIdHex: '42', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: '7d 1. 00',    // Set On/Off the VariPhrase Part
	},
	{
		modelName: 'GS Compatible',
		modelIdHex: '42', deviceIdReStr: '..', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1991-02-01 Ver.1.00] Roland SSC-8004 (Sound Space Controller)
	{
		modelName: 'SSC-8004',
		modelIdHex: '43', deviceIdReStr: '0.', commands: [0x12], addrLen: 2,
	},
	// [1990-09-20 Ver.1.00] Roland A-220 (MIDI Separator)
	{
		modelName: 'A-220',
		modelIdHex: '44', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [1991-01-24 (Ver.1.00)] Roland SC-55 (MIDI Sound Generator)
	// [1991-12-16 (Ver.1.00)] Roland SC-155 (MIDI Sound Generator)
	// [1993-03-01 (Ver.1.00)] Roland SC-55mkII (MIDI Sound Generator)
	// [1994-03-?? (Ver.1.00)] Roland SC-88 (MIDI Sound Generator)
	// [1995-03-?? (Ver.1.00)] Roland SC-55ST (MIDI Sound Generator)
	// [1995-04-?? (Ver.1.00)] Roland SC-88VL (MIDI Sound Generator)
	// [1996-09-?? (Ver.1.00)] Roland SC-88Pro (MIDI Sound Generator)
	// [1997-10-01 (Ver.1.00)] Roland SK-88Pro (Sound Canvas)
	// [1998-01-01 (Ver.1.00)] Roland SC-880 (64 Voice Synthesizer Module)
	// [1999-05-?? (Ver.1.00)] Roland SC-8850 (Sound Canvas)
	// [2001-09-18 (Ver.1.00)] Roland SD-90 (Studio Canvas)
	{
		modelName: 'SC-55 LCD',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
		address: '10 0[01] ..',
	},
	{
		modelName: 'SC-55mkII LCD',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
		address: '10 (?:08|1[01]) ..',
	},
	{
		modelName: 'SC-88 LCD',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
		address: '10 (?:0[2-5]|20) ..',
	},
	{
		modelName: 'SC-8850 LCD',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
		address: '20 0. ..',
	},
	{
		modelName: 'SC-880',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
		address: [
			'50 0[0-7] [01]. ..',       // User Performance System
			'5[12] 0[0-7] [0-3]. ..',   // User Performance Common
			'5[34] 0[0-7] [124]. ..',   // User Performance Part
			'61 .. 0[0-3] ..',          // User Patch Common
			'63 .. [124]. ..',          // User Patch Part
			'70 0. 0[0-9a-c] ..',       // User Rhythm Set
		],
	},
	{
		modelName: 'SC Firmware',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [[0x00, 0x12]], addrLen: 4,
	},
	{
		modelName: 'SC LCD',
		modelIdHex: '45', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [1991-09-01 (Ver.1.00)] Roland JV-80 (Multi Timbral Synthesizer)
	// [1992-07-14 (Ver.1.00)] Roland JV-880 (Multi Timbral Synthesizer Module)
	// [1993-03-24 (Ver.1.00)] Roland JV-1000 (Music Workstation)
	// [1993-10-13 (Ver.1.00)] Roland JV-90 (Expandable Synthesizer)
	// [1995-02-22 (Ver.1.00)] Roland M-BD1 (Sound Expansion Series)
	// [1995-02-22 (Ver.1.00)] Roland M-DC1 (Sound Expansion Series)
	// [1995-02-22 (Ver.1.00)] Roland M-OC1 (Sound Expansion Series)
	// [1995-02-22 (Ver.1.00)] Roland M-SE1 (Sound Expansion Series)
	// [1995-02-22 (Ver.1.00)] Roland M-VS1 (Sound Expansion Series)
	{
		modelName: 'JV-80',
		modelIdHex: '46', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: '(?:00 0[0-8] .. ..|0[12] (?:0.|[4-7].) .. ..)',
	},
	{
		modelName: 'M-BD1/DC1/OC1/SE1/VS1',
		modelIdHex: '46', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
		address: '00 (?:0[0-8]|20) .. ..',
	},
	// [1991-04-30 Ver.1.00] Roland VK-1000 (Rhodes Organ)
	{
		modelName: 'VK-1000',
		modelIdHex: '48', deviceIdReStr: '1.', commands: [0x12], addrLen: 3,
	},
	// [1992-02-14 Ver.1.00] Boss ME-10 (Guitar Multiple Effects)
	{
		modelName: 'ME-10',
		modelIdHex: '49', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1991-05-?? Ver.1.00] Roland RA-90 (Realtime Arranger)
	{
		modelName: 'RA-90',
		modelIdHex: '4a', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1992-??-?? Ver.1.00] Roland A-30 (MIDI Keyboard Controller)
	// [1993-06-01 Ver.1.0] Rodgers RK-76 (MIDI Keyboard Controller)
	{
		modelName: 'A-30',
		modelIdHex: '4c', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1992-01-06 Ver.1.01] Roland JV-30 (16 Part Multi Timbral Synthesizer)
	// [1993-10-15 Ver.1.00] Roland JV-50/35 (Expandable Synthesizer)
	{
		modelName: 'JV-30',
		modelIdHex: '4d', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: '[23][08] .. ..',
	},
	{
		modelName: 'JV-50/35',
		modelIdHex: '4d', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: '[2356][08] .. ..',
	},
	// [1991-07-31 (Ver.1.00)] Roland FG-10 (Music Timer)
	// [1991-07-31 (Ver.1.00)] Roland FG-1000 (Music Timer)
	{
		modelName: 'FG-10',
		modelIdHex: '4f', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '(?:1[012]|20) .. ..',
	},
	{
		modelName: 'FG-1000',
		modelIdHex: '4f', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '(?:1[01]|30) .. ..',
	},
	// [1991-12-28 (Ver.1.00)] Roland R-70 (Human Rhythm Composer)
	{
		modelName: 'R-70',
		modelIdHex: '50', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1992-02-15 (Ver.1.00)] Boss DR-660 (Dr. Rhythm)
	{
		modelName: 'DR-660',
		modelIdHex: '52', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1992-05-29 (Ver.1.00)] Roland DJ-70 (Sampling Workstation)
	{
		modelName: 'DJ-70',
		modelIdHex: '53', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
	},
	// [1992-06-03 (Ver.1.00)] Roland GR-1 (Guitar Synthesizer)
	{
		modelName: 'GR-1',
		modelIdHex: '54', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [1992-06-05 (Ver.1.00)] Roland SC-33 (Sound Module)
	// [1992-06-05 (Ver.1.00)] Boss DS-330 (Dr. Synth)
	{
		modelName: 'SC-33',
		modelIdHex: '55', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1993-07-01 (Ver.1.00)] Roland SC-7 (Sound Module)
	{
		modelName: 'SC-7',
		modelIdHex: '56', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1993-01-20 (Ver.1.00)] Roland JD-990 (Super JD Synthesizer Module)
	{
		modelName: 'JD-990',
		modelIdHex: '57', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1992-08-04 (Ver.1.00)] Roland TD-7 (Percussion Sound Module)
	{
		modelName: 'TD-7',
		modelIdHex: '58', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1993-03-30 (Ver.1.00)] Roland SRV-330 (Dimensional Space Reverb)
	{
		modelName: 'SRV-330',
		modelIdHex: '59', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1993-03-30 (Ver.1.00)] Roland SDE-330 (Dimensional Space Delay)
	{
		modelName: 'SDE-330',
		modelIdHex: '5a', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1993-02-?? (Ver.1.00)] Roland E-56 (Intelligent Synthesizer)
	{
		modelName: 'E-56',
		modelIdHex: '5b', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2002-09-20 (Ver.1.00)] Roland MC-909 (sampling groovebox)
	// [2006-12-14 (Ver.1.00)] Roland MC-808 (sampling groovebox)
	{
		modelName: 'Quick SysEx',
		modelIdHex: '5d', deviceIdReStr: '1.', commands: [0x12], addrLen: 2,
	},
	// [1992-11-04 (Ver.1.00)] Roland R-8MKII (Human Rhythm Composer)
	{
		modelName: 'R-8MKII',
		modelIdHex: '5e', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1994-05-?? (Ver.1.00)] Roland JS-30 (Sampling Workstation)
	{
		modelName: 'JS-30',
		modelIdHex: '5f', deviceIdReStr: '[01].', commands: [0x11, 0x12, 0x40, 0x41, 0x42, 0x43, 0x45, 0x4e, 0x4f], addrLen: 4,
	},
	// [1992-02-06 (Ver.1.00)] Roland SPD-11 (Total Percussion Pad)
	{
		modelName: 'SPD-11',
		modelIdHex: '60', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1993-03-19 (Ver.1.00)] Boss SE-70 (Super Effects Processor)
	{
		modelName: 'SE-70',
		modelIdHex: '61', deviceIdReStr: '(?:0.|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1998-12-01 (Ver.1.00)] Roland AT-20R (Music Atelier)
	// [1998-12-01 (Ver.1.00)] Roland AT-30R (Music Atelier)
	// [1998-12-01 (Ver.1.00)] Roland AT-90R (Music Atelier)
	// [1999-02-01 (Ver.1.00)] Roland AT-80R (Music Atelier)
	// [1999-03-01 (Ver.1.00)] Roland AT-60R (Music Atelier)
	// [2003-07-01 (Ver.1.10)] Roland AT-15 (Music Atelier)
	// [2004-08-01 (Ver.2.00)] Roland AT-90S Ver.2 (Music Atelier)
	// [2004-08-01 (Ver.2.00)] Roland AT-80S Ver.2 (Music Atelier)
	// [2007-07-01 (Ver.1.00)] Roland AT-900/900C (Music Atelier)
	// [2007-07-01 (Ver.1.00)] Roland AT-800 (Music Atelier)
	// [2008-05-01 (Ver.1.00)] Roland AT-100/300 (Music Atelier)
	// [2008-09-01 (Ver.1.00)] Roland AT-500 (Music Atelier)
	// [2008-09-01 (Ver.1.00)] Roland AT-75 (Music Atelier)
	// [2011-??-?? (Ver.?.??)] Roland AT-350C (Music Atelier)
	// [2012-??-?? (Ver.?.??)] Roland ATUP-EX (Music Atelier Upgrade/Expansion Package)
	// [2017-09-01 (Ver.1.11)] Roland VR-09/730 (V-Combo)
	{
		modelIdHex: '62',
		modelName: 'AT-30R', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2[0-8])',          // System Parameters
			'01 (?:00 0[34]|0[1-3] 0[0-7])',    // Upper Part Information
			'01 (?:10 0[034]|1[1-3] 0[0-7])',   // Lower Part Information
			'01 (?:20 0[0134]|21 0[0-57])',     // Pedal Bass Part Information
			'01 (?:30 0[12]|31 0[0-57])',       // Solo Part Information
			'01 41 0[0-5]',                     // Manual Drum Part Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'AT-90R', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2[0-8])',          // System Parameters
			'01 (?:00 0[34]|0[1-3] 0[0-7])',    // Upper Part Information
			'01 (?:10 0[034]|1[1-3] 0[0-7])',   // Lower Part Information
			'01 (?:20 0[0134]|2[12] 0[0-57])',  // Pedal Bass Part Information
			'01 30 0[0-57]',                    // Solo Part Information
			'01 40 0[0-5]',                     // Manual Drum Part Information
			'01 50 0[0-5]',                     // Manual Percussion Part Information
			'02 0[01] 0[0-9a-d]',               // Footage Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'AT-80R', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2[0-8])',          // System Parameters
			'01 (?:00 0[34]|0[1-3] 0[0-7])',    // Upper Part Information
			'01 (?:10 0[034]|1[1-3] 0[0-7])',   // Lower Part Information
			'01 (?:20 0[0134]|2[12] 0[0-57])',  // Pedal Bass Part Information
			'01 31 0[0-57]',                    // Solo Part Information
			'01 41 0[0-5]',                     // Manual Drum Part Information
			'01 51 0[0-5]',                     // Manual Percussion Part Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'AT-15', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2[0-9a])',         // System Parameters
			'01 (?:00 0[34]|0[1-3] 0[0-7])',    // Upper Part Information
			'01 (?:10 0[034]|1[1-3] 0[0-7])',   // Lower Part Information
			'01 (?:20 0[0134]|2[12] 0[0-57])',  // Pedal Bass Part Information
			'01 (?:30 0[12]|31 0[0-57])',       // Solo Part Information
			'01 40 0[0-5]',                     // Manual Drum Part Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'AT-90S/80S', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2.|3[0-5])',       // System Parameters
			'01 (?:00 0[3-5]|0[1-3] 0[0-7])',   // Upper Part Information
			'01 (?:10 0[03-5]|1[1-3] 0[0-7])',  // Lower Part Information
			'01 (?:20 0[013-5]|2[12] 0[0-57])', // Pedal Bass Part Information
			'01 (?:30 0[12]|31 0[0-57])',       // Solo Part Information
			'01 41 0[0-5]',                     // Manual Drum Part Information
			'01 51 0[0-5]',                     // Manual Percussion Part Information
			'02 0[01] 0[0-9a-e]',               // Footage Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'AT-900', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|[2-4].|5[0-8])',           // System Parameters
			'01 (?:00 0[3-5]|0[1-3] (?:0[0-7]|3[ab]))', // Upper Part Information
			'01 (?:10 0[04]|1[1-3] 0[0-7])',            // Lower Part Information
			'01 (?:20 0[0134]|2[12] 0[0-57])',          // Pedal Bass Part Information
			'01 (?:30 0[12]|31 (?:0[0-57]|3[ab]))',     // Solo Part Information
			'01 41 0[0-5]',                             // Manual Drum Part Information
			'01 51 0[0-5]',                             // Manual Percussion Part Information
			'02 0[0-2] (?:0[0-9a-e]|37)',               // Vintage Organ Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'VR-09/730', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: [
			'00 00 (?:0[0-3]|2[359abe]|3[68c-f]|4.|5[017def]|6[0-8])',  // System Parameters
			'01 (?:0[1-3]|31) (?:0[0-47]|3a|5[9a-c]|6[34])',            // Upper Part Information
			'01 1[13] (?:0[0-47]|3a|5[9a-c]|6[34])',                    // Lower Part Information
			'01 41 0[0-4]',                                             // Drum Part Information
			'02 (?:00 0[0-9a-d]|0[01] 37)',                             // Organ Information
		],
	},
	{
		modelIdHex: '62',
		modelName: 'Atelier', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1993-07-19 (Ver.1.00)] Roland P-55 (Piano Module)
	{
		modelName: 'P-55',
		modelIdHex: '63', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1994-01-20 (Ver.1.00)] Roland MCR-8 (Multi Controller)
	{
		modelName: 'MCR-8',
		modelIdHex: '64', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 1,
	},
	// [1993-10-24 (Ver.1.00)] Boss DR-5 (Dr. Rhythm Section)
	{
		modelName: 'DR-5',
		modelIdHex: '65', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1994-01-10 (Ver.1.00)] Roland SDX-330 (Dimensional Expander)
	{
		modelName: 'SDX-330',
		modelIdHex: '66', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1993-11-26 (Ver.1.00)] Roland GR-09 (Guitar Synthesizer)
	{
		modelName: 'GR-09',
		modelIdHex: '67', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1994-06-06 (Ver.1.00)] Boss RV-70 (Digital Stereo Reverb)
	{
		modelName: 'RV-70',
		modelIdHex: '69', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1994-07-18 (Ver.1.00)] Roland JV-1080 (64 Voice Synthesizer Module)
	// [1994-12-15 (Ver.1.00)] Roland XP-50 (Music Workstation)
	// [1996-10-30 (Ver.1.00)] Roland JV-2080 (64 Voice Synthesizer Module)
	// [1998-02-01 (Ver.1.00)] Roland XP-80/60 (Music Workstation)
	// [1999-01-18 (Ver.1.00)] Roland XP-30 (64 Voice Expandable Synthesizer)
	// [1999-01-20 (Ver.1.00)] Roland JV-1010 (64 Voice Synthesizer Module)
	{
		modelName: 'JV-1080',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:[01].|2[0-7])',                                    // System Common
			'00 00 (?:1.|20) 0[0-9ab]',                                     // Scale Tune
			'(?:01 00|[12]0 [01].) 00 [0-3].',                              // Performance Common
			'(?:01 00|[12]0 [01].) 1. (?:0.|1[0-2])',                       // Performance Part
			'(?:02 0[0-8a-f]|03 00|[12]1 ..) 00 (?:[0-3].|4[0-7])',         // Patch Common
			'(?:02 0[0-8a-f]|03 00|[12]1 ..) (?:1[0246] ..|1[1357] 00)',    // Patch Tone
			'(?:02 09|[12]0 4[01]) 00 0[0-9ab]',                            // Rhythm Common
			'(?:02 09|[12]0 4[01]) (?:2[3-9a-b]|[3-5].|6[0-2]) (?:[0-2].|3[0-9])',  // Rhythm Note
		],
	},
	{
		modelName: 'XP-50',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:[0-4].|5[01])',                                    // System Common
			'00 00 (?:1.|20) 0[0-9ab]',                                     // Scale Tune
			'(?:01 00|10 [01].) 00 (?:[0-3].|4[01])',                       // Performance Common
			'(?:02 0[0-8a-f]|03 00|11 ..) 00 (?:[0-3].|4[0-8])',            // Patch Common
			'(?:02 0[0-8a-f]|03 00|11 ..) (?:1[0246] ..|1[1357] 00)',       // Patch Tone
			'(?:02 09|10 4[01]) 00 0[0-9ab]',                               // Rhythm Common
			'(?:02 09|10 4[01]) (?:2[3-9a-b]|[3-5].|6[0-2]) (?:[0-2].|3[0-9])', // Rhythm Note
		],
	},
	{
		modelName: 'JV-2080',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:[0-5].|6[01])',                                    // System Common
			'00 00 (?:1.|20) 0[0-9ab]',                                     // Scale Tune
			'(?:01 00|[12]0 [01].) 00 (?:[0-3].|4[0-3])',                   // Performance Common
			'(?:02 0[0-8a-f]|03 00|[12]1 ..) 00 (?:[0-3].|4[0-9])',         // Patch Common
			'(?:02 0[0-8a-f]|03 00|[12]1 ..) (?:1[0246] ..|1[1357] 00)',    // Patch Tone
			'(?:02 09|[12]0 4[01]) 00 0[0-9ab]',                            // Rhythm Common
			'(?:02 09|[12]0 4[01]) (?:2[3-9a-b]|[3-5].|6[0-2]) (?:[0-2].|3[0-9])',  // Rhythm Note
		],
	},
	{
		modelName: 'XP-30',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:[0-5].|6[0-5])',                                   // System Common
			'00 00 (?:1.|20) 0[0-9ab]',                                     // Scale Tune
			'(?:01 00|10 [01].) 00 (?:[0-3].|4[01])',                       // Performance Common
			'(?:02 0[0-8a-f]|03 00|11 ..) 00 (?:[0-3].|4[0-9])',            // Patch Common
			'(?:02 0[0-8a-f]|03 00|11 ..) (?:1[0246] ..|1[1357] 00)',       // Patch Tone
			'(?:02 09|10 4[01]) 00 0[0-9ab]',                               // Rhythm Common
			'(?:02 09|10 4[01]) (?:2[3-9a-b]|[3-5].|6[0-2]) (?:[0-2].|3[0-9])', // Rhythm Note
		],
	},
	{
		modelName: 'JV-1010 Firmware',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '0[67] .. .. ..',
	},
	{
		modelName: 'JV/XP',
		modelIdHex: '6a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1993-10-10 (Ver.1.00)] Roland RD-500 (Digital Piano)
	// [1999-07-28 (Ver.1.00)] Roland TD-8 (Percussion Sound Module)
	{
		modelName: 'TD-8 Firmware',
		modelIdHex: '6b', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '02 4. .. ..',
	},
	{
		modelName: 'RD-500',
		modelIdHex: '6b', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1994-07-01 (Ver.1.0)] Rodgers 520/530
	// [1996-07-?? (Ver.1.0)] Rodgers 525/535
	// [2001-02-?? (Ver.1.00)] Rodgers 527
	{
		modelName: '520/530',
		modelIdHex: '6d', deviceIdReStr: '[01].', commands: [0x12], addrLen: 2,
	},
	// [1994-06-22 (Ver.1.00)] Roland TD-5 (Percussion Sound Module)
	{
		modelName: 'TD-5',
		modelIdHex: '6e', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1994-08-24 (Ver.1.00)] Roland GI-10 (Guitar-MIDI Interface)
	{
		modelName: 'GI-10',
		modelIdHex: '70', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1995-03-17 (Ver.1.00)] Roland GP-100 (Guitar Preamp Processor)
	{
		modelName: 'GP-100',
		modelIdHex: '71', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1995-01-20 (Ver.1.00)] Roland FC-200 (Foot Controller)
	{
		modelName: 'FC-200',
		modelIdHex: '72', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [1995-01-10 (Ver.1.00)] Roland AP-700 (Advanced Equalizing Processor)
	{
		modelName: 'AP-700',
		modelIdHex: '73', deviceIdReStr: '..', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1995-02-01 (Ver.1.00)] Roland VG-8 (V-Guitar System)
	// [1996-05-08 (Ver.2.00)] Roland VG-8 (+ VG8S-1) (System Expansion Kit for VG-8)
	// [1998-05-01 (Ver.1.00)] Roland VG-8EX (V-Guitar System)
	{
		modelName: 'VG-8',
		modelIdHex: '74', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1994-11-16 (Ver.1.00)] Roland MS-1 (Digital Sampler)
	// Note: MS-1 seems to accept 11h (RQ1) instead of 12h (DT1) due to wrong implementation.
	{
		modelName: 'MS-1',
		modelIdHex: '75', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [1995-02-03 (Ver.1.00)] Roland AR-2000 (Audio Recorder)
	// [1995-06-16 (Ver.1.00)] Roland AR-100 (Audio Recorder)	// Not confirmed
	{
		modelName: 'AR-2000',
		modelIdHex: '76', deviceIdReStr: '[01].', commands: [0x12], addrLen: 2,
	},
	// [1995-02-08 (Ver.1.00)] Roland RA-30 (Realtime Arranger)
	{
		modelName: 'RA-30',
		modelIdHex: '77', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1996-06-01 (Ver.1.00)] Roland E-28 (Intelligent Keyboard)
	// [1997-02-?? (Ver.1.00)] Roland ep-95/85/75 (Digital Piano)
	// [1997-02-?? (Ver.1.00)] Roland HP-130 (Digital Piano)
	{
		modelName: 'E-28',
		modelIdHex: '78', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
		address: '[25]0 .. ..',
	},
	{
		modelName: 'ep-95/85/75/HP-130',
		modelIdHex: '78', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
		address: '60 .. ..',
	},
	// [1995-11-17 (Ver.1.00)] Boss GX-700 (Guitar Sound System)
	{
		modelName: 'GX-700',
		modelIdHex: '79', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1995-11-17 (Ver.1.00)] Boss SX-700 (Studio Effects Processor)
	{
		modelName: 'SX-700',
		modelIdHex: '7a', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1995-01-16 (Ver.1.00)] Roland XP-10 (Multitimbral Synthesizer)
	{
		modelName: 'XP-10',
		modelIdHex: '7b', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1995-12-10 (Ver.1.00)] Roland VS-880 (Digital Studio Workstation)
	// [1996-12-12 (Ver.2.00)] Roland VS-880 (+ V-XPANDED) (Digital Studio Workstation)
	{
		modelName: 'VS-880',
		modelIdHex: '7c', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1995-10-25 (Ver.1.00)] Roland A-90 (Expandable Controller)
	// [1995-10-25 (Ver.1.00)] Roland A-90EX (Expandable Controller)
	{
		modelName: 'A-90',
		modelIdHex: '7d', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2001-05-01 (Ver.1.01)] Roland RD-700 (Digital Piano)
	// [2002-02-01 (Ver.1.00)] Roland VK-8 (Combo Organ)
	// [2002-12-01 (Ver.1.00)] Roland VK-8M (Organ Module)
	// [2003-02-14 (Ver.1.00)] Roland SPD-S (Sampling Pad)
	// [2003-03-01 (Ver.1.00)] Roland VK-88 (Combo Organ)
	// [2003-12-18 (Ver.1.00)] Roland GR-20 (Guitar Synthesizer)
	// [2004-11-01 (Ver.1.00)] Roland RD-700SX (Digital Piano)
	// [2004-12-17 (Ver.1.00)] Roland TD-12 (Percussion Sound Module)
	// [2006-10-01 (Ver.1.00)] Roland FP-4 (Digital Piano)
	// [2007-04-01 (Ver.1.00)] Roland FC-300 (MIDI Foot Controller)
	// [2007-05-31 (Ver.1.00)] Roland VG-99 (V-Guitar System)
	// [2008-07-02 (Ver.1.00)] Roland VB-99 (V-Bass System)
	// [2012-09-01 (Ver.1.00)] Roland A-49 (MIDI Keyboard Controller)
	// [2012-??-?? (Ver.?.??)] Roland ATUP-EX (Music Atelier Upgrade/Expansion Package)
	// [2013-??-?? (Ver.?.??)] Roland RD-64 (Digital Piano)
	// [2014-08-01 (Ver.1.00)] Roland SBX-1 (Sync Box)
	// [2015-04-22 (Ver.1.00)] Boss ES-8 (Effects Switching System)
	// [2015-11-30 (Ver.1.00)] Boss ES-5 (Effects Switching System)
	// [2015-??-?? (Ver.?.??)] Roland A-01 (Controller Generator)
	// [2019-11-01 (Ver.1.00)] Roland A-88MKII (MIDI Keyboard Controller)
	{
		modelName: 'Firmware',
		modelIdHex: '7f', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [1996-03-04 (Ver.1.00)] Roland SN-700 (Noise/Hum Eliminator)
	{
		modelName: 'SN-700',
		modelIdHex: '00 01', deviceIdReStr: '..', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1996-01-?? (Ver.1.00)] Roland A-33 (MIDI Keyboard Controller)
	// [2011-12-12 (Ver.1.00)] Roland PK-6 (Dynamic MIDI Pedal)
	// [2012-01-?? (Ver.1.00)] Roland PK-9 (MIDI Pedal Keyboard)
	{
		modelName: 'A-33',
		modelIdHex: '00 02', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '00 .. ..',
	},
	{
		modelName: 'PK-6/9',
		modelIdHex: '00 02', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
		address: '13 .. ..',
	},
	// [1996-03-25 (Ver.1.00)] Roland MC-303 (groovebox)
	{
		modelName: 'MC-303',
		modelIdHex: '00 03', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1996-05-26 (Ver.1.00)] Boss GT-5 (Guitar Effects Processor)
	{
		modelName: 'GT-5',
		modelIdHex: '00 04', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1996-02-19 (Ver.1.10)] Roland PMA-5 (Personal Music Assistant)
	{
		modelName: 'PMA-5',
		modelIdHex: '00 05', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1996-10-14 (Ver.1.00)] Roland JP-8000 (Synthesizer)
	// [1998-04-14 (Ver.1.00)] Roland JP-8080 (Synthesizer Module)
	{
		modelName: 'JP-8000',
		modelIdHex: '00 06', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:0.|1[0-6])',                                       // System Parameter
			'00 00 10 [0-2].',                                              // Pattern Setup
			'00 00 20 0[0-3]',                                              // Motion Setup
			'00 00 30 (?:[01].|2[0-9])',                                    // Tx/Rx Setting
			'(?:01 00|03 [0-3].) 00 (?:[01].|2[0-3])',                      // Performance Common
			'(?:01 00|03 [0-3].) 1[01] 0[0-6]',                             // Performance Part
			'(?:01 00|03 [0-3].) (?:4[02] ..|4[13] (?:[0-5].|6[0-9a-e]))',  // Performance Patch
			'02 0[01] (?:.[02468ace] ..|.[13579bdf] (?:[0-5].|6[0-9a-e]))', // User Patch
			'08 [0-2]. .. ..',                                              // Pattern Data
			'09 [04]. .. ..',                                               // Motion Controller Data
		],
	},
	{
		modelName: 'JP-8080',
		modelIdHex: '00 06', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:0.|1[0-8])',                                       // System Parameter
			'00 00 20 0[0-3]',                                              // Motion Setup
			'00 00 30 (?:[01].|2[0-9])',                                    // Tx/Rx Setting
			'(?:01 00|03 [0-3].) 00 (?:[01].|2[0-4])',                      // Performance Common
			'(?:01 00|03 [0-3].) 08 (?:[01].|2[0-8])',                      // Voice Modulator
			'(?:01 00|03 [0-3].) 1[01] 0[0-7]',                             // Performance Part
			'01 00 (?:4[02] ..|4[13] (?:[0-6].|7[0-7]))',                   // Performance Patch
			'02 0[01] (?:.[02468ace] ..|.[13579bdf] (?:[0-6].|7[0-7]))',    // User Patch
			'0[9a] [04]. .. ..',                                            // Motion Controller Data
		],
	},
	// [1996-10-04 (Ver.1.00)] Roland GR-30 (Guitar Synthesizer)
	{
		modelName: 'GR-30',
		modelIdHex: '00 07', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1997-01-21 (Ver.1.00)] Roland VK-7 (Combo Organ)
	// [1998-10-21 (Ver.1.00)] Roland PK-7 (Pedal Keyboard)
	// [2000-02-01 (Ver.1.00)] Roland PK-25 (Pedal Keyboard)
	// [2005-10-20 (Ver.1.00)] Roland PK-7A (Pedal Keyboard)
	// [2005-10-20 (Ver.1.00)] Roland PK-25A (Pedal Keyboard)
	{
		modelName: 'VK-7',
		modelIdHex: '00 08', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1997-01-28 (Ver.1.00)] Roland RD-600 (Digital Piano)
	{
		modelName: 'RD-600',
		modelIdHex: '00 09', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1997-05-01 (Ver.1.00)] Roland TD-10 (Percussion Sound Module)
	{
		modelName: 'TD-10',
		modelIdHex: '00 0a', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [1997-10-30 (Ver.1.00)] Roland MC-505 (groovebox)
	// [1998-03-06 (Ver.1.00)] Roland JX-305 (groovesynth)
	// [1999-10-27 (Ver.1.00)] Roland MC-307 (groovebox)
	// [2001-03-08 (Ver.1.00)] Roland D2 (groovebox)
	{
		modelName: 'MC-505',
		modelIdHex: '00 0b', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1997-12-04 (Ver.1.00)] Roland SPD-20 (Total Percussion Pad)
	{
		modelName: 'SPD-20',
		modelIdHex: '00 0d', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1998-01-17 (Ver.1.00)] Roland VS-1680 (24-bit Digital Studio Workstation)
	// [1999-03-14 (Ver.2.00)] Roland VS-1680 V-XPANDED (24-bit Digital Studio Workstation)
	// [1999-11-23 (Ver.1.00)] Roland VS-1880 (24-bit Digital Studio Workstation)
	{
		modelName: 'VS-1680',
		modelIdHex: '00 0e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 (?:[0-4].|5[0-6]))',    // System Parameter
			'01 .. ..',                                 // Song Parameter
			'02 (?:0. ..|10 ..|11 (?:[0-2].|3[0-9a]))', // Mixer Parameter
			'03 .. ..',                                 // Locate Parameter
			'04 .. ..',                                 // Effect Parameter
			'0[89a-f] .. ..',                           // Sync Track Data
		],
	},
	{
		modelName: 'VS-1680 Ver.2',
		modelIdHex: '00 0e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 (?:[0-4].|5[0-9a-d]))', // System Parameter
			'01 .. ..',                                 // Song Parameter
			'02 (?:0. ..|10 ..|11 (?:[0-4].|5[0-9]))',  // Mixer Parameter
			'03 .. ..',                                 // Locate Parameter
			'04 .. ..',                                 // Effect Parameter
			'05 .. ..',                                 // Remote Operation
			'0[89a-f] .. ..',                           // Sync Track Data
		],
	},
	{
		modelName: 'VS-1880',
		modelIdHex: '00 0e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 (?:[0-5].|6[0-5]))',    // System Parameter
			'01 .. ..',                                 // Song Parameter
			'02 (?:0. ..|1[0-2] ..|13 [01].)',          // Mixer Parameter
			'03 .. ..',                                 // Locate Parameter
			'04 .. ..',                                 // Effect Parameter
			'05 .. ..',                                 // Remote Operation
			'0[89a-f] .. ..',                           // Sync Track Data
		],
	},
	// [1995-03-25 (Ver.1.00)] Roland SP-808 (groovesampler)
	{
		modelName: 'SP-808',
		modelIdHex: '00 0f', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [1999-12-18 (Ver.1.00)] Roland XV-3080 (128-Voice Sound Module)
	// [2000-02-15 (Ver.1.00)] Roland XV-88 (128-Voice Expandable Synthesizer)
	// [2000-05-20 (Ver.1.00)] Roland XV-5080 (128-Voice Sound Module)
	// [2001-07-31 (Ver.1.00)] Roland FA-76 (Fantom)
	// [2001-10-04 (Ver.1.00)] Roland XV-5050 (64-Voice Sound Module)
	// [2002-06-04 (Ver.1.00)] Roland XV-2020 (64-Voice Sound Module)
	// [2000-10-12 (Ver.1.00)] Roland RS-5/9 (64 Voice Synthesizer)
	// [2007-05-01 (Ver.1.00)] Roland SP-555 (Sampler)
	{
		modelName: 'XV-5080',
		modelIdHex: '00 10', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 (?:0[02]|[12].) ..',                                     // System
			'(?:10 00|20 [0-3].) 00 ..',                                    // Performance Common
			'(?:10 00|20 [0-3].) 0[23] ..',                                 // Performance Common MFX
			'(?:10 00|20 [0-3].) 04 ..',                                    // Performance Common Chorus
			'(?:10 00|20 [0-3].) 06 ..',                                    // Performance Common Reverb
			'(?:10 00|20 [0-3].) 1. ..',                                    // Performance MIDI
			'(?:10 00|20 [0-3].) [23]. (?:[01].|20)',                       // Performance Part
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 00 ..',                // Patch Common
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 0[23] ..',             // Patch Common MFX
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 04 ..',                // Patch Common Chorus
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 06 ..',                // Patch Common Reverb
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 10 ..',                // Patch TMT
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) 2[0-7] ..',            // Patch Tone
			'(?:1[0-7] [02468ace]0|18 [0246]0|30 ..) (?:3.|4[0-5]) ..',     // Patch Split Key
			'(?:1[0-7] [13579bdf]0|18 [1357]0|40 [0-3]0) 00 ..',            // Rhythm Common
			'(?:1[0-7] [13579bdf]0|18 [1357]0|40 [0-3]0) 0[23] ..',         // Rhythm Common MFX
			'(?:1[0-7] [13579bdf]0|18 [1357]0|40 [0-3]0) 04 ..',            // Rhythm Common Chorus
			'(?:1[0-7] [13579bdf]0|18 [1357]0|40 [0-3]0) 06 ..',            // Rhythm Common Reverb
			'(?:1[0-7] [13579bdf][01]|18 [1357][01]|40 [0-3][01]) .. ..',   // Rhythm Tone
		],
	},
	{
		modelName: 'XV-88',
		modelIdHex: '00 10', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 (?:0[02]|1.|40) ..',                                     // System
			'(?:10 00|20 [0-3].) 00 ..',                                    // Performance Common
			'(?:10 00|20 [0-3].) 0[23] ..',                                 // Performance Common MFX
			'(?:10 00|20 [0-3].) 04 ..',                                    // Performance Common Chorus
			'(?:10 00|20 [0-3].) 06 ..',                                    // Performance Common Reverb
			'(?:10 00|20 [0-3].) 1. ..',                                    // Performance MIDI
			'(?:10 00|20 [0-3].) 2. (?:[01].|20)',                          // Performance Part
			'(?:10 00|20 [0-3].) 40 0[0-9a-d]',                             // Performance Keyboard
			'(?:10 00|20 [0-3].) 50 0[0-9a-d]',                             // Performance Zone
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 00 ..',                // Patch Common
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 0[23] ..',             // Patch Common MFX
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 04 ..',                // Patch Common Chorus
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 06 ..',                // Patch Common Reverb
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 10 ..',                // Patch TMT
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 2[0-7] ..',            // Patch Tone
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 00 ..',            // Rhythm Common
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 0[23] ..',         // Rhythm Common MFX
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 04 ..',            // Rhythm Common Chorus
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 06 ..',            // Rhythm Common Reverb
			'(?:1[0-3] [02468ace][01]|14 [0246][01]|40 [0-3][01]) .. ..',   // Rhythm Tone
		],
	},
	{
		modelName: 'FA-76',
		modelIdHex: '00 10', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 ..',                                                  // Setup
			'02 00 (?:0[02]|40) ..',                                        // System
			'(?:10 00|20 [0-3].) 00 ..',                                    // Performance Common
			'(?:10 00|20 [0-3].) 0[23] ..',                                 // Performance Common MFX
			'(?:10 00|20 [0-3].) 04 ..',                                    // Performance Common Chorus
			'(?:10 00|20 [0-3].) 06 ..',                                    // Performance Common Reverb
			'(?:10 00|20 [0-3].) 1. ..',                                    // Performance MIDI
			'(?:10 00|20 [0-3].) 2. (?:[0-2].|30)',                         // Performance Part
			'(?:10 00|20 [0-3].) 50 (?:0.|1[0-3])',                         // Performance Zone
			'(?:10 00|20 [0-3].) 60 ..',                                    // Performance Controller
			'(?:19 00|50 0.) [0-2]. ..',                                    // Multitimbre
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 00 ..',                // Patch Common
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 0[23] ..',             // Patch Common MFX
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 04 ..',                // Patch Common Chorus
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 06 ..',                // Patch Common Reverb
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 10 ..',                // Patch TMT
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 2[0-7] ..',            // Patch Tone
			'(?:1[0-3] [02468ace]0|14 [0246]0|30 ..) 60 ..',                // Patch Controller
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 00 ..',            // Rhythm Common
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 0[23] ..',         // Rhythm Common MFX
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 04 ..',            // Rhythm Common Chorus
			'(?:1[0-3] [02468ace]0|14 [0246]0|40 [0-3]0) 06 ..',            // Rhythm Common Reverb
			'(?:1[0-3] [02468ace][01]|14 [0246][01]|40 [0-3][01]) .. ..',   // Rhythm Tone
			'(?:1[0-3] [02468ace]1|14 [0246]1|40 [0-3]1) 40 ..',            // Rhythm Controller
		],
	},
	{
		modelName: 'XV-5080 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '(?:06 [4-7].|07 [0-3].) .. ..',
	},
	{
		modelName: 'FA-76 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '0.', commands: [0x12], addrLen: 4,
		address: '0a 0[01] .. ..',
	},
	{
		modelName: 'XV-5050 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '(?:02 [4-7].|03 ..) .. ..',
	},
	{
		modelName: 'RS-5/9 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '06 [4-7]. .. ..', // Overlapped with XV-5080
	},
	{
		modelName: 'RS-70/50 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '(?:05 1.|06 [0-3].) .. ..',
	},
	{
		modelName: 'SP-555 Firmware',
		modelIdHex: '00 10', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
		address: '00 .. .. ..',
	},
	// [1998-??-?? (Ver.?.??)] Roland UA-100 (Audio & MIDI Processing Unit)
	// [1999-09-?? (Ver.1.00)] Roland ED UA-100G (Audio & MIDI Processing Unit)
	{
		modelName: 'UA-100',
		modelIdHex: '00 11', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [1998-11-26 (Ver.1.00)] Roland SRV-3030/3030D (24bit Digital Reverb)
	{
		modelName: 'SRV-3030',
		modelIdHex: '00 12', deviceIdReStr: '(?:[0-6].|7[0-9a-e])', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1998-06-01 (Ver.1.00)] Boss DR-202 (Dr. Groove)
	{
		modelName: 'DR-202',
		modelIdHex: '00 13', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1998-06-03 (Ver.1.00)] Roland VS-880EX (Digital Studio Workstation)
	// [1999-11-23 (Ver.1.00)] Roland VSR-880 (24-bit Digital Studio Recorder)
	// [2000-03-09 (Ver.1.00)] Roland VS-890 (24-bit Digital Studio Workstation)
	{
		modelName: 'VS-880EX',
		modelIdHex: '00 14', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 (?:[0-4].|5[0-7]))',                // System Parameter
			'01 (?:0. ..|1[0-9a-e].|1f (?:[0-2].|3[0-7]))',         // Song Parameter
			'02 (?:0[0-5] ..|06 (?:0.|1[0-4]))',                    // Mixer Parameter
			'03 (?:00 [0-2].|01 0[0-4])',                           // Locate Parameter
			'04 .. ..',                                             // Effect Parameter
			'05 .. ..',                                             // Remote Operation
			'0[89a-f] .. ..',                                       // Sync Track Data
			'1[0-2] .. ..',                                         // Disk Access
		],
	},
	{
		modelName: 'VSR-880',
		modelIdHex: '00 14', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 [0-5].)',                           // System Parameter
			'01 (?:[0-4]. ..|5[0-9a-c].|5d (?:[0-6].|7[0-9ab]))',   // Song Parameter
			'02 (?:0[0-5] ..|06 (?:0.|1[0-7]))',                    // Mixer Parameter
			'03 (?:00 [0-2].|01 0[0-5])',                           // Locate Parameter
			'04 .. ..',                                             // Effect Parameter
			'05 .. ..',                                             // Remote Operation
			'0[89a-f] .. ..',                                       // Sync Track Data
			'1[0-2] .. ..',                                         // Disk Access
		],
	},
	{
		modelName: 'VS-890',
		modelIdHex: '00 14', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'00 (?:0[0-5] ..|06 (?:[0-4].|5[0-9a-e]))',             // System Parameter
			'01 (?:[0-4]. ..|5[0-9a-c].|5d (?:[0-6].|7[0-9ab]))',   // Song Parameter
			'02 (?:0[0-5] ..|06 (?:0.|1[0-7]))',                    // Mixer Parameter
			'03 (?:00 [0-2].|01 0[0-5])',                           // Locate Parameter
			'04 .. ..',                                             // Effect Parameter
			'05 .. ..',                                             // Remote Operation
			'0[89a-f] .. ..',                                       // Sync Track Data
			'1[0-2] .. ..',                                         // Disk Access
		],
	},
	// [1999-03-08 (Ver.1.00)] Roland VM-3100/3100Pro (V-Mixing Station)
	{
		modelName: 'VM-3100',
		modelIdHex: '00 15', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1998-10-?? (Ver.1.00)] Roland EG-101 (groovekeyboard)
	{
		modelName: 'EG-101',
		modelIdHex: '00 18', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1998-11-?? (Ver.1.00)] Roland EM-50/30 (Creative Keyboard)
	{
		modelName: 'EM-50/30',
		modelIdHex: '00 19', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1998-09-21 (Ver.1.00)] Roland VK-77 (Combo Organ)
	{
		modelName: 'VK-77',
		modelIdHex: '00 1a', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1998-11-12 (Ver.1.00)] Boss GT-3 (Guitar Effects Processor)
	{
		modelName: 'GT-3',
		modelIdHex: '00 1b', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1999-01-11 (Ver.1.00)] Boss DR-770 (Dr. Rhythm)
	{
		modelName: 'DR-770',
		modelIdHex: '00 1c', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1999-09-21 (Ver.1.00)] Roland VP-9000 (VariPhrase Processor)
	// [2002-12-01 (Ver.1.00)] Roland VariOS (Open System Module)
	{
		modelName: 'VP-9000',
		modelIdHex: '00 1d', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1999-06-25 (Ver.1.00)] Roland VM-7200/7100 (V-Mixing Station)
	// [1999-07-16 (Ver.1.00)] Roland VM-C7200/C7100 (Digital Mixing Controller)
	{
		modelName: 'VM-7200/7100',
		modelIdHex: '00 1e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: '00 [0-5]. ..',
	},
	{
		modelName: 'VM-C7200/C7100',
		modelIdHex: '00 1e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'0[01] [0-5]. ..',  // Unit 1/2 Block
			'02 0[01] ..',      // System/Project Block
		],
	},
	// [1999-07-28 (Ver.1.00)] Roland TD-8 (Percussion Sound Module)
	{
		modelName: 'TD-8',
		modelIdHex: '00 20', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [????-??-?? (Ver.?.??)] Roland ED U-8 (USB Digital Studio)
	// [????-??-?? (Ver.?.??)] Roland ED U-8 ST (USB Digital Studio)
	{
		modelName: 'U-8',
		modelIdHex: '00 21', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [1999-08-31 (Ver.1.00)] Boss VF-1 (24-bit Multiple Effects Processor)
	{
		modelName: 'VF-1',
		modelIdHex: '00 23', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2000-03-01 (Ver.1.01)] Roland VG-88 (V-Guitar System)
	// [2002-10-01 (Ver.2.00)] Roland VG-88 (V-Guitar System)
	{
		modelName: 'VG-88',
		modelIdHex: '00 27', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [1999-11-23 (Ver.1.00)] Roland VSR-880 (24-bit Digital Studio Recorder)
	{
		modelName: 'VSR-880',
		modelIdHex: '00 29', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1999-11-23 (Ver.1.00)] Roland VS-1880 (24-bit Digital Studio Workstation)
	// [2001-08-01 (Ver.1.00)] Roland VS-1824/1824CD (24-bit Digital Studio Workstation)
	{
		modelName: 'VS-1880',
		modelIdHex: '00 2a', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [1999-12-25 (Ver.1.00)] Roland SP-808EX (e-MIX STUDIO)
	{
		modelName: 'SP-808EX',
		modelIdHex: '00 2b', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2001-01-?? (Ver.1.00)] Roland VA-76 (V-Arranger Keyboard)
	{
		modelName: 'VA-76',
		modelIdHex: '00 2c', deviceIdReStr: '1.', commands: [0x12], addrLen: 4,
	},
	// [2000-03-23 (Ver.1.00)] Roland HPD-15 (HandSonic)
	{
		modelName: 'HPD-15',
		modelIdHex: '00 2e', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2000-03-09 (Ver.1.00)] Roland VS-890 (24-bit Digital Studio Workstation)
	{
		modelName: 'VS-890',
		modelIdHex: '00 2f', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2000-07-20 (Ver.1.01)] Roland GR-33 (Guitar Synthesizer)
	{
		modelName: 'GR-33',
		modelIdHex: '00 30', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2000-06-07 (Ver.1.00)] Roland SRQ-2031 (Digital Graphic Equalizer)
	// [2003-10-22 (Ver.1.00)] Roland RDQ-2031 (Digital Graphic Equalizer)
	{
		modelName: 'SRQ-2031',
		modelIdHex: '00 31', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'0. .. ..',             // User Memory
			'10 .. ..',             // Temporary Parameters
			'11 00 (?:0.|1[0-2])',  // System Parameters
			'12 .. ..',             // Memory Save Request
		],
	},
	{
		modelName: 'RDQ-2031',
		modelIdHex: '00 31', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'0. .. ..',             // User Memory
			'10 .. ..',             // Temporary Parameters
			'11 00 (?:0.|1[0-3])',  // System Parameters
			'12 .. ..',             // Memory Save Request
		],
	},
	// [2000-06-07 (Ver.1.00)] Roland SRQ-4015 (Digital Graphic Equalizer)
	// [2004-06-04 (Ver.1.00)] Roland RDQ-4015 (Digital Graphic Equalizer)
	{
		modelName: 'SRQ-4015',
		modelIdHex: '00 31', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'0. .. ..',             // User Memory
			'10 .. ..',             // Temporary Parameters
			'11 00 (?:0.|1[0-2])',  // System Parameters
			'12 .. ..',             // Memory Save Request
		],
	},
	{
		modelName: 'RDQ-4015',
		modelIdHex: '00 31', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
		address: [
			'0. .. ..',             // User Memory
			'10 .. ..',             // Temporary Parameters
			'11 00 (?:0.|1[0-3])',  // System Parameters
			'12 .. ..',             // Memory Save Request
		],
	},
	// [2000-07-26 (Ver.1.00)] Roland EF-303 (Groove Effects)
	{
		modelName: 'EF-303',
		modelIdHex: '00 33', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2000-08-01 (Ver.1.00)] Roland VGA-7 (V-Guitar Amplifier)
	{
		modelName: 'VGA-7',
		modelIdHex: '00 34', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2000-04-05 (Ver.1.00)] Boss JS-5 (Jam Station)
	{
		modelName: 'JS-5',
		modelIdHex: '00 35', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2000-07-28 (Ver.1.0.0)] Roland VE-7000 (CH Edit Controller)
	// [2001-06-29 (Ver.1.01)] Roland VS-2480/2480CD (24Tr/24-bit/96kHz Digital Studio Workstation)
	{
		modelName: 'VE-7000',
		modelIdHex: '00 36', deviceIdReStr: '7f', commands: [0x12], addrLen: 3,
	},
	// [2000-11-01 (Ver.1.00)] Roland AR-3000 (Audio Recorder)
	// [2006-05-05 (Ver.1.00)] Roland AR-3000R (Audio Recorder)
	// [2014-05-30 (Ver.1.00)] Roland AR-3000SD (Audio Recorder)
	{
		modelName: 'AR-3000',
		modelIdHex: '00 37', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2000-11-01 (Ver.1.00)] Roland AR-200 (Audio Recorder)
	// [2006-05-05 (Ver.1.00)] Roland AR-200R (Audio Recorder)
	{
		modelName: 'AR-200',
		modelIdHex: '00 38', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2001-08-10 (Ver.1.00)] Boss SP-505 (Groove Sampling Workstation)
	{
		modelName: 'SP-505',
		modelIdHex: '00 39', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2000-10-01 (Ver.1.00)] Roland FP-3 (Digital Piano)
	{
		modelName: 'FP-3',
		modelIdHex: '00 3a', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2001-04-16 (Ver.1.01)] Roland CDX-1 (Multitrack CD Recorder / Audio Sample Workstation)
	{
		modelName: 'CDX-1',
		modelIdHex: '00 3b', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2000-10-12 (Ver.1.00)] Roland RS-5/9 (64 Voice Synthesizer)
	{
		modelName: 'RS-5/9',
		modelIdHex: '00 3c', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2001-02-13 (Ver.1.00)] Roland TD-6 (Percussion Sound Module)
	// [2003-10-24 (Ver.1.00)] Roland TD-6V (Percussion Sound Module)
	{
		modelName: 'TD-6',
		modelIdHex: '00 3f', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2001-06-29 (Ver.1.01)] Roland VS-2480/2480CD (Digital Studio Workstation)
	{
		modelName: 'VS-2480',
		modelIdHex: '00 40', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2001-05-18 (Ver.1.00)] Boss DR-670 (Dr. Rhythm)
	{
		modelName: 'DR-670',
		modelIdHex: '00 41', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 5,
	},
	// [2001-05-01 (Ver.1.01)] Roland RD-700 (Digital Piano)
	{
		modelName: 'RD-700',
		modelIdHex: '00 43', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2009-??-?? (Ver.?.??)] Roland DT-HD1 (HD-1 Drum Tutor)
	{
		modelName: 'DT-HD1',
		modelIdHex: '00 45', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [2001-04-10 (Ver.1.00)] Boss GT-6 (Guitar Effects Processor)
	{
		modelName: 'GT-6',
		modelIdHex: '00 46', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-01-?? (Ver.1.00)] Rodgers 537 (insignia)
	// [2007-05-?? (Ver.1.00)] Rodgers 538/i548 (insignia)
	{
		modelName: '537',
		modelIdHex: '00 47', deviceIdReStr: '[01].', commands: [0x12], addrLen: 2,
	},
	// [2001-09-18 (Ver.1.00)] Roland SD-90 (Studio Canvas)
	// [2002-05-01 (Ver.1.00)] Roland SD-80 (Studio Canvas)
	{
		modelName: 'SD-90',
		modelIdHex: '00 48', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	{
		modelName: 'SD-90 Firmware',
		modelIdHex: '00 48', deviceIdReStr: '0.', commands: [0x12], addrLen: 4,
		address: '0a .. .. ..',
	},
	// [2001-08-09 (Ver.1.00)] Edirol UM-880 (USB MIDI Interface / MIDI Patcher)
	{
		modelName: 'UM-880',
		modelIdHex: '00 49', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 2,
	},
	// [2001-10-30 (Ver.1.00)] Roland SH-32 (Synthesizer)
	{
		modelName: 'SH-32',
		modelIdHex: '00 4a', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-01-01 (Ver.1.50)] Edirol HQ-GM2 (Hyper Canvas)
	{
		modelName: 'HQ-GM2',
		modelIdHex: '00 4c', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2002-02-01 (Ver.1.00)] Roland VK-8 (Combo Organ)
	// [2002-12-01 (Ver.1.00)] Roland VK-8M (Organ Module)
	// [2003-04-01 (Ver.2.00)] Roland VK-8 (Combo Organ)
	{
		modelName: 'VK-8',
		modelIdHex: '00 4d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 0[0-7]',                      // System Common
			'00 00 01 0[0-9]',                      // System MIDI
			'00 00 02 0[0-9]',                      // System Organ
			'00 00 03 (?:0.|10)',                   // System FX
			'(?:10 00|20 [0-3].) 00 0[0-9a-c]',     // Preset Common
			'(?:10 00|20 [0-3].) 10 (?:0.|1[0-9])', // Preset Organ
			'(?:10 00|20 [0-3].) 20 0[0-9a-e]',     // Preset FX
		],
	},
	{
		modelName: 'VK-8M',
		modelIdHex: '00 4d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 0[0-9]',                                  // System Common
			'00 00 01 0[0-9a]',                                 // System MIDI
			'00 00 02 0[0-9]',                                  // System Organ
			'00 00 03 (?:0.|1[01])',                            // System FX
			'(?:10 00|20 [0-2][0-589a-d]) 00 0[0-9a-e]',        // Registration Common
			'(?:10 00|20 [0-2][0-589a-d]) 10 (?:0.|1[0-9])',    // Registration Organ
			'(?:10 00|20 [0-2][0-589a-d]) 20 0[0-9a-e]',        // Registration FX
		],
	},
	// [2002-01-15 (Ver.1.00)] Roland MMP-2 (Mic Modeling Preamp)
	{
		modelName: 'MMP-2',
		modelIdHex: '00 4e', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2002-03-28 (Ver.1.00)] Roland MC-09 (Phrase Lab)
	{
		modelName: 'MC-09',
		modelIdHex: '00 4f', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2001-12-10 (Ver.1.00)] Boss GT-6B (Bass Effects Processor)
	{
		modelName: 'GT-6B',
		modelIdHex: '00 50', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-03-25 (Ver.2.00)] Roland DV-7PR (Realtime Video Presenter)
	// [2002-10-02 (Ver.1.00)] Roland VS-2400CD (Digital Studio Workstation)
	// [2002-11-01 (Ver.1.00)] Edirol PCR-30/50/80 (MIDI Keyboard Controller)
	// [2002-12-13 (Ver.1.00)] Edirol V-4 (4-Channel Video Mixer)
	// [2003-05-01 (Ver.1.00)] Edirol UR-80 (USB Recording )
	// [2003-09-29 (Ver.1.00)] Roland MV-8000 (Production Studio)
	// [2003-10-01 (Ver.1.00)] Edirol PCR-A30 (USB Audio Interface / MIDI Keyboard Controller)
	// [2003-10-31 (Ver.1.00)] Roland VS-2000CD (Digital Studio Workstation)
	// [2003-12-10 (Ver.1.00)] Edirol V-1 (4-Channel Video Mixer)
	// [2004-01-28 (Ver.1.00)] Edirol P-1 (Photo Presenter)
	// [2004-04-07 (Ver.1.00)] Edirol PR-50 (Realtime Video Presenter)
	// [2004-09-01 (Ver.1.00)] Edirol PCR-M1 (MIDI Keyboard Controller)
	// [2004-11-01 (Ver.1.00)] Edirol PCR-M30/M50/M80 (MIDI Keyboard Controller)
	// [2004-11-12 (Ver.4.0.0)] Edirol PR-80 (Realtime Video Presenter)
	// [2005-05-01 (Ver.1.00)] Edirol CG-8 (Visual Synthesizer)
	// [2005-10-10 (Ver.1.00)] Edirol V-440HD (Multi-Format Video Switcher)
	// [2006-08-22 (Ver.2.00)] Edirol V-440HD (Multi-Format Video Switcher)
	// [2006-10-10 (Ver.1.00)] Edirol V-44SW (Multi-Format Video Switcher)
	// [2007-05-05 (Ver.1.00)] Edirol PR-1000HD (Realtime Video Presenter)
	// [2007-05-31 (Ver.1.00)] Roland VG-99 (V-Guitar System)
	// [2008-04-01 (Ver.1.00)] Edirol P-10 (Visual Sampler)
	// [2008-07-02 (Ver.1.00)] Roland VB-99 (V-Bass System)
	// [2009-??-?? (Ver.?.??)] Roland VS-700C (V-STUDIO Console)
	// [2009-??-?? (Ver.?.??)] Roland VS-100 (SONAR V-STUDIO 100)
	// [2010-01-01 (Ver.1.00)] Roland SPD-30 (OCTAPAD)
	// [2010-06-14 (Ver.1.00)] Edirol V-1600HD (Multi-Format Video Switcher)
	// [2011-11-?? (Ver.1.00)] Roland BK-5 (Backing Keyboard)
	// [2011-11-01 (Ver.1.04)] Roland VR-5 (AV Mixer & Recorder)
	// [2011-12-10 (Ver.1.00)] Roland VR-3 (AV Mixer)
	// [2012-01-01 (Ver.1.00)] Roland TD-30 (Drum Sound Module)
	// [2012-??-?? (Ver.?.??)] Roland V-40HD (Multi-Format Video Switcher)
	// [2012-??-?? (Ver.?.??)] Roland V-800HD (Multi-Format Video Switcher)
	// [2008-01-10 (Ver.1.00)] Edirol V-8 (8-Channel Video Mixer)
	// [2013-03-01 (Ver.1.000)] Roland V-4EX (4-Channel Video Mixer)
	// [2013-03-22 (Ver.1.01)] Roland M-300 (Live Mixing Console)
	// [2013-03-22 (Ver.1.04)] Roland M-380 (Mixing Console)
	// [2013-03-22 (Ver.1.04)] Roland M-400 (Live Mixing Console)
	// [2013-03-22 (Ver.1.01)] Roland M-480 (Live Mixing Console)
	// [2013-08-01 (Ver.1.00)] Roland HPD-20 (HandSonic)
	// [2013-??-?? (Ver.?.??)] Roland VR-50HD (Multi-Format AV Mixer)
	// [2014-02-10 (Ver.1.00)] Roland VR-3EX (AV Mixer)
	// [2015-10-01 (Ver.1.00)] Roland MD-P1 (motion dive .tokyo console)
	// [2015-11-20 (Ver.1.00)] Roland V-1HD (HD Video Switcher)
	// [2017-??-?? (Ver.?.??)] Roland V-800HD MKII (Multi-Format Video Switcher)
	// [2017-09-01 (Ver.1.11)] Roland VR-09/730 (V-Combo)
	{
		modelName: 'V-LINK',
		modelIdHex: '00 51', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 3,
	},
	// [2002-02-01 (Ver.1.00)] Roland V-Bass (V-Bass System)
	{
		modelName: 'V-Bass',
		modelIdHex: '00 52', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2002-10-20 (Ver.1.00)] Roland V-Synth (Synthesizer Keyboard)
	// [2005-03-01 (Ver.1.01)] Roland V-Synth Version 2.0 (Synthesizer Keyboard)
	// [2005-03-24 (Ver.1.02)] Roland V-Synth XT (Synthesizer)
	{
		modelName: 'V-Synth',
		modelIdHex: '00 53', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 .. ..',                              // Setup
			'02 00 [04]. ..',                           // System
			'(?:10 0.|20 ..) 0[023468] ..',             // Patch Common (and so on)
			'(?:10 0.|20 ..) 1. (?:[0-6].|7[0-8])',     // Patch Oscillator
			'(?:10 0.|20 ..) [23]. ..',                 // Patch Envelope
			'(?:10 0.|20 ..) 4. ..',                    // Patch LFO
			'(?:10 0.|20 ..) [56]. ..',                 // Patch COSM
			'(?:10 0.|20 ..) 7. ..',                    // Patch Arpeggio
		],
	},
	{
		modelName: 'V-Synth XT',
		modelIdHex: '00 53', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 .. ..',                              // Setup
			'02 00 [045]. ..',                          // System
			'(?:10 0.|20 ..) 0[0234689a] ..',           // Patch Common and so on
			'(?:10 0.|20 ..) 1. (?:[0-6].|7[0-9a-e])',  // Patch Oscillator
			'(?:10 0.|20 ..) [23]. ..',                 // Patch Envelope
			'(?:10 0.|20 ..) 4. ..',                    // Patch LFO
			'(?:10 0.|20 ..) [56]. ..',                 // Patch COSM
			'(?:10 0.|20 ..) 7. ..',                    // Patch Arpeggio
		],
	},
	// [2001-08-09 (Ver.1.00)] Edirol UM-550 (USB MIDI Interface/MIDI Patcher)
	{
		modelName: 'UM-550',
		modelIdHex: '00 54', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 2,
	},
	// [2002-02-08 (Ver.1.00)] Boss BR-1180/1180CD (Digital Recording Studio)
	{
		modelName: 'BR-1180',
		modelIdHex: '00 55', deviceIdReStr: '1.', commands: [], addrLen: 0,
	},
	{
		modelName: 'BR-1180 Firmware',
		modelIdHex: '00 55', deviceIdReStr: '0.', commands: [0x12], addrLen: 4,
	},
	// [2003-03-10 (Ver.1.00)] Roland SI-24 (Studio Interface)
	{
		modelName: 'SI-24',
		modelIdHex: '00 57', deviceIdReStr: '00', commands: [], addrLen: 0,
	},
	// 2002-06-01 (Ver.1.00)] Edirol UA-700 (USB Audio Interface)
	{
		modelName: 'UA-700',
		modelIdHex: '00 58', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2002-09-20 (Ver.1.00)] Roland MC-909 (sampling groovebox)
	{
		modelName: 'MC-909',
		modelIdHex: '00 59', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2002-12-13 (Ver.1.00)] Edirol V-4 (4-Channel Video Mixer)
	{
		modelName: 'V-4',
		modelIdHex: '00 5b', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2002-10-28 (Ver.1.00)] Roland RDL-2040 (Multi CH Delay Line)
	// [2006-04-28 (Ver.1.00)] Roland DL-2040 (Multi CH Delay Line)
	{
		modelName: 'RDL-2040',
		modelIdHex: '00 5e', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2002-11-01 (Ver.1.00)] Roland VR-760 (Combo Keyboard)
	{
		modelName: 'VR-760',
		modelIdHex: '00 5f', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2002-09-18 (Ver.1.00)] Roland FP-5 (Digital Piano)
	{
		modelName: 'FP-5',
		modelIdHex: '00 60', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2002-10-02 (Ver.1.00)] Roland VS-2400CD (Digital Studio Workstation)
	{
		modelName: 'VS-2400CD',
		modelIdHex: '00 61', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2002-11-01 (Ver.1.00)] Edirol PCR-30/50/80 (MIDI Keyboard Controller)
	// [2003-10-01 (Ver.1.00)] Edirol PCR-A30 (USB Audio Interface / MIDI Keyboard Controller)
	// [2004-01-01 (Ver.1.00)] Edirol PCR-1 (USB Audio Interface / MIDI Keyboard Controller)
	// [2004-09-01 (Ver.1.00)] Edirol PCR-M1 (MIDI Keyboard Controller)
	// [2004-11-01 (Ver.1.00)] Edirol PCR-M30/M50/M80 (MIDI Keyboard Controller)
	{
		modelName: 'PCR-30/50/80',
		modelIdHex: '00 62', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2003-07-15 (Ver.1.00)] Boss GS-10 (Guitar Effects System with USB Audio Interface)
	{
		modelName: 'GS-10',
		modelIdHex: '00 63', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-04-01 (Ver.1.00)] Roland RS-70/50 (Synthesizer)
	// [2004-04-01 (Ver.1.00)] Roland JUNO-D (Synthesizer)
	{
		modelName: 'RS-70/50',
		modelIdHex: '00 64', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-03-01 (Ver.1.00)] Roland VK-88 (Combo Organ)
	{
		modelName: 'VK-88',
		modelIdHex: '00 65', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-02-14 (Ver.1.00)] Roland SPD-S (Sampling Pad)
	{
		modelName: 'SPD-S',
		modelIdHex: '00 67', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-05-01 (Ver.1.00)] Edirol UR-80 (USB Recording System)
	{
		modelName: 'UR-80',
		modelIdHex: '00 68', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2007-??-?? (Ver.?.??)] Edirol M-16DX (16 Channel Digital Mixer)
	// [2009-??-?? (Ver.?.??)] Roland VS-100 (SONAR V-STUDIO 100)
	// [2011-??-?? (Ver.?.??)] Roland UA-55 (QUAD-CAPTURE)
	{
		modelName: 'Firmware',
		modelIdHex: '00 69', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2002-12-26 (Ver.1.00)] Roland GI-20 (GK-MIDI Interface)
	{
		modelName: 'GI-20',
		modelIdHex: '00 6a', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2003-02-06 (Ver.1.00)] Roland Fantom-S/S88 (Synthesizer)
	// [2004-02-02 (Ver.1.00)] Roland Fantom-X6/X7/X8 (Synthesizer)
	// [2004-03-03 (Ver.1.00)] Roland Fantom-XR (128-Voice Synthesizer / Sampler Module)
	// [2004-08-01 (Ver.1.00)] Roland Fantom-Xa (Synthesizer)
	{
		modelName: 'Fantom-S/S88',
		modelIdHex: '00 6b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 (?:[01].|2[0-9a-e])', // Setup
			'02 00 .. ..',                  // System
			'10 00 [0-5]. ..',              // Temporary Performance (other than Controller)
			'10 00 60 (?:[0-4].|5[0-5])',   // Temporary Performance Controller
			'1[1-4f] .. .. ..',             // Temporary Patch/Rhythm
			'1e .. .. ..',                  // Temporary Rhythm Pattern/Arpeggio/Chord/Rhythm Group
		],
	},
	{
		modelName: 'Fantom-X6/X7/X8',
		modelIdHex: '00 6b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 (?:[0-2].|3[0-3])',   // Setup
			'02 00 .. ..',                  // System
			'10 00 [0-5]. ..',              // Temporary Performance (other than Controller)
			'10 00 60 (?:[0-4].|5[0-7])',   // Temporary Performance Controller
			'1[1-4f] .. .. ..',             // Temporary Patch/Rhythm
			'1e .. .. ..',                  // Temporary Rhythm Pattern/Arpeggio/Chord/Rhythm Group
		],
	},
	// Minus-One (Not a model name)
	{
		modelName: 'Minus-One',
		modelIdHex: '00 6c', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2003-??-?? (Ver.?.??)] Roland VariOS 8
	// [2003-??-?? (Ver.?.??)] Roland VariOS 303
	{
		modelName: 'VariOS 8',
		modelIdHex: '00 6d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
		address: '(?:10 00|20 ..) 0[0-2] ..',   // Patch
	},
	{
		modelName: 'VariOS 303',
		modelIdHex: '00 6d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
		address: '(?:10 00|20 ..) 1[0-8] ..',   // Patch
	},
	{
		modelName: 'VariOS 8/303',
		modelIdHex: '00 6d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-03-30 (Ver.1.00)] Roland SP-606 (Sampling Workstation)
	{
		modelName: 'SP-606',
		modelIdHex: '00 6e', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2003-09-01 (Ver.1.00)] Roland FP-2 (Digital Piano)
	{
		modelName: 'FP-2',
		modelIdHex: '00 6f', deviceIdReStr: '(?:1.|7f)', commands: [0x12], addrLen: 4,
	},
	// [2003-12-10 (Ver.1.00)] Edirol V-1 (4-Channel Video Mixer)
	{
		modelName: 'V-1',
		modelIdHex: '00 6f', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [2003-10-31 (Ver.1.00)] Roland VS-2000CD (Digital Studio Workstation)
	{
		modelName: 'VS-2000CD',
		modelIdHex: '00 70', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2003-12-18 (Ver.1.00)] Roland GR-20 (Guitar Synthesizer)
	{
		modelName: 'GR-20',
		modelIdHex: '00 72', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-01-15 (Ver.1.00)] Roland TD-3 (Percussion Sound Module)
	{
		modelName: 'TD-3',
		modelIdHex: '00 76', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-01-15 (Ver.1.00)] Roland TD-20 (Percussion Sound Module)
	{
		modelName: 'TD-20',
		modelIdHex: '00 7a', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 4,
	},
	// [2004-01-28 (Ver.1.00)] Edirol P-1 (Photo Presenter)
	{
		modelName: 'P-1',
		modelIdHex: '00 7b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2004-??-?? (Ver.?.??)] Roland FR-7/5 (V-Accordion)
	// [2006-06-?? (Ver.1.00)] Roland FR-7/5 Ver.2 (V-Accordion)
	// [2006-06-?? (Ver.1.00)] Roland FR-3/3b/3s/3sb (V-Accordion)
	{
		modelName: 'FR-7/5',
		modelIdHex: '00 7c', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2004-03-01 (Ver.1.00)] Roland HP107 (Digital Piano)
	{
		modelName: 'HP107',
		modelIdHex: '00 7e', deviceIdReStr: '10', commands: [0x12], addrLen: 3,
	},
	// [2004-04-07 (Ver.1.00)] Edirol PR-50 (Realtime Video Presenter)
	{
		modelName: 'PR-50',
		modelIdHex: '00 00 01', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 3,
	},
	// [2004-08-11 (Ver.1.00)] Boss DR-880 (Dr. Rhythm)
	{
		modelName: 'DR-880',
		modelIdHex: '00 00 02', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-11-01 (Ver.1.00)] Roland RD-700SX (Digital Piano)
	{
		modelName: 'RD-700SX',
		modelIdHex: '00 00 03', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-10-20 (Ver.1.00)] Roland RD-300SX (Digital Piano)
	{
		modelName: 'RD-300SX',
		modelIdHex: '00 00 04', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-11-12 (Ver.4.0.0)] Edirol PR-80 (Realtime Video Presenter)
	{
		modelName: 'PR-80',
		modelIdHex: '00 00 05', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2004-10-12 (Ver.1.00)] Boss GT-8 (Guitar Effects Processor)
	{
		modelName: 'GT-8',
		modelIdHex: '00 00 06', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2004-11-24 (Ver.1.00)] Roland GW-7 (Workstation)
	{
		modelName: 'GW-7',
		modelIdHex: '00 00 07', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2006-05-?? (Ver.1.00)] Roland E-80 (Music Workstation)
	// [2009-06-?? (Ver.1.00)] Roland JM-8 (VIMA)
	// [2011-07-?? (Ver.1.00)] Roland JM-5 (VIMA)
	{
		modelName: 'E-80',
		modelIdHex: '00 00 08', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2004-12-17 (Ver.1.00)] Roland TD-12 (Percussion Sound Module)
	{
		modelName: 'TD-12',
		modelIdHex: '00 00 09', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 4,
	},
	// [2004-02-14 (Ver.1.00)] Boss GT-PRO (Guitar Effects Processor)
	{
		modelName: 'GT-PRO',
		modelIdHex: '00 00 0b', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2005-03-01 (Ver.1.00)] Roland VC-2 (Vocal Designer)
	{
		modelName: 'VC-2',
		modelIdHex: '00 00 0d', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2005-05-01 (Ver.1.00)] Edirol CG-8 (Visual Synthesizer)
	{
		modelName: 'CG-8',
		modelIdHex: '00 00 0e', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2005-10-10 (Ver.1.00)] Edirol V-440HD (Multi-Format Video Mixer)
	// [2006-08-22 (Ver.2.00)] Edirol V-440HD (Multi-Format Video Mixer)
	// [2006-10-10 (Ver.1.00)] Edirol V-44SW (Multi-Format Video Switcher)
	{
		modelName: 'V-440HD',
		modelIdHex: '00 00 10', deviceIdReStr: '[01].', commands: [0x12], addrLen: 3,
	},
	// [2006-12-14 (Ver.1.00)] Roland MC-808 (sampling groovebox)
	{
		modelName: 'MC-808',
		modelIdHex: '00 00 14', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2006-02-01 (Ver.1.00)] Roland JUNO-G (128 Voice Expandable Synthesizer with Audio/MIDI Song Recorder)
	{
		modelName: 'JUNO-G',
		modelIdHex: '00 00 15', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2006-03-01 (Ver.1.00)] Roland SH-201 (Synthesizer)
	{
		modelName: 'SH-201',
		modelIdHex: '00 00 16', deviceIdReStr: '(?:1[0-7]|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2005-09-30 (Ver.1.00)] Roland E-09 (Interactive Arranger)
	{
		modelName: 'E-09',
		modelIdHex: '00 00 17', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2005-09-30 (Ver.1.00)] Roland VP-550 (Vocal & Ensemble Keyboard)
	{
		modelName: 'VP-550',
		modelIdHex: '00 00 18', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2006-02-01 (Ver.1.00)] Roland HPD-10 (HandSonic)
	{
		modelName: 'HPD-10',
		modelIdHex: '00 00 19', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 4,
	},
	// [2007-01-01 (Ver.1.00)] Edirol PCR-300/500/800 (MIDI Keyboard Controller)
	{
		modelName: 'PCR-300/500/800',
		modelIdHex: '00 00 1a', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2006-10-01 (Ver.1.00)] Roland FP-4 (Digital Piano)
	{
		modelName: 'FP-4',
		modelIdHex: '00 00 1b', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2007-05-31 (Ver.1.00)] Roland VG-99 (V-Guitar System)
	{
		modelName: 'VG-99',
		modelIdHex: '00 00 1c', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2008-07-02 (Ver.1.00)] Roland VB-99 (V-Bass System)
	{
		modelName: 'VB-99',
		modelIdHex: '00 00 1d', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2007-04-01 (Ver.1.00)] Roland FC-300 (MIDI Foot Controller)
	{
		modelName: 'FC-300',
		modelIdHex: '00 00 1e', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [2007-04-01 (Ver.1.00)] Roland Foot Controller
	{
		modelName: 'Foot Controller',
		modelIdHex: '00 00 20', deviceIdReStr: '0.', commands: [0x11, 0x12], addrLen: 2,
	},
	// [2007-04-01 (Ver.1.00)] Roland V-Synth GT (Synthesizer Keyboard)
	{
		modelName: 'V-Synth GT',
		modelIdHex: '00 00 21', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2007-05-05 (Ver.1.00)] Edirol PR-1000HD (Realtime Video Presenter)
	{
		modelName: 'PR-1000HD',
		modelIdHex: '00 00 23', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 3,
	},
	// [2013-03-22 (Ver.1.01)] Roland M-300 (Live Mixing Console)
	// [2013-03-22 (Ver.1.04)] Roland M-380 (Mixing Console)
	// [2013-03-22 (Ver.1.04)] Roland M-400 (Live Mixing Console)
	// [2013-03-22 (Ver.1.01)] Roland M-480 (Live Mixing Console)
	{
		modelName: 'M-300',
		modelIdHex: '00 00 24', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2007-06-15 (Ver.1.00)] Roland SonicCell (128-Voice Expandable Synth Module with Audio Interface)
	// [2008-05-01 (Ver.1.00)] Roland JUNO-STAGE (128 Voice Expandable Synthesizer with Song Player)
	{
		modelName: 'SonicCell',
		modelIdHex: '00 00 25', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 ..',                                      // Setup
			'02 00 0[023] ..',                                  // System
			'(?:10 00|20 [0-3].) [0-2]. ..',                    // Performance
			'(?:1[1-4] ..|1f [01].|3[01] ..|4[0-3] ..) .. ..',  // Patch/Rhythm
		],
	},
	{
		modelName: 'JUNO-STAGE',
		modelIdHex: '00 00 25', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 ..',                                      // Setup
			'02 00 0[04] ..',                                   // System
			'(?:10 00|20 [0-3].) (?:[0-2].|60) ..',             // Performance
			'(?:1[1-4] ..|1f [0-3].|3[01] ..|4[0-3] ..) .. ..', // Patch/Rhythm
			'(?:1e ..|50 00|51 ..|58 00|5[9a] ..) .. ..',       // Rhythm Pattern/Arpeggio/Chord/Rhythm Group
		],
	},
	// [2008-04-01 (Ver.1.00)] Edirol P-10 (Visual Sampler)
	{
		modelName: 'P-10',
		modelIdHex: '00 00 26', deviceIdReStr: '1.', commands: [0x12], addrLen: 3,
	},
	// [2008-02-01 (Ver.1.00)] Roland Fantom-G6/G7/G8 (Music Workstation)
	{
		modelName: 'Fantom-G',
		modelIdHex: '00 00 27', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2008-01-10 (Ver.1.00)] Edirol V-8 (8-Channel Video Mixer)
	{
		modelName: 'V-8',
		modelIdHex: '00 00 28', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 3,
	},
	// [2007-12-01 (Ver.1.00)] Roland RD-700GX (Digital Piano)
	{
		modelName: 'RD-700GX',
		modelIdHex: '00 00 2b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2007-11-20 (Ver.1.00)] Roland RD-300GX (Digital Piano)
	{
		modelName: 'RD-300GX',
		modelIdHex: '00 00 2c', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2008-01-10 (Ver.1.00)] Roland GT-10 (Guitar Effects Processor)
	{
		modelName: 'GT-10',
		modelIdHex: '00 00 2f', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2009-??-?? (Ver.?.??)] Roland VS-700C (V-STUDIO Console)
	{
		modelName: 'VS-700C',
		modelIdHex: '00 00 31', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2009-??-?? (Ver.?.??)] Roland VS-700R (V-STUDIO I/O)	// Not confirmed
/*
	{
		modelName: 'VS-700R',
		modelIdHex: '00 00 32', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
*/
	// [2009-03-13 (Ver.1.00)] Fantom VS
	{
		modelName: 'Fantom VS',
		modelIdHex: '00 00 33', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2009-07-01 (Ver.1.00)] Roland TD-20X (Percussion Sound Module)
	{
		modelName: 'TD-20X',
		modelIdHex: '00 00 35', deviceIdReStr: '(?:[01].|7f)', commands: [0x12], addrLen: 4,
	},
	// [2008-03-01 (Ver.1.00)] Roland GW-8 (Workstation)
	// [2008-10-15 (Ver.1.00)] Roland Prelude (Music Keyboard)
	{
		modelName: 'GW-8',
		modelIdHex: '00 00 36', deviceIdReStr: '1.', commands: [], addrLen: 0,
	},
	// [2009-02-01 (Ver.1.00)] Roland V-Piano (Digital Piano)
	// [2011-06-01 (Ver.1.00)] Roland V-Piano Grand (Digital Piano)
	{
		modelName: 'V-Piano',
		modelIdHex: '00 00 39', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2009-04-01 (Ver.1.00)] Roland JUNO-Di (Mobile Synthesizer with Song Player)
	// [2018-02-15 (Ver.1.00)] Roland JUNO-DS61/DS76/DS88 (Synthesizer)
	{
		modelName: 'JUNO-Di',
		modelIdHex: '00 00 3a', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 ..',                                  // Setup
			'02 00 .. ..',                                  // System
			'0f .. .. ..',                                  // For Editor
			'(?:10 00|20 [0-3].) [0-25]. ..',               // Performance
			'(?:1[1-4] ..|1f [0-3].|3[01] ..|40 ..) .. ..', // Patch/Rhythm
			'1e (?:00|11|13|14) .. ..',                     // Temporary Rhythm Pattern/Arpeggio/Rhythm Group/Chord Memory
		],
	},
	{
		modelName: 'JUNO-DS',
		modelIdHex: '00 00 3a', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'01 00 00 ..',                                  // Setup
			'02 00 .. ..',                                  // System
			'(?:10 00|20 ..) (?:[0-25].|60) ..',            // Performance
			'(?:1[1-4] ..|1f [0-3].|3[01] ..|40 ..) .. ..', // Patch/Rhythm
			'1e (?:00|11|13|15) .. ..',                     // Temporary Rhythm Pattern/Arpeggio/Rhythm Group/Vocal Effect
			'21 .. .. ..',                                  // User Pattern
			'60 00 .. ..',                                  // User Vocal Effect
		],
	},
	// [2009-01-05 (Ver.1.00)] Roland VP-770 (Vocal & Ensemble Keyboard)
	{
		modelName: 'VP-770',
		modelIdHex: '00 00 3b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2009-03-?? (Ver.1.00)] Roland AX-Synth (Shoulder Synthesizer)
	{
		modelName: 'AX-Synth',
		modelIdHex: '00 00 3c', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-03-01 (Ver.1.00)] Roland GAIA SH-01 (Synthesizer)
	{
		modelName: 'GAIA SH-01',
		modelIdHex: '00 00 41', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-01-01 (Ver.1.00)] Roland VR-700 (V-Combo)
	{
		modelName: 'VR-700',
		modelIdHex: '00 00 42', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-01-16 (Ver.1.00)] Roland A-300PRO/500PRO/800PRO (MIDI Keyboard Controller)
	{
		modelName: 'A-300PRO/500PRO/800PRO',
		modelIdHex: '00 00 44', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2010-??-?? (Ver.?.??)] Boss ME-25 (Guitar Multiple Effects)
	{
		modelName: 'ME-25',
		modelIdHex: '00 00 45', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-??-?? (Ver.?.??)] Boss VS-20 (Audio Interface / Control Surface)
	{
		modelName: 'VS-20',
		modelIdHex: '00 00 48', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-01-05 (Ver.1.00)] Roland SD-50 (Mobile Studio Canvas)
	{
		modelName: 'SD-50',
		modelIdHex: '00 00 4a', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-01-01 (Ver.1.00)] Roland SPD-30 Version 2 (OCTAPAD)
	{
		modelName: 'SPD-30',
		modelIdHex: '00 00 4b', deviceIdReStr: '1.', commands: [], addrLen: 0,
	},
	// [2010-06-01 (Ver.1.00)] Roland JUNO-Gi (Mobile Synthesizer with Digital Recorder)
	{
		modelName: 'JUNO-Gi',
		modelIdHex: '00 00 4c', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-10-10 (Ver.1.00)] Roland RD-700NX (Digital Piano)
	{
		modelName: 'RD-700NX',
		modelIdHex: '00 00 50', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-12-10 (Ver.1.00)] Roland RD-300NX (Digital Piano)
	{
		modelName: 'RD-300NX',
		modelIdHex: '00 00 51', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2010-09-09 (Ver.1.00)] Roland GR-55 (Guitar Synthesizer)
	{
		modelName: 'GR-55',
		modelIdHex: '00 00 53', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2011-01-?? (Ver.1.00)] Roland BK-7m (Backing Module)
	// [2011-11-?? (Ver.1.00)] Roland BK-5 (Backing Keyboard)
	// [2013-01-01 (Ver.1.00)] Roland BK-3 (Backing Keyboard)
	// [2013-02-?? (Ver.1.00)] Roland BK-9 (Backing Keyboard)
	{
		modelName: 'BK-7m',
		modelIdHex: '00 00 54', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2011-04-01 (Ver.1.00)] Roland JUPITER-80 (Synthesizer)
	{
		modelName: 'JUPITER-80',
		modelIdHex: '00 00 55', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2011-05-17 (Ver.1.00)] Boss BR-80 (Digital Recorder)
	{
		modelName: 'BR-80',
		modelIdHex: '00 00 59', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2011-??-?? (Ver.?.??)] Boss RC-300 (Loop Station)
	{
		modelName: 'RC-300',
		modelIdHex: '00 00 5c', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-04-30 (Ver.2.00)] Boss GT-100 (Amp Effects Processor)
	{
		modelName: 'GT-100',
		modelIdHex: '00 00 60', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2012-01-01 (Ver.1.00)] Roland TD-30 (Drum Sound Module)
	{
		modelName: 'TD-30',
		modelIdHex: '00 00 61', deviceIdReStr: '(?:[01].|7f)', commands: [], addrLen: 0,
	},
	// [2012-03-01 (Ver.1.00)] Roland JUPITER-50 (Synthesizer)
	{
		modelName: 'JUPITER-50',
		modelIdHex: '00 00 63', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2012-06-01 (Ver.1.00)] Roland INTEGRA-7 (SuperNATURAL Sound Module)
	{
		modelName: 'INTEGRA-7',
		modelIdHex: '00 00 64', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-??-?? (Ver.?.??)] Roland HS-5 (Session Mixer)
	// [2014-??-?? (Ver.?.??)] Roland UA-M10 (Mobile UA)
	{
		modelName: 'Firmware',
		modelIdHex: '00 00 6b', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2013-03-01 (Ver.1.000)] Roland V-4EX (4-Channel Video Mixer)
	{
		modelName: 'V-4EX',
		modelIdHex: '00 00 6f', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2017-09-01 (Ver.1.11)] Roland VR-09 (V-Combo)
	// [2017-09-01 (Ver.1.11)] Roland VR-730 (V-Combo)
	{
		modelName: 'VR-09/730',
		modelIdHex: '00 00 71', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2013-??-?? (Ver.?.??)] Boss RC-505 (Loop Station)
	{
		modelName: 'RC-505',
		modelIdHex: '00 00 72', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-01-01 (Ver.1.00)] Roland RD-800 (Digital Piano)
	// [2018-01-01 (Ver.1.01)] Roland RD-2000 (Digital Piano)
	{
		modelName: 'RD-800',
		modelIdHex: '00 00 75', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 (?:0.|1[0-3])',               // System Common
			'00 00 0[1-3] ..',                      // System Compressor/V-Link/Switch Assign
			'10 00 00 (?:[0-6].|7[0-9a-e])',        // Temporary Live Set Common
			'10 00 02 0[0-3]',                      // Temporary Live Set Song/Rhythm
			'10 00 04 ..',                          // Temporary Live Set Delay
			'10 00 06 ..',                          // Temporary Live Set Reverb
			'10 00 1. ..',                          // Temporary Live Set Modulation FX/Tremolo/Amp Simulator
			'10 00 (?:[23][0-589a-d] ..|[23][6e] (?:[0-4].|5[01]))',    // Temporary Live Set Internal Layer
			'10 00 4[0246] (?:[0-3].|40)',          // Temporary Live Set External Layer
		],
	},
	{
		modelName: 'RD-2000',
		modelIdHex: '00 00 75', deviceIdReStr: '(1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 00 [01].',                       // System Common
			'00 00 01 ..',                          // System Compressor
			'10 00 (?:00 ..|01 (?:[0-3].|4[0-3]))', // Temporary Program Common
			'10 00 02 0[0-4]',                      // Temporary Program Song/Rhythm
			'10 00 04 ..',                          // Temporary Program Delay
			'10 00 06 ..',                          // Temporary Program Reverb
			'10 00 1. ..',                          // Temporary Program Modulation FX/Tremolo/Amp Simulator
			'10 00 (?:[2356][0-589a-d] ..|[2356][6e] (?:[0-6].|7[0-8]))',   // Temporary Program Internal Zone
			'10 00 [47][0246] (?:[0-3].|4[0-9ab])', // Temporary Program External Zone
		],
	},
	// [2014-01-01 (Ver.1.00)] Roland FA-06/07/08 (Music Workstation)
	{
		modelName: 'FA-06/07/08',
		modelIdHex: '00 00 77', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-01-01 (Ver.1.00)] Roland HPD-20 (HandSonic)
	{
		modelName: 'HPD-20',
		modelIdHex: '00 00 78', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2014-07-04 (Ver.1.10)] Roland TB-3 (Touch Bassline)
	{
		modelName: 'TB-3',
		modelIdHex: '00 00 7b', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2013-??-?? (Ver.?.??)] Boss ME-80 (Guitar Multiple Effects)
	{
		modelName: 'ME-80',
		modelIdHex: '00 00 00 01', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-02-10 (Ver.1.00)] Roland VR-3EX (AV Mixer)
	{
		modelName: 'VR-3EX',
		modelIdHex: '00 00 00 02', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2014-06-17 (Ver.1.00)] Boss GP-10 (Guitar Processor)
	{
		modelName: 'GP-10',
		modelIdHex: '00 00 00 05', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2014-04-30 (Ver.1.00)] Boss GT-001 (Guitar Effects Processor)
	{
		modelName: 'GT-001',
		modelIdHex: '00 00 00 06', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-05-01 (Ver.1.00)] Roland JD-Xi (Synthesizer)
	{
		modelName: 'JD-Xi',
		modelIdHex: '00 00 00 0e', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-05-01 (Ver.1.00)] Roland JD-XA (Synthesizer)
	{
		modelName: 'JD-XA',
		modelIdHex: '00 00 00 0f', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-06-03 (Ver.1.00)] Roland MX-1 (Mix Performer)
	{
		modelName: 'MX-1',
		modelIdHex: '00 00 00 11', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2015-05-28 (Ver.1.00)] Boss SY-300 (Guitar Synthesizer)
	{
		modelName: 'SY-300',
		modelIdHex: '00 00 00 13', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-04-22 (Ver.1.00)] Boss ES-8 (Effects Switching System)
	{
		modelName: 'ES-8',
		modelIdHex: '00 00 00 14', deviceIdReStr: '(?:1.|7f)', commands: [0x12], addrLen: 4,
	},
	// [2015-??-?? (Ver.?.??)] Roland BITRAZER (Modular Crusher)
	{
		modelName: 'BITRAZER',
		modelIdHex: '00 00 00 15', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-??-?? (Ver.?.??)] Roland DEMORA (Modular Delay)
	{
		modelName: 'DEMORA',
		modelIdHex: '00 00 00 16', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-??-?? (Ver.?.??)] Roland TORCIDO (Modular Distortion)
	{
		modelName: 'TORCIDO',
		modelIdHex: '00 00 00 17', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2015-??-?? (Ver.?.??)] Roland SCOOPER (Modular Scatter)
	{
		modelName: 'SCOOPER',
		modelIdHex: '00 00 00 18', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-09-20 (Ver.1.03)] Roland LX-17/7 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland HP605/603/603A (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland KF-10 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland GP607 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland DP603 (Digital Piano)
	// [2017-09-01 (Ver.1.01)] Roland FP-90/60 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland RP102 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland HP601 (Digital Piano)
	// [2019-09-20 (Ver.1.03)] Roland FP-10 (Digital Piano)
	// [2021-08-01 (Ver.1.00)] Roland FP-90X/60X/30X (Digital Piano)
	{
		modelName: 'Digital Piano',
		modelIdHex: '00 00 00 19', deviceIdReStr: '10', commands: [], addrLen: 0,
	},
	// [2015-08-05 (Ver.1.00)] Boss DD-500 (Digital Delay)
	{
		modelName: 'DD-500',
		modelIdHex: '00 00 00 1a', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2016-08-03 (Ver.1.01)] Roland JP-08 (Sound Module)
	{
		modelName: 'JP-08',
		modelIdHex: '00 00 00 1c', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2016-08-03 (Ver.1.01)] Roland JU-06 (Sound Module)
	{
		modelName: 'JU-06',
		modelIdHex: '00 00 00 1d', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2016-08-03 (Ver.1.01)] Roland JX-03 (Sound Module)
	{
		modelName: 'JX-03',
		modelIdHex: '00 00 00 1e', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2015-11-20 (Ver.1.00)] Roland E-A7 (Expandable Arranger)
	{
		modelName: 'E-A7',
		modelIdHex: '00 00 00 1f', deviceIdReStr: '[01].', commands: [0x12], addrLen: 4,
	},
	// [2015-11-20 (Ver.1.00)] Roland V-1HD (HD Video Switcher)
	{
		modelName: 'V-1HD',
		modelIdHex: '00 00 00 20', deviceIdReStr: '[01].', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2015-11-30 (Ver.1.00)] Boss ES-5 (Effects Switching System)
	{
		modelName: 'ES-5',
		modelIdHex: '00 00 00 21', deviceIdReStr: '(?:1.|7f)', commands: [0x12], addrLen: 4,
	},
	// [2016-??-?? (Ver.?.??)] Boss WAZA AMP (Guitar Amplifier)
	{
		modelName: 'WAZA AMP',
		modelIdHex: '00 00 00 23', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-04-13 (Ver.1.01)] Roland TD-50 (Drum Sound Module)
	{
		modelName: 'TD-50',
		modelIdHex: '00 00 00 24', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-03-16 (Ver.1.50)] Roland VR-4HD (HD AV Mixer)
	{
		modelName: 'VR-4HD',
		modelIdHex: '00 00 00 29', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2021-12-24 (Ver.1.01)] Roland AE-10 (Aerophone)
	{
		modelName: 'AE-10',
		modelIdHex: '00 00 00 2f', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2016-??-?? (Ver.?.??)] Boss GT-1 (Guitar Effects Processor)
	{
		modelName: 'GT-1',
		modelIdHex: '00 00 00 30', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-02-28 (Ver.1.50)] Roland V-1SDI (3D-SDI Video Switcher)
	{
		modelName: 'V-1SDI',
		modelIdHex: '00 00 00 31', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2016-??-?? (Ver.?.??)] Boss KATANA-50 (Guitar Amplifier)
	// [2016-??-?? (Ver.?.??)] Boss KATANA-100 (Guitar Amplifier)
	// [2016-??-?? (Ver.?.??)] Boss KATANA-100/212 (Guitar Amplifier)
	// [2016-??-?? (Ver.?.??)] Boss KATANA-HEAD (Guitar Amplifier)
	// [2016-??-?? (Ver.?.??)] Boss KATANA-Artist (Guitar Amplifier)
	// [2020-??-?? (Ver.?.??)] Boss KATANA-50 MkII (Guitar Amplifier)
	// [2020-??-?? (Ver.?.??)] Boss KATANA-100 MkII (Guitar Amplifier)
	// [2020-??-?? (Ver.?.??)] Boss KATANA-100/212 MkII (Guitar Amplifier)
	// [2020-??-?? (Ver.?.??)] Boss KATANA-HEAD MkII (Guitar Amplifier)
	// [2020-??-?? (Ver.?.??)] Boss KATANA-Artist MkII (Guitar Amplifier)
	// [2023-??-?? (Ver.?.??)] Boss KATANA-50 MkII Ex (Guitar Amplifier)
	// [2023-??-?? (Ver.?.??)] Boss KATANA-Artist MkII HEAD (Guitar Amplifier)
	{
		modelName: 'KATANA',
		modelIdHex: '00 00 00 33', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2016-11-01 (Ver.1.00)] Roland FR-4x (V-Accordion)
	{
		modelName: 'FR-4x',
		modelIdHex: '00 00 00 34', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2013-06-?? (Ver.1.00)] Roland FR-8x (V-Accordion)
	{
		modelName: 'FR-8x',
		modelIdHex: '00 00 00 39', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-03-28 (Ver.1.00)] Boss MS-3 (Multi Effects Switcher)
	{
		modelName: 'MS-3',
		modelIdHex: '00 00 00 3b', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-??-?? (Ver.?.??)] Boss GT-1B (Bass Effects Processor)
	{
		modelName: 'GT-1B',
		modelIdHex: '00 00 00 3e', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-07-01 (Ver.1.00)] Boss RV-500 (Reverb)
	{
		modelName: 'RV-500',
		modelIdHex: '00 00 00 42', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-07-01 (Ver.1.00)] Boss RV-500 (Reverb)
	{
		modelName: 'MD-500',
		modelIdHex: '00 00 00 43', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-10-04 (Ver.1.10)] Roland TR-8S (Rhythm Performer)
	{
		modelName: 'TR-8S',
		modelIdHex: '00 00 00 45', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-05-01 (Ver.1.00)] Roland TD-17/17-L (Drum Sound Module)
	{
		modelName: 'TD-17',
		modelIdHex: '00 00 00 4b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-08-01 (Ver.1.01)] Roland TM-6 PRO (Trigger Module)
	{
		modelName: 'TM-6 PRO',
		modelIdHex: '00 00 00 4c', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2017-09-28 (Ver.2.00)] Boss DD-500 Ver.2 (Digital Delay)
	{
		modelName: 'DD-500 Ver.2',
		modelIdHex: '00 00 00 4d', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-??-?? (Ver.?.??)] Roland AE-05 (Aerophone GO)
	{
		modelName: 'AE-05',
		modelIdHex: '00 00 00 4e', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2018-09-06 (Ver.1.20)] Boss GT-1000 (Guitar Effects Processor)
	// [????-??-?? (Ver.?.??)] Boss GT-1000L (Guitar Effects Processor)
	// [2022-01-20 (Ver.1.10)] Boss GT-1000CORE (Guitar Effects Processor)
	{
		modelName: 'GT-1000',
		modelIdHex: '00 00 00 4f', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-??-?? (Ver.?.??)] Boss KATANA-AIR (Guitar Amplifier)
	{
		modelName: 'KATANA-AIR',
		modelIdHex: '00 00 00 50', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-11-16 (Ver.1.02)] Roland VT-4 (Voice Transformer)
	{
		modelName: 'VT-4',
		modelIdHex: '00 00 00 51', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-07-01 (Ver.1.01)] Roland AX-Edge (Shoulder Digital Keyboard)
	{
		modelName: 'AX-Edge',
		modelIdHex: '00 00 00 52', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Roland TM-1 (Trigger Module)
	{
		modelName: 'TM-1',
		modelIdHex: '00 00 00 53', deviceIdReStr: '1.', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-06-17 (Ver.1.02)] Roland V-02HD (Multi-Format Video Mixer)
	{
		modelName: 'V-02HD',
		modelIdHex: '00 00 00 54', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2018-??-?? (Ver.?.??)] Boss VE-500 (Vocal Performer)
	{
		modelName: 'VE-500',
		modelIdHex: '00 00 00 55', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2018-??-?? (Ver.?.??)] Boss Nextone (Guitar Amplifier)
	{
		modelName: 'Nextone',
		modelIdHex: '00 00 00 57', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss WAZA Tube Amp Expander (Tube Amp Expander)
	{
		modelName: 'WAZA Tube Amp Expander',
		modelIdHex: '00 00 00 59', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-11-01 (Ver.1.00)] Roland FANTOM-6/7/8 (Music Workstation)
	// [2022-02-01 (Ver.1.00)] Roland FANTOM-06/07/08 (Synthesizer Keyboard)
	{
		modelName: 'FANTOM-6/7/8',
		modelIdHex: '00 00 00 5b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 (?:0[023469ab]|1[0-5]) ..',  // System
			'01 00 00 ..',                      // Setup
			'01 00 02 ..',                      // Vocoder
			'02 00 (?:0[0-7]|[1-3].|4[03]) ..', // Temporary Scene
			'02 1. .. ..',                      // Temporary Z-Core Tone
			'02 [34]. .. ..',                   // Temporary Drum Kit
			'03 [0-3]. .. ..',                  // Temporary Drum Kit Inst Set
			'04 0. .. ..',                      // Temporary SN-A Tone
			'04 20 .. ..',                      // Temporary V-Piano Tone
			'05 0. .. ..',                      // Temporary EXSN Tone
		],
	},
	{
		modelName: 'FANTOM-06/07/08',
		modelIdHex: '00 00 00 5b', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
		address: [
			'00 00 (?:0[02346ab]|1[0-3]) ..',   // System
			'01 00 00 ..',                      // Setup
			'01 00 02 ..',                      // Vocoder
			'02 00 (?:0[0-7]|[1-3].|40) ..',    // Temporary Scene
			'02 1. .. ..',                      // Temporary Z-Core Tone
			'02 [34]. .. ..',                   // Temporary Drum Kit
			'03 [0-3]. .. ..',                  // Temporary Drum Kit Inst Set
			'04 0. .. ..',                      // Temporary SN-A Tone
			'04 40 .. ..',                      // Temporary VTW Tone
			'05 0. .. ..',                      // Temporary EXSN Tone
			'05 2. .. ..',                      // Temporary Model Tone
		],
	},
	// [2019-09-05 (Ver.1.00)] Boss RC-10R (Rhythm Loop Station)
	{
		modelName: 'RC-10R',
		modelIdHex: '00 00 00 5f', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss DD-200 (Digital Delay)
	{
		modelName: 'DD-200',
		modelIdHex: '00 00 00 60', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss EQ-200 (Graphic Equalizer)
	{
		modelName: 'EQ-200',
		modelIdHex: '00 00 00 61', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2021-04-13 (Ver.1.01)] Roland TD-27 (Drum Sound Module)
	{
		modelName: 'TD-27',
		modelIdHex: '00 00 00 63', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-07-22 (Ver.1.12)] Roland RD-88 (Digital Piano)
	{
		modelName: 'RD-88',
		modelIdHex: '00 00 00 64', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-08-19 (Ver.1.06)] Roland JUPITER-X/Xm (Synthesizer)
	{
		modelName: 'JUPITER-X/Xm',
		modelIdHex: '00 00 00 65', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss MD-200 (Modulation)
	{
		modelName: 'MD-200',
		modelIdHex: '00 00 00 66', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss OD-200 (Hybrid Drive)
	{
		modelName: 'OD-200',
		modelIdHex: '00 00 00 67', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2021-10-08 (Ver.2.00)] Roland V-8HD (HD Video Mixer)
	{
		modelName: 'V-8HD',
		modelIdHex: '00 00 00 68', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2020-01-15 (Ver.1.00)] Boss SY-1000 (Guitar Synthesizer)
	{
		modelName: 'SY-1000',
		modelIdHex: '00 00 00 69', deviceIdReStr: '(?:[01].|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2019-??-?? (Ver.?.??)] Boss WAZA-AIR (Wireless Personal Guitar Amplification System)
	{
		modelName: 'WAZA-AIR',
		modelIdHex: '00 00 00 6a', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-12-10 (Ver.1.02)] Roland MV-1 (VERSELAB)
	{
		modelName: 'MV-1',
		modelIdHex: '00 00 00 6f', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-10-01 (Ver.1.00)] Roland TD-07 (Drum Sound Module)
	{
		modelName: 'TD-07',
		modelIdHex: '00 00 00 75', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-??-?? (Ver.?.??)] Boss RC-5 (Loop Station)
	{
		modelName: 'RC-5',
		modelIdHex: '00 00 00 76', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-??-?? (Ver.?.??)] Boss RC-500 (Loop Station)
	{
		modelName: 'RC-500',
		modelIdHex: '00 00 00 77', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-??-?? (Ver.?.??)] Boss Pocket GT (Pocket Effects Processor)
	{
		modelName: 'Pocket GT',
		modelIdHex: '00 00 00 78', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2020-11-01 (Ver.1.00)] Roland SPD-20 PRO (OCTAPAD)
	{
		modelName: 'SPD-20 PRO',
		modelIdHex: '00 00 00 79', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-01-01 (Ver.2.01)] Roland AE-30 (Aerophone Pro)
	// [2022-01-01 (Ver.2.01)] Roland AE-20 (Aerophone)
	{
		modelName: 'AE-30',
		modelIdHex: '00 00 00 7d', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-??-?? (Ver.?.??)] Boss SY-200 (Synthesizer)
	{
		modelName: 'SY-200',
		modelIdHex: '00 00 00 00 03', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2021-??-?? (Ver.?.??)] Boss RC-600 (Loop Station)
	{
		modelName: 'RC-600',
		modelIdHex: '00 00 00 00 04', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-??-?? (Ver.?.??)] Boss RC-505mkII (Loop Station)
	{
		modelName: 'RC-505mkII',
		modelIdHex: '00 00 00 00 05', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-??-?? (Ver.?.??)] Boss IR-200 (Amp & IR Cabinet)
	{
		modelName: 'IR-200',
		modelIdHex: '00 00 00 00 06', deviceIdReStr: '10', commands: [0x12], addrLen: 4,
	},
	// [2021-04-13 (Ver.1.00)] Roland TD-50X (Drum Sound Module)
	{
		modelName: 'TD-50X',
		modelIdHex: '00 00 00 00 07', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2021-06-17 (Ver.1.00)] Roland V-02HD MKII (Streaming Video Mixer)
	{
		modelName: 'V-02HD MKII',
		modelIdHex: '00 00 00 00 0a', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 3,
	},
	// [2022-03-03 (Ver.1.10)] Boss GX-100 (Guitar Effects Processor)
	{
		modelName: 'GX-100',
		modelIdHex: '00 00 00 00 0b', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-04-26 (Ver.1.10)] Roland JUNO-X (Programmable Polyphonic Synthesizer)
	{
		modelName: 'JUNO-X',
		modelIdHex: '00 00 00 00 12', deviceIdReStr: '(?:1.|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-??-?? (Ver.?.??)] Boss KATANA BASS (Bass Amplifier)
	{
		modelName: 'KATANA BASS',
		modelIdHex: '00 00 00 00 13', deviceIdReStr: '00', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-03-24 (Ver.1.00)] Boss RE-202 (Space Echo)
	{
		modelName: 'RE-202',
		modelIdHex: '00 00 00 00 18', deviceIdReStr: '(?:10|7f)', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-??-?? (Ver.?.??)] Boss SL-2 (Slicer)
	{
		modelName: 'SL-2',
		modelIdHex: '00 00 00 00 1d', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
	// [2022-??-?? (Ver.?.??)] Boss FS-1-WL (Wireless Foot Switch)
	{
		modelName: 'FS-1-WL',
		modelIdHex: '00 00 00 00 24', deviceIdReStr: '10', commands: [0x11, 0x12], addrLen: 4,
	},
];

export const sysExParsers = Object.freeze([
	...modelProps.map((modelProp) => makeRolandParsers(modelProp)).flat(),
	...Object.values(modelProps.reduce((p, c) => {
		// Counts the number of parsers for each model ID.
		const key = c.modelIdHex;
		if (!p[key]) {
			p[key] = [];
		}
		p[key].push(c);
		return p;
	}, {})).map((modelProps) => {
		const parsers = [];
		const {modelName, modelIdHex, deviceIdReStr, addrLen} = modelProps[0];
		const commands = [...new Set(modelProps.map((e) => e.commands).flat())];
		// If multiple parsers exist for each model ID and all of them handles limited "address" range, add an additional parser to handle whole address.
		if (modelProps.length > 1 && modelProps.every((modelProp) => 'address' in modelProp)) {
			parsers.push(...makeRolandParsers({modelName, modelIdHex, deviceIdReStr, commands, addrLen}));
		}
		// ... and if all of them handles limited "deviceIdReStr" range, add an additional parser to handle any device ID.
		if (modelProps.every((modelProp) => modelProp.deviceIdReStr !== '..')) {
			parsers.push(...makeRolandParsers({
				modelIdHex, commands, addrLen,
				modelName: `${modelName}?`,
				deviceIdReStr: '..',
			}));
		}
		return parsers;
	}).flat(),
]);
