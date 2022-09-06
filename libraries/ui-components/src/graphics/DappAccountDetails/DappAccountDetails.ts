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
import type { Variant } from "@/types/Variant";
import { AccountInfo } from "@dhealth/sdk";
import DappDirectionTriangle from "../DappDirectionTriangle/DappDirectionTriangle.vue";
import { DirectionTriangle } from "@/types/DirectionTriangle";
import { Asset } from "@/types/Asset";

/**
 * @class DappAccountDetails
 * @description This component displays an account details row
 * and uses the standard `<div>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappAccountDetails component with attribute parameters
 * <br /><br />
 * ```html
 * <template>
 *  <DappAccountDetails
 *      accountName="Yoga Master"
 *      :accountInfo="some_accountInfo_instance"
 *      :asset="{
 *        mosaicId: '39E0C49FA322A459',
 *        mosaicName: '$DHP',
 *        divisibility: 6,
 *        fractionalDigits: 0,
 *      }"
 *      direction="both"
 *  >
 *    <span slot="count">#1</span>
 *    <DappIcon slot="icon" size="medium-large" src="img/icons/yoga.svg" />
 *  </DappAccountDetails>
 * </template>
 * ```
 * <br /><br />
 * #### Parameters
 * @param  {Variant}            variant             The optional design variant (defaults to `"primary"`).
 * @param  {AccountInfo}        accountInfo         The required {@link AccountInfo} instance of this component.
 * @param  {string}             accountName         The optional account name - to be displayed on top of the address.
 * @param  {Asset}              asset               The required {@link Asset} instance - contains the displayed mosaic's information.
 * @param  {DirectionTriangle}  direction           The optional {@link DirectionTriangle} instance - to be displayed as arrow(s) next to account name.
 *
 * @since v0.3.0
 */
@Component({
  components: {
    DappDirectionTriangle,
  },
})
export default class DappAccountDetails extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The required {@link AccountInfo} instance of this component.
   *
   * @access protected
   * @var {AccountInfo}
   */
  @Prop({ required: true })
  protected accountInfo?: AccountInfo;

  /**
   * The optional account name - to be displayed on top of the address.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected accountName?: string;

  /**
   * The required {@link Asset} instance - contains the displayed mosaic's information.
   *
   * @access protected
   * @var {Asset}
   */
  @Prop({ required: true })
  protected asset?: Asset;

  /**
   * The optional {@link DirectionTriangle} instance - to be displayed as arrow(s) next to account name.
   *
   * @access protected
   * @var {DirectionTriangle}
   */
  @Prop()
  protected direction?: DirectionTriangle;

  /**
   * Getter that gets and returns amount from this component's {@link AccountInfo} instance.
   * This amount is queried by `mosaicID` in {@link Asset} and divided by its `inputDecimals`
   * (divisibilty). It is then display in `outputDecimal` (no. of fractional digits).
   * <br /><br />
   * Returns 0 if there's no mosaic available.
   *
   * @access protected
   * @var {number}
   */
  protected get amount() {
    const mosaics = this.accountInfo?.mosaics;
    if (mosaics) {
      for (const mosaic of mosaics) {
        if (mosaic.id.toHex() === this.asset?.mosaicId) {
          return (
            mosaic.amount.compact() / Math.pow(10, this.asset.inputDecimals)
          ).toFixed(this.asset.outputDecimals);
        }
      }
    }
    return 0;
  }
}
