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
import DappMessage from "@/fields/DappMessage/DappMessage.vue";
import {
  EncryptedMessage,
  Message,
  MessageType,
  PersistentHarvestingDelegationMessage,
  PlainMessage,
  RawMessage,
} from "@dhealth/sdk";
import { VueConstructor } from "vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions: {
  localVue: VueConstructor<Vue>;
  propsData?: object;
} = {
  localVue,
};

describe("DappMessage -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappMessage as any, componentOptions);
  });

  const messages: Message[] = [
    {
      type: MessageType.PlainMessage,
      payload: "plain message",
    } as PlainMessage,
    { type: MessageType.RawMessage, payload: "raw message" } as RawMessage,
    {
      type: MessageType.EncryptedMessage,
      payload: "encrypted message",
    } as EncryptedMessage,
    {
      type: MessageType.PersistentHarvestingDelegationMessage,
      payload: "persistent harvest delegation message",
    } as PersistentHarvestingDelegationMessage,
  ];

  const titleMessages: Message[] = [messages[2], messages[3]];

  it("should display correct message content", () => {
    messages.forEach((message: Message, index: number) => {
      componentOptions.propsData = {
        value: message,
      };
      widget = shallowMount(DappMessage as any, componentOptions);
      const messageContent =
        index > 1
          ? widget.findAll("div").at(3).text()
          : widget.findAll("div").at(1).text();
      expect(messageContent).to.equals(message.payload);
    });
  });

  it("should have clickable title div available only for encrypted and persistent harvest delegation message", () => {
    messages.forEach((message: Message, index: number) => {
      componentOptions.propsData = {
        value: message,
      };
      widget = shallowMount(DappMessage as any, componentOptions);
      const noOfDivs = widget.findAll("div").length;
      expect(noOfDivs).to.equals(index > 1 ? 4 : 2);
    });
  });

  it("should display correct clickable title", () => {
    const expectedTitles = [
      "Click to view Encrypted message",
      "Click to view Delegated Harvesting Persistent message",
    ];
    titleMessages.forEach((message: Message, index: number) => {
      componentOptions.propsData = {
        value: message,
      };
      widget = shallowMount(DappMessage as any, componentOptions);
      const titleDiv = widget
        .find("div")
        .findAll("div")
        .at(1)
        .findAll("div")
        .at(1);
      expect(titleDiv.text()).to.equals(expectedTitles[index]);
    });
  });

  it("should always add dapp-message-style-overlay class to title div", () => {
    titleMessages.forEach((message: Message) => {
      componentOptions.propsData = {
        value: message,
      };
      widget = shallowMount(DappMessage as any, componentOptions);
      const titleDiv = widget
        .find("div")
        .findAll("div")
        .at(1)
        .findAll("div")
        .at(1);
      expect(titleDiv.classes()).to.include("dapp-message-style-overlay");
    });
  });

  it("should toggle between title div and content div for encrypted and persistent harvest delegation message", () => {
    titleMessages.forEach(async (message: Message) => {
      componentOptions.propsData = {
        value: message,
      };
      widget = shallowMount(DappMessage as any, componentOptions);
      const hostDiv = widget.find("div").findAll("div").at(1);
      const titleDiv = hostDiv.findAll("div").at(1);
      const messageDiv = hostDiv.findAll("div").at(2);
      expect(titleDiv.classes()).to.equals(["dapp-message-style-overlay"]);
      expect(messageDiv.classes).to.equals(["dapp-message-style-hideContent"]);
      hostDiv.trigger("click");
      await widget.vm.$nextTick();
      expect(titleDiv.classes()).to.equals(["dapp-message-style-hideContent"]);
      expect(messageDiv.classes()).to.equals(["dapp-message-style-overlay"]);
      hostDiv.trigger("click");
      await widget.vm.$nextTick();
      expect(titleDiv.classes()).to.equals(["dapp-message-style-overlay"]);
      expect(messageDiv.classes).to.equals(["dapp-message-style-hideContent"]);
    });
  });
});
