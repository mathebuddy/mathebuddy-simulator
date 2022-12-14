/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import {
  MBL_Course,
  MBL_Course_Debug,
} from '@mathebuddy/mathebuddy-compiler/src/dataCourse';
import { MBL_Exercise } from '@mathebuddy/mathebuddy-compiler/src/dataExercise';
import { MBL_Level } from '@mathebuddy/mathebuddy-compiler/src/dataLevel';

import { MathJax } from './mathjax';
import { matrix2tex } from './tex';

export class Simulator {
  private course: MBL_Course = null;
  private exercise: MBL_Exercise = null;
  private mathjaxInst: MathJax = null;

  private parentDOM: HTMLElement = null;

  constructor(course: MBL_Course, parent: HTMLElement) {
    this.course = course;
    this.parentDOM = parent;
    this.mathjaxInst = new MathJax();
  }

  public getHTML(): string {
    let html = this.parentDOM.innerHTML;
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');
    html = html.replace(/"/g, '&quot;');
    html = html.replace(/'/g, '&#039;');
    return html;
  }

  public getJSON(): string {
    let json = JSON.stringify(this.course.toJSON(), null, 2);
    json = json.replace(/</g, '&lt;');
    json = json.replace(/>/g, '&gt;');
    json = json.replace(/\n/g, '<br/>');
    json = json.replace(/ /g, '&nbsp;');
    json = json.replace(/"/g, '&quot;');
    json = json.replace(/'/g, '&#039;');
    return json;
  }

  public generateDOM(): boolean {
    this.parentDOM.innerHTML = '';

    const h4 = document.createElement('h4');
    h4.innerHTML = 'SIMULATOR WILL BE AVAILABLE SOON!!';

    switch (this.course.debug) {
      case MBL_Course_Debug.Level:
        this.parentDOM.appendChild(
          this.generateLevel(this.course.chapters[0].levels[0]),
        );
        this.parentDOM.appendChild(h4);
        break;
      default:
        console.log(
          'ERROR: Simulator.generateDOM(..): unimplemented ' +
            this.course.debug,
        );
        break;
    }

    return true;

    /*// if no alias is provided, then use the first document
    if (documentAlias.length == 0) {
      if (this.course.documents.length == 0) return false;
      this.parentDOM.appendChild(this.genDoc(this.course.documents[0]));
      return true;
    }
    // otherwise search for document with alias
    else {
      for (const doc of this.course.documents) {
        if (doc.alias === documentAlias) {
          this.parentDOM.appendChild(this.genDoc(doc));
          //console.log(this.parentDOM.innerHTML);
          return true;
        }
      }
    }
    return false;*/
  }

  private generateLevel(level: MBL_Level): HTMLElement {
    const span = document.createElement('span');
    span.innerHTML = level.title;
    return span;
  }

  /*private genDoc(doc: Doc): HTMLElement {
    const dom = document.createElement('div');
    const title = document.createElement('h4');
    title.innerHTML = doc.title.toUpperCase();
    title.classList.add('text-center', 'py-2');
    dom.appendChild(title);
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
        case 'equation':
          {
            // TODO: check if error is set
            // TODO: equation numbering
            const p = document.createElement('p');
            p.classList.add('text-center');
            p.innerHTML = this.mathjaxInst.tex2svgBlock(item.value);
            dom.appendChild(p);
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
      case 'span': {
        const s = document.createElement('span');
        for (const child of item.items) {
          const c = this.genParagraph(child);
          if (c != null) s.appendChild(c);
        }
        return s;
      }
      case 'text': {
        const span = document.createElement('span');
        span.innerHTML = item.value;
        return span;
      }
      case 'itemize': {
        const ul = document.createElement('ul');
        for (const child of item.items) {
          const c = this.genParagraph(child);
          if (c != null) {
            const li = document.createElement('li');
            li.appendChild(c);
            ul.appendChild(li);
          }
        }
        return ul;
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
        input.size = 5; // TODO
        input.style.display = 'inline';
        //input.classList.add('form-control');
        return input;
      }
      case 'bold':
      case 'italic':
      case 'color': {
        const span = document.createElement('span');
        let color = '';
        switch (item.type) {
          case 'bold':
            span.style.fontWeight = 'bold';
            break;
          case 'italic':
            span.style.fontStyle = 'italic';
            break;
          case 'color':
            switch (item.value) {
              case '1':
                color = '#c56663';
                break;
              case '2':
                color = 'green';
                break;
              case '3':
                color = 'blue';
                break;
            }
            span.style.color = color;
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
  }*/
}
