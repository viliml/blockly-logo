/**
 * @fileoverview Generating Logo for text blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.texts');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['text'] = function(block) {
  // Text value.
  var code = Logo.quote_(block.getFieldValue('TEXT'));
  return [code, Logo.ORDER_ATOMIC];
};

Logo['text_multiline'] = function(block) {
  // Text value.
  var code = Logo.multiline_quote_(block.getFieldValue('TEXT'));
  if (code.includes('\n')) {
    code = '(' + code + ')';
  }
  return [code, Logo.ORDER_ATOMIC];
};

Logo['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  switch (block.itemCount_) {
    case 0:
      return ['"', Logo.ORDER_ATOMIC];
    case 2: {
      const element0 = Logo.valueToCode(block, 'ADD0', Logo.ORDER_ATOMIC) || '"';
      const element1 = Logo.valueToCode(block, 'ADD1', Logo.ORDER_NONE) || '"';
      const code = 'word ' + element0 + ' ' + element1;
      return [code, Logo.ORDER_PROCEDURE];
    }
    default: {
      const elements = new Array(block.itemCount_);
      for (var i = 0; i < block.itemCount_; i++) {
        elements[i] = Logo.valueToCode(block, 'ADD' + i, Logo.ORDER_NONE) || '"';
      }
      const code = '(word ' + elements.join(' ') + ')';
      return [code, Logo.ORDER_ATOMIC];
    }
  }
};

Logo['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Logo.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  var value = Logo.valueToCode(block, 'TEXT', Logo.ORDER_NONE) || '"';
  return 'make "' + varName + ' word :' + varName + ' ' + value + '\n';
};

Logo['text_length'] = function(block) {
  // String or array length.
  var text = Logo.valueToCode(block, 'VALUE', Logo.ORDER_NONE) || '\'\'';
  return ['count ' + text, Logo.ORDER_PROCEDURE];
};

Logo['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Logo.valueToCode(block, 'VALUE', Logo.ORDER_NONE) || '\'\'';
  return ['emptyp ' + text, Logo.ORDER_PROCEDURE];
};

Logo['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const textOrder = (where === 'FROM_END') ?
      Blockly.JavaScript.ORDER_SUBTRACTION :
      Blockly.JavaScript.ORDER_NONE;
  const text = Logo.valueToCode(block, 'VALUE', textOrder) || '\'\'';
  switch (where) {
    case 'FIRST': {
      const code = 'first ' + text;
      return [code, Logo.ORDER_PROCEDURE];
    }
    case 'LAST': {
      const code = 'last ' + text;
      return [code, Logo.ORDER_PROCEDURE];
    }
    case 'FROM_START': {
      const at = Logo.getAdjusted(block, 'AT');
      // Adjust index if using one-based indices.
      const code = 'item ' + at + ' ' + text;
      return [code, Logo.ORDER_PROCEDURE];
    }
    case 'FROM_END': {
      const at = Logo.getAdjusted(block, 'AT', -1, true);
      const procedureName = Logo.provideFunction_('wordLetterFromEnd', [
        'to ' + Logo.FUNCTION_NAME_PLACEHOLDER_ + ' :w :a', 'op item :a + count :w :w', 'end']);
      const code = procedureName + ' ' + text + ' ' + at;
      return [code, Logo.ORDER_PROCEDURE];
    }
    case 'RANDOM': {
      const code = 'pick ' + text;
      return [code, Logo.ORDER_PROCEDURE];
    }
  }
  throw Error('Unhandled option (text_charAt).');
};

Logo['text_changeCase'] = function(block) {
// Change capitalization.
  const OPERATORS = {
    'UPPERCASE': 'uppercase ', 'LOWERCASE': 'lowercase ', 'TITLECASE': null,
  };
  const operator = OPERATORS[block.getFieldValue('CASE')];
  const text = Logo.valueToCode(block, 'TEXT', Logo.ORDER_NONE) || '"';
  let code;
  if (operator) {
    // Upper and lower case are functions built into Logo.
    code = operator + text;
  } else {
    // Title case is not a native Logo function.  Define one.
    const functionName = Logo.provideFunction_('textToTitleCase', [
      'to ' + Logo.FUNCTION_NAME_PLACEHOLDER_ + ' :w',
      'op map [ifelse #>1 [ifelse "\\  = item #-1 :w [uppercase ?] [lowercase ?]][uppercase ?]] :w',
      'end']);
    code = functionName + ' ' + text;
  }
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['text_print'] = function(block) {
  // Print statement.
  const msg = Logo.valueToCode(block, 'TEXT', Logo.ORDER_NONE) || '"';
  return 'pr ' + msg + '\n';
};

Logo['text_prompt_ext'] = function(block) {
  let msg;
// Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    msg = Logo.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    msg = Logo.valueToCode(block, 'TEXT', Logo.ORDER_NONE) || '\'\'';
  }
  const code = 'readword ' + msg + ' ' + msg;
  return [code, Logo.ORDER_NONE];
};

Logo['text_prompt'] = Logo['text_prompt_ext'];

// Logo['text_reverse'] = function(block) {
// var text = Logo.valueToCode(block, 'TEXT',
// Logo.ORDER_MEMBER) || '\'\'';
// var code = text + '.split(\'\').reverse().join(\'\')';
// return [code, Logo.ORDER_MEMBER];
// };
