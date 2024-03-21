/**
 * @fileoverview Generating Logo for logic blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.logic

import type {Block} from '../../core/block.js';
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';


export function controls_ifelse(
  block: Block,
  generator: LogoGenerator,
) {
  // If/else condition.
  let code = '', conditionCode, ifCode, elseCode;
  if (generator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += generator.injectId(generator.STATEMENT_PREFIX,
        block);
  }
  conditionCode = generator.valueToCode(block, 'IF0',
      Order.NONE) || '"false';
  ifCode = generator.statementToCode(block, 'DO0');
  if (generator.STATEMENT_SUFFIX) {
    ifCode = generator.prefixLines(
        generator.injectId(generator.STATEMENT_SUFFIX,
        block), generator.INDENT) + ifCode;
  }

  elseCode = generator.statementToCode(block, 'ELSE');
  if (generator.STATEMENT_SUFFIX) {
    elseCode = generator.prefixLines(
      generator.injectId(generator.STATEMENT_SUFFIX,
        block), generator.INDENT) + elseCode;
  }
  code += 'ifelse ' + conditionCode + ' [\n' + ifCode + '] [\n' + elseCode + ']\n';
  return code;
}

export function logic_compare(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Comparison operator.
  const OPERATORS = {
    'EQ': '==',
    'NEQ': '<>',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  type OperatorOption = keyof typeof OPERATORS;
  const operator = OPERATORS[block.getFieldValue('OP') as OperatorOption];
  const argument0 = generator.valueToCode(block, 'A', Order.COMPARISON) || '0';
  const argument1 = generator.valueToCode(block, 'B', Order.COMPARISON) || '0';
  const code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, Order.COMPARISON];
}

export function logic_operation(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Operations 'and', 'or'.
  const operator = (block.getFieldValue('OP') === 'AND') ? 'and' : 'or';
  let argument0 = generator.valueToCode(block, 'A', Order.NONE);
  let argument1 = generator.valueToCode(block, 'B', Order.NONE);
  // Single missing arguments have no effect on the return value.
  const defaultArgument = (operator === 'and') ? 'true' : 'false';
  if (!argument0) {
    argument0 = defaultArgument;
  }
  if (!argument1) {
    argument1 = defaultArgument;
  }
  const code = operator + ' ' + argument0 + ' ' + argument1;
  return [code, Order.PROCEDURE];
}

export function logic_negate(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Negation.
  const argument0 = generator.valueToCode(block, 'BOOL', Order.NONE) ||
      'true';
  const code = '!' + argument0;
  return [code, Order.PROCEDURE];
}

export function logic_boolean(
  block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Boolean values true and false.
  const code = (block.getFieldValue('BOOL') === 'TRUE') ? '"true' : '"false';
  return [code, Order.ATOMIC];
}

export function logic_null(
  _block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Null data type.
  return ['[]', Order.ATOMIC];
}

export function logic_ternary(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Ternary operator.
  const value_if = generator.valueToCode(block, 'IF',
      Order.NONE) || '"false';
  const value_then = generator.valueToCode(block, 'THEN',
      Order.NONE) || '[]';
  const value_else = generator.valueToCode(block, 'ELSE',
      Order.NONE) || '[]';
  const code = 'ifelse ' + value_if + ' [' + value_then + '] [' + value_else + ']';
  return [code, Order.PROCEDURE];
}
