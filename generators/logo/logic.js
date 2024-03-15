/**
 * @fileoverview Generating Logo for logic blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.logic');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['controls_ifelse'] = function(block) {
  // If/else condition.
  let code = '', conditionCode, ifCode, elseCode;
  if (Logo.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Logo.injectId(Logo.STATEMENT_PREFIX,
        block);
  }
  conditionCode = Logo.valueToCode(block, 'IF0',
      Logo.ORDER_NONE) || '"false';
  ifCode = Logo.statementToCode(block, 'DO0');
  if (Logo.STATEMENT_SUFFIX) {
    ifCode = Logo.prefixLines(
        Logo.injectId(Logo.STATEMENT_SUFFIX,
        block), Logo.INDENT) + ifCode;
  }

  elseCode = Logo.statementToCode(block, 'ELSE');
  if (Logo.STATEMENT_SUFFIX) {
    elseCode = Logo.prefixLines(
      Logo.injectId(Logo.STATEMENT_SUFFIX,
        block), Logo.INDENT) + elseCode;
  }
  code += 'ifelse ' + conditionCode + ' [\n' + ifCode + '] [\n' + elseCode + ']\n';
  return code;
}

Logo['logic_compare'] = function(block) {
  // Comparison operator.
  const OPERATORS = {
    'EQ': '==',
    'NEQ': '<>',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const argument0 = Logo.valueToCode(block, 'A', Logo.ORDER_COMPARISON) || '0';
  const argument1 = Logo.valueToCode(block, 'B', Logo.ORDER_COMPARISON) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Logo.ORDER_COMPARISON];
};

Logo['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  const operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or';
  let argument0 = Logo.valueToCode(block, 'A', Logo.ORDER_NONE);
  let argument1 = Logo.valueToCode(block, 'B', Logo.ORDER_NONE);
  // Single missing arguments have no effect on the return value.
  const defaultArgument = (operator === 'and') ? 'true' : 'false';
  if (!argument0) {
    argument0 = defaultArgument;
  }
  if (!argument1) {
    argument1 = defaultArgument;
  }
  const code = operator + ' ' + argument0 + ' ' + argument1;
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['logic_negate'] = function(block) {
  // Negation.
  const argument0 = Logo.valueToCode(block, 'BOOL', Logo.ORDER_NONE) ||
      'true';
  const code = '!' + argument0;
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['logic_boolean'] = function(block) {
  // Boolean values true and false.
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? '"true' : '"false';
  return [code, Logo.ORDER_ATOMIC];
};

Logo['logic_null'] = function(block) {
  // Null data type.
  return ['[]', Logo.ORDER_ATOMIC];
};

Logo['logic_ternary'] = function(block) {
  // Ternary operator.
  const value_if = Logo.valueToCode(block, 'IF',
      Logo.ORDER_NONE) || '"false';
  const value_then = Logo.valueToCode(block, 'THEN',
      Logo.ORDER_NONE) || '[]';
  const value_else = Logo.valueToCode(block, 'ELSE',
      Logo.ORDER_NONE) || '[]';
  const code = 'ifelse ' + value_if + ' [' + value_then + '] [' + value_else + ']';
  return [code, Logo.ORDER_PROCEDURE];
};
