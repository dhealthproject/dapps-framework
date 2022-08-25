/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { BaseCommand } from "./BaseCommand";

/**
 * @class BaseScheduler
 * @description The abstract definition of a command line script
 * that the backend runtime can execute as a cronjob background
 * process(es).
 *
 * @since v0.2.0
 */
export abstract class BaseScheduler extends BaseCommand {
  /**
   * This method must implement the *scheduler* logic of
   * the underlying command. Additionally, the method
   * implementation should use the `Cron` decoration to
   * register the command execution and configure dates.
   * <br /><br />
   * Note that schedulers *do not* accept any options.
   *
   * @abstract
   * @returns {Promise<void>}
   */
  protected abstract runAsScheduler(): Promise<void>;
}
