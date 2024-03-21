/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper functions for generating JavaScript for blocks.
 * @author Vilim Lendvaj
 */

// Former goog.module ID: Blockly.Logo

// import * as Variables from '../../core/variables.js';
import * as stringUtils from '../../core/utils/string.js';
import type {Block} from '../../core/block.js';
import {CodeGenerator} from '../../core/generator.js';
import {Names} from '../../core/names.js';
import type {Workspace} from '../../core/workspace.js';
import {inputTypes} from '../../core/inputs/input_types.js';

/**
 * Order of operation ENUMs.
 * @enum {number}
 */

export enum Order {
  ATOMIC= 0,				// ()
  UNARY_NEGATION = 1,		// -
  MULTIPLICATION = 2.1,	// *
  DIVISION = 2.2,			// /
  SUBTRACTION = 3.1,		// -
  ADDITION = 3.2,			// +
  COMPARISON = 4,			// == < > <= >= <>
  PROCEDURE = 5,			// pr "|Hello World|
  NONE = 99,              // (...)
}

export class LogoGenerator extends CodeGenerator {

  /**
   * List of outer-inner pairings that do NOT require parentheses.
   * @type {!Array.<!Array.<number>>}
   */
  ORDER_OVERRIDES: [Order, Order][] = [
    // a * (b * c) -> a * b * c
    [Order.MULTIPLICATION, Order.MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Order.ADDITION, Order.ADDITION],//,

    //pr (abs a) -> pr abs a
    //[Order.PROCEDURE, Order.PROCEDURE]
  ];

  constructor(name = 'Logo') {
    super(name);
    this.isInitialized = false;

    // Copy Order values onto instance for backwards compatibility
    // while ensuring they are not part of the publically-advertised
    // API.
    //
    // TODO(#7085): deprecate these in due course.  (Could initially
    // replace data properties with get accessors that call
    // deprecate.warn().)
    for (const key in Order) {
      // Must assign Order[key] to a temporary to get the type guard to work;
      // see https://github.com/microsoft/TypeScript/issues/10530.
      const value = Order[key];
      // Skip reverse-lookup entries in the enum.  Due to
      // https://github.com/microsoft/TypeScript/issues/55713 this (as
      // of TypeScript 5.5.2) actually narrows the type of value to
      // never - but that still allows the following assignment to
      // succeed.
      if (typeof value === 'string') continue;
      (this as unknown as Record<string, Order>)['ORDER_' + key] = value;
    }
  }

  /**
   * Initialise the database of variable names.
   * @param workspace Workspace to generate code from.
   */
  init(workspace: Workspace) {
    super.init(workspace);

    if (!this.nameDB_) {
      this.nameDB_ = new Names(this.RESERVED_WORDS_);
    } else {
      this.nameDB_.reset();
    }

    this.nameDB_.setVariableMap(workspace.getVariableMap());
    this.nameDB_.populateVariables(workspace);
    this.nameDB_.populateProcedures(workspace);

    this.isInitialized = true;
  };

  /**
   * Prepend the generated code with the variable definitions.
   * @param {string} code Generated code.
   * @return {string} Completed code.
   */
  finish(code: string) {
    // Convert the definitions dictionary into a list.
    const definitions = Object.values(this.definitions_);
    // Call Blockly.CodeGenerator's finish.
    super.finish(code);
    this.isInitialized = false;

    this.nameDB_!.reset();
    return definitions.join('\n\n') + '\n\n\n' + code;
  };

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  An ignore function is needed to make this legal.
   * @param line Line of generated code.
   * @return Legal line of code.
   */
  scrubNakedValue(line: string): string {
    return 'ignore ' + line + '\n';
  }

  /**
   * Encode a string as a properly escaped JavaScript string, complete with
   * quotes.
   * @param string Text to encode.
   * @return JavaScript string.
   */
  quote_(string: string): string {
    string = string.replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\\n')
    .replace(/;/g, '\\;')
    .replace(/ /g, '\\ ')
    .replace(/\|/g, '\\|')
    .replace(/~/g, '\\~');
    return '"' + string;
  }

  /**
   * Encode a string as a properly escaped multiline JavaScript string, complete
   * with quotes.
   * @param string Text to encode.
   * @return JavaScript string.
   */
  multiline_quote_(string: string): string {
    const lines = string.split(/\n/g).map(this.quote_);
    return lines.join('\\\n');
  }

  /**
   * Common tasks for generating JavaScript from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   * @param block The current block.
   * @param code The JavaScript code created for this block.
   * @param opt_thisOnly True to generate code for only this
   *     statement.
   * @return Logo code with comments and subsequent blocks added.
   * @protected
   */
  scrub_(block: Block, code: string, opt_thisOnly = false): string {
    let commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      let comment = block.getCommentText();
      if (comment) {
        comment = stringUtils.wrap(comment, this.COMMENT_WRAP - 3);
        commentCode += this.prefixLines(comment + '\n', '; ');
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type === inputTypes.VALUE) {
          const childBlock = block.inputList[i].connection!.targetBlock();
          if (childBlock) {
            comment = this.allNestedComments(childBlock);
            if (comment) {
              commentCode += this.prefixLines(comment, '; ');
            }
          }
        }
      }
    }
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  }

  /**
   * Generate code representing the specified value input, adjusted to take into
   * account indexing (zero- or one-based) and optionally by a specified delta
   * and/or by negation.
   *
   * @param block The block.
   * @param atId The ID of the input block to get (and adjust) the value of.
   * @param delta Value to add.
   * @param negate Whether to negate the value.
   * @param order The highest order acting on this value.
   * @returns The adjusted value or code that evaluates to it.
   */
  getAdjusted(
      block: Block,
      atId: string,
      delta = 0,
      negate = false,
      order = Order.NONE,
  ) {
    if (!block.workspace.options.oneBasedIndex) {
      delta++;
    }
    const defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';

    let orderForInput = order;
    if (delta > 0) {
      orderForInput = Order.ADDITION;
    } else if (delta < 0) {
      orderForInput = Order.SUBTRACTION;
    } else if (negate) {
      orderForInput = Order.UNARY_NEGATION;
    }

    let at = this.valueToCode(block, atId, orderForInput) || defaultAtIndex;

    // Easy case: no adjustments.
    if (delta === 0 && !negate) {
      return at;
    }
    // If the index is a naked number, adjust it right now.
    if (stringUtils.isNumber(at)) {
      at = String(Number(at) + delta);
      if (negate) {
        at = String(-Number(at));
      }
      return at;
    }
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = `${at} + ${delta}`;
    } else if (delta < 0) {
      at = `${at} - ${-delta}`;
    }
    if (negate) {
      at = delta ? `-(${at})` : `-${at}`;
    }
    if (Math.floor(order) >= Math.floor(orderForInput)) {
      at = `(${at})`;
    }
    return at;
  }
}
