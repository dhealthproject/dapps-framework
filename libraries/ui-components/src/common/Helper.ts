/**
 * @class Helper
 * @description a helper class that contains common methods to perform operations for components.
 *
 * @since v0.1.0
 */
export class Helper {
  /**
   * Method to return color from hash value.
   * Result will be different and is dependent on the hash value.
   *
   * @access public
   * @static
   * @param {string}  hash
   * @param {boolean} isHex
   * @returns {{ R: number; G: number; B: number }}
   */
  public static getColorFromHash(
    hash: string,
    isHex = true
  ): { R: number; G: number; B: number } {
    const color = {
      R: 0,
      G: 0,
      B: 0,
    };

    if (hash.length < 3) {
      console.error("Failed to convert hash to color. Hash string length < 3");
      return color;
    }

    const hashLength = hash.length;
    const colorStrLength = Math.trunc(hashLength / 3);

    const strRed = hash.substring(0, colorStrLength);
    const strGreen = hash.substring(colorStrLength, colorStrLength * 2);
    const strBlue = hash.substring(colorStrLength * 2, colorStrLength * 3);

    color.R = isHex
      ? Helper.hexToRGB(strRed)
      : Helper.charsetToRGB(strRed.substring(2, 3));
    color.G = isHex ? Helper.hexToRGB(strGreen) : Helper.charsetToRGB(strGreen);
    color.B = isHex ? Helper.hexToRGB(strBlue) : Helper.charsetToRGB(strBlue);

    return color;
  }

  /**
   * Method to return RGB value from hex string.
   *
   * @access public
   * @static
   * @param {string} hexString
   * @returns {number}
   */
  public static hexToRGB(hexString: string): number {
    let totalHex = 0;
    for (const hex of hexString) totalHex += parseInt(hex, 16);
    return Math.trunc((totalHex * 255) / (15 * hexString.length));
  }

  /**
   * Method to return RGB value from normal string.
   *
   * @access public
   * @static
   * @param {string} string
   * @returns {number}
   */
  public static charsetToRGB(string: string): number {
    const charset = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];
    let totalHex = 0;
    for (const char of string) totalHex += charset.indexOf(char.toLowerCase());
    return Math.trunc(
      (totalHex * 255) / ((charset.length - 1) * string.length)
    );
  }

  /**
   * Method to return a truncated string.
   * Length of result will be based on `strLen`.
   *
   * @access protected
   * @param str {string}
   * @param strLen {number}
   * @returns {string}
   */
  public static truncString(str: string, strLen = 4): string {
    if (str.length > strLen * 2)
      return `${str.substring(0, strLen)}...${str.substring(
        str.length - strLen,
        str.length
      )}`;
    return str;
  }
}
