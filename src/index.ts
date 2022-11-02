/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { DocContainer } from './interfaces';
import { Simulator } from './sim';
import { Compiler } from '@mathebuddy/mathebuddy-compiler/src/compiler';

export function compile(src: string): DocContainer {
  const compiler = new Compiler();
  compiler.run(src);
  const course = compiler.getCourse().toJSON();
  //console.log(course);
  return course as any as DocContainer;
}

export function createSim(data: DocContainer, root: HTMLElement): Simulator {
  const sim = new Simulator(data, root);
  return sim;
}

export function generateDOM(sim: Simulator, documentAlias = ''): boolean {
  return sim.generateDOM(documentAlias);
}

export function getJSON(sim: Simulator): string {
  return sim.getJSON();
}

export function getHTML(sim: Simulator): string {
  return sim.getHTML();
}
