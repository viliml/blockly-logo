/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Complete helper functions for generating Lua for
 *     blocks.  This is the entrypoint for lua_compressed.js.
 * @suppress {extraRequire}
 */
'use strict';

goog.module('Blockly.Logo.all');

const moduleExports = goog.require('Blockly.Logo');
goog.require('Blockly.Logo.colour');
goog.require('Blockly.Logo.lists');
goog.require('Blockly.Logo.logic');
goog.require('Blockly.Logo.logo');
goog.require('Blockly.Logo.loops');
goog.require('Blockly.Logo.math');
goog.require('Blockly.Logo.procedures');
goog.require('Blockly.Logo.texts');
goog.require('Blockly.Logo.variables');
goog.require('Blockly.Logo.variablesDynamic');

exports = moduleExports;
