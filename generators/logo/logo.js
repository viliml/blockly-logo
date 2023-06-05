/**
 * @fileoverview Generating Logo for logo blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.logo');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['logo_move'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  var value_amount = Logo.valueToCode(block, 'AMOUNT', Logo.ORDER_NONE);
  return dropdown_op.toLowerCase() + ' ' + value_amount + '\n';
};

Logo['logo_rotate'] = function(block) {
  var dropdown_direction = block.getFieldValue('DIRECTION');
  var value_amount = Logo.valueToCode(block, 'AMOUNT', Logo.ORDER_NONE);
  return dropdown_direction.toLowerCase() + ' ' + value_amount + '\n';
};

Logo['logo_circle'] = function(block) {
  var dropdown_method = block.getFieldValue('METHOD');
  var value_r = Logo.valueToCode(block, 'R', Logo.ORDER_NONE);
  return dropdown_method.toLowerCase() + ' ' + value_r + '\n';
};

Logo['logo_pen'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  return dropdown_op.toLowerCase() + '\n';
};

Logo['logo_setcolor'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  var value_color = Logo.valueToCode(block, 'COLOR', Logo.ORDER_ATOMIC);
  return dropdown_which.toLowerCase() + ' ' + value_color + '\n';
};

Logo['logo_getcolor'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Logo.ORDER_PROCEDURE];
};

Logo['logo_mode'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Logo['logo_screen'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Logo['logo_set'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  var value_value = Logo.valueToCode(block, 'VALUE', Logo.ORDER_NONE);
  return dropdown_which.toLowerCase() + ' ' + value_value + '\n';
};

Logo['logo_get'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Logo.ORDER_PROCEDURE];
};
