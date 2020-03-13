/**
 * @fileoverview Generating Logo for loop blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.loops');

goog.require('Blockly.Logo');


Blockly.Logo['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.Logo.valueToCode(block, 'TIMES',
        Blockly.Logo.ORDER_NONE) || '0';
  }
  var branch = Blockly.Logo.statementToCode(block, 'DO');
  branch = Blockly.Logo.addLoopTrap(branch, block);
  var code = '';
  code += 'repeat ' + repeats + ' [\n' +
      branch + ']\n';
  return code;
};

Blockly.Logo['controls_repeat'] =
    Blockly.Logo['controls_repeat_ext'];

Blockly.Logo['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Logo.valueToCode(block, 'BOOL',
      Blockly.Logo.ORDER_NONE) || '"false';
  var branch = Blockly.Logo.statementToCode(block, 'DO');
  branch = Blockly.Logo.addLoopTrap(branch, block);
  return (until ? 'until ' : 'while ') + argument0 + ' [\n' + branch + ']\n';
};

Blockly.Logo['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.Logo.valueToCode(block, 'FROM',
      Blockly.Logo.ORDER_NONE) || '0';
  var argument1 = Blockly.Logo.valueToCode(block, 'TO',
      Blockly.Logo.ORDER_NONE) || '0';
  var increment = Blockly.Logo.valueToCode(block, 'BY',
      Blockly.Logo.ORDER_NONE) || '1';
  var branch = Blockly.Logo.statementToCode(block, 'DO');
  branch = Blockly.Logo.addLoopTrap(branch, block);
  var code = 'for [' + variable0 + ' [' + argument0 + '] [' +
		argument1 + '] [' + increment + ']] [\n' +
		branch + ']\n';
  return code;
};

Blockly.Logo['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var argument0 = Blockly.Logo.valueToCode(block, 'LIST',
      Blockly.Logo.ORDER_NONE) || '[]';
  var branch = Blockly.Logo.statementToCode(block, 'DO');
  branch = Blockly.Logo.addLoopTrap(branch, block);
  branch = Blockly.Logo.INDENT + 'make "' + variable0 + ' ?\n' + branch;
  var code = 'foreach ' + argument0 + ' [\n' + branch + ']\n';
  return code;
};
/*
Blockly.Logo['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  var xfix = '';
  if (Blockly.Logo.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.Logo.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_SUFFIX,
        block);
  }
  if (Blockly.Logo.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_PREFIX,
          loop);
    }
  }
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return xfix + 'break;\n';
    case 'CONTINUE':
      return xfix + 'continue;\n';
  }
  throw Error('Unknown flow statement.');
};*/
