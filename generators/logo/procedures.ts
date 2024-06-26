/**
 * @fileoverview Generating Logo for procedure blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo.procedures

import type {Block} from '../../core/block.js';
import type {IfReturnBlock} from '../../blocks/procedures.js';
import type {LogoGenerator} from './logo_generator.js';
import {Order} from './logo_generator.js';


export function procedures_defreturn(
  block: Block,
  generator: LogoGenerator,
) {
  // Define a procedure with a return value.
  const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
  let xfix1 = '';
  if (generator.STATEMENT_PREFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_PREFIX,
        block);
  }
  if (generator.STATEMENT_SUFFIX) {
    xfix1 += generator.injectId(generator.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = generator.prefixLines(xfix1, generator.INDENT);
  }
  let loopTrap = '';
  if (generator.INFINITE_LOOP_TRAP) {
    loopTrap = generator.prefixLines(
        generator.injectId(generator.INFINITE_LOOP_TRAP,
        block), generator.INDENT);
  }
  const branch = generator.statementToCode(block, 'STACK');
  let returnValue = generator.valueToCode(block, 'RETURN',
      Order.NONE) || '';
  let xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = generator.INDENT + 'op ' + returnValue + '\n';
  }
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
      args[i] = generator.getVariableName(variables[i]);
  }
  let arg_str = args.join(' :');
  if (arg_str) {
    arg_str = ' :' + arg_str;
  }
  let code = 'to ' + funcName + arg_str + '\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + 'end';
  code = generator.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  // TODO(#7600): find better approach than casting to any to override
  // CodeGenerator declaring .definitions protected.
  (generator as AnyDuringMigration).definitions_['%' + funcName] = code;
  return null;
}

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
export const procedures_defnoreturn = procedures_defreturn;

export function procedures_callreturn(
  block: Block,
  generator: LogoGenerator,
): [string, Order] {
  // Call a procedure with a return value.
  const funcName = generator.getProcedureName(block.getFieldValue('NAME'));
  const args = [];
  const variables = block.getVars();
  for (let i = 0; i < variables.length; i++) {
    args[i] = generator.valueToCode(block, 'ARG' + i,
        Order.NONE) || '[]';
  }
  const code = funcName + ' ' + args.join(' ');
  return [code, Order.PROCEDURE];
}

export function procedures_callnoreturn(
  block: Block,
  generator: LogoGenerator,
) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  const tuple = procedures_callreturn(block, generator);
  return tuple[0] + '\n';
}

export function procedures_ifreturn(
  block: Block,
  generator: LogoGenerator,
) {
  // Conditionally return value from a procedure.
  const condition = generator.valueToCode(block, 'CONDITION',
      Order.NONE) || 'false';
  let code = 'if ' + condition + ' [\n';
  if (generator.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += generator.prefixLines(
        generator.injectId(generator.STATEMENT_SUFFIX, block),
        generator.INDENT);
  }
  if ((block as IfReturnBlock).hasReturnValue_) {
    const value = generator.valueToCode(block, 'VALUE',
        Order.NONE) || '[]';
    code += generator.INDENT + 'op ' + value + '\n';
  } else {
    code += generator.INDENT + 'stop\n';
  }
  code += ']\n';
  return code;
}
