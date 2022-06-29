/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * @class DappAccountAvatar
 * @description This component displays an account avatar
 * and depends on the value of its address the avatar will
 * be rendered in different color.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAccountAvatar component
 * ```html
 *   <template>
 *     <DappAccountAvatar
 *       :width="123"
 *       :height="123"
 *       :address="some-address"
 *       :hideCaption="true"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {string}     address         The required account address.
 * @param  {number}     width           The optional avatar width value (defaults to `261.333`).
 * @param  {number}     height          The optional avatar height value (defaults to `131.313`).
 * @param  {boolean}    hideCaption     The optional avatar hideCaption flag (defaults to `false`).
 *
 * @since v0.1.0
 */
@Component({})
export default class DappAccountAvatar extends Vue {
  /**
   * The required account address.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected address?: string;

  /**
   * The optional avatar width value (defaults to `261.333`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 261.333,
  })
  protected width?: number;

  /**
   * The optional avatar height value (defaults to `131.313`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 131.313,
  })
  protected height?: number;

  /**
   * The optional avatar hideCaption flag (defaults to `false`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  protected hideCaption?: boolean;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return { id: this.getId("account-icon") };
  }

  /**
   * Computed method to return display title.
   *
   * @access protected
   * @returns {string}
   */
  protected get title(): string {
    return "address: " + this.address;
  }

  /**
   * Computed method to return display title.
   *
   * @access protected
   * @returns {string}
   */
  protected get iconColor(): string {
    if (!this.address) return "";
    const color = this.getColorFromHash(this.address, false);
    return `RGB(${color.R},${color.G},${color.B})`;
  }

  /**
   * Computed method to return display this component's
   * address in truncated format.
   *
   * @access protected
   * @returns {string}
   */
  protected get truncatedAddress(): string {
    return this.address ? this.truncString(this.address) : "";
  }

  /**
   * Computed method to return this svg's display viewBox attribute.
   * Value will be set depending on `hideCaption` prop value.
   *
   * @access protected
   * @returns {string}
   */
  protected get viewBox(): string {
    return this.hideCaption ? "115 0 16 105" : "0 0 261.333 131.313";
  }

  /**
   * Method to return this component's id.
   *
   * @access protected
   * @param id {string}
   * @returns {string}
   */
  protected getId(id: string): string {
    return id + "-" + Math.floor(Math.random() * Math.floor(1000));
  }

  /**
   * Method to get a deterministic color from hash value.
   *
   * @access protected
   * @param hash {string}
   * @param isHex {boolean}
   * @returns {{R: number, G: number, B: number}}
   */
  protected getColorFromHash(
    hash: string,
    isHex = true
  ): { R: number; G: number; B: number } {
    const color = {
      R: 0,
      G: 0,
      B: 0,
    };

    if (typeof hash !== "string") {
      console.error("Failed to convert hash to color. Hash is not a String");
      return color;
    }
    if (hash.length < 3) {
      console.error("Failed to convert hash to color. Hash string length < 3");
      return color;
    }

    const hexToRGB = (hexString: string) => {
      let totalHex = 0;

      for (const hex of hexString) totalHex += parseInt(hex, 16);

      return Math.trunc((totalHex * 255) / (15 * hexString.length));
    };

    const charsetToRGB = (string: string) => {
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

      for (const char of string)
        totalHex += charset.indexOf(char.toLowerCase());

      return Math.trunc(
        (totalHex * 255) / ((charset.length - 1) * string.length)
      );
    };

    const hashLength = hash.length;
    const colorStrLength = Math.trunc(hashLength / 3);

    const strRed = hash.substring(0, colorStrLength);
    const strGreen = hash.substring(colorStrLength, colorStrLength * 2);
    const strBlue = hash.substring(colorStrLength * 2, colorStrLength * 3);

    color.R = isHex ? hexToRGB(strRed) : charsetToRGB(strRed.substring(2, 3));
    color.G = isHex ? hexToRGB(strGreen) : charsetToRGB(strGreen);
    color.B = isHex ? hexToRGB(strBlue) : charsetToRGB(strBlue);

    return color;
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
  protected truncString(str: string, strLen = 4): string {
    if (typeof str === "string") {
      if (str.length > strLen * 2)
        return `${str.substring(0, strLen)}...${str.substring(
          str.length - strLen,
          str.length
        )}`;
      return str;
    }
    console.error("Failed to trunc string. Provided value is not a string");
    return str;
  }
}
