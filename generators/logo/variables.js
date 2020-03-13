/**
 * @fileoverview Generating Logo for variable blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.variables');

goog.require('Blockly.Logo');


Blockly.Logo['variables_get'] = function(block) {
  // Variable getter.
  var code = ':' + Blockly.Logo.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_ATOMIC) || '0'; //TODO add proper order
  var varName = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return 'make ' + Blockly.Logo.quote_(varName) + ' ' + argument0 + '\n';
};
