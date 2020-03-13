/**
 * @fileoverview Generating Logo for list blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.lists');

goog.require('Blockly.Logo');


Blockly.Logo['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['[]', Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  var elements = new Array(block.itemCount_);
  for (var i = 0; i < block.itemCount_; i++) {
    elements[i] = Blockly.Logo.valueToCode(block, 'ADD' + i,
        Blockly.Logo.ORDER_NONE) || 'null';
  }
  var code = '(list ' + elements.join(' ') + ')';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  var functionName = Blockly.Logo.provideFunction_(
      'listsRepeat',
      ['to ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
          ' :value :n',
       '  op cascade :n [lput :value ?] []',
       'end']);
  var element = Blockly.Logo.valueToCode(block, 'ITEM',
      Blockly.Logo.ORDER_NONE) || 'null';
  var repeatCount = Blockly.Logo.valueToCode(block, 'NUM',
      Blockly.Logo.ORDER_NONE) || '0';
  var code = functionName + ' ' + element + ' ' + repeatCount;
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['lists_length'] = function(block) {
  // String or array length.
  var list = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '[]';
  return ['count ' + list, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['lists_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var list = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '[]';
  return ['emptyp ' + list, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['lists_indexOf'] = function(block) {
  // Find an item in the list.
  var rev = block.getFieldValue('END') == 'FIRST' ?
      '"true' : '"false';
  var item = Blockly.Logo.valueToCode(block, 'FIND',
      Blockly.Logo.ORDER_NONE) || '"';
  var list = Blockly.Logo.valueToCode(block, 'VALUE',
      Blockly.Logo.ORDER_NONE) || '[]';
  var functionName = Blockly.Logo.provideFunction_(
      'listsIndexOf',
      ['to ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
          ' :item :l :reverse',
       '  ifelse :reverse [',
	   '    localmake "res find [? = :item] reverse :l',
	   '    op ifelse listp :res 0 1 - :res + count :l',
	   '  ][',
	   '    localmake "res find [? = :item] :l',
	   '    op ifelse listp :res 0 :res',
	   '  ]',
       'end']);
  var code = functionName + ' ' + item + ' ' + list + ' ' + rev;
  if (block.workspace.options.oneBasedIndex) {
    return [code, Blockly.Logo.ORDER_PROCEDURE];
  }
  return ['-1 + ' + code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['lists_getIndex'] = function(block) {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var listOrder = Blockly.Logo.ORDER_NONE;
  var list = Blockly.Logo.valueToCode(block, 'VALUE', listOrder) || '[]';

  switch (where) {
    case ('FIRST'):
      if (mode == 'GET') {
        var code = 'first ' + list;
        return [code, Blockly.Logo.ORDER_PROCEDURE];
      }
      break;
    case ('LAST'):
      if (mode == 'GET') {
        var code = 'last ' + list;
        return [code, Blockly.Logo.ORDER_PROCEDURE];
      }
      break;
    case ('FROM_START'):
      var at = Blockly.Logo.getAdjusted(block, 'AT');
      if (mode == 'GET') {
        var code = 'item ' + at + ' ' + list;
        return [code, Blockly.Logo.ORDER_PROCEDURE];
      }
      break;
    case ('RANDOM'):
      if (mode == 'GET') {
        var code = 'pick ' + list;
        return [code, Blockly.Logo.ORDER_PROCEDURE];
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

Blockly.Logo['lists_sort'] = function(block) {
  // Block for sorting a list.
  var list = Blockly.Logo.valueToCode(block, 'LIST',
      Blockly.Logo.ORDER_NONE) || '[]';
  var type = block.getFieldValue('TYPE');
  if (block.getFieldValue('DIRECTION') === '1') {
    if (type === 'NUMERIC') {
      var cmp = '"lessp';
    } else {
      var cmp = '"beforep';
	}
  } else {
    if (type === 'NUMERIC') {
      var cmp = '"greaterp';
    } else {
      var cmp = '[beforep ?2 ?1]';
	}
  }
  if (type === 'TEXT') {
    var ignoreCase = '"false';
  } else {
    var ignoreCase = '"true';
  }
  var functionName = Blockly.Logo.provideFunction_(
      'listsGetSort',
      ['to ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
          ' :l',
       '  localmake "cip ifelse definedp "caseignoredp [:caseignoredp] ""true',
	   '  make "caseignoredp ' + ignoreCase,
	   '  localmake "res (sort :l ' + cmp + ')',
	   '  make "caseignoredp :cip',
	   '  op :res',
       'end']);
  return [functionName + ' ' + list, Blockly.Logo.ORDER_PROCEDURE];
};

// Blockly.Logo['lists_split'] = function(block) {
  // // Block for splitting text into a list, or joining a list into text.
  // var input = Blockly.Logo.valueToCode(block, 'INPUT',
      // Blockly.Logo.ORDER_MEMBER);
  // var delimiter = Blockly.Logo.valueToCode(block, 'DELIM',
      // Blockly.Logo.ORDER_NONE) || '\'\'';
  // var mode = block.getFieldValue('MODE');
  // if (mode == 'SPLIT') {
    // if (!input) {
      // input = '\'\'';
    // }
    // var functionName = 'split';
  // } else if (mode == 'JOIN') {
    // if (!input) {
      // input = '[]';
    // }
    // var functionName = 'join';
  // } else {
    // throw Error('Unknown mode: ' + mode);
  // }
  // var code = input + '.' + functionName + '(' + delimiter + ')';
  // return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
// };

Blockly.Logo['lists_reverse'] = function(block) {
  // Block for reversing a list.
  var list = Blockly.Logo.valueToCode(block, 'LIST',
      Blockly.Logo.ORDER_NONE) || '[]';
  var code = 'reverse ' + list;
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};
