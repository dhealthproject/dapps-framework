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
import DappIcon from "@/graphics/DappIcon/DappIcon.vue";

/**
 * @class DappInput
 * @description This component displays an input field and uses the
 * standard `<input>` tag to automatically make `@click` and `@hover`
 * compatible with browser events.
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * @example Using the DappInput component.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappInput
 *      inputValue="some value"
 *      placeholder="some placeholder value"
 *      disabled=true
 *      leftIconSrc="url to left icon image"
 *      rightIconSrc="url to right icon image"
 *    />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {string}     inputValue          The optional `value` to be put inside the input element.
 * @param  {string}     placeholder         The optional `placeholder` value of the input element.
 * @param  {boolean}    disabled            The optional `disabled` value of the input element.
 * @param  {string}    leftIconSrc          The optional `src` value of the left icon image.
 * @param  {string}    rightIconSrc         The optional `src` value of the right icon image.
 *
 * @since v0.2.0
 */
@Component({
  components: {
    DappIcon,
  },
})
export default class DappInput extends Vue {
  /**
   * The optional `value` to be put inside the input element.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected inputValue?: string;

  /**
   * The optional `placeholder` value of the input element.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
  })
  protected placeholder?: string;

  /**
   * The optional `disabled` value of the input element.
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  protected disabled?: boolean;

  /**
   * The optional `src` value of the left icon image.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
  })
  protected leftIconSrc?: string;

  /**
   * The optional `src` value of the right icon image.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
  })
  protected rightIconSrc?: string;
}
