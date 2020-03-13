/**
 * @fileoverview Generating Logo for logic blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.logic');

goog.require('Blockly.Logo');


Blockly.Logo['controls_ifelse'] = function(block) {
  // If/else condition.
  var code = '', conditionCode, ifCode, elseCode;
  if (Blockly.Logo.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_PREFIX,
        block);
  }
  conditionCode = Blockly.Logo.valueToCode(block, 'IF0',
      Blockly.Logo.ORDER_NONE) || '"false';
  ifCode = Blockly.Logo.statementToCode(block, 'DO0');
  if (Blockly.Logo.STATEMENT_SUFFIX) {
    ifCode = Blockly.Logo.prefixLines(
        Blockly.Logo.injectId(Blockly.Logo.STATEMENT_SUFFIX,
        block), Blockly.Logo.INDENT) + ifCode;
  }

  elseCode = Blockly.Logo.statementToCode(block, 'ELSE');
  if (Blockly.Logo.STATEMENT_SUFFIX) {
    elseCode = Blockly.Logo.prefixLines(
      Blockly.Logo.injectId(Blockly.Logo.STATEMENT_SUFFIX,
        block), Blockly.Logo.INDENT) + elseCode;
  }
  code += 'ifelse ' + conditionCode + ' [\n' + ifCode + '] [\n' + elseCode + ']\n';
  return code;
}

Blockly.Logo['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '<>',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = Blockly.Logo.valueToCode(block, 'A', Blockly.Logo.ORDER_COMPARISON) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'B', Blockly.Logo.ORDER_COMPARISON) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Blockly.Logo.ORDER_COMPARISON];
};

Blockly.Logo['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var argument0 = Blockly.Logo.valueToCode(block, 'A', Blockly.Logo.ORDER_NONE);
  var argument1 = Blockly.Logo.valueToCode(block, 'B', Blockly.Logo.ORDER_NONE);
  // Single missing arguments have no effect on the return value.
  var defaultArgument = (operator == 'and') ? 'true' : 'false';
  if (!argument0) {
    argument0 = defaultArgument;
  }
  if (!argument1) {
    argument1 = defaultArgument;
  }
  var code = operator + ' ' + argument0 + ' ' + argument1;
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.Logo.valueToCode(block, 'BOOL', Blockly.Logo.ORDER_NONE) ||
      'true';
  var code = '!' + argument0;
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? '"true' : '"false';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['logic_null'] = function(block) {
  // Null data type.
  return ['[]', Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Logo.valueToCode(block, 'IF',
      Blockly.Logo.ORDER_NONE) || '"false';
  var value_then = Blockly.Logo.valueToCode(block, 'THEN',
      Blockly.Logo.ORDER_NONE) || '[]';
  var value_else = Blockly.Logo.valueToCode(block, 'ELSE',
      Blockly.Logo.ORDER_NONE) || '[]';
  var code = 'ifelse ' + value_if + ' [' + value_then + '] [' + value_else + ']';
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};
