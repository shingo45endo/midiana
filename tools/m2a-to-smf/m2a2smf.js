import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import assert from 'node:assert';

import {convertM2aToSmfs, defaultSettings} from './m2a_converter.js';

const usage = `Usage: node m2a2smf.js [options] m2a-file [output-dir]

Converts an M2A file of the Yamaha MU2000 to 3 Standard MIDI Files:
  NAME_samples.mid  Sends the sampling data by SysEx
  NAME_song.mid     The song in the M2A file
  NAME.mid          The sampling data and the song

Options:
  --device-no <0-15>    Device number of the SysEx (default: ${defaultSettings.deviceNo})
  --no-init             Do not initialize the sampling data before sending
  --init-wait <ms>      Wait after the initialization (default: ${defaultSettings.initWait})
  --bytes-per-sec <n>   Speed to send the SysEx (default: ${defaultSettings.bytesPerSec})
  --debug               Enable assertion
  -h, --help            Show this help`;

const {values: argv, positionals} = util.parseArgs({
	options: {
		'device-no':     {type: 'string'},
		'no-init':       {type: 'boolean', default: false},
		'init-wait':     {type: 'string'},
		'bytes-per-sec': {type: 'string'},
		'debug':         {type: 'boolean', default: false},
		'help':          {type: 'boolean', short: 'h', default: false},
	},
	allowPositionals: true,
});

if (argv.help || positionals.length < 1) {
	console.log(usage);
	process.exit((argv.help) ? 0 : 1);
}

console.assert = (argv.debug) ? assert : () => {/* EMPTY */};

const settings = {
	...defaultSettings,
	deviceNo:    toInteger(argv['device-no'], defaultSettings.deviceNo, 0, 15),
	isInitSent:  !argv['no-init'],
	initWait:    toInteger(argv['init-wait'], defaultSettings.initWait, 0, 60000),
	bytesPerSec: toInteger(argv['bytes-per-sec'], defaultSettings.bytesPerSec, 100, 1000000),
};

const [m2aFile, outputDir] = positionals;
const {name} = path.parse(m2aFile);
const dir = outputDir ?? path.dirname(m2aFile);

try {
	const logs = [];
	const {samplingSmf, songSmf, combinedSmf} = convertM2aToSmfs(new Uint8Array(fs.readFileSync(m2aFile)), settings, logs);
	for (const log of logs) {
		console.warn(log.message);
	}

	fs.writeFileSync(path.join(dir, `${name}_samples.mid`), samplingSmf);
	if (songSmf) {
		fs.writeFileSync(path.join(dir, `${name}_song.mid`), songSmf);
	}
	if (combinedSmf) {
		fs.writeFileSync(path.join(dir, `${name}.mid`), combinedSmf);
	}
} catch (e) {
	console.error((argv.debug) ? e : `${e}`);
	process.exitCode = 1;
}

function toInteger(text, defaultValue, minValue, maxValue) {
	if (text === undefined) {
		return defaultValue;
	}
	const value = Number(text);
	if (!Number.isInteger(value) || value < minValue || value > maxValue) {
		throw new Error(`Invalid value: ${text} (${minValue}-${maxValue})`);
	}
	return value;
}
