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
import FriendsList from "@/views/Dashboard/components/FriendsList.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets/";

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
  },
  propsData: {
    friends: [
      {
        avatar: "friend1.png",
        name: "Yoga Maestro",
      },
      {
        avatar: "friend2.png",
        name: "Terminator",
      },
    ],
  },
};

describe("FriendsList -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(FriendsList as any, componentOptions);
  });

  it("should display title", () => {
    expect(widget.find(".title").exists()).to.be.true;
  });

  it("should display items", () => {
    expect(widget.findAll(".dapp-friends-list__item")).to.have.length(
      widget.props("friends").length
    );
  });
});
