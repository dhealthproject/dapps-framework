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
 * @class BaseCommand
 * @description The abstract definition of a command line script
 * that the backend runtime can execute. Commands refer to routines
 * that handle scoped business layer logic and that may or may not
 * run on a separate process in the background.
 * <br /><br />
 * Note that cronjobs, for example, should always use commands to
 * execute their business logic as this permits to further augment
 * the access to cronjobs for the team.
 *
 * @since v0.2.0
 */
export abstract class BaseScheduler
  extends BaseCommand
{
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
