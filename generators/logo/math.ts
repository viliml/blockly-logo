/**
 * @fileoverview Generating Logo for math blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.math

import type {Block} from '../../core/block.js';
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';


export function math_number(
  block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Numeric value.
  const number = Number(block.getFieldValue('NUM'));
  const order = number >= 0 ? Order.ATOMIC : Order.UNARY_NEGATION;
  return [String(number), order];
}

export function math_arithmetic(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Basic arithmetic operators, and power.
  const OPERATORS: Record<string, [string | null, Order]> = {
    'ADD': [' + ', Order.ADDITION],
    'MINUS': [' - ', Order.SUBTRACTION],
    'MULTIPLY': [' * ', Order.MULTIPLICATION],
    'DIVIDE': [' / ', Order.DIVISION],
    'POWER': [null, Order.NONE]  // Handle power separately.
  };
  const tuple = OPERATORS[block.getFieldValue('OP')];
  const operator = tuple[0];
  const order = tuple[1];
  const argument0 = generator.valueToCode(block, 'A', order) || '0';
  const argument1 = generator.valueToCode(block, 'B', order) || '0';
  let code;
  // Power in Logo requires a special case since it has no operator.
  if (!operator) {
    code = 'power ' + argument0 + ' ' + argument1;
    return [code, Order.PROCEDURE];
  }
  code = argument0 + operator + argument1;
  return [code, order];
}

export function math_single(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Math operators with single operand.
  const operator = block.getFieldValue('OP');
  let code;
  let arg;
  if (operator === 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = generator.valueToCode(block, 'NUM',
        Order.UNARY_NEGATION) || '0';
    if (arg[0] === '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Order.UNARY_NEGATION];
  }
  if (operator === 'ROUNDUP') {
    arg = generator.valueToCode(block, 'NUM',
        Order.ADDITION) || '0';
  } else {
    arg = generator.valueToCode(block, 'NUM',
        Order.NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'abs ' + arg;
      break;
    case 'ROOT':
      code = 'sqrt ' + arg;
      break;
    case 'LN':
      code = 'ln ' + arg;
      break;
    case 'EXP':
      code = 'exp ' + arg;
      break;
    case 'POW10':
      code = 'power 10 ' + arg;
      break;
    case 'ROUND':
      code = 'round ' + arg;
      break;
    case 'ROUNDUP':
      code = 'round 0.5 + ' + arg;
      break;
    case 'ROUNDDOWN':
      code = 'int ' + arg;
      break;
    case 'SIN':
      code = 'sin ' + arg;
      break;
    case 'COS':
      code = 'cos ' + arg;
      break;
    case 'TAN':
      code = 'tan ' + arg;
      break;
    case 'LOG10':
      code = 'log10 ' + arg;
      break;
    case 'ASIN':
      code = 'arcsin ' + arg;
      break;
    case 'ACOS':
      code = 'arccos ' + arg;
      break;
    case 'ATAN':
      code = 'arctan ' + arg;
      break;
    default:
      throw Error('Unknown math operator: ' + operator);
  }
  return [code, Order.PROCEDURE];
}

export function math_constant(
  block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  const CONSTANTS: Record<string, [string, Order]> = {
    'PI': ['pi', Order.ATOMIC],
    'E': ['exp 1', Order.PROCEDURE],
    'GOLDEN_RATIO':
        ['(1 + sqrt 5) / 2', Order.DIVISION],
    'SQRT2': ['sqrt 2', Order.PROCEDURE],
    'SQRT1_2': ['sqrt 1/2', Order.PROCEDURE]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
}

export function math_number_property(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Check if a number is even, odd, prime, whole, positive, or negative
// or if it is divisible by certain number. Returns true or false.
  const dropdown_property = block.getFieldValue('PROPERTY');
  let number_to_check;
  let code = '';
  if (dropdown_property === 'PRIME') {
    throw Error('Primality testing isn\'t supported yet');
    number_to_check = generator.valueToCode(block, 'NUMBER_TO_CHECK',
        Order.NONE) || '0';
    // Prime is a special case as it is not a one-liner test.
    const functionName = generator.provideFunction_(
        'mathIsPrime',
        ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
          '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
          '  if (n == 2 || n == 3) {',
          '    return true;',
          '  }',
          '  // False if n is NaN, negative, is 1, or not whole.',
          '  // And false if n is divisible by 2 or 3.',
          '  if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
          ' n % 3 == 0) {',
          '    return false;',
          '  }',
          '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
          '  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {',
          '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
          '      return false;',
          '    }',
          '  }',
          '  return true;',
          '}']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Order.PROCEDURE];
  }
  const numberOrder = (dropdown_property === 'POSITIVE' || dropdown_property === 'NEGATIVE') ?
      Order.COMPARISON : Order.NONE;
  const order = (dropdown_property === 'POSITIVE' || dropdown_property === 'NEGATIVE') ?
      Order.COMPARISON : Order.PROCEDURE;
  number_to_check = generator.valueToCode(block, 'NUMBER_TO_CHECK',
      numberOrder) || '0';
  switch (dropdown_property) {
    case 'EVEN':
      code = '0 == modulo ' + number_to_check + ' 2';
      break;
    case 'ODD':
      code = '1 == modulo ' + number_to_check + ' 2';
      break;
    case 'WHOLE':
      code = '0 == modulo ' + number_to_check + ' 1';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      const divisor = generator.valueToCode(block, 'DIVISOR',
          Order.NONE) || '0';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, order];
}

export function math_change(
  block: Block,
  generator: LogoGenerator,
) {
  // Add to a variable in place.
  const argument0 = generator.valueToCode(block, 'DELTA',
      Order.ADDITION) || '0';
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  return 'make "' + varName + ' (ifelse numberp :' + varName + ' :' + varName +
      ' 0) + ' + argument0 + '\n';
}


// Rounding functions have a single operand.
export const math_round = math_single;
// Trigonometry functions have a single operand.
export const math_trig = math_single;

/*
export function math_on_list(
  block: Block,
  generator: LogoGenerator,
) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = generator.valueToCode(block, 'LIST',
          Order.MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      list = generator.valueToCode(block, 'LIST',
          Order.COMMA) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = generator.valueToCode(block, 'LIST',
          Order.COMMA) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE':
      // mathMean([null,null,1,3]) == 2.0.
      var functionName = generator.provideFunction_(
          'mathMean',
          ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;',
            '}']);
      list = generator.valueToCode(block, 'LIST',
          Order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MEDIAN':
      // mathMedian([null,null,1,3]) == 2.0.
      var functionName = generator.provideFunction_(
          'mathMedian',
          ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  var localList = myList.filter(function (x) ' +
              '{return typeof x == \'number\';});',
            '  if (!localList.length) return null;',
            '  localList.sort(function(a, b) {return b - a;});',
            '  if (localList.length % 2 == 0) {',
            '    return (localList[localList.length / 2 - 1] + ' +
              'localList[localList.length / 2]) / 2;',
            '  } else {',
            '    return localList[(localList.length - 1) / 2];',
            '  }',
            '}']);
      list = generator.valueToCode(block, 'LIST',
          Order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MODE':
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = generator.provideFunction_(
          'mathModes',
          ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
              '(values) {',
            '  var modes = [];',
            '  var counts = [];',
            '  var maxCount = 0;',
            '  for (var i = 0; i < values.length; i++) {',
            '    var value = values[i];',
            '    var found = false;',
            '    var thisCount;',
            '    for (var j = 0; j < counts.length; j++) {',
            '      if (counts[j][0] === value) {',
            '        thisCount = ++counts[j][1];',
            '        found = true;',
            '        break;',
            '      }',
            '    }',
            '    if (!found) {',
            '      counts.push([value, 1]);',
            '      thisCount = 1;',
            '    }',
            '    maxCount = Math.max(thisCount, maxCount);',
            '  }',
            '  for (var j = 0; j < counts.length; j++) {',
            '    if (counts[j][1] == maxCount) {',
            '        modes.push(counts[j][0]);',
            '    }',
            '  }',
            '  return modes;',
            '}']);
      list = generator.valueToCode(block, 'LIST',
          Order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      var functionName = generator.provideFunction_(
          'mathStandardDeviation',
          ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
              '(numbers) {',
            '  var n = numbers.length;',
            '  if (!n) return null;',
            '  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;',
            '  var variance = 0;',
            '  for (var j = 0; j < n; j++) {',
            '    variance += Math.pow(numbers[j] - mean, 2);',
            '  }',
            '  variance = variance / n;',
            '  return Math.sqrt(variance);',
            '}']);
      list = generator.valueToCode(block, 'LIST',
          Order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'RANDOM':
      var functionName = generator.provideFunction_(
          'mathRandomList',
          ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
              '(list) {',
            '  var x = Math.floor(Math.random() * list.length);',
            '  return list[x];',
            '}']);
      list = generator.valueToCode(block, 'LIST',
          Order.NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, Order.FUNCTION_CALL];
};
*/
export function math_modulo(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Remainder computation.
  const argument0 = generator.valueToCode(block, 'DIVIDEND',
      Order.NONE) || '0';
  const argument1 = generator.valueToCode(block, 'DIVISOR',
      Order.NONE) || '0';
  const code = 'modulo ' + argument0 + ' ' + argument1;
  return [code, Order.PROCEDURE];
}
/*
export function math_constrain(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Constrain a number between two limits.
  var argument0 = generator.valueToCode(block, 'VALUE',
      Order.COMMA) || '0';
  var argument1 = generator.valueToCode(block, 'LOW',
      Order.COMMA) || '0';
  var argument2 = generator.valueToCode(block, 'HIGH',
      Order.COMMA) || 'Infinity';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Order.FUNCTION_CALL];
};
*/
export function math_random_int(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Random integer between [X] and [Y].
  const argument0 = generator.valueToCode(block, 'FROM',
      Order.SUBTRACTION) || '0';
  const argument1 = generator.valueToCode(block, 'TO',
      Order.SUBTRACTION) || '0';
  const code = argument0 + ' + random ' + argument1 + ' - ' + argument0 + " + 1";
  return [code, Order.PROCEDURE];
}
/*
export function math_random_float(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Random fraction between 0 and 1.
  return ['Math.random()', Order.FUNCTION_CALL];
};
*/
export function math_atan2(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  const argument0 = generator.valueToCode(block, 'X',
      Order.NONE) || '0';
  const argument1 = generator.valueToCode(block, 'Y',
      Order.NONE) || '0';
  return ['(arctan ' + argument0 + ' ' + argument1 + ')',
      Order.ATOMIC];
}
