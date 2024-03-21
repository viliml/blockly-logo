/**
 * @fileoverview Generating Logo for list blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.lists

import type {Block} from '../../core/block.js';
import type {CreateWithBlock} from "../../blocks/lists";
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';

export function lists_create_empty(
  _block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Create an empty list.
  return ['[]', Order.ATOMIC];
}

export function lists_create_with(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Create a list with any number of elements of any type.
  const createWithBlock = block as CreateWithBlock;
  const elements = new Array(createWithBlock.itemCount_);
  for (let i = 0; i < createWithBlock.itemCount_; i++) {
    elements[i] = generator.valueToCode(block, 'ADD' + i,
        Order.NONE) || 'null';
  }
  const code = '(list ' + elements.join(' ') + ')';
  return [code, Order.ATOMIC];
}

export function lists_repeat(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Create a list with one element repeated.
  const functionName = generator.provideFunction_(
      'listsRepeat',
      ['to ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
      ' :value :n',
        '  op cascade :n [lput :value ?] []',
        'end']);
  const element = generator.valueToCode(block, 'ITEM',
      Order.NONE) || 'null';
  const repeatCount = generator.valueToCode(block, 'NUM',
      Order.NONE) || '0';
  const code = functionName + ' ' + element + ' ' + repeatCount;
  return [code, Order.PROCEDURE];
}

export function lists_length(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // String or array length.
  const list = generator.valueToCode(block, 'VALUE',
      Order.NONE) || '[]';
  return ['count ' + list, Order.PROCEDURE];
}

export function lists_isEmpty(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Is the string null or array empty?
  const list = generator.valueToCode(block, 'VALUE',
      Order.NONE) || '[]';
  return ['emptyp ' + list, Order.PROCEDURE];
}

export function lists_indexOf(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Find an item in the list.
  const rev = block.getFieldValue('END') === 'FIRST' ?
      '"true' : '"false';
  const item = generator.valueToCode(block, 'FIND',
      Order.NONE) || '"';
  const list = generator.valueToCode(block, 'VALUE',
      Order.NONE) || '[]';
  const functionName = generator.provideFunction_(
      'listsIndexOf',
      ['to ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
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
    return [code, Order.PROCEDURE];
  }
  return ['-1 + ' + code, Order.PROCEDURE];
}

export function lists_getIndex(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  const mode = block.getFieldValue('MODE') || 'GET';
  const where = block.getFieldValue('WHERE') || 'FROM_START';
  const listOrder = Order.NONE;
  const list = generator.valueToCode(block, 'VALUE', listOrder) || '[]';

  let code;
  switch (where) {
    case ('FIRST'):
      if (mode === 'GET') {
        code = 'first ' + list;
        return [code, Order.PROCEDURE];
      }
      break;
    case ('LAST'):
      if (mode === 'GET') {
        code = 'last ' + list;
        return [code, Order.PROCEDURE];
      }
      break;
    case ('FROM_START'):
      const at = generator.getAdjusted(block, 'AT');
      if (mode === 'GET') {
        code = 'item ' + at + ' ' + list;
        return [code, Order.PROCEDURE];
      }
      break;
    case ('RANDOM'):
      if (mode === 'GET') {
        code = 'pick ' + list;
        return [code, Order.PROCEDURE];
      }
      break;
  }
  throw Error('Unhandled combination (lists_getIndex).');
}

export function lists_sort(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
// Block for sorting a list.
  const list = generator.valueToCode(block, 'LIST',
      Order.NONE) || '[]';
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
  const functionName = generator.provideFunction_(
      'listsGetSort',
      ['to ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
      ' :l',
        '  localmake "cip ifelse definedp "caseignoredp [:caseignoredp] ""true',
        '  make "caseignoredp ' + ignoreCase,
        '  localmake "res (sort :l ' + cmp + ')',
        '  make "caseignoredp :cip',
        '  op :res',
        'end']);
  return [functionName + ' ' + list, Order.PROCEDURE];
}

// export function lists_split(
//   block: Block,
//   generator: LogoGenerator,
// ) {
  // // Block for splitting text into a list, or joining a list into text.
  // var input = generator.valueToCode(block, 'INPUT',
      // Order.MEMBER);
  // var delimiter = generator.valueToCode(block, 'DELIM',
      // Order.NONE) || '\'\'';
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
  // return [code, Order.FUNCTION_CALL];
// };

export function lists_reverse(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Block for reversing a list.
  const list = generator.valueToCode(block, 'LIST',
      Order.NONE) || '[]';
  const code = 'reverse ' + list;
  return [code, Order.PROCEDURE];
}
