/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Injectable } from "@nestjs/common";

// internal dependencies
import { NotifierType } from "../models/NotifierType";
import { EmailNotifier } from "../services/EmailNotifier";
import { Notifier } from "../models/Notifier";

/**
 * @class NotifierFactory
 * @description A factory class that creates and returns notifier
 * strategy instance depend on input {@link NotifierType} value.
 * <br /><br />
 * @example using the `NotifierFactory`
 * ```typescript
 *  import { NotifierFactory } from "./NotifierFactory";
 *
 *  @Injectable()
 *  class Example {
 *    constructor(private readonly notifierFactory: NotifierFactory) {}
 *
 *    public notifyInternal() {
 *      const emailNotifier = this.notifierFactory.getNotifier(NotifierType.MAIL);
 *      await emailNotifier.sendInternal({
 *        to: `recipient@example.com`,
 *        subject: `subject`,
 *        text: `text content`,
 *         html: `<p>html content</p>`,
 *      });
 *    }
 *  }
 * ```
 *
 * @since v0.3.2
 */
@Injectable()
export class NotifierFactory {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {EmailNotifier} emailNotifier The {@link EmailNotifier} instance of this class.
   */
  constructor(private readonly emailNotifier: EmailNotifier) {}

  /**
   * Method to return an instance of {@link Notifier} depends
   * on the input {@link NotifierType}.
   *
   * @access public
   * @param {NotifierType} notifierType The notifier type to return an instance of.
   * @returns {Notifier}
   */
  public getNotifier(notifierType: NotifierType): Notifier {
    switch (notifierType) {
      case NotifierType.MAIL:
        return this.emailNotifier;
      default:
        return null;
    }
  }
}
