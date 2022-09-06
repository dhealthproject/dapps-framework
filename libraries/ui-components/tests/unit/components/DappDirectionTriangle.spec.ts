/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { expect } from "chai";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import DappDirectionTriangle from "@/graphics/DappDirectionTriangle/DappDirectionTriangle.vue";
import { DirectionTriangle } from "@/types/DirectionTriangle";

// creates local vue instance for tests
const localVue = createLocalVue();
const direction: DirectionTriangle = "up";
const componentOptions = {
  localVue,
  propsData: { direction },
};

describe("DappDirectionTriangle -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappDirectionTriangle as any, componentOptions);
  });

  it("should have correct prop values & default values", () => {
    expect(widget.props().variant).to.equals("primary");
    expect(widget.props().direction).to.equals("up");
  });

  it("should always add base CSS class", () => {
    expect(widget.find("div").classes()).to.contain(
      "dappDirectionTriangle-base"
    );
  });

  it("should add style-primary CSS class given default variant", () => {
    expect(widget.find("div").classes()).to.contain(
      "dappDirectionTriangle-base"
    );
    expect(widget.find("div").classes()).to.contain(
      "dappDirectionTriangle-style-primary"
    );
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappDirectionTriangle as any, {
        ...componentOptions,
        propsData: { variant },
      });

      // assert
      expect(widget.find("div").classes()).to.contain(
        "dappDirectionTriangle-base"
      );
      expect(widget.find("div").classes()).to.contain(
        `dappDirectionTriangle-style-${variant}`
      );
    });
  });

  it("should render correct elements", () => {
    ["up", "down", "both"].forEach((direction: string) => {
      // prepare
      // overwrites "direction" property
      widget = shallowMount(DappDirectionTriangle as any, {
        ...componentOptions,
        propsData: { direction },
      });
      const rootDivElement = widget.find("div");

      // assert
      if (direction === "both") {
        expect(rootDivElement.find(".dappDirectionTriangle-up").exists()).to.be
          .true;
        expect(rootDivElement.find(".dappDirectionTriangle-down").exists()).to
          .be.true;
      } else {
        expect(
          rootDivElement.find(`.dappDirectionTriangle-${direction}`).exists()
        ).to.be.true;
      }
    });
  });
});
