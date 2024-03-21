/**
 * @fileoverview Generating Logo for colour blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.colour

import type {Block} from '../../core/block.js';
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';


export function colour_picker(
  block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Colour picker.
  const c = block.getFieldValue('COLOUR');
  const r = parseInt(c.substring(1, 3), 16);
  const g = parseInt(c.substring(3, 5), 16);
  const b = parseInt(c.substring(5, 7), 16);
  const code = '[' + r + ' ' + g + ' ' + b + ']';
  return [code, Order.ATOMIC];
}

export function colour_random(
  _block: Block,
  _generator: LogoGenerator,
): [string, Order] {
  // Generate a random colour.
  const code = "(list random 256 random 256 random 256)";
  return [code, Order.ATOMIC];
}

export function colour_rgb(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Compose a colour from RGB components expressed as percentages.
  const red = generator.valueToCode(block, 'RED',
      Order.MULTIPLICATION) || 0;
  const green = generator.valueToCode(block, 'GREEN',
      Order.MULTIPLICATION) || 0;
  const blue = generator.valueToCode(block, 'BLUE',
      Order.MULTIPLICATION) || 0;
  const code = '(list 2.55 * ' + red + ' 2.55 * ' + green + ' 2.55 * ' + blue + ')';
  return [code, Order.ATOMIC];
}
/*
export function colour_blend(
  block: Block,
  generator: LogoGenerator,
) {
  // Blend two colours together.
  var c1 = generator.valueToCode(block, 'COLOUR1',
      Order.COMMA) || '\'#000000\'';
  var c2 = generator.valueToCode(block, 'COLOUR2',
      Order.COMMA) || '\'#000000\'';
  var ratio = generator.valueToCode(block, 'RATIO',
      Order.COMMA) || 0.5;
  var functionName = generator.provideFunction_(
      'colourBlend',
      ['function ' + generator.FUNCTION_NAME_PLACEHOLDER_ +
          '(c1, c2, ratio) {',
       '  ratio = Math.max(Math.min(Number(ratio), 1), 0);',
       '  var r1 = parseInt(c1.substring(1, 3), 16);',
       '  var g1 = parseInt(c1.substring(3, 5), 16);',
       '  var b1 = parseInt(c1.substring(5, 7), 16);',
       '  var r2 = parseInt(c2.substring(1, 3), 16);',
       '  var g2 = parseInt(c2.substring(3, 5), 16);',
       '  var b2 = parseInt(c2.substring(5, 7), 16);',
       '  var r = Math.round(r1 * (1 - ratio) + r2 * ratio);',
       '  var g = Math.round(g1 * (1 - ratio) + g2 * ratio);',
       '  var b = Math.round(b1 * (1 - ratio) + b2 * ratio);',
       '  r = (\'0\' + (r || 0).toString(16)).slice(-2);',
       '  g = (\'0\' + (g || 0).toString(16)).slice(-2);',
       '  b = (\'0\' + (b || 0).toString(16)).slice(-2);',
       '  return \'#\' + r + g + b;',
       '}']);
  var code = functionName + '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
  return [code, Order.FUNCTION_CALL];
};*/
