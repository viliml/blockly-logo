/**
 * @fileoverview Generating Logo for variable blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.variables');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['variables_get'] = function(block) {
  // Variable getter.
  var code = ':' + Logo.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Logo.ORDER_ATOMIC];
};

Logo['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Logo.valueToCode(block, 'VALUE',
      Logo.ORDER_ATOMIC) || '0'; //TODO add proper order
  var varName = Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return 'make ' + Logo.quote_(varName) + ' ' + argument0 + '\n';
};
