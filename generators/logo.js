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

goog.provide('Blockly.Logo');

goog.require('Blockly.Generator');
goog.require('Blockly.utils.global');
goog.require('Blockly.utils.string');


/**
 * Logo code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Logo = new Blockly.Generator('Logo');

/**
 * Order of operation ENUMs.
 */
Blockly.Logo.ORDER_ATOMIC = 0;				// ()
Blockly.Logo.ORDER_UNARY_NEGATION = 1;		// -
Blockly.Logo.ORDER_MULTIPLICATION = 2.1;	// *
Blockly.Logo.ORDER_DIVISION = 2.2;			// /
Blockly.Logo.ORDER_SUBTRACTION = 3.1;		// -
Blockly.Logo.ORDER_ADDITION = 3.2;			// +
Blockly.Logo.ORDER_COMPARISON = 4;			// = < > <= >= <>
Blockly.Logo.ORDER_PROCEDURE = 5;			// pr "|Hello World|
Blockly.Logo.ORDER_NONE = 99;				// ...

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.Logo.ORDER_OVERRIDES = [
  // a * (b * c) -> a * b * c
  [Blockly.Logo.ORDER_MULTIPLICATION, Blockly.Logo.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Blockly.Logo.ORDER_ADDITION, Blockly.Logo.ORDER_ADDITION]//,
  
  //pr (abs a) -> pr abs a
  //[Blockly.Logo.ORDER_PROCEDURE, Blockly.Logo.ORDER_PROCEDURE]
];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Logo.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Logo.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Logo.functionNames_ = Object.create(null);

  if (!Blockly.Logo.variableDB_) {
    Blockly.Logo.variableDB_ =
        new Blockly.Names(Blockly.Logo.RESERVED_WORDS_);
  } else {
    Blockly.Logo.variableDB_.reset();
  }

  Blockly.Logo.variableDB_.setVariableMap(workspace.getVariableMap());
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Logo.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.Logo.definitions_) {
    definitions.push(Blockly.Logo.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.Logo.definitions_;
  delete Blockly.Logo.functionNames_;
  Blockly.Logo.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Logo.scrubNakedValue = function(line) {
  return 'ignore ' + line + '\n';
};

/**
 * Encode a string as a properly escaped Logo string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} Logo string.
 * @private
 */
Blockly.Logo.quote_ = function(string) {
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/;/g, '\\;')
                 .replace(/ /g, '\\ ')
                 .replace(/\|/g, '\\|')
                 .replace(/~/g, '\\~');
  return '"' + string;
};

/**
 * Encode a string as a properly escaped multiline Logo string, complete
 * with quotes.
 * @param {string} string Text to encode.
 * @return {string} Logo string.
 * @private
 */
Blockly.Logo.multiline_quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  var lines = string.split(/\n/g).map(Blockly.Logo.quote_);
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
Blockly.Logo.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      comment = Blockly.utils.string.wrap(comment,
          Blockly.Logo.COMMENT_WRAP - 3);
      commentCode += Blockly.Logo.prefixLines(comment + '\n', '; ');
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.Logo.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Logo.prefixLines(comment, '; ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.Logo.blockToCode(nextBlock);
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
Blockly.Logo.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.Logo.ORDER_NONE;
  if (!block.workspace.options.oneBasedIndex) {
    delta++;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.Logo.valueToCode(block, atId,
        Blockly.Logo.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.Logo.valueToCode(block, atId, order) ||
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
      var innerOrder = Blockly.Logo.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.Logo.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.Logo.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
