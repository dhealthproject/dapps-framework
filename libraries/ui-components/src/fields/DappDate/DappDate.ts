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
import moment from "moment";

/**
 * @class DappDate
 * @description This component displays a timestamp in UTC with optional
 * timestamp value and uses the standard `<span>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * @example Using the DappDate component with timestamp and isShowTimestamp.
 * timestamp is an epoch timestamp in seconds.
 * isShowTimestamp is a boolean value specifying whether timestamp should also be
 * displayed in raw format (i.e. number).
 * <br /><br />
 * ```html
 *   <template>
 *     <DappDate
 *       timestamp=1655718418
 *       isShowTimestamp=true
 *     />
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {number}     timestamp           The mandatory epoch timestamp (in seconds) value.
 * @param  {boolean}    isShowTimestamp     The optional flag specifying whether to also display timestamp in number.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappDate extends Vue {
  /**
   * The required epoch timestamp (in seconds) value.
   *
   * @access protected
   * @var {number}
   */
  @Prop({ required: true })
  protected timestamp?: number;

  /**
   * The optional flag specifying whether to also display timestamp in number.
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({ default: false })
  protected isShowTimestamp?: boolean;

  /**
   * Method to return a formatted string of the timestamp in UTC timezone.
   *
   * @access public
   * @param {number} timestamp
   * @returns {string}
   */
  public utcDate(timestamp: number): string {
    return moment.utc(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
  }
}
