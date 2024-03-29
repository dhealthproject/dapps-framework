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
import { Namespace } from "@dhealth/sdk";
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappNamespaceCircle
 * @description This component renders a namespace circle icon
 * that can be put in other transaction graphic components.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappGraphicComponent component
 * ```html
 *   <template>
 *     <DappNamespaceCircle
 *       :namespaces="[
 *         {
 *           namespaceId: '1B3FD12D2E7832CCD',
 *           namespaceName: 'DHP',
 *         },
 *       ]"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Namespace[]}    namespaces         The {@link Namespace} array instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappNamespaceCircle extends DappGraphicComponent {
  /**
   * The {@link Namespace} array instance to be displayed.
   *
   * @access protected
   * @var {Namespace[]}
   */
  @Prop({
    type: Array,
    required: true,
  })
  protected namespaces?: Namespace[];

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      id: this.getId("namespace-circle"),
    };
  }
}
