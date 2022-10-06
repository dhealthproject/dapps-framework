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
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import { MetaView } from "@/views/MetaView";

// style resource
import "./Tabs.scss";

@Component({})
export default class Tabs extends MetaView {
  /**
   * Prop which defines title of the tabs
   *
   * @access readonly
   * @var {title}
   */
  @Prop({ default: "" }) readonly title?: string;

  /**
   * Prop which defines list and content of tabs
   * .title - field which defines tab text
   *
   * @access readonly
   * @var {tabList}
   */
  @Prop({ default: () => [] }) readonly tabList?: [];

  /**
   * Prop which defines initially selected tab
   * value shouldn't be > tabList.length
   *
   * @access readonly
   * @var {initialTab}
   */
  @Prop({}) readonly initialTab?: number;

  /**
   * Prop which defines how tabs are used:
   * 1. As switcher with buttons
   * 2. As tabs with related tab content screens
   *
   * @access readonly
   * @var {asSwitcher}
   */
  @Prop({ default: false }) readonly asSwitcher?: boolean;

  /**
   * Prop which defines existing of space between title and tabs
   *
   * @access readonly
   * @var {spacedTitle}
   */
  @Prop({ default: false }) readonly spacedTitle?: boolean;

  /**
   * Property which defines currently selected tab
   *
   * @access public
   * @var {selectedTab}
   */
  selectedTab = 0;

  /**
   * Computed which maps tab items
   * returns array of strings
   * string values are taken from .title properties
   *
   * @returns {any[] | undefined}
   */
  get tabNames() {
    return this.tabList?.map((tabItem: any) => tabItem.title);
  }

  /**
   * This method sets number of currently shown tab
   * if {asSwitcher} prop is true - emits event with value from tab
   *
   * @access public
   */
  handleSwitch($event: any, tab: any, index: number) {
    if (this.asSwitcher) {
      this.$emit("tabChange", tab);
    }
    this.selectedTab = index;
  }

  mounted() {
    if (this.initialTab) {
      this.selectedTab = this.initialTab;
    }
  }
}
