/**
 * @fileoverview Generating Logo for logo blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.logo');

goog.require('Blockly.Logo');


Blockly.Logo['logo_move'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  var value_amount = Blockly.Logo.valueToCode(block, 'AMOUNT', Blockly.Logo.ORDER_NONE);
  return dropdown_op.toLowerCase() + ' ' + value_amount + '\n';
};

Blockly.Logo['logo_rotate'] = function(block) {
  var dropdown_direction = block.getFieldValue('DIRECTION');
  var value_amount = Blockly.Logo.valueToCode(block, 'AMOUNT', Blockly.Logo.ORDER_NONE);
  return dropdown_direction.toLowerCase() + ' ' + value_amount + '\n';
};

Blockly.Logo['logo_circle'] = function(block) {
  var dropdown_method = block.getFieldValue('METHOD');
  var value_r = Blockly.Logo.valueToCode(block, 'R', Blockly.Logo.ORDER_NONE);
  return dropdown_method.toLowerCase() + ' ' + value_r + '\n';
};

Blockly.Logo['logo_pen'] = function(block) {
  var dropdown_op = block.getFieldValue('OP');
  return dropdown_op.toLowerCase() + '\n';
};

Blockly.Logo['logo_setcolor'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  var value_color = Blockly.Logo.valueToCode(block, 'COLOR', Blockly.Logo.ORDER_ATOMIC);
  return dropdown_which.toLowerCase() + ' ' + value_color + '\n';
};

Blockly.Logo['logo_getcolor'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['logo_mode'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Blockly.Logo['logo_screen'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return dropdown_which.toLowerCase() + '\n';
};

Blockly.Logo['logo_set'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  var value_value = Blockly.Logo.valueToCode(block, 'VALUE', Blockly.Logo.ORDER_NONE);
  return dropdown_which.toLowerCase() + ' ' + value_value + '\n';
};

Blockly.Logo['logo_get'] = function(block) {
  var dropdown_which = block.getFieldValue('WHICH');
  return [dropdown_which.toLowerCase(), Blockly.Logo.ORDER_PROCEDURE];
};