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
import Vue from "vue";
import useMeta from "vue-meta";

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
  public metaConfig: any = inject("metaConfig");

  /**
   * The current page meta tags configuration.
   *
   * @access public
   * @var {Object}
   */
  public meta = setup(() =>
    useMeta(computed(() => this.metaConfig[this.constructor.name]))
  );
}
