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
import { h } from "vue";
import type { PropType } from "vue";
import { Options } from "vue-class-component";

// internal dependencies
import { Layout, Layouts, LayoutType, Page } from "@/kernel";
import { MetaView } from "@/views/MetaView";

@Options({
  props: {
    page: {
      type: Object as PropType<Page>,
    },
  },
})
export default class Assembler extends MetaView {
  /**
   *
   */
  protected page: Page = {} as Page;

  /**
   *
   */
  protected layoutType: LayoutType = "default" as LayoutType;

  /**
   *
   */
  protected layout: Layout = Layouts["default"];

  /**
   * Hook called on mount of the Component (inject).
   *
   * @async
   * @returns {void}
   */
  mounted() {
    console.log("displaying page: ", this.page);
    console.log("using layoutType: ", this.layoutType);

    if (this.page) {
      console.log("initialize", this.page.dependencies);
    }
  }

  created() {
    this.layoutType = this.page.layout;

    // read the actual layout by type
    this.layout = !(this.layoutType in Layouts)
      ? (Layouts["default"] as Layout)
      : (Layouts[this.layoutType] as Layout);
  }

  /**
   *
   * @returns
   */
  render() {
    console.log("rendering now");
    return h(this.layout.render());
  }
}

// import CardTable from '@/components/containers/CardTable.vue';
// import BaseInfoWidget from '@/components/widgets/BaseInfoWidget.vue';
// import PriceChartWidget from '@/components/widgets/PriceChartWidget.vue';
// import RecentBlocksWidget from '@/components/widgets/RecentBlocksWidget.vue';
// import RecentTransactionsWidget from '@/components/widgets/RecentTransactionsWidget.vue';
// import TransactionGraphicWidget from '@/components/widgets/TransactionGraphicWidget.vue';
// import AccountBalanceWidget from '@/components/widgets/AccountBalanceWidget.vue';
// import NodesMapWidget from '@/components/widgets/NodesMapWidget.vue';
// import NodeStatsWidget from '@/components/widgets/NodeStatsWidget.vue';

// export default {
// 	components: {
// 		CardTable,
// 		BaseInfoWidget,
// 		PriceChartWidget,
// 		RecentBlocksWidget,
// 		RecentTransactionsWidget,
// 		TransactionGraphicWidget,
// 		AccountBalanceWidget,
// 		NodesMapWidget,
// 		NodeStatsWidget
// 	},

// 	props: {
// 		storeNamespaces: {
// 			type: Array,
// 			default: () => []
// 		},
// 		initActions: {
// 			type: Array,
// 			default: () => []
// 		},
// 		layout: {
// 			type: String,
// 			required: true,
// 			default: 'flex'
// 		},
// 		layoutOptions: {
// 			type: String,
// 			default: ''
// 		},
// 		schema: {
// 			type: Array,
// 			required: true,
// 			default: () => []
// 		}
// 	},

// 	async mounted() {
// 		console.log('initialize', this.storeNamespaces);
// 		await this.$store.dispatch('initialize', this.$route);
// 		if (this.storeNamespaces?.length) {
// 			for (const namespace of this.storeNamespaces)
// 				await this.$store.dispatch(namespace + '/initialize');
// 		}
// 		if (this.initActions?.length) {
// 			for (const action of this.initActions)
// 				await this.$store.dispatch(action, this.$route.params);
// 		}
// 	},

// 	computed: {
// 		prop() {
// 			for (let key in this.$route.params)
// 				return this.$route.params[key];
// 			return null;
// 		}
// 	},

// 	methods: {
// 		getter(e) {
// 			if (typeof e === 'string')
// 				return this.$store.getters[e];
// 		},

// 		isItemShown(item) {
// 			if (this.getter(item.hideDependOnGetter)?.error)
// 				return false;

// 			if (item.hideEmptyData && (
// 				!this.getData(item) || (
// 					Array.isArray(this.getData(item)) && !this.getData(item)?.length
// 				)
// 			)
// 			)
// 				return false;

// 			if (item.hideOnError && this.getter(item.managerGetter)?.error)
// 				return false;

// 			return true;
// 		},

// 		getKeyName(e) {
// 			return this.$store.getters['ui/getKeyName'](e);
// 		},

// 		getData(item) {
// 			if (typeof item.dataGetter === 'string')
// 				return this.getter(item.dataGetter);
// 			else
// 				return this.getter(item.managerGetter)?.data;
// 		}
// 	}
// };
