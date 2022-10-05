/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { DocContainer } from './interfaces';
import { Simulator } from './sim';

export function createSim(data: DocContainer): Simulator {
  const sim = new Simulator(data);
  return sim;
}

export function generateDOM(
  root: HTMLElement,
  sim: Simulator,
  documentAlias: string,
): boolean {
  return sim.generateDOM(root, documentAlias);
}
