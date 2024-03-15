/**
 * @fileoverview Generating Logo for loop blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.loops');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['controls_repeat_ext'] = function(block) {
  let repeats;
// Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    repeats = Logo.valueToCode(block, 'TIMES',
        Logo.ORDER_NONE) || '0';
  }
  let branch = Logo.statementToCode(block, 'DO');
  branch = Logo.addLoopTrap(branch, block);
  let code = '';
  code += 'repeat ' + repeats + ' [\n' +
      branch + ']\n';
  return code;
};

Logo['controls_repeat'] =
    Logo['controls_repeat_ext'];

Logo['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  const until = block.getFieldValue('MODE') === 'UNTIL';
  const argument0 = Logo.valueToCode(block, 'BOOL',
      Logo.ORDER_NONE) || '"false';
  let branch = Logo.statementToCode(block, 'DO');
  branch = Logo.addLoopTrap(branch, block);
  return (until ? 'until ' : 'while [') + argument0 + '] [\n' + branch + ']\n';
};

Logo['controls_for'] = function(block) {
  // For loop.
  const variable0 = Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  const argument0 = Logo.valueToCode(block, 'FROM',
      Logo.ORDER_NONE) || '0';
  const argument1 = Logo.valueToCode(block, 'TO',
      Logo.ORDER_NONE) || '0';
  const increment = Logo.valueToCode(block, 'BY',
      Logo.ORDER_NONE) || '1';
  let branch = Logo.statementToCode(block, 'DO');
  branch = Logo.addLoopTrap(branch, block);
  const code = 'for [' + variable0 + ' [' + argument0 + '] [' +
      argument1 + '] [' + increment + ']] [\n' +
      branch + ']\n';
  return code;
};

Logo['controls_forEach'] = function(block) {
  // For each loop.
  const variable0 = Logo.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  const argument0 = Logo.valueToCode(block, 'LIST',
      Logo.ORDER_NONE) || '[]';
  let branch = Logo.statementToCode(block, 'DO');
  branch = Logo.addLoopTrap(branch, block);
  branch = Logo.INDENT + 'make "' + variable0 + ' ?\n' + branch;
  const code = 'foreach ' + argument0 + ' [\n' + branch + ']\n';
  return code;
};
/*
Logo['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  var xfix = '';
  if (Logo.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += Logo.injectId(Logo.STATEMENT_PREFIX,
        block);
  }
  if (Logo.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += Logo.injectId(Logo.STATEMENT_SUFFIX,
        block);
  }
  if (Logo.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += Logo.injectId(Logo.STATEMENT_PREFIX,
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
