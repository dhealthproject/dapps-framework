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
import { Transaction } from "@dhealth/sdk";
import DappTreeView from "@/graphics/DappTreeView/DappTreeView.vue";
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappUnknownTransaction
 * @description This component display a generic transaction graphic for any transactions that are
 * not currently supported by {@link DappAbstractTransaction}.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAbstractTransaction component
 * ```html
 *   <template>
 *     <DappUnknownTransaction
 *      :item="someTransactionInstance"
 *      name="someName"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Transaction}    transaction         The {@link Transaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: { DappTreeView },
})
export default class DappUnknownTransaction extends DappGraphicComponent {
  /**
   * The {@link Transaction} instance to be displayed.
   *
   * @access protected
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: Transaction;
}
