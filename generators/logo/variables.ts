/**
 * @fileoverview Generating Logo for variable blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.variables

import type {Block} from '../../core/block.js';
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';


export function variables_get(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Variable getter.
  const code = ':' + generator.getVariableName(block.getFieldValue('VAR'));
  return [code, Order.ATOMIC];
}

export function variables_set(
  block: Block,
  generator: LogoGenerator,
) {
  // Variable setter.
  const argument0 = generator.valueToCode(block, 'VALUE',
      Order.ATOMIC) || '0'; //TODO add proper order
  const varName = generator.getVariableName(block.getFieldValue('VAR'));
  return 'make ' + generator.quote_(varName) + ' ' + argument0 + '\n';
}
