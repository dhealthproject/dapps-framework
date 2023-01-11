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
import { Component } from "vue-property-decorator";
import InlineSvg from "vue-inline-svg";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import { UserStatisticsDTO } from "@/models/UserStatisticsDTO";

// style resource
import "./UserBalance.scss";

@Component({
  components: {
    InlineSvg,
  },
  computed: {
    ...mapGetters({
      userStatistics: "statistics/getUserStatistics",
    }),
  },
})
export default class UserBalance extends MetaView {
  /**
   * This property contains the user statistics and maps to a store
   * getter named `statistics/getUserStatistics`.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {UserStatisticsDTO}
   */
  public userStatistics!: UserStatisticsDTO;

  /**
   * @todo missing method documentation
   */
  public get userBalance(): number {
    if (undefined === this.userStatistics) {
      return 0;
    }

    return this.formatAmount(this.userStatistics.amount ?? 0);
  }
}
