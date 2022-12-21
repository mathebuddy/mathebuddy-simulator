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
import { MBL_Definition } from '@mathebuddy/mathebuddy-compiler/src/dataDefinition';
import { MBL_Equation } from '@mathebuddy/mathebuddy-compiler/src/dataEquation';
import { MBL_Error } from '@mathebuddy/mathebuddy-compiler/src/dataError';
import {
  MBL_Exercise,
  MBL_Exercise_Text_Multiple_Choice,
  MBL_Exercise_Text_Variable,
  MBL_Exercise_VariableType,
} from '@mathebuddy/mathebuddy-compiler/src/dataExercise';
import {
  MBL_Level,
  MBL_LevelItem,
} from '@mathebuddy/mathebuddy-compiler/src/dataLevel';
import { MBL_Section } from '@mathebuddy/mathebuddy-compiler/src/dataSection';
import { MBL_Table } from '@mathebuddy/mathebuddy-compiler/src/dataTable';
import {
  MBL_Text,
  MBL_Text_AlignCenter,
  MBL_Text_Bold,
  MBL_Text_Color,
  MBL_Text_InlineMath,
  MBL_Text_Itemize,
  MBL_Text_Paragraph,
  MBL_Text_Span,
  MBL_Text_Text,
} from '@mathebuddy/mathebuddy-compiler/src/dataText';
import { htmlSafeString } from './html';

import { MathJax } from './mathjax';
import { matrix2tex, set2tex, term2tex } from './tex';

export class Simulator {
  private log = '';

  private course: MBL_Course = null;

  private exercise: MBL_Exercise = null;
  private exerciseInstanceIndex = 0;

  private mathjaxInst: MathJax = null;

  private parentDOM: HTMLElement = null;

  constructor(parent: HTMLElement) {
    this.parentDOM = parent;
    this.mathjaxInst = new MathJax();
  }

  public setCourse(course: MBL_Course): void {
    this.course = course;
  }

  public getLog(): string {
    return htmlSafeString(this.log);
  }

  public getHTML(): string {
    const html = this.parentDOM.innerHTML;
    return htmlSafeString(html);
  }

  public getJSON(): string {
    const json = JSON.stringify(this.course.toJSON(), null, 2);
    return htmlSafeString(json);
  }

  public generateDOM(): boolean {
    this.parentDOM.innerHTML = '';
    switch (this.course.debug) {
      case MBL_Course_Debug.Level:
        this.parentDOM.appendChild(
          this.generateLevel(this.course.chapters[0].levels[0]),
        );
        //this.parentDOM.appendChild(h4);
        break;
      default:
        this.error(
          'Simulator.generateDOM(..): unimplemented ' + this.course.debug,
        );
        break;
    }
    this.info('... ready');
    return true;
  }

  private generateLevel(level: MBL_Level): HTMLElement {
    const root = document.createElement('div');
    // title
    const title = document.createElement('h4');
    title.innerHTML = level.title.toUpperCase();
    title.classList.add('text-center', 'py-2');
    root.appendChild(title);
    // level items
    for (const item of level.items) {
      const itemHTML = this.generateLevelItem(item);
      if (itemHTML != null) root.appendChild(itemHTML);
    }
    return root;
  }

  private generateLevelItem(item: MBL_LevelItem): HTMLElement {
    switch (item.type) {
      case 'section': {
        const section = <MBL_Section>item;
        const element = document.createElement('h1');
        element.innerHTML = section.text;
        return element;
      }
      case 'subsection': {
        const section = <MBL_Section>item;
        const element = document.createElement('h2');
        element.innerHTML = section.text;
        return element;
      }
      case 'subsubsection': {
        const section = <MBL_Section>item;
        const element = document.createElement('h3');
        element.innerHTML = section.text;
        return element;
      }
      case 'equation': {
        const equation = <MBL_Equation>item;
        const element = document.createElement('div');
        element.classList.add('text-center');
        let tex = equation.value;
        if (equation.numbering > 0) tex += '~~(' + equation.numbering + ')';
        const html = this.mathjaxInst.tex2svgBlock(tex);
        element.innerHTML = ' ' + html + ' ';
        return element;
      }
      case 'definition':
      case 'theorem': {
        const definition = <MBL_Definition>item;
        const element = document.createElement('div');
        element.classList.add('my-1', 'p-1');
        element.classList.add('border', 'border-dark');
        for (const subItem of definition.items) {
          element.appendChild(this.generateLevelItem(subItem));
        }
        return element;
      }
      case 'exercise': {
        this.exercise = <MBL_Exercise>item;
        this.exerciseInstanceIndex = Math.floor(
          Math.random() * this.exercise.instances.length,
        );
        const element = document.createElement('div');
        const title = document.createElement('h4');
        element.appendChild(title);
        title.classList.add('text-center');
        title.innerHTML = this.exercise.title;
        element.classList.add('my-1', 'p-1');
        element.appendChild(this.generateTextItem(this.exercise.text));
        return element;
      }
      case 'table': {
        const table = <MBL_Table>item;
        const element = document.createElement('div');
        const p = document.createElement('p');
        p.classList.add('text-center');
        p.innerHTML = table.title;
        element.appendChild(p);
        const tableElement = document.createElement('table');
        element.appendChild(tableElement);
        tableElement.classList.add('table');
        if (table.head.columns.length > 0) {
          const thead = document.createElement('thead');
          tableElement.appendChild(thead);
          for (const column of table.head.columns) {
            const th = document.createElement('th');
            th.scope = 'col';
            thead.appendChild(th);
            th.appendChild(this.generateTextItem(column));
          }
        }
        const tbody = document.createElement('tbody');
        tableElement.appendChild(tbody);
        for (const row of table.rows) {
          const tr = document.createElement('tr');
          tbody.appendChild(tr);
          for (const column of row.columns) {
            const td = document.createElement('td');
            tr.appendChild(td);
            td.appendChild(this.generateTextItem(column));
          }
        }
        return element;
      }
      case 'paragraph':
      case 'align_center': {
        return this.generateTextItem(item);
      }
      default:
        this.warning('generateLevelItem(..): unimplemented type: ' + item.type);
    }
    return document.createElement('span');
  }

  private generateTextItem(item: MBL_Text): HTMLElement {
    switch (item.type) {
      case 'paragraph': {
        const paragraph = <MBL_Text_Paragraph>item;
        const p = document.createElement('p');
        for (const paragraphItem of paragraph.items)
          p.appendChild(this.generateTextItem(paragraphItem));
        return p;
      }
      case 'align_left':
      case 'align_center':
      case 'align_right': {
        const align = <MBL_Text_AlignCenter>item;
        const element = document.createElement('div');
        switch (item.type) {
          case 'align_left':
            element.classList.add('text-start');
            break;
          case 'align_center':
            element.classList.add('text-center');
            break;
          case 'align_right':
            element.classList.add('text-end');
            break;
        }
        for (const subItem of align.items)
          element.appendChild(this.generateTextItem(subItem));
        return element;
      }
      case 'text': {
        const text = <MBL_Text_Text>item;
        const element = document.createElement('span');
        element.innerHTML = text.value;
        return element;
      }
      case 'linefeed': {
        const span = document.createElement('span');
        span.innerHTML = '<br/><br/>';
        return span;
      }
      case 'span': {
        const span = <MBL_Text_Span>item;
        const element = document.createElement('span');
        for (const subItem of span.items)
          element.appendChild(this.generateTextItem(subItem));
        return element;
      }
      case 'bold': {
        const bold = <MBL_Text_Bold>item;
        const element = document.createElement('strong');
        element.classList.add('px-1');
        for (const subItem of bold.items)
          element.appendChild(this.generateTextItem(subItem));
        return element;
      }
      case 'italic': {
        const italic = <MBL_Text_Bold>item;
        const element = document.createElement('em');
        element.classList.add('px-1');
        for (const subItem of italic.items)
          element.appendChild(this.generateTextItem(subItem));
        return element;
      }
      case 'color': {
        const color = <MBL_Text_Color>item;
        const element = document.createElement('span');
        element.classList.add('px-1');
        switch (color.key) {
          case 0:
            element.style.color = 'rgb(0,0,0)';
            break;
          case 1:
            element.style.color = 'rgb(255,0,0)';
            break;
          case 2:
            element.style.color = 'rgb(0,0,255)';
            break;
          case 3:
            element.style.color = 'rgb(0,255,0)';
            break;
          default:
            this.warning(
              'generateTextItem(..): unimplemented color key: ' + color.key,
            );
        }
        for (const subItem of color.items)
          element.appendChild(this.generateTextItem(subItem));
        return element;
      }
      case 'itemize':
      case 'enumerate':
      case 'enumerate_alpha': {
        const itemize = <MBL_Text_Itemize>item;
        let element: HTMLUListElement | HTMLOListElement;
        switch (item.type) {
          case 'itemize':
            element = document.createElement('ul');
            break;
          case 'enumerate':
            element = document.createElement('ol');
            break;
          case 'enumerate_alpha':
            element = document.createElement('ol');
            element.type = 'a';
            break;
        }
        for (const subItem of itemize.items) {
          const li = document.createElement('li');
          element.appendChild(li);
          li.appendChild(this.generateTextItem(subItem));
        }
        return element;
      }
      case 'inline_math': {
        const inlineMath = <MBL_Text_InlineMath>item;
        const element = document.createElement('span');
        element.classList.add('m-1');
        let tex = '';
        for (const subItem of inlineMath.items) {
          switch (subItem.type) {
            case 'text': {
              const text = <MBL_Text_Text>subItem;
              tex += text.value;
              break;
            }
            case 'variable': {
              const variable = <MBL_Exercise_Text_Variable>subItem;
              const v = this.exercise.variables[variable.variableId];
              const value =
                this.exercise.instances[this.exerciseInstanceIndex].values[
                  variable.variableId
                ];
              switch (v.type) {
                case MBL_Exercise_VariableType.Bool:
                case MBL_Exercise_VariableType.Int:
                case MBL_Exercise_VariableType.Real:
                case MBL_Exercise_VariableType.Complex:
                  tex += value;
                  break;
                case MBL_Exercise_VariableType.IntSet:
                case MBL_Exercise_VariableType.RealSet:
                  tex += set2tex(value);
                  break;
                case MBL_Exercise_VariableType.Matrix:
                  tex += matrix2tex(value);
                  break;
                case MBL_Exercise_VariableType.Term:
                  tex += term2tex(value);
                  break;
                default:
                  this.warning(
                    'generateTextItem(..):inline_math:variable: ' +
                      'unimplemented type: ' +
                      v.type,
                  );
              }
              break;
            }
            default:
              this.warning(
                'generateTextItem(..):inline_math: unimplemented type: ' +
                  subItem.type,
              );
          }
        }
        const html = this.mathjaxInst.tex2svgInline(tex);
        element.innerHTML = ' ' + html + ' ';
        return element;
      }
      case 'text_input': {
        // TODO: depends on type, ...
        const element = document.createElement('input');
        element.classList.add('m-1');
        return element;
      }
      case 'multiple_choice': {
        const mc = <MBL_Exercise_Text_Multiple_Choice>item;
        const element = document.createElement('table');
        // todo: randomize order
        for (const option of mc.items) {
          const tr = document.createElement('tr');
          tr.classList.add('p-1');
          element.appendChild(tr);
          // check box
          let td = document.createElement('td');
          td.classList.add('p-1');
          tr.appendChild(td);
          const input = document.createElement('input');
          input.classList.add('form-check-input');
          input.type = 'checkbox';
          input.value = '';
          td.appendChild(input);
          // text
          td = document.createElement('td');
          td.classList.add('p-1');
          tr.appendChild(td);
          td.appendChild(this.generateTextItem(option.text));
        }
        return element;
      }
      case 'error': {
        const error = <MBL_Error>item;
        const element = document.createElement('div');
        element.classList.add('text-danger', 'border', 'border-dark');
        const p = document.createElement('p');
        element.appendChild(p);
        p.innerHTML = error.message;
        return element;
      }
      default:
        this.warning('generateTextItem(..): unimplemented type: ' + item.type);
    }
    return document.createElement('span');
  }

  info(message: string): void {
    console.log('SIM:INFO:' + message);
    this.log += 'SIM:INFO:' + message + '\n';
  }

  warning(message: string): void {
    console.log('SIM:WARNING:' + message);
    this.log += 'SIM:WARNING:' + message + '\n';
  }

  error(message: string): void {
    console.log('SIM:ERROR:' + message);
    this.log += 'SIM:ERROR:' + message + '\n';
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
