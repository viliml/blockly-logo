/**
 * @fileoverview Generating Logo for text blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.texts');

goog.require('Blockly.Logo');


Blockly.Logo['text'] = function(block) {
  // Text value.
  var code = Blockly.Logo.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['text_multiline'] = function(block) {
  // Text value.
  var code = Blockly.Logo.multiline_quote_(block.getFieldValue('TEXT'));
  if (code.includes('\n')) {
      code = '(' + code + ')'
  }
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  switch (block.itemCount_) {
    case 0:
      return ['"', Blockly.Logo.ORDER_ATOMIC];
    case 2:
      var element0 = Blockly.Logo.valueToCode(block, 'ADD0',
          Blockly.Logo.ORDER_ATOMIC) || '"';
      var element1 = Blockly.Logo.valueToCode(block, 'ADD1',
          Blockly.Logo.ORDER_NONE) || '"';
      var code = 'word ' + element0 + ' ' + element1;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
    default:
      var elements = new Array(block.itemCount_);
      for (var i = 0; i < block.itemCount_; i++) {
        elements[i] = Blockly.Logo.valueToCode(block, 'ADD' + i,
            Blockly.Logo.ORDER_NONE) || '"';
      }
      var code = '(word ' + elements.join(' ') + ')';
      return [code, Blockly.Logo.ORDER_ATOMIC];
  }
};

Blockly.Logo['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var value = Blockly.Logo.valueToCode(block, 'TEXT',
      Blockly.Logo.ORDER_NONE) || '"';
  return 'make "' + varName + ' word :' + varName + ' ' + value + '\n';
};

Blockly.Logo['text_length'] = function(block) {
  // String or array length.
  var text = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '\'\'';
  return ['count ' + text, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '\'\'';
  return ['emptyp ' + text, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var textOrder = (where == 'FROM_END') ? Blockly.JavaScript.ORDER_SUBTRACTION :
      Blockly.JavaScript.ORDER_NONE;
  var text = Blockly.Logo.valueToCode(block, 'VALUE',
      textOrder) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'first ' + text;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
    case 'LAST':
      var code = 'last ' + text;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
    case 'FROM_START':
      var at = Blockly.Logo.getAdjusted(block, 'AT');
      // Adjust index if using one-based indices.
      var code = 'item ' + at + ' ' + text;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
    case 'FROM_END':
      var at = Blockly.Logo.getAdjusted(block, 'AT', -1, true);
      var procedureName = Blockly.Logo.provideFunction_(
          'wordLetterFromEnd',
          ['to ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
              ' :w :a',
           'op item :a + count :w :w',
           'end']);
      var code =procedurenName + ' ' + text + ' ' + at;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
    case 'RANDOM':
      var code = 'pick ' + text;
      return [code, Blockly.Logo.ORDER_PROCEDURE];
  }
  throw Error('Unhandled option (text_charAt).');
};

Blockly.Logo['text_changeCase'] = function(block) {
  // Change capitalization.
  var OPERATORS = {
    'UPPERCASE': 'uppercase ',
    'LOWERCASE': 'lowercase ',
    'TITLECASE': null
  };
  var operator = OPERATORS[block.getFieldValue('CASE')];
  var text = Blockly.Logo.valueToCode(block, 'TEXT',
      Blockly.Logo.ORDER_NONE) || '"';
  if (operator) {
    // Upper and lower case are functions built into Logo.
    var code = operator + text;
  } else {
    // Title case is not a native Logo function.  Define one.
    var functionName = Blockly.Logo.provideFunction_(
        'textToTitleCase',
        ['to ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
            ' :w',
         'op map [ifelse #>1 [ifelse "\\  = item #-1 :w [uppercase ?] [lowercase ?]][uppercase ?]] :w',
         'end']);
    var code = functionName + ' ' + text;
  }
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.Logo.valueToCode(block, 'TEXT',
      Blockly.Logo.ORDER_NONE) || '"';
  return 'pr ' + msg + '\n';
};

Blockly.Logo['text_prompt_ext'] = function(block) {
  // Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    var msg = Blockly.Logo.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    var msg = Blockly.Logo.valueToCode(block, 'TEXT',
        Blockly.Logo.ORDER_NONE) || '\'\'';
  }
  var code = 'readword ' + msg + ' ' + msg;
  return [code, Blockly.Logo.ORDER_NONE];
};

 Blockly.Logo['text_prompt'] = Blockly.Logo['text_prompt_ext'];

// Blockly.Logo['text_reverse'] = function(block) {
  // var text = Blockly.Logo.valueToCode(block, 'TEXT',
      // Blockly.Logo.ORDER_MEMBER) || '\'\'';
  // var code = text + '.split(\'\').reverse().join(\'\')';
  // return [code, Blockly.Logo.ORDER_MEMBER];
// };
