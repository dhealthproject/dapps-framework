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
import { Options } from "vue-class-component";
import { Prop, Vue } from "vue-property-decorator";

/**
 * @class TokenAmount
 * @description This component displays a token amount
 * and permits to differentiate between the decimals
 * part of the amount, and the integer part as well as
 * adding a limitation on the number of decimals that
 * are displayed and also adding a currency suffix.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#attributes).
 * <br /><br />
 * Warning: This component serves as a base to **display** any
 * amount and does not currently implement a protection against
 * big numbers overflow. A second iteration of this component
 * may implement these features and remove this comment.
 * <br /><br />
 * @example Using the TokenAmount component
 * ```html
 *   <template>
 *     <TokenAmount
 *       :decimals="2"
 *       :currency="DHP"
 *       :value="1.234"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {number}     value           The amount value (defaults to 0).
 * @param  {decimals}   decimals        The number of decimal places to display (defaults to 6).
 * @param  {currency}   currency        The currency symbol (defaults to empty string).
 * @param  {boolean}    fade-decimals   Whether the decimal part should be faded or not (defaults to false).
 *
 * @since v0.1.0
 */
@Options({})
export default class TokenAmount extends Vue {
  /**
   * The amount value (defaults to 0).
   *
   * @var {number|undefined}
   */
  @Prop({ default: 0 }) value: number | undefined;

  /**
   * The number of decimal places to display (defaults to 6).
   *
   * @var {number|undefined}
   */
  @Prop({ default: 6 }) decimals: number | undefined;

  /**
   * The currency symbol (defaults to empty string).
   *
   * @var {string|undefined}
   */
  @Prop({ default: "" }) currency: string | undefined;

  /**
   * The boolean value that determines whether display
   * should differentiate between the integer part and
   * the decimals part (defaults to false). Setting it
   * to true will fade the decimals part of the number.
   *
   * @var {boolean|undefined}
   */
  @Prop({ default: false }) fadeDecimals: boolean | undefined;

  /**
   * Getter to retrieve the untouched token amount.
   *
   * @access public
   * @returns {number}
   */
  protected get amount(): number {
    return this.value ? this.value : 0;
  }

  /**
   * Getter to retrieve only the *integer* part of an
   * amount. It uses the `toLocaleString()` method to
   * format the number according to locale settings.
   *
   * @access public
   * @returns {string}
   */
  public get integerPart(): string {
    // floor value to keep only integer part
    const floored = Math.floor(Math.abs(this.amount));
    const sign = this.amount < 0 ? "-" : "";

    // results in a signed integer value
    return `${sign}${floored.toLocaleString()}`;
  }

  /**
   * Getter to retrieve only the *decimal* part of an
   * amount. It uses the `toLocaleString()` method to
   * format the number according to locale settings.
   *
   * The integer part is removed from the result.
   *
   * @access public
   * @returns {string}
   */
  public get fractionalPart(): string {
    // gets the absolute value of the amount
    const absolute = Math.abs(this.amount);

    // absolute value - floored value
    const rest = absolute - Math.floor(absolute);

    // formatting and removing integer part
    return rest
      .toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: this.decimals ? this.decimals : 6,
      })
      .replace(/^0/, "");
  }
}
