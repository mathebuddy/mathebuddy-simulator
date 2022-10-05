/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Doc, DocContainer, DocItem } from './interfaces';
import { MathJax } from './mathjax';
import { matrix2tex } from './tex';

export class Simulator {
  private data: DocContainer = null;
  private exercise: DocItem = null;
  private mathjaxInst: MathJax = null;

  constructor(data: DocContainer) {
    this.data = data;
    this.mathjaxInst = new MathJax();
  }

  public generateDOM(parent: HTMLElement, documentAlias: string): boolean {
    parent.innerHTML = '';
    for (const doc of this.data.documents) {
      if (doc.alias === documentAlias) {
        parent.appendChild(this.genDoc(doc));
        return true;
      }
    }
    return false;
  }

  private genDoc(doc: Doc): HTMLElement {
    const dom = document.createElement('div');
    for (const item of doc.items) {
      switch (item.type) {
        case 'paragraph':
          {
            const p = this.genParagraph(item);
            if (p != null) dom.appendChild(p);
          }
          break;
        case 'exercise':
          {
            const e = this.genExercise(item);
            dom.appendChild(e);
            const br = document.createElement('br');
            dom.appendChild(br);
          }
          break;
        default:
          console.log('ERROR: UNIMPLEMENTED genDoc(..) type ' + item.type);
      }
    }
    return dom;
  }

  private genParagraph(item: DocItem): HTMLElement {
    switch (item.type) {
      case 'paragraph': {
        const p = document.createElement('p');
        for (const child of item.items) {
          const c = this.genParagraph(child);
          if (c != null) p.appendChild(c);
        }
        return p;
      }
      case 'text': {
        const span = document.createElement('span');
        span.innerHTML = item.value;
        return span;
      }
      case 'inline-math': {
        const span = document.createElement('span');
        let tex = '';
        for (const child of item.items) {
          switch (child.type) {
            case 'variable':
              // TODO: randomly choose instance!
              tex += this.exercise.instances[0][child.value];
              break;
            case 'matrix-variable':
              // TODO: randomly choose instance!
              tex += matrix2tex(this.exercise.instances[0][child.value]);
              break;
            case 'text':
              tex += child.value;
              break;
          }
        }
        const html = this.mathjaxInst.tex2svgInline(tex);
        span.innerHTML = ' ' + html + ' ';
        return span;
      }
      case 'integer-input': {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('form-control');
        return input;
      }
      case 'bold':
      case 'italic':
      case 'color': {
        const span = document.createElement('span');
        switch (item.type) {
          case 'bold':
            span.style.fontWeight = 'bold';
            break;
          case 'italic':
            span.style.fontStyle = 'italic';
            break;
          case 'color':
            span.style.color = item.value;
            break;
        }
        let space = document.createElement('span');
        space.innerHTML = ' ';
        span.appendChild(space);
        for (const child of item.items) {
          const c = this.genParagraph(child);
          if (c != null) span.appendChild(c);
        }
        space = document.createElement('span');
        space.innerHTML = ' ';
        span.appendChild(space);
        return span;
      }
      case 'linefeed': {
        const span = document.createElement('span');
        span.innerHTML = '<br/>';
        return span;
      }
      case 'error': {
        const span = document.createElement('span');
        span.classList.add('text-danger');
        span.innerHTML = item.value;
        return span;
      }
      default:
        console.log('ERROR: UNIMPLEMENTED genParagraph(..) type ' + item.type);
    }
    return null;
  }

  private genExercise(item: DocItem): HTMLElement {
    this.exercise = item;
    console.log('generating exercise "' + item.title + '"');
    // container
    const div = document.createElement('div');
    //div.classList.add('border', 'border-dark', 'rounded');
    // title
    const h2 = document.createElement('h4');
    h2.innerHTML =
      '<i class="fa-solid fa-circle-question"></i>' + '&nbsp;' + item.title;
    div.appendChild(h2);
    // text
    //console.log('>>>>>');
    //console.log(item.text);

    div.appendChild(this.genParagraph(item.text));
    return div;
  }
}
