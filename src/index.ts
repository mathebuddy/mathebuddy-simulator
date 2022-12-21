/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Compiler } from '@mathebuddy/mathebuddy-compiler/src/compiler';
import { MBL_Course } from '@mathebuddy/mathebuddy-compiler/src/dataCourse';

import { Simulator } from './sim';

let compilerLog = '';

export function compile(
  path: string,
  files: { [fileId: string]: string },
): MBL_Course {
  compilerLog = '';
  function load(path: string): string {
    if (path in files) return files[path];
    // TODO output warning
    else return '';
  }
  const compiler = new Compiler();
  try {
    compiler.compile(path, load);
  } catch (e) {
    compilerLog = '' + e;
    return null;
  }
  const course = compiler.getCourse();
  //console.log(course.toJSON());
  return course;
}

export function getCompilerLog(): string {
  return compilerLog;
}

export function createSim(root: HTMLElement): Simulator {
  const sim = new Simulator(root);
  return sim;
}

export function setCourse(sim: Simulator, course: MBL_Course): void {
  sim.setCourse(course);
}

export function generateDOM(sim: Simulator): boolean {
  return sim.generateDOM();
}

export function getLOG(sim: Simulator): string {
  return sim.getLog();
}

export function getJSON(sim: Simulator): string {
  return sim.getJSON();
}

export function getHTML(sim: Simulator): string {
  return sim.getHTML();
}
