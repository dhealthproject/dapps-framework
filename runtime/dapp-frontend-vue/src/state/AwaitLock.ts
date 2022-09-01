/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vuex Store
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import AwaitLockImpl from "await-lock";

export class AwaitLock {
  /**
   * Create a lock instance
   * @access private
   * @param lock
   */
  private constructor(
    /**
     * The lock specialization
     * @var {AwaitLockImpl}
     */
    protected readonly lock: AwaitLockImpl
  ) {}

  /**
   * Create a lock
   * @return {AwaitLock}
   */
  static create() {
    return new AwaitLock(new AwaitLockImpl());
  }

  /**
   * Helper method for the initialize callback.
   * @param callback
   * @param store
   */
  async initialize(callback: any, { getters }: any) {
    await this.lock.acquireAsync();
    try {
      if (!getters.getInitialized) {
        await callback();
      }
    } finally {
      this.lock.release();
    }
  }

  /**
   * Helper method for the uninitialize callback
   * @param callback
   * @param store
   */
  async uninitialize(callback: any, { getters }: any) {
    await this.lock.acquireAsync();
    try {
      if (getters.getInitialized) {
        await callback();
      }
    } finally {
      this.lock.release();
    }
  }
}
