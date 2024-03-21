/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating Logo for blocks.
 * @author Vilim Lendvaj
 */

import {LogoGenerator} from './logo/logo_generator.js';
import * as colour from './logo/colour.js';
import * as lists from './logo/lists.js';
import * as logic from './logo/logic.js';
import * as logo from './logo/logo.js';
import * as loops from './logo/loops.js';
import * as math from './logo/math.js';
import * as procedures from './logo/procedures.js';
import * as text from './logo/text.js';
import * as variables from './logo/variables.js';
import * as variablesDynamic from './logo/variables_dynamic.js';

export * from './logo/logo_generator.js';


/**
 * Logo code generator instance.
 */
export const logoGenerator = new LogoGenerator();

// Install per-block-type generator functions:
const generators: typeof logoGenerator.forBlock = {
    ...colour,
    ...lists,
    ...logic,
    ...logo,
    ...loops,
    ...math,
    ...procedures,
    ...text,
    ...variables,
    ...variablesDynamic,
};
for (const name in generators) {
    logoGenerator.forBlock[name] = generators[name];
}
