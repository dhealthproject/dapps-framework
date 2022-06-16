/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependenciess
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * @class DappTitle
 * @description This component displays a title text
 * and uses the standard `<h1>` tag.
 * <br /><br />
 * You can customize the content of this components with
 * [component properties](#parameters).
 * <br /><br />
 * @example Using the DappTitle component with predefined text content
 * <br /><br />
 * ```html
 *   <template>
 *     <DappTitle text="Some title text" />
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {string}     text           The title content.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappTitle extends Vue {
  /**
   * The title text content.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected text?: string;
}
