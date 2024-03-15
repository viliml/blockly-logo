/**
 * @fileoverview Generating Logo for list blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.lists');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['[]', Logo.ORDER_ATOMIC];
};

Logo['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  const elements = new Array(block.itemCount_);
  for (let i = 0; i < block.itemCount_; i++) {
    elements[i] = Logo.valueToCode(block, 'ADD' + i,
        Logo.ORDER_NONE) || 'null';
  }
  const code = '(list ' + elements.join(' ') + ')';
  return [code, Logo.ORDER_ATOMIC];
};

Logo['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  const functionName = Logo.provideFunction_(
      'listsRepeat',
      ['to ' + Logo.FUNCTION_NAME_PLACEHOLDER_ +
      ' :value :n',
        '  op cascade :n [lput :value ?] []',
        'end']);
  const element = Logo.valueToCode(block, 'ITEM',
      Logo.ORDER_NONE) || 'null';
  const repeatCount = Logo.valueToCode(block, 'NUM',
      Logo.ORDER_NONE) || '0';
  const code = functionName + ' ' + element + ' ' + repeatCount;
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['lists_length'] = function(block) {
  // String or array length.
  const list = Logo.valueToCode(block, 'VALUE',
      Logo.ORDER_NONE) || '[]';
  return ['count ' + list, Logo.ORDER_PROCEDURE];
};

Logo['lists_isEmpty'] = function(block) {
  // Is the string null or array empty?
  const list = Logo.valueToCode(block, 'VALUE',
      Logo.ORDER_NONE) || '[]';
  return ['emptyp ' + list, Logo.ORDER_PROCEDURE];
};

Logo['lists_indexOf'] = function(block) {
  // Find an item in the list.
  const rev = block.getFieldValue('END') === 'FIRST' ?
      '"true' : '"false';
  const item = Logo.valueToCode(block, 'FIND',
      Logo.ORDER_NONE) || '"';
  const list = Logo.valueToCode(block, 'VALUE',
      Logo.ORDER_NONE) || '[]';
  const functionName = Logo.provideFunction_(
      'listsIndexOf',
      ['to ' + Logo.FUNCTION_NAME_PLACEHOLDER_ +
      ' :item :l :reverse',
        '  ifelse :reverse [',
        '    localmake "res find [? = :item] reverse :l',
        '    op ifelse listp :res 0 1 - :res + count :l',
        '  ][',
        '    localmake "res find [? = :item] :l',
        '    op ifelse listp :res 0 :res',
        '  ]',
        'end']);
  const code = functionName + ' ' + item + ' ' + list + ' ' + rev;
  if (block.workspace.options.oneBasedIndex) {
    return [code, Logo.ORDER_PROCEDURE];
  }
  return ['-1 + ' + code, Logo.ORDER_PROCEDURE];
};

Logo['lists_getIndex'] = function(block) {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  const mode = block.getFieldValue('MODE') || 'GET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const listOrder = Logo.ORDER_NONE;
  const list = Logo.valueToCode(block, 'VALUE', listOrder) || '[]';

  let code;
  switch (where) {
    case ('FIRST'):
      if (mode === 'GET') {
        code = 'first ' + list;
        return [code, Logo.ORDER_PROCEDURE];
      }
      break;
    case ('LAST'):
      if (mode === 'GET') {
        code = 'last ' + list;
        return [code, Logo.ORDER_PROCEDURE];
      }
      break;
    case ('FROM_START'):
      const at = Logo.getAdjusted(block, 'AT');
      if (mode === 'GET') {
        code = 'item ' + at + ' ' + list;
        return [code, Logo.ORDER_PROCEDURE];
      }
      break;
    case ('RANDOM'):
      if (mode === 'GET') {
        code = 'pick ' + list;
        return [code, Logo.ORDER_PROCEDURE];
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
};

Logo['lists_sort'] = function(block) {
// Block for sorting a list.
  const list = Logo.valueToCode(block, 'LIST',
      Logo.ORDER_NONE) || '[]';
  const type = block.getFieldValue('TYPE');

  let cmp, ignoreCase;
  if (block.getFieldValue('DIRECTION') === '1') {
    if (type === 'NUMERIC') {
      cmp = '"lessp';
    } else {
      cmp = '"beforep';
    }
  } else {
    if (type === 'NUMERIC') {
      cmp = '"greaterp';
    } else {
      cmp = '[beforep ?2 ?1]';
	}
  }
  if (type === 'TEXT') {
    ignoreCase = '"false';
  } else {
    ignoreCase = '"true';
  }
  const functionName = Logo.provideFunction_(
      'listsGetSort',
      ['to ' + Logo.FUNCTION_NAME_PLACEHOLDER_ +
      ' :l',
        '  localmake "cip ifelse definedp "caseignoredp [:caseignoredp] ""true',
        '  make "caseignoredp ' + ignoreCase,
        '  localmake "res (sort :l ' + cmp + ')',
        '  make "caseignoredp :cip',
        '  op :res',
        'end']);
  return [functionName + ' ' + list, Logo.ORDER_PROCEDURE];
};

// Logo['lists_split'] = function(block) {
  // // Block for splitting text into a list, or joining a list into text.
  // var input = Logo.valueToCode(block, 'INPUT',
      // Logo.ORDER_MEMBER);
  // var delimiter = Logo.valueToCode(block, 'DELIM',
      // Logo.ORDER_NONE) || '\'\'';
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
  // return [code, Logo.ORDER_FUNCTION_CALL];
// };

Logo['lists_reverse'] = function(block) {
  // Block for reversing a list.
  const list = Logo.valueToCode(block, 'LIST',
      Logo.ORDER_NONE) || '[]';
  const code = 'reverse ' + list;
  return [code, Logo.ORDER_PROCEDURE];
};
