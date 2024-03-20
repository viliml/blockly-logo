/**
 * @license
 * Copyright 2012 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
 * @type {!LogoGenerator}
 */
export const logoGenerator = new LogoGenerator();

// Install per-block-type generator functions:
Object.assign(
    logoGenerator.forBlock,
    colour, lists, logic, logo, loops, math,
    procedures, text, variables, variablesDynamic
);
