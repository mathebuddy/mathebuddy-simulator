/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * example: "[[1,2],[3,4]]" -> "\begin{pmatrix}1&2\\3&4\end{pmatrix}"
 * @param m
 * @returns
 */
export function matrix2tex(m: string): string {
  let tex = m.replace(/\],\[/g, '\\\\');
  tex = tex.replace(/,/g, '&');
  tex = tex.replace(/\[/g, '');
  tex = tex.replace(/\]/g, '');
  tex = '\\begin{pmatrix}' + tex + '\\end{pmatrix}';
  console.log(m);
  console.log(tex);
  return tex;
}
