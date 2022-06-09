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
import { Logger } from '@nestjs/common';

// internal dependencies
import { State } from 'src/common/models';

/**
 * @class AbstractDiscoveryService
 * @description An abstract class that defines common attributes/methods
 * for all discovery cron services.
 *
 * @abstract
 * @since v0.1.0
 */
export abstract class AbstractDiscoveryService {
  /**
   * The main logger instance for this class.
   * This will be initialized within subclasses such that
   * this logger will contain a prefix with their class name.
   *
   * @access protected
   * @var {Logger}
   */
  protected logger: Logger;

  /**
   * The discovery source. In most cases this will be the host
   * dapp's main account public key.
   *
   * @access protected
   * @var {string}
   */
  protected discoverySource: string;

  /**
   * The state of the service.
   *
   * Contains necessary state of the service that can be accessed/modified for each run.
   *
   * Use {@link StateService} from {@link StateModule} to retrieve/save
   * this from/to database.
   *
   * @access protected
   * @var {State}
   */
  protected state: State;

  /**
   * The main method of the service to discover relevant subjects.
   *
   * Must be overriden by subclasses.
   *
   * @access public
   * @abstract
   * @returns {void}
   */
  public abstract discover(): void;
}
