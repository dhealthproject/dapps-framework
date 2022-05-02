/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type ScalarValueType
 * @description This type represents all scalar value
 * types that are available using Typescript at time
 * of implementation.
 * <br /><br />
 * This type is used mostly to augment type-security
 * for data stored with this driver implementation.
 *
 * @since v0.1.0
 */
export type ScalarValueType = string | number | boolean | null | undefined;

/**
 * @type DefinedScalarValueType
 * @description This type represents all scalar value
 * types that are available using Typescript at time
 * of implementation minus `undefined` and `null`.
 * <br /><br />
 * This type is used mostly to augment type-security
 * for data stored with this driver implementation.
 * <br /><br />
 * Note that it is not possible to store `undefined`
 * or `null` values using `window.localStorage` and
 * these are therefor ignored with this type.
 *
 * @since v0.1.0
 */
export type DefinedScalarValueType = string | number | boolean;

/**
 * @class StorageDriver
 * @description This class handles persistence using in
 * a simple form using either of `window.localStorage` or
 * a `Storage` extending object, or a forward predicate
 * that returns values for specific keys.
 * <br /><br />
 * The persistence uses a simple key-value format where
 * scalar value types are kept in their original type
 * whereas objects are flattened to their corresponding
 * JSON representation.
 * <br /><br />
 * Note that if you are using an arrow function to read
 * the key-value store, persistence will not be possible.
 * <br /><br />
 * @example Using the StorageDriver class
 * ```typescript
 *   const driver = new StorageDriver();
 *   console.log(driver.read('storage_key')); // returns scalar
 *   console.log(driver.read('storage_key', 'fallback')); // returns scalar
 *   console.log(driver.write('storage_key', value)); // no return
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param  {WindowLocalStorage | Storage | any}     storageProvider           The storage provider used for persistence (defaults to window.localStorage).
 *
 * @since v0.1.0
 */
export class StorageDriver {
  /**
   * The storage provider used for persistence using this
   * storage driver. This should generally use `window.localStorage`
   * as a default.
   * <br /><br />
   * You can also provide an arrow function which consists
   * in reading one value of said persistence layer. Note that
   * the arrow function must return a string formatted value.
   *
   * @var {WindowLocalStorage | Storage | ((key: string) => string)}
   */
  protected storageProvider:
    | WindowLocalStorage
    | Storage
    | ((key: string) => string);

  /**
   * Constructs a storage driver instance setting
   * the actual storage provider as {@link storageProvider}
   * property. By default, this class uses `window.localStorage`.
   *
   * @access public
   * @param   {WindowLocalStorage | Storage | ((key: string) => string)}  provider      The storage provider or arrow function, i.e. the "location".
   * @returns {StorageDriver}
   */
  public constructor(
    provider:
      | WindowLocalStorage
      | Storage
      | ((key: string) => string) = localStorage
  ) {
    this.storageProvider = provider;
  }

  /**
   * Helper method to read one value from the linked
   * {@link storageProvider} using either the `getItem`
   * method or calling the forward predicate if an arrow
   * function is passed to overwrite the persistence
   * for the active language definition.
   *
   * @access public
   * @param   {string}            storageKey      The storage key that must be read.
   * @param   {ScalarValueType}   fallbackValue   The fallback value in case the value does not exist.
   * @returns {ScalarValueType}
   */
  public read(
    storageKey: string,
    fallbackValue?: ScalarValueType
  ): ScalarValueType {
    // when fallback is undefined, there is no
    // need to check the content and value type.
    // on the other hand, when we have a fallback
    // and the retrieved value is undefined, we
    // want to return the fallback.

    // by default, try using the localStorage flow
    if ("getItem" in this.storageProvider) {
      const fromStorage = this.storageProvider.getItem(storageKey);

      return undefined === fallbackValue
        ? fromStorage
        : fromStorage === undefined
        ? fallbackValue
        : fromStorage;
    }

    // otherwise, try forwarding to the arrow function
    const fromPredicate = (
      this.storageProvider as (key: string) => string
    ).apply(this, [storageKey]);

    return undefined === fallbackValue
      ? fromPredicate
      : fromPredicate === undefined
      ? fallbackValue
      : fromPredicate;
  }

  /**
   * Helper method to write one value using the linked
   * {@link storageProvider} using the `setItem` method.
   * <br /><br />
   * Note that persistence is not available if using arrow
   * functions as the storage provider. Currently persistence
   * is only available in browser runtime with `window.localStorage`.
   *
   * @access public
   * @param   {string}            storageKey             The storage key that must be read.
   * @param   {DefinedScalarValueType}   fallbackValue   The fallback value in case the value does not exist.
   * @returns {ScalarValueType}
   */
  public write(
    storageKey: string,
    value: DefinedScalarValueType // does not allow undefined
  ): void {
    // use JSON format always (e.g. number 1 is '1')
    const jsonFormat = JSON.stringify(value);

    // by default, try using the localStorage flow
    if ("setItem" in this.storageProvider) {
      this.storageProvider.setItem(storageKey, jsonFormat);
      return;
    }

    // persistence is not available if using arrow functions
    // as the storage provider ; Currently only compatible
    // with `window.localStorage`.
  }
}
