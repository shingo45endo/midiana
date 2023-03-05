export function makeResolvedJson(json) {
	const newJson = structuredClone(json);
	resolveJsonRefs(newJson);
	return newJson;
}

export function resolveJsonRefs(json) {
	for (;;) {
		const refs = {};

		// Picks all references up.
		(function recurse(elem, refStr) {
			if (elem === undefined || elem === null) {
				return;
			}

			if (typeof elem === 'object') {
				const keys = Object.keys(elem);
				for (const key of keys) {
					if (key === '$ref') {
						refs[refStr] = elem[key];
						if (keys.length > 1) {
							console.warn(`"$ref" cannot contain any other keys. (${refStr})`);
						}
					} else {
						recurse(elem[key], `${refStr}/${key}`);
					}
				}
			} else if (Array.isArray(elem)) {
				for (let i = 0; i < elem.length; i++) {
					recurse(elem[i], `${refStr}/${i}`);
				}
			}
		})(json, '#');

		// Checks if all the references are resolved.
		if (Object.keys(refs).length === 0) {
			break;
		}

		// Resolves all unresolved references.
		let isFound = false;
		for (const pair of Object.entries(refs)) {
			const [dst, src] = pair;
			console.assert(getRef(json, dst));
			const srcRef = getRef(json, src);
			if (srcRef) {
				const index = dst.lastIndexOf('/');
				const dstParent = getRef(json, dst.slice(0, index));
				const key = dst.slice(index + 1);
				dstParent[key] = srcRef;
				isFound = true;
			}
		}

		// Checks if there are any unresolved references.
		if (!isFound) {
			console.error(`${Object.values(refs).length} unresolved "$ref"(s) found.`);
			console.error(refs);
			break;
		}
	}
}

function getRef(obj, str) {
	// This parser only handles absolute paths. (start with "#")
	if (typeof str !== 'string' || !str.startsWith('#')) {
		return undefined;
	}

	const tokens = str.replace('~1', '/').replace('~0', '~').split('/');

	let ret = obj;
	for (const token of tokens.slice(1)) {
		ret = ret[token];
		if (ret === 'undefined') {
			return undefined;
		}
	}

	return ret;
}
