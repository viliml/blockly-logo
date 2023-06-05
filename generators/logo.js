/**
 * @license
 * Copyright 2012 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Logo for blocks.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.Logo');

const {CodeGenerator} = goog.require('Blockly.CodeGenerator');
const stringUtils = goog.require('Blockly.utils.string');


/**
 * Logo code generator.
 * @type {!CodeGenerator}
 */
const Logo = new CodeGenerator('Logo');

/**
 * Order of operation ENUMs.
 */
Logo.ORDER_ATOMIC = 0;				// ()
Logo.ORDER_UNARY_NEGATION = 1;		// -
Logo.ORDER_MULTIPLICATION = 2.1;	// *
Logo.ORDER_DIVISION = 2.2;			// /
Logo.ORDER_SUBTRACTION = 3.1;		// -
Logo.ORDER_ADDITION = 3.2;			// +
Logo.ORDER_COMPARISON = 4;			// = < > <= >= <>
Logo.ORDER_PROCEDURE = 5;			// pr "|Hello World|
Logo.ORDER_NONE = 99;				// ...

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Logo.ORDER_OVERRIDES = [
  // a * (b * c) -> a * b * c
  [Logo.ORDER_MULTIPLICATION, Logo.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Logo.ORDER_ADDITION, Logo.ORDER_ADDITION],//,

  //pr (abs a) -> pr abs a
  //[Logo.ORDER_PROCEDURE, Logo.ORDER_PROCEDURE]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Logo.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Logo.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Logo.functionNames_ = Object.create(null);

  if (!Logo.variableDB_) {
    Logo.variableDB_ =
        new Blockly.Names(Logo.RESERVED_WORDS_);
  } else {
    Logo.variableDB_.reset();
  }

  Logo.variableDB_.setVariableMap(workspace.getVariableMap());
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Logo.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Logo.definitions_) {
    definitions.push(Logo.definitions_[name]);
  }
  // Clean up temporary data.
  delete Logo.definitions_;
  delete Logo.functionNames_;
  Logo.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Logo.scrubNakedValue = function(line) {
  return 'ignore ' + line + '\n';
};

/**
 * Encode a string as a properly escaped Logo string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Logo string.
 * @private
 */
Logo.quote_ = function(string) {
  string = string.replace(/\\/g, '\\\\').
      replace(/\n/g, '\\\n').
      replace(/;/g, '\\;').
      replace(/ /g, '\\ ').
      replace(/\|/g, '\\|').
      replace(/~/g, '\\~');
  return '"' + string;
};

/**
 * Encode a string as a properly escaped multiline Logo string, complete
 * with quotes.
 * @param {string} string Text to encode.
 * @return {string} Logo string.
 * @private
 */
Logo.multiline_quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  var lines = string.split(/\n/g).map(Logo.quote_);
  return lines.join('\\\n');
};

/**
 * Common tasks for generating Logo from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Logo code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} Logo code with comments and subsequent blocks added.
 * @private
 */
Logo.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      comment = stringUtils.wrap(comment,
          Logo.COMMENT_WRAP - 3);
      commentCode += Logo.prefixLines(comment + '\n', '; ');
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Logo.allNestedComments(childBlock);
          if (comment) {
            commentCode += Logo.prefixLines(comment, '; ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Logo.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Logo.getAdjusted = function(block, atId, opt_delta, opt_negate,
                            opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Logo.ORDER_NONE;
  if (!block.workspace.options.oneBasedIndex) {
    delta++;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Logo.valueToCode(block, atId,
        Logo.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Logo.valueToCode(block, atId,
        Logo.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Logo.valueToCode(block, atId,
        Logo.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Logo.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = Number(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Logo.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Logo.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Logo.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};

exports.logoGenerator = Logo;
