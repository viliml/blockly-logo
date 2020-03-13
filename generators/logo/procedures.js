/**
 * @fileoverview Generating Logo for procedure blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.provide('Blockly.Logo.procedures');

goog.require('Blockly.Logo');


Blockly.Logo['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Blockly.Logo.STATEMENT_PREFIX) {
    xfix1 += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.Logo.STATEMENT_SUFFIX) {
    xfix1 += Blockly.Logo.injectId(Blockly.Logo.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = Blockly.Logo.prefixLines(xfix1, Blockly.Logo.INDENT);
  }
  var loopTrap = '';
  if (Blockly.Logo.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.Logo.prefixLines(
        Blockly.Logo.injectId(Blockly.Logo.INFINITE_LOOP_TRAP,
        block), Blockly.Logo.INDENT);
  }
  var branch = Blockly.Logo.statementToCode(block, 'STACK');
  var returnValue = Blockly.Logo.valueToCode(block, 'RETURN',
      Blockly.Logo.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.Logo.INDENT + 'op ' + returnValue + '\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Logo.variableDB_.getName(block.arguments_[i],
        Blockly.VARIABLE_CATEGORY_NAME);
  }
  var arg_str = args.join(' :');
  if (arg_str) {
    arg_str = ' :' + arg_str;
  }
  var code = 'to ' + funcName + arg_str + '\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + 'end';
  code = Blockly.Logo.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Logo.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Logo['procedures_defnoreturn'] =
    Blockly.Logo['procedures_defreturn'];

Blockly.Logo['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Logo.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Logo.valueToCode(block, 'ARG' + i,
        Blockly.Logo.ORDER_NONE) || '[]';
  }
  var code = funcName + ' ' + args.join(' ');
  return [code, Blockly.Logo.ORDER_PROCEDURE];
};

Blockly.Logo['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.Logo['procedures_callreturn'](block);
  return tuple[0] + '\n';
};

Blockly.Logo['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Logo.valueToCode(block, 'CONDITION',
      Blockly.Logo.ORDER_NONE) || 'false';
  var code = 'if ' + condition + ' [\n';
  if (Blockly.Logo.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.Logo.prefixLines(
        Blockly.Logo.injectId(Blockly.Logo.STATEMENT_SUFFIX, block),
        Blockly.Logo.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.Logo.valueToCode(block, 'VALUE',
        Blockly.Logo.ORDER_NONE) || '[]';
    code += Blockly.Logo.INDENT + 'op ' + value + '\n';
  } else {
    code += Blockly.Logo.INDENT + 'stop\n';
  }
  code += ']\n';
  return code;
};
