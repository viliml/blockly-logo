/**
 * @fileoverview Generating Logo for loop blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.loops

import {Order} from './logo_generator.js';


export function controls_repeat_ext(block, generator) {
  let repeats;
// Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    repeats = generator.valueToCode(block, 'TIMES',
        Order.NONE) || '0';
  }
  let branch = generator.statementToCode(block, 'DO');
  branch = generator.addLoopTrap(branch, block);
  let code = '';
  code += 'repeat ' + repeats + ' [\n' +
      branch + ']\n';
  return code;
};

export const controls_repeat = controls_repeat_ext;

export function controls_whileUntil(block, generator) {
  // Do while/until loop.
  const until = block.getFieldValue('MODE') === 'UNTIL';
  const argument0 = generator.valueToCode(block, 'BOOL',
      Order.NONE) || '"false';
  let branch = generator.statementToCode(block, 'DO');
  branch = generator.addLoopTrap(branch, block);
  return (until ? 'until ' : 'while [') + argument0 + '] [\n' + branch + ']\n';
};

export function controls_for(block, generator) {
  // For loop.
  const variable0 = generator.getVariableName(block.getFieldValue('VAR'));
  const argument0 = generator.valueToCode(block, 'FROM',
      Order.NONE) || '0';
  const argument1 = generator.valueToCode(block, 'TO',
      Order.NONE) || '0';
  const increment = generator.valueToCode(block, 'BY',
      Order.NONE) || '1';
  let branch = generator.statementToCode(block, 'DO');
  branch = generator.addLoopTrap(branch, block);
  const code = 'for [' + variable0 + ' [' + argument0 + '] [' +
      argument1 + '] [' + increment + ']] [\n' +
      branch + ']\n';
  return code;
};

export function controls_forEach(block, generator) {
  // For each loop.
  const variable0 = generator.getVariableName(block.getFieldValue('VAR'));
  const argument0 = generator.valueToCode(block, 'LIST',
      Order.NONE) || '[]';
  let branch = generator.statementToCode(block, 'DO');
  branch = generator.addLoopTrap(branch, block);
  branch = generator.INDENT + 'make "' + variable0 + ' ?\n' + branch;
  const code = 'foreach ' + argument0 + ' [\n' + branch + ']\n';
  return code;
};
/*
export function controls_flow_statements(block, generator) {
  // Flow statements: continue, break.
  var xfix = '';
  if (generator.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    xfix += generator.injectId(generator.STATEMENT_PREFIX,
        block);
  }
  if (generator.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the break/continue is triggered.
    xfix += generator.injectId(generator.STATEMENT_SUFFIX,
        block);
  }
  if (generator.STATEMENT_PREFIX) {
    var loop = Blockly.Constants.Loops
        .CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(block);
    if (loop && !loop.suppressPrefixSuffix) {
      // Inject loop's statement prefix here since the regular one at the end
      // of the loop will not get executed if 'continue' is triggered.
      // In the case of 'break', a prefix is needed due to the loop's suffix.
      xfix += generator.injectId(generator.STATEMENT_PREFIX,
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
