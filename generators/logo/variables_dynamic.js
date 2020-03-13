/**
 * @fileoverview Generating Logo for dynamic variable blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.variablesDynamic');

goog.require('Blockly.Logo');
goog.require('Blockly.Logo.variables');


// Logo is dynamically typed.
Blockly.Logo['variables_get_dynamic'] =
    Blockly.Logo['variables_get'];
Blockly.Logo['variables_set_dynamic'] =
    Blockly.Logo['variables_set'];
