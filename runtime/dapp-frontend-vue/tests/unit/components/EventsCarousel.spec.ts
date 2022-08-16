/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// external dependencies
import { expect } from "chai";
import { mount, createLocalVue } from "@vue/test-utils";

// components page being tested
import EventsCarousel from "@/views/Dashboard/components/EventsCarousel.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets/";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
  },
  propsData: {
    // mock of slider list items
    items: [
      {
        image: "footbalbg.jpg",
        gradient:
          "linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
      {
        header: {
          icon: "provided.svg",
          text: "Powered by lululemon®",
        },
        image: "runningbg.jpg",
        gradient:
          "linear-gradient(0deg, rgba(0, 117, 89, 0.6) 7.64%, rgba(9, 129, 107, 0) 119.21%)",
        footer: {
          title: "Yoga Mind",
          participants: "10,102",
        },
      },
      {
        image: "footbalbg.jpg",
        gradient:
          "linear-gradient(360deg, rgba(32, 89, 234, 0.7) 0%, rgba(32, 94, 255, 0) 106.16%)",
        footer: {
          title: "24/7 HIIT",
          participants: "29,988",
        },
      },
    ],
    // mock of slider configuration
    config: {
      arrows: false,
      bullets: false,
      itemsHeight: "203px",
      visibleSlides: 2.2,
      gap: 4,
    },
  },
};

describe("EventsCarousel -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(EventsCarousel as any, componentOptions);
  });

  it("should display list of slides", () => {
    expect(widget.findAll(".item")).to.have.length(
      widget.props("items").length
    );
  });

  it("should not display arrows", () => {
    expect(widget.find(".vueperslides__arrow").exists()).to.be.false;
  });

  it("should not display arrows", () => {
    expect(widget.find(".vueperslides__bullets").exists()).to.be.false;
  });
});
