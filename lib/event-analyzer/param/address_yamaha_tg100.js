import {makeResolvedJson} from '../json_refs.js';
import {makeAddressParser, makeParamParser} from './address_common.js';

import json from './address_43_27_tg100.json' with {type: 'json'};

const parser = makeAddressParser(makeResolvedJson(json));

export const supportedIds = Object.freeze(json._idKeys);
export const parseParam = Object.freeze(makeParamParser(() => ({parser})));
