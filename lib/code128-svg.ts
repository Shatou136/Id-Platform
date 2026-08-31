/** CODE128-B SVG for the card Barcode. Patterns are the standard 6-run widths; stop has 7. */
const PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312",
  "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222",
  "123122", "123221", "223211", "221132", "221231", "213212", "223112", "312131",
  "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321",
  "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121",
  "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321",
  "331121", "312113", "312311", "332111", "314111", "221411", "431111", "111224",
  "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114",
  "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112",
  "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113",
  "114311", "411113", "411311", "113141", "114131", "311141", "411131", "211412",
  "211214", "211232", "2331112",
];

export function code128Svg(text: string): string {
  const payload = text.trim();
  if (!payload) return "";

  const values = [104];
  for (const char of payload) {
    const code = char.charCodeAt(0) - 32;
    if (code < 0 || code > 94) {
      throw new Error(`Barcode cannot encode ${char}`);
    }
    values.push(code);
  }

  let checksum = 104;
  for (let i = 1; i < values.length; i += 1) {
    checksum += values[i] * i;
  }
  values.push(checksum % 103, 106);

  const unit = 2;
  const quiet = 10 * unit;
  let x = quiet;
  const rects: string[] = [];
  for (const value of values) {
    const pattern = PATTERNS[value];
    if (!pattern) throw new Error(`Missing CODE128 pattern ${value}`);
    for (let i = 0; i < pattern.length; i += 1) {
      const width = Number(pattern[i]) * unit;
      if (i % 2 === 0) {
        rects.push(
          `<rect x="${x}" y="0" width="${width}" height="100" fill="#000"/>`,
        );
      }
      x += width;
    }
  }
  x += quiet;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 100" preserveAspectRatio="none" role="img" aria-label="Barcode">${rects.join("")}</svg>`;
}
