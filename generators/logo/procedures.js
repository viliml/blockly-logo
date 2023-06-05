/**
 * @fileoverview Generating Logo for procedure blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo.procedures');

const {logoGenerator: Logo} = goog.require('Blockly.Logo');


Logo['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Logo.variableDB_.getName(block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Logo.STATEMENT_PREFIX) {
    xfix1 += Logo.injectId(Logo.STATEMENT_PREFIX, block);
  }
  if (Logo.STATEMENT_SUFFIX) {
    xfix1 += Logo.injectId(Logo.STATEMENT_SUFFIX, block);
  }
  if (xfix1) {
    xfix1 = Logo.prefixLines(xfix1, Logo.INDENT);
  }
  var loopTrap = '';
  if (Logo.INFINITE_LOOP_TRAP) {
    loopTrap = Logo.prefixLines(Logo.injectId(Logo.INFINITE_LOOP_TRAP, block), Logo.INDENT);
  }
  var branch = Logo.statementToCode(block, 'STACK');
  var returnValue = Logo.valueToCode(block, 'RETURN', Logo.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Logo.INDENT + 'op ' + returnValue + '\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Logo.variableDB_.getName(block.arguments_[i], Blockly.VARIABLE_CATEGORY_NAME);
  }
  var arg_str = args.join(' :');
  if (arg_str) {
    arg_str = ' :' + arg_str;
  }
  var code = 'to ' + funcName + arg_str + '\n' + xfix1 + loopTrap + branch + xfix2 + returnValue +
      'end';
  code = Logo.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Logo.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Logo['procedures_defnoreturn'] = Logo['procedures_defreturn'];

Logo['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Logo.variableDB_.getName(block.getFieldValue('NAME'),
      Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Logo.valueToCode(block, 'ARG' + i, Logo.ORDER_NONE) || '[]';
  }
  var code = funcName + ' ' + args.join(' ');
  return [code, Logo.ORDER_PROCEDURE];
};

Logo['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Logo['procedures_callreturn'](block);
  return tuple[0] + '\n';
};

Logo['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Logo.valueToCode(block, 'CONDITION', Logo.ORDER_NONE) || 'false';
  var code = 'if ' + condition + ' [\n';
  if (Logo.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Logo.prefixLines(Logo.injectId(Logo.STATEMENT_SUFFIX, block), Logo.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Logo.valueToCode(block, 'VALUE', Logo.ORDER_NONE) || '[]';
    code += Logo.INDENT + 'op ' + value + '\n';
  } else {
    code += Logo.INDENT + 'stop\n';
  }
  code += ']\n';
  return code;
};
