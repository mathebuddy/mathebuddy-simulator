/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

export interface DocContainer {
  id: string;
  author: string;
  modifiedDate: string;
  documents: Doc[];
}

export interface Doc {
  title: string;
  alias: string;
  items: DocItem[];
}

export interface DocItem {
  type: 'paragraph' | 'equation' | 'text' | 'linefeed' | 'exercise' | 'error';
  value: string;
  label: string;
  title: string;
  text: DocItem;
  items: DocItem[];
}
