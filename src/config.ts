/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { KeyboardLayout } from './keyboard';

/*
  7 8 9 + B
  4 5 6 - B
  1 2 3 * E
  0 0 0 / E
 */
export function createIntegerKeyboardLayout(operators = false): KeyboardLayout {
  const layout = new KeyboardLayout(4, operators ? 5 : 4);
  layout.addKey(0, 0, 1, 1, '7');
  layout.addKey(1, 0, 1, 1, '4');
  layout.addKey(2, 0, 1, 1, '1');
  layout.addKey(0, 1, 1, 1, '8');
  layout.addKey(1, 1, 1, 1, '5');
  layout.addKey(2, 1, 1, 1, '2');
  layout.addKey(0, 2, 1, 1, '9');
  layout.addKey(1, 2, 1, 1, '6');
  layout.addKey(2, 2, 1, 1, '3');
  layout.addKey(3, 0, 1, 3, '0');

  if (operators) {
    layout.addKey(0, 3, 1, 1, '+');
    layout.addKey(1, 3, 1, 1, '-');
    layout.addKey(2, 3, 1, 1, '*');
    layout.addKey(3, 3, 1, 1, '/');
  }

  layout.addKey(0, operators ? 4 : 3, 2, 1, '!BACKSPACE!');
  layout.addKey(2, operators ? 4 : 3, 2, 1, '!ENTER!');
  return layout;
}
