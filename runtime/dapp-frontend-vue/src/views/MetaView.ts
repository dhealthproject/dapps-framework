/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Vue } from "vue-property-decorator";

// eslint-disable-next-line
const metaConfig = require("../../config/meta.json");

/**
 * @class MetaView
 *
 * @description
 * This class encapsulates meta-tags configuration
 * and injects/sets up the meta for child components.
 *
 * @since v1.0.0
 */
export abstract class MetaView extends Vue {
  /**
   * The dApp meta tags content configuration.
   *
   * @access public
   * @var {Object}
   */
  public metaConfig: any = metaConfig;

  /**
   * The current page meta tags configuration.
   *
   * @access public
   * @var {Object}
   */
  public metaInfo = this.metaConfigByName;

  /**
   * Helper method to read the meta information
   * depending on the current instance's class
   * name.
   *
   * @access private
   * @returns {string | undefined}
   */
  private get metaConfigByName() {
    return this.metaConfig[this.constructor.name];
  }
}
