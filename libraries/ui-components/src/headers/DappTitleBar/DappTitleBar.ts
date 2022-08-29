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
import { Variant } from "@/classes";
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * @class DappTitleBar
 * @description This component displays a title bar that contains
 * several slots of which styling and events handling can be performed
 * independently and dynamically.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * Note that this component defines 3 slots that can be filled
 * with content:
 * | Slot | Description |
 * | --- | --- |
 * | `left`   | Defines a slot on the left of the title bar (e.g. back-arrow icon).       |
 * | `center` | Defines a slot on the center of the title bar (e.g. DappTitle component). |
 * | `right`  | Defines a slot on the right of the title bar (e.g. forward-arrow icon).   |
 * <br /><br />
 * @example Using the DappTitleBar component with variants
 * Variants that are available with the components library
 * can take up values as defined in {@link Variant}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappTitleBar variant="primary">
 *     <span slot="left">left</span>
 *     <span slot="center">center</span>
 *     <span slot="right">right</span>
 *   </DappTitleBar>
 * </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param   {Variant}     variant     The optional design variant (defaults to `"primary"`).
 *
 * @since v0.2.1
 */
@Component({})
export default class DappTitleBar extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;
}
