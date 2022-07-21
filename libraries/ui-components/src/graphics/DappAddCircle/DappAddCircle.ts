/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { Component, Prop } from "vue-property-decorator";
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappAddCircle
 * @description This component renders an add circle icon
 * that can be put in other transaction graphic components.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappGraphicComponent component
 * ```html
 *   <template>
 *     <DappAddCircle
 *      :content="some-content-object"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {object}    content         The content object instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappAddCircle extends DappGraphicComponent {
  /**
   * The content object instance to be displayed
   *
   * @access protected
   * @var {object}
   */
  @Prop({
    type: Object,
    default: {},
  })
  protected content?: object;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      id: this.getId("add-circle"),
    };
  }
}
