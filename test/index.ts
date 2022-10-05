/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import fs from 'fs';
import * as lz_string from 'lz-string';
import { createSim, generateDOM } from '../src';

// TODO: generating DOM is not testable via node... this file will probably become obsolete..

const dataHex = fs.readFileSync(
  '../mathebuddy-compiler/testdata/testcourse/chapter1.txt_COMPILED_COMPRESSED.hex',
  'base64',
);

const dataRaw = lz_string.decompressFromBase64(dataHex);
const data = JSON.parse(dataRaw);

//console.log(JSON.stringify(data, null, 2));

const sim = createSim(data);
const html = generateDOM(sim, 'intro');

console.log(html);

const bp = 1337;
