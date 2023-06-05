/**
 * @fileoverview Generating Logo for logic blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.logic');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['controls_ifelse'] = function(block) {
  // If/else condition.
  var code = '', conditionCode, ifCode, elseCode;
  if (Logo.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Logo.injectId(Logo.STATEMENT_PREFIX, block);
  }
  conditionCode = Logo.valueToCode(block, 'IF0', Logo.ORDER_NONE) || '"false';
  ifCode = Logo.statementToCode(block, 'DO0');
  if (Logo.STATEMENT_SUFFIX) {
    ifCode = Logo.prefixLines(Logo.injectId(Logo.STATEMENT_SUFFIX, block), Logo.INDENT) + ifCode;
  }

  elseCode = Logo.statementToCode(block, 'ELSE');
  if (Logo.STATEMENT_SUFFIX) {
    elseCode = Logo.prefixLines(Logo.injectId(Logo.STATEMENT_SUFFIX, block), Logo.INDENT) +
        elseCode;
  }
  code += 'ifelse ' + conditionCode + ' [\n' + ifCode + '] [\n' + elseCode + ']\n';
  return code;
};

Logo['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==', 'NEQ': '<>', 'LT': '<', 'LTE': '<=', 'GT': '>', 'GTE': '>=',
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var argument0 = Logo.valueToCode(block, 'A', Logo.ORDER_COMPARISON) || '0';
  var argument1 = Logo.valueToCode(block, 'B', Logo.ORDER_COMPARISON) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Logo.ORDER_COMPARISON];
};

Logo['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var argument0 = Logo.valueToCode(block, 'A', Logo.ORDER_NONE);
  var argument1 = Logo.valueToCode(block, 'B', Logo.ORDER_NONE);
  // Single missing arguments have no effect on the return value.
  var defaultArgument = (operator == 'and') ? 'true' : 'false';
  if (!argument0) {
    argument0 = defaultArgument;
  }
  if (!argument1) {
    argument1 = defaultArgument;
  }
  var code = operator + ' ' + argument0 + ' ' + argument1;
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Logo.valueToCode(block, 'BOOL', Logo.ORDER_NONE) || 'true';
  var code = '!' + argument0;
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? '"true' : '"false';
  return [code, Logo.ORDER_ATOMIC];
};

Logo['logic_null'] = function(block) {
  // Null data type.
  return ['[]', Logo.ORDER_ATOMIC];
};

Logo['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Logo.valueToCode(block, 'IF', Logo.ORDER_NONE) || '"false';
  var value_then = Logo.valueToCode(block, 'THEN', Logo.ORDER_NONE) || '[]';
  var value_else = Logo.valueToCode(block, 'ELSE', Logo.ORDER_NONE) || '[]';
  var code = 'ifelse ' + value_if + ' [' + value_then + '] [' + value_else + ']';
  return [code, Logo.ORDER_PROCEDURE];
};
