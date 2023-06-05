/**
 * @fileoverview Logo blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author Vilim Lendvaj
 */
'use strict';

goog.module('Blockly.libraryBlocks.logo');

const {createBlockDefinitionsFromJsonArray, defineBlocks} = goog.require('Blockly.common');

/**
 * A dictionary of the block definitions provided by this module.
 * @type {!Object<string, !BlockDefinition>}
 */
const blocks = createBlockDefinitionsFromJsonArray([
  {
    'type': 'logo_move',
    'message0': 'move %1 by %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'OP',
        'options': [
          [
            'forward',
            'FD',
          ],
          [
            'backward',
            'BK',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'AMOUNT',
        'check': 'Number',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_rotate',
    'message0': 'rotate %1 by %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'DIRECTION',
        'options': [
          [
            'left',
            'LT',
          ],
          [
            'right',
            'RT',
          ],
          [
            'pitch up',
            'UP',
          ],
          [
            'pitch down',
            'DOWN',
          ],
          [
            'roll left',
            'RL',
          ],
          [
            'roll right',
            'RR',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'AMOUNT',
        'check': 'Number',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_circle',
    'message0': 'draw circle %1 with radius %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'METHOD',
        'options': [
          [
            'from center',
            'CIRCLE',
          ],
          [
            'around edge',
            'CIRCLE2',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'R',
        'check': 'Number',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_pen',
    'message0': 'pen %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'OP',
        'options': [
          [
            'down',
            'PD',
          ],
          [
            'up',
            'PU',
          ],
          [
            'paint',
            'PPT',
          ],
          [
            'erase',
            'PE',
          ],
          [
            'normal',
            'PENNORMAL',
          ],
          [
            'reverse',
            'PX',
          ],
        ],
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_setcolor',
    'message0': 'set %1 color to %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'pen',
            'SETPC',
          ],
          [
            'fill',
            'SETFC',
          ],
          [
            'pixel',
            'SETPIXEL',
          ],
          [
            'screen',
            'SETSC',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'COLOR',
        'check': 'Colour',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_getcolor',
    'message0': 'get %1 color',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'pen',
            'PC',
          ],
          [
            'fill',
            'FLOODCOLOR',
          ],
          [
            'pixel',
            'PIXEL',
          ],
          [
            'screen',
            'SCREENCOLOR',
          ],
        ],
      },
    ],
    'output': 'Colour',
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_mode',
    'message0': 'enter %1 mode',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'wrap',
            'WRAP',
          ],
          [
            'window',
            'WINDOW',
          ],
          [
            'fence',
            'FENCE',
          ],
          [
            'perspective',
            'PERSPECTIVE',
          ],
        ],
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_screen',
    'message0': '%1 screen',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'clear',
            'CS',
          ],
          [
            'clean',
            'CLEAN',
          ],
          [
            'fill',
            'FILL',
          ],
        ],
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_set',
    'message0': 'set %1 to %2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'x coordinate',
            'SETX',
          ],
          [
            'y coordinate',
            'SETY',
          ],
          [
            'z coordinate',
            'SETZ',
          ],
          [
            'heading',
            'SETH',
          ],
          [
            'pitch',
            'SETPITCH',
          ],
          [
            'roll',
            'SETROLL',
          ],
        ],
      },
      {
        'type': 'input_value',
        'name': 'VALUE',
        'check': 'Number',
      },
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
  {
    'type': 'logo_get',
    'message0': 'get %1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'WHICH',
        'options': [
          [
            'x coordinate',
            'XCOR',
          ],
          [
            'y coordinate',
            'YCOR',
          ],
          [
            'z coordinate',
            'ZCOR',
          ],
          [
            'heading',
            'HEADING',
          ],
          [
            'pitch',
            'PITCH',
          ],
          [
            'roll',
            'ROLL',
          ],
        ],
      },
    ],
    'output': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': '',
  },
]);
exports.blocks = blocks;

// Register provided blocks.
defineBlocks(blocks);
