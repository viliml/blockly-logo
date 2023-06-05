/**
 * @fileoverview Generating Logo for dynamic variable blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.variablesDynamic');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');
goog.require('Blockly.Logo.variables');


// Logo is dynamically typed.
Logo['variables_get_dynamic'] = Logo['variables_get'];
Logo['variables_set_dynamic'] = Logo['variables_set'];
