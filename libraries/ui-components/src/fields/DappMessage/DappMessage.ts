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
import { Message, MessageType } from "@dhealth/sdk";
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * @class DappMessage
 * @description This component displays a message content
 * of a dHealth transaction.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappMessage component
 * ```html
 *   <template>
 *     <DappMessage
 *       :value=transaction.message
 *       :clickMessageTitle="Click to view Plain Message"
 *     />
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {Message}    value               The optional message object of a dHealth network transaction.
 * @param  {string}     clickMessageTitle   The optional click message title content.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappMessage extends Vue {
  /**
   * The message object to be displayed (defaults to empty object).
   *
   * @access protected
   * @var {Message}
   */
  @Prop({
    type: Object,
    default: () => ({}),
  })
  protected value?: Message;

  /**
   * The optional click message title content.
   * This will be displayed inside a clickable `<span>`
   * which will switch to the actual message content when clicked.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected expandMessage?: string;

  /**
   * Method to return this component's data store.
   * Data can be accessed with `this.$data`.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return { isClick: false };
  }

  /**
   * Getter to return message's payload.
   *
   * @access protected
   * @returns {string | undefined}
   */
  protected get message(): string | undefined {
    return this.value?.payload;
  }

  /**
   * Getter to return message's type.
   *
   * @access protected
   * @returns {MessageType | undefined}
   */
  protected get messageType(): MessageType | undefined {
    return this.value?.type;
  }

  /**
   * Getter to check whether message is plain message or raw message.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isPlainMessage(): boolean {
    return (
      this.value?.type === MessageType.PlainMessage ||
      this.value?.type === MessageType.RawMessage
    );
  }

  /**
   * Getter to return click message title.
   *
   * @access protected
   * @returns {string}
   */
  protected get title(): string {
    return this.expandMessage
      ? this.expandMessage
      : `Click to view ${this.getMessageTypeString()}`;
  }

  /**
   * Method to return message type as string.
   *
   * @access public
   * @returns {string}
   */
  public getMessageTypeString(): string {
    switch (this.value?.type) {
      case undefined:
        return "";
      case MessageType.RawMessage:
        return "Raw Message";
      case MessageType.PlainMessage:
        return "Plain Message";
      case MessageType.EncryptedMessage:
        return "Encrypted message";
      case MessageType.PersistentHarvestingDelegationMessage:
        return "Delegated Harvesting Persistent message";
    }
  }

  /**
   * Method to toggle `isClick` property in this component's data store.
   * Called when click message title is clicked.
   *
   * @access public
   * @returns {void}
   */
  public expanding(): void {
    this.$data.isClick = !this.$data.isClick;
  }
}
