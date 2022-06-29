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
// internal dependencies
import DappTokenAmount from "@/fields/DappTokenAmount/DappTokenAmount.vue";
import IconCopy from "../../assets/img/copy.png";

/**
 * @class DappAccountCard
 * @description This component displays an account card
 * and permits to differentiate between the different
 * parts of the card.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAccountCard component
 * ```html
 *   <template>
 *     <DappAccountCard
 *       :disableAvatar="false"
 *       :disableAddress="false"
 *       :inline="false"
 *       :balance="1.237"
 *       :address="some-address"
 *       :alias="some-alias"
 *       :mosaicName="DHP"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {boolean}    address               The required account address value.
 * @param  {boolean}    disableAvatar         The optional avatar disable flag (defaults to `true`).
 * @param  {boolean}    disableAddress        The optional address disable flag (defaults to `true`).
 * @param  {boolean}    inline                The optional inline flag (defaults to `false`).
 * @param  {boolean}    balance               The optional display account balance value (defaults to `0`).
 * @param  {boolean}    alias                 The optional alias vaue (defaults to `"No alias"`).
 * @param  {boolean}    mosaicName            The optional currency name value (defaults to `"DHP"`).
 *
 * @since v0.1.0
 */
@Component({
  components: { DappTokenAmount },
})
export default class DappAccountCard extends Vue {
  /**
   * The required account address value.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  address?: string;

  /**
   * The optional avatar disable flag (defaults to `true`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({ default: true })
  protected disableAvatar?: boolean;

  /**
   * The optional address disable flag (defaults to `true`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({ default: true })
  protected disableAddress?: boolean;

  /**
   * The optional inline flag (defaults to `false`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({ default: false })
  protected inline?: boolean;

  /**
   * The optional display account balance value (defaults to `0`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 0,
  })
  protected balance?: number;

  /**
   * The optional alias vaue (defaults to `"No alias"`).
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    default: "No alias",
  })
  alias?: string;

  /**
   * The optional currency name value (defaults to `"DHP"`).
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    default: "DHP",
  })
  mosaicName?: string;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return { IconCopy };
  }

  /**
   * Method to copy this component's account address to clipboard.
   *
   * @access protected
   * @returns {void}
   */
  protected onCopyClick(): void {
    if (!this.address) return;

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(this.address);
  }
}
