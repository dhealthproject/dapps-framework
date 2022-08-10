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

// internal dependencies
import DappTitle from "@/texts/DappTitle/DappTitle.vue";

/**
 * @class DappTitleBar
 * @description This component displays a title bar that contains
 * several slots of which styling and events handling can be performed
 * independently and dynamically.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * Note that this component defines 5 slots that can be filled
 * with content:
 * | Slot | Description |
 * | --- | --- |
 * | `leftIcon` | Defines an optional icon on the left of the title bar (e.g. back-arrow icon). |
 * | `prefix` | Defines an optional prefix text or element on the left of the button text (e.g. caret icon). |
 * | `suffix` | Defines an optional suffix text or element on the right of the button text (e.g. caret icon). |
 * | `rightIcon` | Defines an optional icon on the right of the title bar (e.g. forward-arrow icon). |
 * | `rightButton` | Defines an optional button on the right of the title bar (e.g. switch-wallet button). |
 * <br /><br />
 * @example Using the DappButton component with variants
 * Variants that are available with the components library
 * can take up values as defined in {@link Variant}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappTitleBar title="dHealth Network" variant="primary">
 *     <template #leftIcon>
 *       <DappIcon src="back-arrow.png" size="small" />
 *     </template>
 *   </DappTitleBar>
 * </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param   {Variant}     variant           The optional design variant (defaults to `"primary"`).
 * @param   {string}      title             The optional title text content (defaults to `"dHealth Network"`).
 *
 * @since v0.2.1
 */
@Component({
  components: {
    DappTitle,
  },
})
export default class DappTitleBar extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The optional title text content (defaults to `"dHealth Network"`).
   *
   * @access protected
   * @var {string}
   */
  @Prop({ default: "dHealth Network" })
  protected title?: string;

  /**
   * Getter to check if the `"rightButton"` slot is occupied.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get hasRightButtonSlot(): boolean {
    return !!this.$slots.rightButton;
  }
}
