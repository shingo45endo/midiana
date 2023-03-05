function makeConverter(bitLen, elemSize, isLittleEndian) {
	const maskBit = (1 << bitLen) - 1;
	const shiftNums = [...new Array(elemSize)].fill().map((_, i) => i * bitLen);
	if (!isLittleEndian) {
		shiftNums.reverse();
	}

	let makeValue;
	switch (elemSize) {
	case 2:
		makeValue = ((maskBit, shiftNums) => (...values) => {
			console.assert(values.length === 2);
			return ((values[0] & maskBit) << shiftNums[0]) | ((values[1] & maskBit) << shiftNums[1]);
		})(maskBit, shiftNums);
		break;

	case 3:
		makeValue = ((maskBit, shiftNums) => (...values) => {
			console.assert(values.length === 3);
			return ((values[0] & maskBit) << shiftNums[0]) | ((values[1] & maskBit) << shiftNums[1]) | ((values[2] & maskBit) << shiftNums[2]);
		})(maskBit, shiftNums);
		break;

	case 4:
		makeValue = ((maskBit, shiftNums) => (...values) => {
			console.assert(values.length === 4);
			return ((values[0] & maskBit) << shiftNums[0]) | ((values[1] & maskBit) << shiftNums[1]) | ((values[2] & maskBit) << shiftNums[2]) | ((values[3] & maskBit) << shiftNums[3]);
		})(maskBit, shiftNums);
		break;

	case 5:
		makeValue = ((maskBit, shiftNums) => (...values) => {
			console.assert(values.length === 5);
			return ((values[0] & maskBit) << shiftNums[0]) | ((values[1] & maskBit) << shiftNums[1]) | ((values[2] & maskBit) << shiftNums[2]) | ((values[3] & maskBit) << shiftNums[3]) | ((values[4] & maskBit) << shiftNums[4]);
		})(maskBit, shiftNums);
		break;

	default:
		console.assert(false);
		break;
	}

	const makeArray = ((elemSize, makeValue) => (...values) => {
		console.assert(values.length % elemSize === 0, `The length of array must be multiple of ${elemSize}.`);
		return [...new Array(values.length / elemSize)].fill().map((_, i) => makeValue(...values.slice(elemSize * i, elemSize * (i + 1))));
	})(elemSize, makeValue);

	return {
		makeArray, makeValue,
		bitLen, elemSize, isLittleEndian,
	};
}

export const converters = Object.freeze({
	'nibbled8bitBE':  makeConverter(4, 2, false),
	'nibbled16bitBE': makeConverter(4, 4, false),
	'14bitBE':        makeConverter(7, 2, false),
	'21bitBE':        makeConverter(7, 3, false),
	'14bitLE':        makeConverter(7, 2, true),
	'21bitLE':        makeConverter(7, 3, true),
});

export const {makeValue: asNibbled8bitBE,  makeArray: convertNibbled8bitBE}  = converters.nibbled8bitBE;
export const {makeValue: asNibbled16bitBE, makeArray: convertNibbled16bitBE} = converters.nibbled16bitBE;
export const {makeValue: as14bitBE,        makeArray: convert14bitBE}        = converters['14bitBE'];
export const {makeValue: as21bitBE,        makeArray: convert21bitBE}        = converters['21bitBE'];
export const {makeValue: as14bitLE,        makeArray: convert14bitLE}        = converters['14bitLE'];
export const {makeValue: as21bitLE,        makeArray: convert21bitLE}        = converters['21bitLE'];
