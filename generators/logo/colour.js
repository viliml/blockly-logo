/**
 * @fileoverview Generating Logo for colour blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.colour');

goog.require('Blockly.Logo');


Blockly.Logo['colour_picker'] = function(block) {
  // Colour picker.
  var c = block.getFieldValue('COLOUR');
  var r = parseInt(c.substring(1, 3), 16);
  var g = parseInt(c.substring(3, 5), 16);
  var b = parseInt(c.substring(5, 7), 16);
  var code = '[' + r + ' ' + g + ' ' + b + ']'
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['colour_random'] = function(block) {
  // Generate a random colour.
  var code = "(list random 256 random 256 random 256)";
  return [code, Blockly.Logo.ORDER_ATOMIC];
};

Blockly.Logo['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  var red = Blockly.Logo.valueToCode(block, 'RED',
      Blockly.Logo.ORDER_MULTIPLICATION) || 0;
  var green = Blockly.Logo.valueToCode(block, 'GREEN',
      Blockly.Logo.ORDER_MULTIPLICATION) || 0;
  var blue = Blockly.Logo.valueToCode(block, 'BLUE',
      Blockly.Logo.ORDER_MULTIPLICATION) || 0;
  var code = '(list 2.55 * ' + red + ' 2.55 * ' + green + ' 2.55 * ' + blue + ')';
  return [code, Blockly.Logo.ORDER_ATOMIC];
};
/*
Blockly.Logo['colour_blend'] = function(block) {
  // Blend two colours together.
  var c1 = Blockly.Logo.valueToCode(block, 'COLOUR1',
      Blockly.Logo.ORDER_COMMA) || '\'#000000\'';
  var c2 = Blockly.Logo.valueToCode(block, 'COLOUR2',
      Blockly.Logo.ORDER_COMMA) || '\'#000000\'';
  var ratio = Blockly.Logo.valueToCode(block, 'RATIO',
      Blockly.Logo.ORDER_COMMA) || 0.5;
  var functionName = Blockly.Logo.provideFunction_(
      'colourBlend',
      ['function ' + Blockly.Logo.FUNCTION_NAME_PLACEHOLDER_ +
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
  return [code, Blockly.Logo.ORDER_FUNCTION_CALL];
};*/
