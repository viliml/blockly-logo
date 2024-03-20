/**
 * @fileoverview Generating Logo for logo blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.logo

import {Order} from './logo_generator.js';


export function logo_move(block, generator) {
  const dropdown_op = block.getFieldValue('OP');
  const value_amount = generator.valueToCode(block, 'AMOUNT', Order.NONE);
  return dropdown_op.toLowerCase() + ' ' + value_amount + '\n';
};

export function logo_rotate(block, generator) {
  const dropdown_direction = block.getFieldValue('DIRECTION');
  const value_amount = generator.valueToCode(block, 'AMOUNT', Order.NONE);
  return dropdown_direction.toLowerCase() + ' ' + value_amount + '\n';
};

export function logo_circle(block, generator) {
  const dropdown_method = block.getFieldValue('METHOD');
  const value_r = generator.valueToCode(block, 'R', Order.NONE);
  return dropdown_method.toLowerCase() + ' ' + value_r + '\n';
};

export function logo_pen(block, generator) {
  const dropdown_op = block.getFieldValue('OP');
  return dropdown_op.toLowerCase() + '\n';
};

export function logo_setcolor(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  const value_color = generator.valueToCode(block, 'COLOR', Order.ATOMIC);
  return dropdown_which.toLowerCase() + ' ' + value_color + '\n';
};

export function logo_getcolor(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Order.PROCEDURE];
};

export function logo_mode(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

export function logo_screen(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

export function logo_set(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  const value_value = generator.valueToCode(block, 'VALUE', Order.NONE);
  return dropdown_which.toLowerCase() + ' ' + value_value + '\n';
};

export function logo_get(block, generator) {
  const dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Order.PROCEDURE];
};