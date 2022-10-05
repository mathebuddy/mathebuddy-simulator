/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Doc, DocContainer, DocItem } from './interfaces';

export class Simulator {
  private data: DocContainer = null;

  constructor(data: DocContainer) {
    this.data = data;
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
    console.log('generating exercise "' + item.title + '"');
    // container
    const div = document.createElement('div');
    div.classList.add('border', 'border-dark', 'rounded');
    // title
    const h2 = document.createElement('h2');
    h2.innerHTML = item.title;
    div.appendChild(h2);
    // text
    //console.log('>>>>>');
    //console.log(item.text);

    div.appendChild(this.genParagraph(item.text));
    return div;
  }
}
