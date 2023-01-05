/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

export class KeyboardKey {
  value = ''; // special values: "!BACKSPACE!", "!ENTER!"
  text = '';
  i = 0;
  j = 0;
  rows = 1;
  cols = 1;
}

export class KeyboardLayout {
  rows = 4;
  cols = 4;
  keys: KeyboardKey[] = [];
  constructor(numRows: number, numCols: number) {
    this.rows = numRows;
    this.cols = numCols;
    const n = this.rows * this.cols;
    for (let k = 0; k < n; k++) this.keys.push(null);
  }
  addKey(
    i: number,
    j: number,
    numRows: number,
    numCols: number,
    value: string,
  ): void {
    const key = new KeyboardKey();
    this.keys[i * this.cols + j] = key;
    key.i = i;
    key.j = j;
    key.rows = numRows;
    key.cols = numCols;
    key.value = value;
    switch (value) {
      case '*':
        key.text = '&bullet;';
        break;
      case '!BACKSPACE!':
        key.text = '<i class="fa-solid fa-delete-left"></i>';
        break;
      case '!ENTER!':
        key.text = '<i class="fa-solid fa-check-double"></i>';
        break;
      default:
        key.text = value;
    }
  }
}

export class Keyboard {
  private parent: HTMLElement = null;

  private inputText = '';
  private inputTextHTMLElement: HTMLSpanElement = null;

  private listener: (text: string) => void;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  hide(): void {
    this.parent.style.display = 'none';
  }

  setInputText(inputText: string): void {
    this.inputText = inputText;
  }

  setListener(fct: (text: string) => void): void {
    this.listener = fct;
  }

  show(layout: KeyboardLayout, showPreview: boolean): void {
    this.parent.innerHTML = '';
    // div row
    const row = document.createElement('div');
    row.classList.add('row');
    this.parent.appendChild(row);
    // div column
    const col = document.createElement('div');
    row.appendChild(col);
    col.classList.add('col', 'text-center');
    // typed input
    this.inputTextHTMLElement = document.createElement('span');
    this.inputTextHTMLElement.innerHTML = this.inputText;
    this.inputTextHTMLElement.style.color = 'white';
    this.inputTextHTMLElement.style.fontSize = '18pt';
    this.inputTextHTMLElement.style.borderStyle = 'solid';
    this.inputTextHTMLElement.style.borderColor = 'white';
    this.inputTextHTMLElement.style.borderWidth = '2px';
    this.inputTextHTMLElement.style.paddingLeft = '3px';
    this.inputTextHTMLElement.style.paddingRight = '3px';
    col.appendChild(this.inputTextHTMLElement);
    if (showPreview == false) {
      const br = document.createElement('br');
      col.appendChild(br);
      this.inputTextHTMLElement.style.display = 'none';
    }
    // table
    const table = document.createElement('table');
    table.style.margin = '0 auto';
    const cells: HTMLTableCellElement[] = [];
    for (let i = 0; i < layout.rows; i++) {
      const tr = document.createElement('tr');
      table.appendChild(tr);
      for (let j = 0; j < layout.cols; j++) {
        const key = layout.keys[i * layout.cols + j];
        if (key == null) continue;
        const td = document.createElement('td');
        cells.push(td);
        tr.appendChild(td);
        td.style.backgroundColor = 'white';
        td.style.borderRadius = '6px';
        td.style.borderWidth = '4px';
        td.style.borderStyle = 'solid';
        td.style.borderColor = '#b1c752';
        td.style.color = '#b1c752';
        td.style.paddingLeft = '7px';
        td.style.paddingTop = '0px';
        td.style.paddingRight = '7px';
        td.style.paddingBottom = '0px';
        //td.style.maxHeight = '14px';
        td.style.fontSize = '20pt';
        td.style.cursor = 'crosshair';
        if (key.rows > 1) td.rowSpan = key.rows;
        if (key.cols > 1) td.colSpan = key.cols;
        td.innerHTML = key.text;
        {
          const _value = key.value;
          td.addEventListener('click', () => {
            switch (_value) {
              case '!BACKSPACE!':
                if (this.inputText.length > 0) {
                  this.inputText = this.inputText.substring(
                    0,
                    this.inputText.length - 1,
                  );
                }
                break;
              case '!ENTER!':
                this.hide();
                break;
              default:
                this.inputText += _value;
            }
            this.listener(this.inputText);
            this.inputTextHTMLElement.innerHTML = this.inputText;
          });
        }
      }
    }
    col.appendChild(table);
    this.parent.style.display = 'block';
  }
}
