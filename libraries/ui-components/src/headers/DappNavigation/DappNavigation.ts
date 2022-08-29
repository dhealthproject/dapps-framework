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
import DappTitleBar from "@/headers/DappTitleBar/DappTitleBar.vue";
import DappTitle from "@/texts/DappTitle/DappTitle.vue";

/**
 * @class DappNavigation
 * @description This component displays a navigation header bar that contains
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
 * | `start`   | Defines a slot on the left of the title bar (e.g. logo icon).                |
 * | `menuItem{number}` | Defines a slot of menu item in the center of the navigation bar.    |
 * | `end`  | Defines a slot on the end of the navigation bar (e.g. login/logout button).     |
 * <br /><br />
 * @example Using the DappNavigation component with variants
 * Variants that are available with the components library
 * can take up values as defined in {@link Variant}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappNavigation :noOfMenuItems="4">
 *      <img slot="start" src="/img/icons/ELEVATE.svg" />
 *      <DappNavigationItem slot="menuItem1" icon="/img/icons/dashboard.svg" label="Dashboard" @click="this.$router.push({name: 'dashboard'})" />
 *      <DappNavigationItem slot="menuItem2" icon="/img/icons/activity.svg" label="Activity" @click="this.$router.push({name: 'activity'}) class="active" />
 *      <DappNavigationItem slot="menuItem3" icon="/img/icons/events.svg" label="Events" @click="this.$router.push({name: 'events'})/>
 *      <DappNavigationItem slot="menuItem4" icon="/img/icons/rewards.svg" label="Rewards" @click="this.$router.push({name: 'rewards'})/>
 *      <span slot="end">End of navigation bar</span>
 *    </DappNavigation>
 * </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param   {Variant}     variant         The optional design variant (defaults to `"primary"`).
 * @param   {string}      title           The optional title of this navigation bar (to be displayed with mobile view).
 * @param   {string}      noOfMenuItems   The optional number of menu items to display (defaults to `0`).
 * @since v0.2.1
 */
@Component({
  components: {
    DappTitleBar,
    DappTitle,
  },
})
export default class DappNavigation extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The optional title of this navigation bar (to be displayed with mobile view).
   *
   * @access protected
   * @var {string}
   */
  @Prop({ type: String })
  protected title?: string;

  /**
   * The optional number of menu items to display (defaults to `0`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({ type: Number, default: 0 })
  protected noOfMenuItems?: number;
}
