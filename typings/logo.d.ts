/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Order {
  ATOMIC = 0,				// ()
  UNARY_NEGATION = 1,		// -
  MULTIPLICATION = 2.1,	// *
  DIVISION = 2.2,			// /
  SUBTRACTION = 3.1,		// -
  ADDITION = 3.2,			// +
  COMPARISON = 4,			// == < > <= >= <>
  PROCEDURE = 5,			// pr "|Hello World|
  NONE = 99,              // (...)
}

export declare const logoGenerator: any;

export {LogoGenerator} from './generators/logo';
