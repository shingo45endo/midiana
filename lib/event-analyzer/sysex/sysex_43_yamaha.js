import {makeYamahaXgParser} from './sysex_common_yamaha.js';

const modelProps = [
	// [1994-10-28 (Ver.1.0)] Yamaha MU80 (Tone Generator)
	// [1995-02-16 (Ver.1.0)] Yamaha MU50 (Tone Generator)
	// [1996-04-05 (Ver.1.0)] Yamaha MU10 (Tone Generator)
	// [1996-09-21 (Ver.1.0)] Yamaha PCC10XG (Sound PC Card)
	// [1996-10-18 (Ver.1.0)] Yamaha MU90 (Tone Generator)
	// [1996-11-25 (Ver.1.0)] Yamaha MU90B (Tone Generator)
	// [1996-12-16 (Ver.1.0)] Yamaha MU90R (Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100 (Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100R (Tone Generator)
	// [1997-11-28 (Ver.1.0)] Yamaha MU100B (Tone Generator)
	// [1998-05-22 (Ver.1.0)] Yamaha MU128 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU2000 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU1000 (Tone Generator)
	// [2000-04-11 (Ver.1.0)] Yamaha MU500 (Tone Generator)
	{
		modelName: 'MU80 Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 0[0-9]',                     // MU80 System
			'09 00 (?:0.|[2-4].|50|7[0-5])',    // Current Performance Common
			'09 0[1-4] (?:[01].|2[0-5])',       // Current Performance Part 1-4
			'0a 00 0[0-9a-e]',                  // Remote Switch
			'30 .. (?:0.|[2-4].|50|7[0-5])',    // Internal Performance 1-128 > Common
			'3[1-4] .. (?:[01].|2[0-2])',       // Internal Performance 1-128 > Part 1-4
		],
	},
	{
		modelName: 'DB60XG Native',
		modelId: [0x49], commands: [0x00, 0x10],
		address: [
			'01 00 0[01]',  // DB60XG System
		],
	},
	{
		modelName: 'MU90 Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 10', // MU80 System > Drum Edit Rcv Note
		],
	},
	{
		modelName: 'MU90R Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 11', // MU80 System > Output Select Lock
		],
	},
	{
		modelName: 'MU100 Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 12', // MU100 System > Voice Map
		],
	},
	{
		modelName: 'MU128 Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a 00 (?:0[0-9a-e]|1.|2[0-3])',    // Remote Switch
		],
	},
	{
		modelName: 'MU2000EX Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 1[45]',  // MU1000/2000 System > Output / Digital Output Gain
		],
	},
	{
		modelName: 'MU Native',
		modelId: [0x49], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1995-05-10 (Ver.1.0)] Yamaha QS300 (Music Synthesizer)
	// [1995-06-04 (Ver.1.0)] Yamaha B900/B900EX (Music Synthesizer)
	// [1995-10-06 (Ver.1.0)] Yamaha SDX3000 (Music Synthesizer)
	// [1995-??-?? (Ver.?.?)] Yamaha DB50XG (Sound Daughter Board)
	// [1996-03-26 (Ver.1.0)] Yamaha CS1x (Control Synthesizer)
	// [1996-04-05 (Ver.1.0)] Yamaha MU10 (Tone Generator)
	// [????-??-?? (Ver.?.?)] Yamaha DB51XG (Sound Daughter Board)
	// [????-??-?? (Ver.?.?)] Yamaha DB60XG (Sound Daughter Board)
	{
		modelName: 'QS300',
		modelId: [0x4b], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 ..',     // All System
			'10 00 ..',     // Current Normal Voice
			'11 .. ..',     // User Normal Voice
			'2[0-3] .. ..', // Current Normal Voice Element
			'30 .. ..',     // Drum Voice Key
			'40 00 ..',     // Drum Voice Common
		],
	},
	{
		modelName: 'CS1x',
		modelId: [0x4b], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'50 00 ..',     // System
			'60 0[0-4] ..', // Current Performance
			'7[0-3] .. ..', // User Performance
		],
	},
	// Synthesizers
	// [1994-10-28 (Ver.1.0)] Yamaha MU80 (Tone Generator)
	// [1995-02-16 (Ver.1.0)] Yamaha MU50 (Tone Generator)
	// [1995-05-10 (Ver.1.0)] Yamaha QS300 (Music Synthesizer)
	// [1995-06-04 (Ver.1.0)] Yamaha B900/B900EX (Music Synthesizer)
	// [1995-07-17 (Ver.1.0)] Yamaha CBX-K1XG (MIDI Sound Keyboard)
	// [1995-??-?? (Ver.?.?)] Yamaha DB50XG (Sound Daughter Board)
	// [????-??-?? (Ver.?.?)] Yamaha DB51XG (Sound Daughter Board)
	// [????-??-?? (Ver.?.?)] Yamaha DB60XG (Sound Daughter Board)
	// [1995-??-?? (Ver.?.?)] Yamaha SW60XG (Sound Edge)
	// [1996-03-22 (Ver.1.0)] Yamaha QY700 (Music Sequencer)
	// [1996-03-26 (Ver.1.0)] Yamaha CS1x (Control Synthesizer)
	// [1996-04-05 (Ver.1.0)] Yamaha MU10 (Tone Generator)
	// [1996-09-21 (Ver.1.0)] Yamaha PCC10XG (Sound PC Card)
	// [1996-10-18 (Ver.1.0)] Yamaha MU90 (Tone Generator)
	// [1996-11-25 (Ver.1.0)] Yamaha MU90B (Tone Generator)
	// [1996-12-16 (Ver.1.0)] Yamaha MU90R (Tone Generator)
	// [1997-04-24 (Ver.1.0)] Yamaha QY70 (Music Sequencer)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100 (Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100R (Tone Generator)
	// [1997-11-28 (Ver.1.0)] Yamaha MU100B (Tone Generator)
	// [1998-03-09 (Ver.1.1)] Yamaha B2000 (Music Production Synthesizer)
	// [1998-04-10 (Ver.1.0)] Yamaha WF192XG (PCI Sound Card)
	// [1998-05-22 (Ver.1.0)] Yamaha MU128 (Tone Generator)
	// [1998-11-16 (Ver.1.0)] Yamaha CS2x (Control Synthesizer)
	// [1998-10-19 (Ver.1.0)] Yamaha MU15 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU2000 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU1000 (Tone Generator)
	// [2000-04-11 (Ver.1.0)] Yamaha MU500 (Tone Generator)
	// [2000-10-06 (Ver.1.0)] Yamaha QY100 (Music Sequencer)
	// [2000-12-27 (Ver.1.0)] Yamaha S03/S03SL (Music Synthesizer)
	// [2001-06-18 (Ver.1.0)] Yamaha EOS BX (Entertainment Operating System)
	// [2001-11-20 (Ver.1.0)] Yamaha S08 (Music Synthesizer)
	// [2005-11-01 (Ver.1.00)] Yamaha CP300 (Stage Piano)
	// Arranger workstations / Portable keyboards
	// [1997-04-14 (Ver.1.0)] Yamaha PSR-730 (Portable Keyboard)
	// [1997-04-14 (Ver.1.0)] Yamaha PSR-630 (Portable Keyboard)
	// [1997-04-14 (Ver.1.0)] Yamaha PSR-530 (Portable Keyboard)
	// [1997-09-08 (Ver.1.0)] Yamaha PSR-8000 (Portable Keyboard)
	// [1999-03-03 (Ver.1.0)] Yamaha PSR-740 (Portable Keyboard)
	// [1999-03-03 (Ver.1.0)] Yamaha PSR-640 (Portable Keyboard)
	// [1999-03-03 (Ver.1.0)] Yamaha PSR-540 (Portable Keyboard)
	// [1999-09-09 (Ver.1.0)] Yamaha PSR-9000 (Portable Keyboard)
	// [1999-09-09 (Ver.1.0)] Yamaha PSR-9000Pro (Portable Keyboard)
	// [2000-11-30 (Ver.1.0)] Yamaha PSR-550 (Portable Keyboard)
	// [2001-06-25 (Ver.1.00)] Yamaha PSR-2000 (Portable Keyboard)
	// [2001-06-25 (Ver.1.00)] Yamaha PSR-1000 (Portable Keyboard)
	// [2002-03-29 (Ver.1.00)] Yamaha PSR-A1000 (Portable Keyboard)
	// [2002-05-01 (Ver.1.00)] Yamaha Tyros (Digital Workstation)
	// [2002-09-10 (Ver.1.00)] Yamaha PSR-2100 (Portable Keyboard)
	// [2002-09-10 (Ver.1.00)] Yamaha PSR-1100 (Portable Keyboard)
	// [2004-01-20 (Ver.1.00)] Yamaha PSR-3000 (Portable Keyboard)
	// [2004-01-20 (Ver.1.00)] Yamaha PSR-1500 (Portable Keyboard)
	// [2005-06-21 (Ver.1.00)] Yamaha Tyros2 (Digital Workstation)
	// [2006-05-08 (Ver.1.00)] Yamaha PSR-S900 (Portable Keyboard)
	// [2006-05-08 (Ver.1.00)] Yamaha PSR-S700 (Portable Keyboard)
	// [2008-04-07 (Ver.1.0)] Yamaha Tyros3 (Digital Workstation)
	// [2009-02-05 (Ver.1.00)] Yamaha PSR-S910 (Portable Keyboard)
	// [2009-02-05 (Ver.1.00)] Yamaha PSR-S710 (Portable Keyboard)
	// [2010-06-10 (Ver.1.0)] Yamaha Tyros4 (Digital Workstation)
	// [2012-04-26 (Ver.1.00)] Yamaha PSR-S950 (Digital Keyboard)
	// [2012-04-26 (Ver.1.00)] Yamaha PSR-S750 (Digital Keyboard)
	// [2013-07-13 (Ver.1.0)] Yamaha Tyros5 (Digital Workstation)
	// [2015-02-15 (Ver.1.0)] Yamaha PSR-S970 (Digital Keyboard)
	// [2015-02-15 (Ver.1.0)] Yamaha PSR-S770 (Digital Keyboard)
	// [2015-02-25 (Ver.1.0)] Yamaha PSR-S670 (Digital Keyboard)
	// [2015-06-17 (Ver.1.0)] Yamaha PSR-A3000 (Digital Keyboard)
	// [2017-08-01 (Ver.1.0)] Yamaha Genos (Digital Workstation)
	// [2018-01-01 (Ver.1.0)] Yamaha PSR-S975 (Digital Keyboard)
	// [2018-01-01 (Ver.1.0)] Yamaha PSR-S775 (Digital Keyboard)
	// [2019-06-01 (Ver.1.0)] Yamaha PSR-SX900 (Digital Keyboard)
	// [2019-06-01 (Ver.1.0)] Yamaha PSR-SX700 (Digital Keyboard)
	// [2020-04-01 (Ver.1.0)] Yamaha PSR-SX600 (Digital Keyboard)
	// [2020-12-01 (Ver.1.0)] Yamaha PSR-A5000 (Digital Keyboard)
	// [2023-07-01 (Ver.1.0)] Yamaha Genos2 (Digital Keyboard)
	// [2002-01-25 (Ver.1.0)] Yamaha PSR-292 (Portable Keyboard) [XGlite]
	// [2002-01-25 (Ver.1.0)] Yamaha PSR-290 (Portable Keyboard) [XGlite]
	// [2003-01-29 (Ver.1.0)] Yamaha PSR-275 (Portable Keyboard) [XGlite]
	// [2003-02-06 (Ver.1.0)] Yamaha PSR-K1 (Portable Keyboard) [XGlite]
	// [2003-03-17 (Ver.1.0)] Yamaha EZ-250i (Portable Keyboard) [XGlite]
	// [2003-04-18 (Ver.1.0)] Yamaha EZ-J24 (Portable Keyboard) [XGlite]
	// [2003-12-12 (Ver.1.0)] Yamaha PSR-450 (Portable Keyboard) [XGlite]
	// [2004-01-27 (Ver.1.0)] Yamaha PSR-295/293 (Portatone) [XGlite]
	// [2004-11-15 (Ver.1.0)] Yamaha PSR-A300 (Portatone) [XGlite]
	// [2004-11-15 (Ver.1.0)] Yamaha PSR-E303 (Portatone) [XGlite]
	// [2005-11-17 (Ver.1.0)] Yamaha PSR-E403 (Portatone) [XGlite]
	// [2006-08-21 (Ver.1.0)] Yamaha PSR-E313 (Portable Keyboard) [XGlite]
	// [2006-10-11 (Ver.1.0)] Yamaha PSR-E213 (Portable Keyboard) [XGlite]
	// [2007-10-10 (Ver.1.0)] Yamaha PSR-E413 (Portatone) [XGlite]
	// [2008-04-11 (Ver.1.0)] Yamaha PSR-S550 (Digital Keyboard)
	// [2008-06-30 (Ver.1.0)] Yamaha PSR-E323 (Portatone) [XGlite]
	// [2008-06-30 (Ver.1.0)] Yamaha PSR-E223 (Portatone) [XGlite]
	// [2009-05-01 (Ver.1.0)] Yamaha PSR-E423 (Portatone) [XGlite]
	// [2010-08-26 (Ver.1.0)] Yamaha PSR-E333 (Portatone) [XGlite]
	// [2010-08-26 (Ver.1.0)] Yamaha PSR-E233 (Portatone) [XGlite]
	// [2011-12-28 (Ver.1.0)] Yamaha PSR-E433 (Portatone) [XGlite]
	// [2012-06-28 (Ver.1.0)] Yamaha PSR-E344 (Portatone) [XGlite]
	// [2012-06-28 (Ver.1.0)] Yamaha PSR-E244 (Portatone) [XGlite]
	// [2012-06-28 (Ver.1.0)] Yamaha PSR-E244 (Portatone) [XGlite]
	// [2013-02-09 (Ver.1.0)] Yamaha PSR-E443 (Portatone) [XGlite]
	// [2015-09-17 (Ver.1.0)] Yamaha PSR-E453 (Portatone) [XGlite]
	// [2015-09-17 (Ver.1.0)] Yamaha PSR-A350 (Digital Keyboard) [XGlite]
	// [2016-08-31 (Ver.1.0)] Yamaha PSR-E363/EW300, YPT-360 (Portatone) [XGlite]
	// [2017-04-17 (Ver.1.00)] Yamaha PSR-E463/EW410 (Portable Keyboard) [XGlite]
	// [2018-04-10 (Ver.1.00)] Yamaha PSR-I500 (Portable Keyboard) [XGlite]
	// [2020-02-26 (Ver.1.0)] Yamaha PSR-E373/EW310, YPT-370 (Portable Keyboard) [XGlite]
	// [2021-10-10 (Ver.1.0)] Yamaha PSR-E473/EW425 (Portable Keyboard) [XGlite]
	// [2024-05-02 (Ver.1.0)] Yamaha PSR-E383/EZ-310 (Portable Keyboard) [XGlite]
	// Clavinova / Digital pianos
	// [1998-02-12 (Ver.1.0)] Yamaha CLP-870 (Clavinova)
	// [2000-04-20 (Ver.1.0)] Yamaha CLP-990/990M (Clavinova)
	// [2000-04-20 (Ver.1.0)] Yamaha CLP-970/970M/970C (Clavinova)
	// [2000-04-20 (Ver.1.0)] Yamaha CLP-970A/970AM/970AC (Clavinova)
	// [2000-04-20 (Ver.1.0)] Yamaha CWP-1/CLP-970/CLP-970C (Clavinova)
	// [2002-11-15 (Ver.1.0)] Yamaha CLP-175/170/150 (Clavinova)
	// [2004-09-21 (Ver.1.00)] Yamaha CLP-280/270 (Clavinova)
	// [2005-??-?? (Ver.?.?)] Yamaha CLP-295GP (Clavinova)
	// [2007-11-07 (Ver.1.00)] Yamaha CLP-380 (Digital Piano)
	// [2010-10-05 (Ver.1.2)] Yamaha CLP-480 (Digital Piano)
	// [2013-04-18 (Ver.1.0)] Yamaha CLP-585/575/545/535/565GP (Digital Piano)
	// [2016-03-22 (Ver.1.0)] Yamaha CLP-695GP/685 (Digital Piano)
	// [2020-??-?? (Ver.1.0)] Yamaha CLP-795GP/785 (Digital Piano)
	// [2024-??-?? (Ver.1.0)] Yamaha CLP-895GP/885 (Digital Piano)
	// [2017-04-21 (Ver.1.0)] Yamaha CSP-170/150 (Digital Piano)
	// [2023-03-29 (Ver.1.0)] Yamaha CSP-275/255 (Digital Piano)
	// [1997-02-18 (Ver.1.0)] Yamaha CVP-98/96/600 (Clavinova)
	// [1997-02-18 (Ver.1.0)] Yamaha CVP-94/92 (Clavinova)
	// [1999-03-01 (Ver.1.0)] Yamaha CVP-109/107/105/103 (Clavinova)
	// [2001-06-25 (Ver.1.00)] Yamaha CVP-209/207/205/203 (Clavinova)
	// [2003-10-29 (Ver.1.00)] Yamaha CVP-309GP/309/307 (Clavinova)
	// [2006-05-08 (Ver.1.0)] Yamaha CVP-409/407/405/403/401 (Clavinova)
	// [2009-02-05 (Ver.1.0)] Yamaha CVP-509/505/503/501 (Clavinova)
	// [2012-07-13 (Ver.1.0)] Yamaha CVP-609/605/601 (Digital Piano)
	// [2015-06-17 (Ver.1.1)] Yamaha CVP-709/705/701 (Digital Piano)
	// [2019-05-01 (Ver.1.0)] Yamaha CVP-809/805 (Digital Piano)
	// [2002-01-25 (Ver.1.0)] Yamaha DGX-202 (Portable Grand) [XGlite]
	// [2002-01-25 (Ver.1.0)] Yamaha DGX-200 (Portable Grand) [XGlite]
	// [2002-03-12 (Ver.1.0)] Yamaha DGX-500/300 (Portable Grand) [XGlite]
	// [2003-12-01 (Ver.1.0)] Yamaha DGX-505/305 (Portable Grand) [XGlite]
	// [2004-01-27 (Ver.1.0)] Yamaha DGX-205/203 (Portable Grand) [XGlite]
	// [2005-11-17 (Ver.1.0)] Yamaha DGX-620 (Portable Grand) [XGlite]
	// [2005-11-17 (Ver.1.0)] Yamaha DGX-620/520, YPG-625/525 (Portable Grand) [XGlite]
	// [2005-11-17 (Ver.1.0)] Yamaha DGX-220/YPG-225 (Portable Grand) [XGlite]
	// [2007-05-14 (Ver.1.0)] Yamaha DGX-630 (Portable Grand) [XGlite]
	// [2007-10-10 (Ver.1.0)] Yamaha DGX-530/YPG-535 (Portable Grand) [XGlite]
	// [2007-10-10 (Ver.1.0)] Yamaha DGX-230/YPG-235 (Portable Grand) [XGlite]
	// [2010-03-18 (Ver.1.0)] Yamaha DGX-640 (Digital Piano) [XGlite]
	// [2013-02-05 (Ver.1.0)] Yamaha DGX-650 (Digital Piano) [XGlite]
	// [2015-02-09 (Ver.1.0)] Yamaha DGX-660 (Digital Piano) [XGlite]
	// [2020-04-01 (Ver.1.0)] Yamaha DGX-670 (Portable Grand)
	// [2007-05-31 (Ver.1.0)] Yamaha F11/01 (Modus)
	// [1996-06-27 (Ver.1.0)] Yamaha MDP10 (Music Data Player)
	// [2008-??-?? (Ver.?.?)] Yamaha MDP-30/30S (Music Data Player)
	// [2009-05-01 (Ver.1.0)] Yamaha NP-V80 (Portatone) [XGlite]
	// [2009-05-01 (Ver.1.0)] Yamaha NP-V60 (Portatone) [XGlite]
	// [2002-07-01 (Ver.1.0)] Yamaha P-250 (Electronic Piano)
	// [2017-08-29 (Ver.1.0)] Yamaha P-515 (Digital Piano)
	// [2023-08-?? (Ver.1.0)] Yamaha P-525 (Digital Piano)
	// [2020-02-04 (Ver.1.0)] Yamaha P-S500 (Digital Piano)
	// [2002-05-01 (Ver.1.00)] Yamaha PF-1000 (Electronic Piano)
	// [2002-05-01 (Ver.1.0)] Yamaha PF-500 (Electronic Piano)
	// [2009-09-18 (Ver.1.0)] Yamaha YDP-V240 (Digital Piano) [XGlite]
	// [2017-05-22 (Ver.1.0)] Yamaha YDP-184 (Digital Piano)
	// [2017-08-10 (Ver.1.0)] Yamaha YDP-S34 (Digital Piano)
	// [2018-03-02 (Ver.1.0)] Yamaha YDP-164/144/S54 (Digital Piano)
	// Silent piano / Hybrid piano
	// [1996-08-01 (Ver.1.00)] Yamaha HQSXG (PPC500R) (Silent Ensemble Piano)
	// [1996-08-01 (Ver.1.00)] Yamaha HQXG (PPC500RXG) (Silent Ensemble Piano)
	// [1998-02-01 (Ver.1.00)] Yamaha EMR1 (Ensemble Music Recorder)
	// [1999-08-01 (Ver.1.00)] Yamaha SXG (PPC500RH) (Silent Ensemble Piano)
	// [2000-07-01 (Ver.1.00)] Yamaha YMSXGZ (PPC50R) (Silent Ensemble Piano)
	// [2000-07-01 (Ver.1.00)] Yamaha EA1 (PPC55RCD) (Silent Ensemble Piano)
	// [2001-07-25 (Ver.1.00)] Yamaha YU-SEB (PPC55) (Silent Ensemble Piano)
	// [2011-03-18 (Ver.1.00)] Yamaha DKC-800 (Disklavier)
	// [2011-03-18 (Ver.3.10)] Yamaha DKC-850 (Disklavier Control Unit)
	// [2016-04-01 (Ver.1.00)] Yamaha ENSPIRE ST/PRO (Disklavier)
	// [2019-08-01 (Ver.1.00)] Yamaha DKC-900 (Disklavier)
	// [2005-06-06 (Ver.1.19J)] Yamaha XP (Silent Ensemble Piano)
	// [2012-06-07 (Ver.1.00)] Yamaha SH (Silent Piano)
	// [2012-06-07 (Ver.1.00)] Yamaha SHTA (TransAcoustic)
	// [2018-01-09 (Ver.1.0)] Yamaha SH2 (Silent Piano)
	// [2018-01-09 (Ver.1.0)] Yamaha SC2 (Silent Piano)
	// [2018-01-09 (Ver.1.0)] Yamaha TA2 (TransAcoustic Piano)
	// [2022-08-31 (Ver.1.0)] Yamaha SH3, SC3 (Silent Piano)
	// [2022-08-31 (Ver.1.0)] Yamaha TA3 (TransAcoustic Piano)
	// Electone
	// [1996-08-27 (Ver.1.00)] Yamaha AR-80 (Electone)
	// [1996-08-27 (Ver.1.00)] Yamaha AR-100 (Electone)
	// [1998-01-14 (Ver.1.00)] Yamaha EL-900 (Electone)
	// [1999-01-14 (Ver.1.00)] Yamaha EL-700 (Electone)
	// [1999-01-14 (Ver.1.00)] Yamaha EL-500 (Electone)
	// [2000-01-16 (Ver.1.00)] Yamaha ELX-1m (Electone)
	// [2000-03-26 (Ver.1.00)] Yamaha EL-200 (Electone)
	// [2000-03-28 (Ver.1.00)] Yamaha EL-400 (Electone)
	// [2000-04-16 (Ver.1.00)] Yamaha EL-900m (Electone)
	// [2001-11-15 (Ver.1.00)] Yamaha EL-100 (Electone)
	// [2005-03-03 (Ver.1.00)] Yamaha ELB-01 (Electone)
	// [2006-04-06 (Ver.1.00)] Yamaha DDK-7 (Dual Manual Keyboard)
	// [2008-10-10 (Ver.1.00)] Yamaha ELS-01C (Electone)
	// [2008-10-10 (Ver.1.00)] Yamaha ELS-01 (Electone)
	// [2008-10-10 (Ver.1.00)] Yamaha ELS-01X (Electone)
	// [2013-10-20 (Ver.1.00)] Yamaha ELS-02 (Electone)
	// [2013-10-20 (Ver.1.00)] Yamaha ELS-02C (Electone)
	// [2013-10-20 (Ver.1.00)] Yamaha ELS-02X (Electone)
	// [2016-01-20 (Ver.1.00)] Yamaha ELB-02 (Electone)
	// [2016-02-01 (Ver.1.00)] Yamaha ELC-02/ELCU-M02 (Electone)
	// [1998-08-25 (Ver.1.0)] Yamaha MDP-20XG (Music Data Player)
	// Educational instruments
	// [1995-08-21 (Ver.1.0)] Yamaha SK1XG (MIDI Sound Keyboard)
	// [1995-10-06 (Ver.1.0)] Yamaha SDX3000 (Music Synthesizer)
	// [1997-02-18 (Ver.1.0)] Yamaha MLP-71D (Clavinova)
	// [1997-03-01 (Ver.1.0)] Yamaha SE-7000 (School Organ)
	// [1999-03-01 (Ver.1.0)] Yamaha SE-7000II (School Organ)
	// [1999-04-01 (Ver.1.0)] Yamaha SE-4000 (School Organ)
	// [1999-12-01 (Ver.1.0)] Yamaha SE-3000 (School Organ)
	// [2000-12-01 (Ver.1.0)] Yamaha MDP10S (Music Data Player)
	// [2003-06-01 (Ver.1.0)] Yamaha SHK-1000 (Harmony Keyboard)
	// [2003-06-01 (Ver.1.0)] Yamaha SHK-1000II (Harmony Keyboard)
	// [2011-03-01 (Ver.1.0)] Yamaha SE-8000 (School Organ)
	// [2011-12-28 (Ver.1.0)] Yamaha SKB-J700 (School Digital Keyboard) [XGlite]
	// [2016-??-?? (Ver.?.?)] Yamaha SEP-3000 (School Digital Piano) [XGlite]
	{
		modelName: 'XG',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 (?:0[0-46]|7[d-f])',                         // System
			'01 00 0.',                                         // Information
			'02 01 (?:0[0-9a-d]|1[0-5]|2[0-9a-e]|3[0-5]|[45].|60|7[0-5])',  // Reverb/Chorus/Variation
			'06 00 [01].',                                      // Display Letter
			'07 00 [0-2].',                                     // Display Bitmap Data
			'08 0. (?:[01].|2[0-8]|[3-5].|6[0-9a-e])',          // Multi Part 1-16
			'3[01] (?:0[d-f]|[1-4].|5[0-9ab]) 0.',              // Drum Setup 1-2
		],
	},
	{
		modelName: 'MU80',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 (?:0[0-6]|7[d-f])',                          // System
			'02 40 (?:0.|1[0-4])',                              // Multi EQ
			'03 00 (?:0.|1[01]|2[0-5])',                        // Insertion Effect 1
			'08 [01]. (?:[01].|2[0-8]|[3-5].|6[0-9a-e])',       // Multi Part 1-32
			'10 0[01] (?:0[0-4be]|1[1-4]|3[239ab]|40|59|60)',   // A/D Part 1-2
			'3[0-3] (?:0[d-f]|[1-4].|5[0-9ab]) 0.',             // Drum Setup 1-4
		],
	},
	{
		modelName: 'MU90',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'03 0[01] (?:0.|1[01]|2[0-5]|3.|4[0-3])',               // Insertion Effect 1-2
			'08 [01]. (?:[01].|2[0-8]|[3-5].|6[0-9a-e]|7[2367])',   // Multi Part 1-32 > EQ
			'0a [01]. 2[01]',                                       // Multi Part (additional) 1-32
			'10 0[01] (?:0[0-4be]|1[1-4]|3[2359ab]|40|59|60)',      // A/D Part 1-2 > Mute
			'11 00 00',                                             // A/D System
			'3[0-3] (?:0[d-f]|[1-4].|5[0-9ab]) (?:0.|2[0-9a-d]|5[01]|6[01])',   // Drum Setup 1-4 > EQ/HPF/Velocity Sense
		],
	},
	{
		modelName: 'MU90R',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a [01]. (?:10|2[01])',    // Multi Part (additional) 1-32 > Output Select
			'3[0-3] (?:0[d-f]|[1-4].|5[0-9ab]) (?:0.|2[0-9a-d]|40|5[01]|6[01])',    // Drum Setup 1-4 > Output Select
		],
	},
	{
		modelName: 'B2000',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'02 01 61',         // Variation > CBC1 Variation Control Depth
			'03 0[01] 12',      // Insertion Effect 1-2 > CBC1 Insertion Control Depth
			'0a [01]. 3[0-2]',  // Multi Part (additional) 1-32 > CBC1
		],
	},
	{
		modelName: 'MU128',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'08 [0-3]. (?:[01].|2[0-8]|[3-5].|6[0-9a-e]|7[2367])',  // Multi Part 1-64
			'0a [0-3]. 2[01]',                                      // Multi Part (additional) 1-64
			'71 0[0-7] 0.',                                         // Plugin Board > Note Filter
		],
	},
	{
		modelName: 'MU1000',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'03 0[0-3] (?:0.|1[01]|2[0-5]|3.|4[0-3])',  // Insertion Effect 1-4
		],
	},
	// XG Plug-in boards
	{
		modelName: 'VH-XG',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: '04 0[0-2] (?:0.|1[0145]|2[0-5])', // Unique Insertion Effect
	},
	{
		modelName: 'VL-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: [
			'08 0. 7[01]',          // Multi Part 1-16 > Bend Pitch Low Control/Filter EG Depth
			'09 0. (?:0.|1[0-6])',  // Multi Part for VL
			'70 00 ..',             // Plugin Board > Part Assign
		],
	},
	{
		modelName: 'SG-XG',
		modelId: [0x4c], commands: [0x00, 0x10, 0x30],
		address: '70 01 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'DX-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 02 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'AN-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 03 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'PF-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 04 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'DR-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 05 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'PC-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 06 ..',    // Plugin Board > Part Assign
	},
	{
		modelName: 'AP-XG',
		modelId: [0x4c], commands: [0x00, 0x10],
		address: '70 07 ..',    // Plugin Board > Part Assign
	},
	// Arranger workstations
	{
		modelName: 'Tyros',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a 0. 4[0-5]', // Multi Part (additional) 1-16 > Offset Level Control
		],
	},
	{
		modelName: 'Tyros3',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'03 0[0-5] (?:0.|1[01]|2[0-5]|3.|4[0-3])',  // Insertion Effect 1-6
		],
	},
	{
		modelName: 'Tyros4',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'04 00 (?:0[0-9a-c]|14|[23].|4[0-5]|6.|7[0-7a-f])', // Unique Insertion Effect (Vocal Harmony)
		],
	},
	{
		modelName: 'Tyros5',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'04 00 (?:0[0-9a-c]|1[4-9ab]|[23].|4[0-5]|6.|7[0-7a-f])',   // Unique Insertion Effect (Vocal Harmony)
		],
	},
	{
		modelName: 'PSR-S970',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'02 40 (?:0.|1[0-4]|2.|3[0-3])',    // Multi EQ
			'3[01] (?:0[d-f]|[1-4].|5[0-9ab]) (?:0.|2[0-9a-d]|7[0-3])', // Drum Setup 1-2 > Source Drum Kit
		],
	},
	{
		modelName: 'Genos',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'03 (?:0.|1[0-3]) (?:0.|1[01]|2[0-5]|3.|4[0-3])',   // Insertion Effect 1-20
			'0a [01]. (?:0[0-3]|4[0-5])',                       // Multi Part (additional) 1-16
		],
	},
	{
		modelName: 'PSR-A5000',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a [01]. (?:0[0-9]|4[0-5]|5[01])',                 // Multi Part (additional) 1-16
			'3[01] .. (?:0.|2[0-9a-d]|7[0-3])',                 // Drum Setup 1-2 > Note No. #0-127
		],
	},
	{
		modelName: 'Genos2',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a [01]. (?:0[0-9a-d]|4[0-5]|5[01]|60)',           // Multi Part (additional) 1-16 > Element Volume Control
			'3[01] .. (?:0.|2[0-9a-d]|4[01]|5[0-2]|7[0-3])',    // Drum Setup 1-2 > Insertion Effect Bypass/Element Volume Control Offset
		],
	},
	// XG Common
	{
		modelName: 'XG Reserved',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'02 01 (?:0[0-9a-d]|1[0-5]|2[0-9a-e]|3[0-5]|[45].|6[0-2]|7[0-5])',  // Reverb/Chorus/Variation
			'03 .. (?:0.|1[0-3]|2[0-5]|3.|4[0-3])',             // Insertion Effect
			'04 0[0-7] ..',                                     // Unique Insertion Effect
			'07 .. [0-2].',                                     // Display Bitmap Data
			'08 [0-3]. (?:[01].|2[0-8]|[3-5].|6[0-9a-e]|7.)',   // Multi Part
			'0a [0-3]. (?:10|2[0-7]|3[0-689a-e])',              // Multi Part (additional)
			'10 [0-3]. (?:0.|1[0-4]|[3-5].|60)',                // A/D Part 1-64
			'11 [0-3]. 0[0-3]',                                 // A/D Configuration
			'12 [0-3]. (?:3[08])',                              // A/D Part (additional)
			'3. .. (?:0.|2[0-9a-d]|40|5[01]|6[01]|7[0-3])',     // Drum Setup
		],
	},
	{
		modelName: 'XG Compatible',
		modelId: [0x4c], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1996-04-09 (Ver.1.1)] Yamaha P50-m (Piano Tone Generator)
	{
		modelName: 'P50-m',
		modelId: [0x55], commands: [0x00, 0x10],
	},
	// [1996-04-25 (Ver.1.0)] Yamaha VL70-m (Virtual Acoustic Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha PLG100-VL (Virtual Acoustic Plug-in Board)
	// [1998-04-10 (Ver.1.0)] Yamaha WF192XG (PCI Sound Card)
	// [1999-09-21 (Ver.1.0)] Yamaha PLG150-VL (Virtual Acoustic Plug-in Board)
	{
		modelName: 'VL70-m',
		modelId: [0x57], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1996-10-18 (Ver.1.0)] Yamaha MU90 (Tone Generator)
	// [1996-12-16 (Ver.1.0)] Yamaha MU90R (Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100 (Tone Generator)
	// [1997-05-07 (Ver.1.0)] Yamaha MU100R (Tone Generator)
	// [1998-05-22 (Ver.1.0)] Yamaha MU128 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU2000 (Tone Generator)
	// [1999-09-17 (Ver.1.0)] Yamaha MU1000 (Tone Generator)
	{
		modelName: 'MU90 Native 2',
		modelId: [0x59], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'09 0[0-3] (?:[01].|2[0-3])',                       // Current Performance > Part 1-4
			'0b 00 (?:0.|1[0-7]|[23].|4[0-7]|7[0-5])',          // Current Performance > Common
			'0c 0[01] 0[0-9a-e]',                               // Current Performance > Insertion Effect 1-2
			'3[0-3] (?:[0-5].|6[0-3]) (?:[01].|2[01])',         // Internal Performance > Part 1-4
			'40 (?:[0-5].|6[0-3]) (?:0.|1[0-7]|[23].|4[0-7]|7[0-5])',   // Internal Performance > Common
			'5[01] (?:[0-5].|6[0-3]) 0[0-9a-e]',                // Internal Performance > Insertion Effect 1-2
		],
	},
	{
		modelName: 'MU100 Native 2',
		modelId: [0x59], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'09 0[0-3] (?:[01].|2[0-5])',                       // Current Performance > Part 1-4 > Bank Select
			'3[0-3] (?:[0-5].|6[0-3]) (?:[01].|2[01]|3[01])',   // Internal Performance > Part 1-4 > Bank Select
		],
	},
	{
		modelName: 'MU Native 2',
		modelId: [0x59], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1998-01-13 (Ver.1.0)] Yamaha EX5 (Music Synthesizer)
	// [1998-01-13 (Ver.1.0)] Yamaha EX7 (Music Synthesizer)
	// [1998-01-13 (Ver.1.0)] Yamaha EX5R (Tone Generator)
	{
		modelName: 'EX5',
		modelId: [0x5b], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1997-03-19 (Ver.1.0)] Yamaha AN1x (Control Synthesizer)
	// [1999-06-16 (Ver.1.0)] Yamaha PLG150-AN (Analog Physical Modeling Plug-in Board)
	// [2000-12-20 (Ver.1.0)] Yamaha AN200 (Desktop Control Synthesizer)
	{
		modelName: 'AN1x',
		modelId: [0x5c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 ..',         // System
			'01 .. ..',         // User Pattern
			'10 0[0-9a-c] ..',  // Current Voice Common
			'10 0e ..',         // Current Pattern Buffer
			'10 1[0-2] ..',     // Current Voice Scene Buffer
			'11 .. ..',         // User Voice 1-128
		],
	},
	{
		modelName: 'PLG150-AN',
		modelId: [0x5c], commands: [0x00, 0x10],
		address: [
			'00 00 ..',         // AN1x System
			'00 08 ..',         // PLG150-AN System
			'01 .. ..',         // User Step Seq Pattern
			'09 0. ..',         // PLG150-AN Native Part 1-16
			'10 0[0-9a-c] ..',  // Current Voice Common
			'10 0e ..',         // Current Step Seq Buffer
			'10 10 ..',         // Current Voice Scene Buffer
			'11 .. ..',         // AN1x User Voice 1-128
			'20 .. ..',         // User Voice 1-128
		],
	},
	{
		modelName: 'AN200',
		modelId: [0x5c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'10 0[0-9a-c] ..',  // Current Voice Common
			'10 0d ..',         // AN200 Current Voice Add
			'10 0e ..',         // Current Voice Step Seq
			'10 10 ..',         // Current Voice Scene Element
			'10 3[01] ..',      // AN200 Current Voice Scene
			'20 .. ..',         // AN200 User Pattern Voice 1-128
			'22 .. ..',         // AN200 User Pattern Voice Add 1-128
			'4[01] .. ..',      // AN200 User Pattern Scene 1/2 1-128
		],
	},
	// [1997-05-07 (Ver.1.0)] Yamaha PLG100-SG (Formant Synging Plug-in Board)
	{
		modelName: 'PLG100-SG',
		modelId: [0x5d], commands: [0x00, 0x10, 0x30],
	},
	// [1998-07-16 (Ver.1.0)] Yamaha FS1R (Tone Generator)
	{
		modelName: 'FS1R',
		modelId: [0x5e], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1997-04-24 (Ver.1.0)] Yamaha QY70 (Music Sequencer)
	// [2000-10-06 (Ver.1.0)] Yamaha QY100 (Music Sequencer)
	{
		modelName: 'QY70',
		modelId: [0x5f], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 ..',     // System
			'01 .. ..',     // Bulk Dump Song
			'02 .. ..',     // Bulk Dump Pattern
			'03 00 ..',     // Bulk Dump Setup
			'04 00 00',     // Bulk Dump All
			'05 00 00',     // Information > Song
			'05 01 0[01]',  // Information > Pattern
			'08 0[01] 00',  // Command
		],
	},
	{
		modelName: 'QY100',
		modelId: [0x5f], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'[01]0 00 ..',      // System
			'[01]1 .. ..',      // Bulk Dump Song
			'[01]2 .. ..',      // Bulk Dump Pattern
			'13 00 ..',         // Bulk Dump Setup
			'14 00 00',         // Bulk Dump All
			'15 00 00',         // Information > Song
			'15 01 0[01]',      // Information > Pattern
			'16 .. ..',         // Guitar Effect
			'[01]8 0[0-2] 00',  // Command
			'18 0[23] 00',      // Command
		],
	},
	// [1998-03-09 (Ver.1.1)] Yamaha B2000 (Music Production Synthesizer)
	{
		modelName: 'B2000',
		modelId: [0x60], commands: [0x00, 0x10],
	},
	// [1998-03-20 (Ver.1.0)] Yamaha PLG100-DX (Advanced DX/TX Plug-in Board)
	// [1999-10-07 (Ver.1.0)] Yamaha PLG150-DX (Advanced DX/TX Plug-in Board)
	// [2001-01-23 (Ver.1.0)] Yamaha DX200 (Desktop Control Synthesizer)
	{
		modelName: 'PLG100-DX',
		modelId: [0x62], commands: [0x00, 0x10],
		address: [
			'00 00 ..',     // System
			'60 0f ..',     // Multi Part 1-16
		],
	},
	{
		modelName: 'DX200',
		modelId: [0x62], commands: [0x00, 0x10],
		address: [
			'00 00 ..',             // System
			'10 (?:0[0-4]|40) ..',  // Current Voice
			'2[01] .. ..',          // User Voice > Common 1/2
			'3. .. ..',             // User Voice > Free EG
			'4[01] .. ..',          // User Voice > Scene 1/2
			'50 .. ..',             // User Voice > Step Seq
		],
	},
	// [1998-11-16 (Ver.1.0)] Yamaha CS2x (Control Synthesizer)
	{
		modelName: 'CS2x',
		modelId: [0x63], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1999-07-13 (Ver.1.0)] Yamaha CS6x (Control Synthesizer)
	// [1999-07-13 (Ver.1.0)] Yamaha CS6R (Tone Generator)
	// [1999-07-13 (Ver.1.0)] Yamaha S80 (Music Synthesizer)
	// [2000-02-15 (Ver.1.0)] Yamaha S30 (Music Synthesizer)
	{
		modelName: 'CS6x/S80',
		modelId: [0x64], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 (?:[01].|2[0-8a-f]|3[0-9a])',    // System
			'00 10 ..',                             // Plug-in Board Native System
			'00 20 ..',                             // Master EQ
			'0a 00 (?:0[7a-f]|1.|2[0-689a-f]|3.)',  // Remote Switch
			'0[ef] .. ..',                          // Bulk Control
			'30 00 ..',                             // Performance Common
			'31 (?:0.|[4-6]0|61) ..',               // Performance Part
			'32 0[0-3] 0[0-9a-df]',                 // Performance Zone
			'40 (?:0[0-6]|70) ..',                  // Voice Common
			'4[1-4] .. ..',                         // Voice Element Group
			'46 (?:0[0-6]|7[01]) ..',               // Kit Common (Drum Voice)
			'4[7-9a] .. ..',                        // Kit Element Group
			'4c (?:0[0-35]|[127]0) ..',             // Voice Plugin
		],
	},
	{
		modelName: 'CS6x',
		modelId: [0x64], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 (?:29|3b)',  // System > Scene Control Number/RB Mode
			'00 70 ..',         // Panel Knob
			'0a 00 0[0-689]',   // Remote Switch
		],
	},
	{
		modelName: 'S80',
		modelId: [0x64], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'0a 00 27',         // Remote Switch > Quick Access
			'32 0[0-3] 0e',     // Performance Zone > Control Slider Control Number
		],
	},
	// [1999-07-09 (Ver.1.0)] Yamaha PLG150-PF (Piano Plug-in Board)
	// [2002-04-26 (Ver.1.0)] Yamaha PLG150-DR (Drums Plug-in Board)
	// [2002-04-26 (Ver.1.0)] Yamaha PLG150-PC (Percussion Plug-in Board)
	// [2004-06-15 (Ver.1.0)] Yamaha PLG150-AP (Piano Plug-in Board)
	{
		modelName: 'PLG150-PF',
		modelId: [0x67], commands: [0x00, 0x10],
		address: [
			'00 00 ..',     // PLG150-PF System
			'60 0. ..',     // PLG150-PF Multi Part
		],
	},
	{
		modelName: 'PLG150-DR/PC',
		modelId: [0x67], commands: [0x00, 0x10],
		address: '[12]. .. ..', // PLG150-DR/PC Current Voice
	},
	{
		modelName: 'PLG150-DR',
		modelId: [0x67], commands: [0x00, 0x10],
		address: [
			'3[0-7] .. ..',     // PLG150-DR Current Voice
			'4[0-7] .. ..',     // PLG150-DR Current Voice
			'5[0-2] 0. ..',     // PLG150-DR Multi Part
		],
	},
	{
		modelName: 'PLG150-PC',
		modelId: [0x67], commands: [0x00, 0x10],
		address: [
			'3[89a-f] .. ..',   // PLG150-DR Current Voice
			'4[89a-f] .. ..',   // PLG150-DR Current Voice
			'5[89a] 0. ..',     // PLG150-DR Multi Part
		],
	},
	{
		modelName: 'PLG150-AP',
		modelId: [0x67], commands: [0x00, 0x10],
		address: [
			'01 00 ..',     // PLG150-AP System
			'61 0. ..',     // PLG150-AP Multi Part
		],
	},
	{
		modelName: 'PLG150-PF/DR/PC/AP',
		modelId: [0x67], commands: [0x00, 0x10],
	},
	// [1999-09-17 (Ver.1.0)] Yamaha MU2000 (Tone Generator)
	{
		modelName: 'MU2000',
		modelId: [0x68], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2001-04-01 (Ver.1.0)] Yamaha RS7000 (Music Production Studio)
	{
		modelName: 'RS7000',
		modelId: [0x6a], commands: [0x10],
	},
	// [2000-09-06 (Ver.1.0)] Yamaha MOTIF6/7/8 (Music Synthesizer)
	// [2002-05-27 (Ver.1.0)] Yamaha S90 (Music Synthesizer)
	{
		modelName: 'MOTIF',
		modelId: [0x6b], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2000-12-27 (Ver.1.0)] Yamaha S03/S03SL (Music Synthesizer)
	// [2001-06-18 (Ver.1.0)] Yamaha EOS BX (Entertainment Operating System)
	// [2001-11-20 (Ver.1.0)] Yamaha S08 (Music Synthesizer)
	{
		modelName: 'S03',
		modelId: [0x6c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'00 00 ..',                 // Native System
			'0a 00 (?:[01].|2[0-7])',   // Remote Switch
			'0[ef] .. ..',              // Bulk Control
			'30 00 ..',                 // Multi Common
			'30 01 ..',                 // Multi Effect
			'31 0. ..',                 // Multi Part
			'40 00 ..',                 // Normal Voice Common
			'41 0[0-3] ..',             // Normal Voice Element
			'46 00 ..',                 // Drum Voice Common
			'47 .. ..',                 // Drum Voice Key
		],
	},
	{
		modelName: 'BX',
		modelId: [0x6c], commands: [0x00, 0x10, 0x20, 0x30],
		address: '0a 00 28',    // Remote Switch > Voice + Seq Play
	},
	{
		modelName: 'S08',
		modelId: [0x6c], commands: [0x00, 0x10, 0x20, 0x30],
		address: [
			'01 00 ..',                 // Native System
			'0a 00 (?:[01].|2[0-9])',   // Remote Switch
			'1[ef] .. ..',              // Bulk Control
			'50 00 ..',                 // Multi Common
			'50 01 ..',                 // Multi Effect
			'51 0. ..',                 // Multi Part
			'60 00 ..',                 // Normal Voice Common
			'61 0[0-3] ..',             // Normal Voice Element
			'66 00 ..',                 // Drum Voice Common
			'67 .. ..',                 // Drum Voice Key
		],
	},
	// [2002-10-31 (Ver.1.0)] Yamaha MOTIF-RACK (Tone Generator)
	{
		modelName: 'MOTIF-RACK',
		modelId: [0x6f], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [1995-??-?? (Ver.?.?)] Yamaha SW60XG (Sound Edge)
	{
		modelName: 'SW60XG',
		modelId: [0x7a], commands: [0x00, 0x10],
	},
	// [2003-02-24 (Ver.1.0)] Yamaha MOTIF ES6/7/8 (Music Synthesizer)
	// [2004-06-09 (Ver.1.0)] Yamaha MOTIF-RACK ES (Tone Generator )
	// [2004-12-01 (Ver.1.0)] Yamaha S90 ES (Music Synthesizer)
	// [2005-08-04 (Ver.1.0)] Yamaha MO6/8 (Music Synthesizer)
	{
		modelName: 'MOTIF ES',
		modelId: [0x7f, 0x00], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2006-09-01 (Ver.1.0)] Yamaha MOTIF XS6/7/8 (Music Production Synthesizer)
	// [2007-11-15 (Ver.1.0)] Yamaha MOTIF-RACK XS (Tone Generator )
	{
		modelName: 'MOTIF XS',
		modelId: [0x7f, 0x03], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2005-11-01 (Ver.1.0)] Yamaha CP300 (Stage Piano)
	{
		modelName: 'CP300',
		modelId: [0x7f, 0x04], commands: [0x00, 0x20],
	},
	// [2005-12-01 (Ver.1.0)] Yamaha CP33 (Stage Piano)
	{
		modelName: 'CP33',
		modelId: [0x7f, 0x05], commands: [0x00, 0x20],
	},
	// [2009-07-22 (Ver.1.0)] Yamaha CP1 (Stage Piano)
	{
		modelName: 'CP1',
		modelId: [0x7f, 0x0c], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2009-01-29 (Ver.1.0)] Yamaha S90/S70 XS (Music Synthesizer)
	{
		modelName: 'S90 XS',
		modelId: [0x7f, 0x0d], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2009-11-16 (Ver.1.0)] Yamaha CP5 (Stage Piano)
	{
		modelName: 'CP5',
		modelId: [0x7f, 0x10], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2009-11-16 (Ver.1.0)] Yamaha CP50 (Stage Piano)
	{
		modelName: 'CP50',
		modelId: [0x7f, 0x11], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2010-05-08 (Ver.1.0)] Yamaha MOTIF XF6/7/8 (Music Production Synthesizer)
	{
		modelName: 'MOTIF XF',
		modelId: [0x7f, 0x12], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2010-09-21 (Ver.1.0)] Yamaha MOX6/8 (Music Production Synthesizer)
	{
		modelName: 'MOX',
		modelId: [0x7f, 0x14], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2012-06-29 (Ver.1.0)] Yamaha MX49/61/88 (Music Synthesizer)
	{
		modelName: 'MX49/61/88',
		modelId: [0x7f, 0x17], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2012-11-14 (Ver.1.0)] Yamaha CP4 STAGE (Stage Piano)
	{
		modelName: 'CP4 STAGE',
		modelId: [0x7f, 0x1a], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2012-11-14 (Ver.1.0)] Yamaha CP40 STAGE (Stage Piano)
	{
		modelName: 'CP40 STAGE',
		modelId: [0x7f, 0x1b], commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2013-04-04 (Ver.1.0)] Yamaha MOXF6/8 (Music Production Synthesizer)
	{
		modelName: 'MOXF',
		modelId: [0x7f, 0x1c], subModelId: 0x00, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2016-02-18 (Ver.1.0)] Yamaha MONTAGE6/7/8 (Music Synthesizer)
	{
		modelName: 'MONTAGE',
		modelId: [0x7f, 0x1c], subModelId: 0x02, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2016-03-31 (Ver.1.1)] Yamaha reface CS (Mobile Mini Keyboard)
	{
		modelName: 'reface CS',
		modelId: [0x7f, 0x1c], subModelId: 0x03, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2015-02-20 (Ver.1.0)] Yamaha reface CP (Mobile Mini Keyboard)
	{
		modelName: 'reface CP',
		modelId: [0x7f, 0x1c], subModelId: 0x04, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2015-03-23 (Ver.1.0)] Yamaha reface DX (Mobile Mini Keyboard)
	{
		modelName: 'reface DX',
		modelId: [0x7f, 0x1c], subModelId: 0x05, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2015-03-23 (Ver.1.0)] Yamaha reface YC (Mobile Mini Keyboard)
	{
		modelName: 'reface YC',
		modelId: [0x7f, 0x1c], subModelId: 0x06, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2017-07-18 (Ver.1.0)] Yamaha MODX6/7/8 (Music Synthesizer)
	// [2021-04-09 (Ver.1.0)] Yamaha MODX6+/7+/8+ (Music Synthesizer)
	{
		modelName: 'MODX',
		modelId: [0x7f, 0x1c], subModelId: 0x07, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2017-11-29 (Ver.1.0)] Yamaha CP73/88 (Stage Piano)
	{
		modelName: 'CP73/88',
		modelId: [0x7f, 0x1c], subModelId: 0x08, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2019-09-25 (Ver.1.0)] Yamaha YC61 (Stage Keyboard)
	// [2019-09-25 (Ver.1.0)] Yamaha YC73/88 (Stage Keyboard)
	{
		modelName: 'YC61/73/88',
		modelId: [0x7f, 0x1c], subModelId: 0x09, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2021-07-16 (Ver.1.0)] Yamaha CK61/88 (Stage Keyboard)
	{
		modelName: 'CK61/88',
		modelId: [0x7f, 0x1c], subModelId: 0x0b, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2023-09-26 (Ver.1.0)] Yamaha SEQTRAK (Music Production Studio)
	{
		modelName: 'SEQTRAK',
		modelId: [0x7f, 0x1c], subModelId: 0x0c, commands: [0x00, 0x10, 0x20, 0x30],
	},
	// [2022-09-14 (Ver.1.0)] Yamaha MONTAGE M6/M7/M8x (Music Synthesizer)
	// [2025-07-02 (Ver.1.0)] Yamaha MODX M6/M7/M8 (Music Synthesizer)
	{
		modelName: 'MONTAGE M6/M7/M8x',
		modelId: [0x7f, 0x1c], subModelId: 0x0d, commands: [0x00, 0x10, 0x20, 0x30],
	},
];

export const sysExParsers = Object.freeze([
	...modelProps.map((modelProp) => makeYamahaXgParser(modelProp)).flat(),
	...Object.values(modelProps.reduce((p, c) => {
		// Counts the number of parsers for each model ID.
		const key = String([...c.modelId, c.subModelId]);
		if (!p[key]) {
			p[key] = [];
		}
		p[key].push(c);
		return p;
	}, {})).map((modelProps) => {
		const parsers = [];
		const {modelName, modelId, subModelId} = modelProps[0];
		const commands = [...new Set(modelProps.map((e) => e.commands).flat())];
		// If multiple parsers exist for each model ID and all of them handles limited "address" range, add an additional parser to handle whole address.
		if (modelProps.length > 1 && modelProps.every((modelProp) => 'address' in modelProp)) {
			parsers.push(...makeYamahaXgParser({modelName, modelId, subModelId, commands}));
		}
		return parsers;
	}).flat(),
]);
