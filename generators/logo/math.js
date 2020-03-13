/**
 * @fileoverview Generating Logo for math blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.math');

goog.require('Blockly.Logo');


Blockly.Logo['math_number'] = function(block) {
  // Numeric value.
  var code = Number(block.getFieldValue('NUM'));
  var order = code >= 0 ? Blockly.Logo.ORDER_ATOMIC :
              Blockly.Logo.ORDER_UNARY_NEGATION;
  return [code, order];
};

Blockly.Logo['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.Logo.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.Logo.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.Logo.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.Logo.ORDER_DIVISION],
    'POWER': [null, Blockly.Logo.ORDER_NONE]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Logo.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in Logo requires a special case since it has no operator.
  if (!operator) {
    code = 'power ' + argument0 + ' ' + argument1;
    return [code, Blockly.Logo.ORDER_PROCEDURE];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Logo['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.Logo.valueToCode(block, 'NUM',
        Blockly.Logo.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.Logo.ORDER_UNARY_NEGATION];
  }
  if (operator == 'ROUNDUP') {
    arg = Blockly.JavaScript.valueToCode(block, 'NUM',
        Blockly.JavaScript.ORDER_ADDITION) || '0';
  } else {
    arg = Blockly.JavaScript.valueToCode(block, 'NUM',
        Blockly.JavaScript.ORDER_NONE) || '0';
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
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    'PI': ['pi', Blockly.Logo.ORDER_ATOMIC],
    'E': ['exp 1', Blockly.Logo.ORDER_PROCEDURE],
    'GOLDEN_RATIO':
        ['(1 + sqrt 5) / 2', Blockly.Logo.ORDER_DIVISION],
    'SQRT2': ['sqrt 2', Blockly.Logo.ORDER_PROCEDURE],
    'SQRT1_2': ['sqrt 1/2', Blockly.Logo.ORDER_PROCEDURE]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

Blockly.Logo['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    throw Error('Primality testing isn\'t supported yet');
    var number_to_check = Blockly.Logo.valueToCode(block, 'NUMBER_TO_CHECK',
        Blockly.Logo.ORDER_NONE) || '0';
    // Prime is a special case as it is not a one-liner test.
    var functionName = Blockly.Logo.provideFunction_(
        'mathIsPrime',
        ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
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
    return [code, Blockly.Logo.ORDER_PROCEDURE];
  }
  var numberOrder = (dropdown_property == 'POSITIVE' || dropdown_property == 'NEGATIVE') ?
      Blockly.Logo.ORDER_COMPARISON : Blockly.Logo.ORDER_NONE;
  var order = (dropdown_property == 'POSITIVE' || dropdown_property == 'NEGATIVE') ?
      Blockly.Logo.ORDER_COMPARISON : Blockly.Logo.ORDER_PROCEDURE;
  var number_to_check = Blockly.Logo.valueToCode(block, 'NUMBER_TO_CHECK',
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
      var divisor = Blockly.Logo.valueToCode(block, 'DIVISOR',
          Blockly.Logo.ORDER_NONE) || '0';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, order];
};

Blockly.Logo['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.Logo.valueToCode(block, 'DELTA',
      Blockly.Logo.ORDER_ADDITION) || '0';
  var varName = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return 'make "' + varName + ' (ifelse numberp :' + varName + ' :' + varName +
      ' 0) + ' + argument0 + '\n';
};

// Rounding functions have a single operand.
Blockly.Logo['math_round'] = Blockly.Logo['math_single'];
// Trigonometry functions have a single operand.
Blockly.Logo['math_trig'] = Blockly.Logo['math_single'];
/*
Blockly.Logo['math_on_list'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_COMMA) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_COMMA) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE':
      // mathMean([null,null,1,3]) == 2.0.
      var functionName = Blockly.Logo.provideFunction_(
          'mathMean',
          ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;',
            '}']);
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MEDIAN':
      // mathMedian([null,null,1,3]) == 2.0.
      var functionName = Blockly.Logo.provideFunction_(
          'mathMedian',
          ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
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
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MODE':
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = Blockly.Logo.provideFunction_(
          'mathModes',
          ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
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
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      var functionName = Blockly.Logo.provideFunction_(
          'mathStandardDeviation',
          ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
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
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'RANDOM':
      var functionName = Blockly.Logo.provideFunction_(
          'mathRandomList',
          ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
              '(list) {',
            '  var x = Math.floor(Math.random() * list.length);',
            '  return list[x];',
            '}']);
      list = Blockly.Logo.valueToCode(block, 'LIST',
          Blockly.Logo.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    default:
      throw Error('Unknown operator: ' + func);
  }
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};
*/
Blockly.Logo['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.Logo.valueToCode(block, 'DIVIDEND',
      Blockly.Logo.ORDER_NONE) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'DIVISOR',
      Blockly.Logo.ORDER_NONE) || '0';
  var code = 'modulo ' + argument0 + ' ' + argument1;
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};
/*
Blockly.Logo['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  var argument0 = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_COMMA) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'LOW',
      Blockly.Logo.ORDER_COMMA) || '0';
  var argument2 = Blockly.Logo.valueToCode(block, 'HIGH',
      Blockly.Logo.ORDER_COMMA) || 'Infinity';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};
*/
Blockly.Logo['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Logo.valueToCode(block, 'FROM',
      Blockly.Logo.ORDER_SUBTRACTION) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'TO',
      Blockly.Logo.ORDER_SUBTRACTION) || '0';
  var code = argument0 + ' + random ' + argument1 + ' - ' + argument0 + " + 1";
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};
/*
Blockly.Logo['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  return ['Math.random()', Blockly.Logo.ORDER_FUNCTION_CALL];
};
*/
Blockly.Logo['math_atan2'] = function(block) {
  // Arctangent of point (X, Y) in degrees from -180 to 180.
  var argument0 = Blockly.Logo.valueToCode(block, 'X',
      Blockly.Logo.ORDER_NONE) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'Y',
      Blockly.Logo.ORDER_NONE) || '0';
  return ['(arctan ' + argument0 + ' ' + argument1 + ')',
      Blockly.Logo.ORDER_ATOMIC];
};
