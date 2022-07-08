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
import { Component, Prop } from "vue-property-decorator";
import { Message } from "@dhealth/sdk";

// internal dependencies
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappMessageCircle
 * @description This component renders a message circle icon
 * that can be put in other transaction graphic components.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappGraphicComponent component
 * ```html
 *   <template>
 *     <DappMessageCircle
 *      :message="some-Message-instance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Message}    message         The {@link Message} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappMessageCircle extends DappGraphicComponent {
  /**
   * The {@link Message} instance to be displayed.
   *
   * @access protected
   * @var {Message}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected message?: Message;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): any {
    return {
      id: this.getId("message-circle"),
    };
  }

  /**
   * Getter to return the message's payload.
   *
   * @access protected
   * @returns {string}
   */
  protected get payload(): string {
    if (!this.message) return "";
    return this.message.payload;
  }
}
