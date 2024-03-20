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
// import type {Block} from '../../core/block.js';
import {CodeGenerator} from '../../core/generator.js';
import {Names, NameType} from '../../core/names.js';
// import type {Workspace} from '../../core/workspace.js';
import {inputTypes} from '../../core/inputs/input_types.js';

/**
 * Order of operation ENUMs.
 * @enum {number}
 */

export const Order = {
  ATOMIC: 0,				// ()
  UNARY_NEGATION: 1,		// -
  MULTIPLICATION: 2.1,	// *
  DIVISION: 2.2,			// /
  SUBTRACTION: 3.1,		// -
  ADDITION: 3.2,			// +
  COMPARISON: 4,			//: < > <= >= <>
  PROCEDURE: 5,			// pr "|Hello World|
  NONE: 99,              // (...)
};

export class LogoGenerator extends CodeGenerator {

  /**
   * List of outer-inner pairings that do NOT require parentheses.
   * @type {!Array.<!Array.<number>>}
   */
  ORDER_OVERRIDES = [
    // a * (b * c) -> a * b * c
    [Order.MULTIPLICATION, Order.MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Order.ADDITION, Order.ADDITION],//,

    //pr (abs a) -> pr abs a
    //[Order.PROCEDURE, Order.PROCEDURE]
  ];

  constructor(name) {
    super(name ?? 'Logo');
    this.isInitialized = false;

    // Copy Order values onto instance for backwards compatibility
    // while ensuring they are not part of the publically-advertised
    // API.
    //
    // TODO(#7085): deprecate these in due course.  (Could initially
    // replace data properties with get accessors that call
    // deprecate.warn().)
    for (const key in Order) {
      this['ORDER_' + key] = Order[key];
    }
  }

  /**
   * Initialise the database of variable names.
   * @param {!Workspace} workspace Workspace to generate code from.
   */
  init(workspace) {
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
  finish(code) {
    // Convert the definitions dictionary into a list.
    const definitions = Object.values(this.definitions_);
    // Call Blockly.CodeGenerator's finish.
    super.finish(code);
    this.isInitialized = false;

    this.nameDB_.reset();
    return definitions.join('\n\n') + '\n\n\n' + code;
  };

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  An ignore function is needed to make this legal.
   * @param {string} line Line of generated code.
   * @return {string} Legal line of code.
   */
  scrubNakedValue(line) {
    return 'ignore ' + line + '\n';
  }

  /**
   * Encode a string as a properly escaped JavaScript string, complete with
   * quotes.
   * @param {string} string Text to encode.
   * @return {string} JavaScript string.
   */
  quote_(string) {
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
   * @param {string} string Text to encode.
   * @return {string} JavaScript string.
   */
  multiline_quote_(string) {
    const lines = string.split(/\n/g).map(this.quote_);
    return lines.join('\\\n');
  }

  /**
   * Common tasks for generating JavaScript from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   * @param {!Block} block The current block.
   * @param {string} code The JavaScript code created for this block.
   * @param {boolean=} opt_thisOnly True to generate code for only this
   *     statement.
   * @return {string} JavaScript code with comments and subsequent blocks added.
   * @protected
   */
  scrub_(block, code, opt_thisOnly) {
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
          const childBlock = block.inputList[i].connection.targetBlock();
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
   * Gets a property and adjusts the value while taking into account indexing.
   * @param {!Block} block The block.
   * @param {string} atId The property ID of the element to get.
   * @param {number=} opt_delta Value to add.
   * @param {boolean=} opt_negate Whether to negate the value.
   * @param {number=} opt_order The highest order acting on this value.
   * @return {string|number}
   */
  getAdjusted(block, atId, opt_delta, opt_negate, opt_order) {
    let delta = opt_delta || 0;
    let order = opt_order || this.ORDER_NONE;
    if (!block.workspace.options.oneBasedIndex) {
      delta++;
    }
    const defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';

    let innerOrder;
    let outerOrder = order;
    if (delta > 0) {
      outerOrder = this.ORDER_ADDITION;
      innerOrder = this.ORDER_ADDITION;
    } else if (delta < 0) {
      outerOrder = this.ORDER_SUBTRACTION;
      innerOrder = this.ORDER_SUBTRACTION;
    } else if (opt_negate) {
      outerOrder = this.ORDER_UNARY_NEGATION;
      innerOrder = this.ORDER_UNARY_NEGATION;
    }

    let at = this.valueToCode(block, atId, outerOrder) || defaultAtIndex;

    if (stringUtils.isNumber(at)) {
      // If the index is a naked number, adjust it right now.
      at = Number(at) + delta;
      if (opt_negate) {
        at = -at;
      }
    } else {
      // If the index is dynamic, adjust it in code.
      if (delta > 0) {
        at = at + ' + ' + delta;
      } else if (delta < 0) {
        at = at + ' - ' + -delta;
      }
      if (opt_negate) {
        if (delta) {
          at = '-(' + at + ')';
        } else {
          at = '-' + at;
        }
      }
      innerOrder = Math.floor(innerOrder);
      order = Math.floor(order);
      if (innerOrder && order >= innerOrder) {
        at = '(' + at + ')';
      }
    }
    return at;
  }
}
