/**
 * @fileoverview Generating Logo for text blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.texts

import {Order} from './logo_generator.js';


export function text(block, generator) {
  // Text value.
  const code = generator.quote_(block.getFieldValue('TEXT'));
  return [code, Order.ATOMIC];
};

export function text_multiline(block, generator) {
  // Text value.
  let code = generator.multiline_quote_(block.getFieldValue('TEXT'));
  if (code.includes('\n')) {
      code = '(' + code + ')'
  }
  return [code, Order.ATOMIC];
};

export function text_join(block, generator) {
  // Create a string made up of any number of elements of any type.
  let code;switch (block.itemCount_) {
    case 0:
      return ['"', Order.ATOMIC];
    case 2:
      const element0 = generator.valueToCode(block, 'ADD0',
          Order.ATOMIC) || '"';
      const element1 = generator.valueToCode(block, 'ADD1',
          Order.NONE) || '"';
      code = 'word ' + element0 + ' ' + element1;
      return [code, Order.PROCEDURE];
    default:
      const elements = new Array(block.itemCount_);
      for (let i = 0; i < block.itemCount_; i++) {
        elements[i] = generator.valueToCode(block, 'ADD' + i,
            Order.NONE) || '"';
      }
      code = '(word ' + elements.join(' ') + ')';
      return [code, Order.ATOMIC];
  }
};

export function text_append(block, generator) {
  // Append to a variable in place.
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  const value = generator.valueToCode(block, 'TEXT',
      Order.NONE) || '"';
  return 'make "' + varName + ' word :' + varName + ' ' + value + '\n';
};

export function text_length(block, generator) {
  // String or array length.
  const text = generator.valueToCode(block, 'VALUE',
      Order.NONE) || '\'\'';
  return ['count ' + text, Order.PROCEDURE];
};

export function text_isEmpty(block, generator) {
  // Is the string null or array empty?
  const text = generator.valueToCode(block, 'VALUE',
      Order.NONE) || '\'\'';
  return ['emptyp ' + text, Order.PROCEDURE];
};

export function text_charAt(block, generator) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const textOrder = (where === 'FROM_END') ? Blockly.JavaScript.ORDER_SUBTRACTION :
      Blockly.JavaScript.ORDER_NONE;
  const text = generator.valueToCode(block, 'VALUE',
      textOrder) || '\'\'';
  let at, code;
  switch (where) {
    case 'FIRST':
      code = 'first ' + text;
      return [code, Order.PROCEDURE];
    case 'LAST':
      code = 'last ' + text;
      return [code, Order.PROCEDURE];
    case 'FROM_START':
      at = generator.getAdjusted(block, 'AT');
      // Adjust index if using one-based indices.
      code = 'item ' + at + ' ' + text;
      return [code, Order.PROCEDURE];
    case 'FROM_END':
      at = generator.getAdjusted(block, 'AT', -1, true);
      const procedureName = generator.provideFunction_(
          'wordLetterFromEnd',
          ['to ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
          ' :w :a',
            'op item :a + count :w :w',
            'end']);
      code = procedureName + ' ' + text + ' ' + at;
      return [code, Order.PROCEDURE];
    case 'RANDOM':
      code = 'pick ' + text;
      return [code, Order.PROCEDURE];
  }
  throw Error('Unhandled option (text_charAt).');
};

export function text_changeCase(block, generator) {
  let code;
// Change capitalization.
  const OPERATORS = {
    'UPPERCASE': 'uppercase ',
    'LOWERCASE': 'lowercase ',
    'TITLECASE': null
  };
  const operator = OPERATORS[block.getFieldValue('CASE')];
  const text = generator.valueToCode(block, 'TEXT',
      Order.NONE) || '"';
  if (operator) {
    // Upper and lower case are functions built into Logo.
    code = operator + text;
  } else {
    // Title case is not a native Logo function.  Define one.
    const functionName = generator.provideFunction_(
        'textToTitleCase',
        ['to ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
        ' :w',
          'op map [ifelse #>1 [ifelse "\\  = item #-1 :w [uppercase ?] [lowercase ?]][uppercase ?]] :w',
          'end']);
    code = functionName + ' ' + text;
  }
  return [code, Order.PROCEDURE];
};

export function text_print(block, generator) {
  // Print statement.
  const msg = generator.valueToCode(block, 'TEXT',
      Order.NONE) || '"';
  return 'pr ' + msg + '\n';
};

export function text_prompt_ext(block, generator) {
  let msg;
// Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    msg = generator.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = generator.valueToCode(block, 'TEXT',
        Order.NONE) || '\'\'';
  }
  const code = 'readword ' + msg + ' ' + msg;
  return [code, Order.NONE];
};

export const text_prompt = text_prompt_ext;

// export function text_reverse(block, generator) {
  // var text = generator.valueToCode(block, 'TEXT',
      // Order.MEMBER) || '\'\'';
  // var code = text + '.split(\'\').reverse().join(\'\')';
  // return [code, Order.MEMBER];
// };
