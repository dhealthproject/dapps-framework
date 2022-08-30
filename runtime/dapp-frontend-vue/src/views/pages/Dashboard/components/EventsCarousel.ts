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
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";
import InlineSvg from "vue-inline-svg";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import { DappButton } from "@dhealth/components";

// eslint-disable-next-line prettier/prettier
export interface CarouselItem {
  gradient: string;
  image: string;
  header?: {
    icon: string;
    text: string;
  };
  footer: {
    title: string;
    participants: number | string;
  };
}

export interface CarouselConfig {
  arrows: boolean;
  bullets: boolean;
  itemsHeight: string | number;
  visibleSlides: number;
  gap: number;
  breakpoints?: any;
}

@Component({
  components: {
    DappButton,
    InlineSvg,
    VueperSlides,
    VueperSlide,
  },
})
export default class EventsCarousel extends MetaView {
  /**
   * Prop which defines list of items displayed in carousel
   * defaults to []
   *
   * @access readonly
   * @var {items}
   */
  @Prop({ default: () => [] }) readonly items?: CarouselItem;

  /**
   * Prop which defines configuration of carousel
   * defaults to {}
   *
   * @access readonly
   * @var {config}
   */
  @Prop({ default: () => ({}) }) readonly config?: CarouselConfig;

  /**
   * Prop which defines configuration of carousel breakpoints
   * defaults to {}
   *
   * @access readonly
   * @var {breakpoints}
   */
  @Prop({ default: () => ({}) }) readonly breakpoints?: any;
}
