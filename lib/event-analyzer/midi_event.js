import {analyzeChannelMessage} from './channel_message.js';
import {analyzeSystemMessage} from './system_message.js';
import {analyzeSysEx} from './sysex.js';

export function analyzeMidiMessage(bytes) {
	if (!bytes?.length || (bytes[0] & 0x80) === 0) {
		return null;
	}

	if (bytes[0] === 0xf0) {	// For SysEx
		return {kind: 'f0', bytes, ...analyzeSysEx(bytes)};
	} else if ((bytes[0] & 0xf0) !== 0xf0) {	// For Channel Messages
		return analyzeChannelMessage(bytes);
	} else {	// For System Common Message and System Real-time Message
		return analyzeSystemMessage(bytes);
	}
}
