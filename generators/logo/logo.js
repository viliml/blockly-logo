/**
 * @fileoverview Generating Logo for logo blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.logo');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['logo_move'] = function(block) {
  const dropdown_op = block.getFieldValue('OP');
  const value_amount = Logo.valueToCode(block, 'AMOUNT', Logo.ORDER_NONE);
  return dropdown_op.toLowerCase() + ' ' + value_amount + '\n';
};

Logo['logo_rotate'] = function(block) {
  const dropdown_direction = block.getFieldValue('DIRECTION');
  const value_amount = Logo.valueToCode(block, 'AMOUNT', Logo.ORDER_NONE);
  return dropdown_direction.toLowerCase() + ' ' + value_amount + '\n';
};

Logo['logo_circle'] = function(block) {
  const dropdown_method = block.getFieldValue('METHOD');
  const value_r = Logo.valueToCode(block, 'R', Logo.ORDER_NONE);
  return dropdown_method.toLowerCase() + ' ' + value_r + '\n';
};

Logo['logo_pen'] = function(block) {
  const dropdown_op = block.getFieldValue('OP');
  return dropdown_op.toLowerCase() + '\n';
};

Logo['logo_setcolor'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  const value_color = Logo.valueToCode(block, 'COLOR', Logo.ORDER_ATOMIC);
  return dropdown_which.toLowerCase() + ' ' + value_color + '\n';
};

Logo['logo_getcolor'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Logo.ORDER_PROCEDURE];
};

Logo['logo_mode'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Logo['logo_screen'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Logo['logo_set'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  const value_value = Logo.valueToCode(block, 'VALUE', Logo.ORDER_NONE);
  return dropdown_which.toLowerCase() + ' ' + value_value + '\n';
};

Logo['logo_get'] = function(block) {
  const dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Logo.ORDER_PROCEDURE];
};