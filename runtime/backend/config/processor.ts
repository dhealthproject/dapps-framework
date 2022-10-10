/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module ProcessorConfig
 * @description The dApp processor configuration. This configuration
 * object is used to determine how information is processed into
 * *operations* for this dApp as listed below:
 * <br /><br />
 *  - A list of enable *contracts*. Note that this configuration
 *    field accepts a *contract identifier* which does not include
 *    the dApp identifier.
 *  - An operations configuration object. This consists of an array of
 *    {@link OperationParameters} which are used to *process* subjects
 *    according to custom transaction queries, i.e. elevate defines an
 *    authentication contract whereby the discovery source is always a
 *    singular account, this is one query parameter that is used.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the dHealth Network connection and may
 * thereby affect the data loaded by the backend runtime.
 *
 * @since v0.3.2
 */
export default () => ({
  /**
   * A list of enable *contracts*. Note that this configuration
   * field accepts a *contract identifier* which does not include
   * the dApp identifier.
   * <br /><br />
   * Note that *operations* are only processed given the presence
   * of the *contract* in this configuration field, i.e. if your
   * dApp must process authentication operations, make sure to add
   * the `"auth"` contract in this configuration field.
   * <br /><br />
   * CAUTION: By removing an entry of this configuration field,
   * *changes* will occur to the list of recent operations that
   * have been processed and thereby affect the data loaded by
   * the backend runtime.
   *
   * @example `["auth", "earn"]`
   * @var {string[]}
   */
  contracts: [
    "elevate:auth",
    "elevate:earn",
    "elevate:referral",
    "elevate:welcome",
  ],

  /**
   * An operations configuration object. This consists of an array of
   * {@link OperationParameters} which are used to *process* subjects
   * according to custom transaction queries, i.e. elevate defines an
   * authentication contract whereby the discovery source is always a
   * singular account, this is one query parameter that is used.
   * <br /><br />
   * CAUTION: By modifying the content of this configuration field,
   * *changes* may occur for the Operations that a dApp processes
   * and may thereby affect the data loaded by the backend runtime.
   * <br /><br />
   *
   * @example Example operation configuration object
   * ```json
   * {
   *   contract: "elevate:auth"
   *   label: "Session|Sessions",
   *   query: {
   *     sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
   *   }
   * }
   * ```
   * @var {OperationParameters[]}
   */
  operations: [
    {
      contract: "elevate:auth",
      label: "Session|Sessions",
      query: {
        sourceAddress: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
        transactionMode: "incoming",
      }
    },
    {
      contract: "elevate:earn",
      label: "Activity|Activities",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "elevate:referral",
      label: "Referral|Referrals",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "elevate:welcome",
      label: "Greeting|Greetings",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
  ],
});
