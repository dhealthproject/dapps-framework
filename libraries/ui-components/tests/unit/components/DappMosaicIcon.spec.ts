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
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";

// internal dependencies
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    mosaic: { mosaicId: "39E0C49FA322A459", aliasName: "test-alias-name" },
  },
};

describe("DappMosaicIcon -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappMosaicIcon as any, componentOptions);
  });

  it("should have correct default props", () => {
    expect(widget.props().width).to.equals(261.333);
    expect(widget.props().height).to.equals(131.313);
    expect(widget.props().hideCaption).to.be.false;
  });

  it("should have correct default attributes", () => {
    expect(widget.attributes().width).to.equals("261.333px");
    expect(widget.attributes().height).to.equals("131.313px");
    expect(widget.attributes().viewBox).to.equals("0 0 261.333 131.313");
  });

  it("should have correct attributes from props", () => {
    const componentOptions = {
      localVue,
      propsData: {
        mosaic: { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" },
        width: 100,
        height: 200,
      },
    };
    widget = shallowMount(DappMosaicIcon as any, componentOptions);
    expect(widget.attributes().width).to.equals("100px");
    expect(widget.attributes().height).to.equals("200px");
    expect(widget.attributes().viewBox).to.equals("0 0 261.333 131.313");
  });

  it("should have correct viewBox attribute & should not display `text` element when `hideCaption` prop is true", () => {
    const componentOptions = {
      localVue,
      propsData: {
        mosaic: { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" },
        hideCaption: true,
      },
    };
    widget = shallowMount(DappMosaicIcon as any, componentOptions);
    expect(widget.findAll("text").length).to.equal(0);
    expect(widget.attributes().viewBox).to.equals("115 0 16 105");
  });

  it("should display correct truncate string in `text` element", () => {
    const propsDataList = [
      { mosaic: { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" } },
      { mosaic: { aliasName: "test-alias-name" } },
      { mosaic: { mosaicId: "test-mosaic-id" } },
      { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" },
      { aliasName: "test-alias-name" },
      { mosaicId: "test-mosaic-id" },
    ];
    const expectedText = [
      "test-...-name",
      "test-...-name",
      "test...c-id",
      "test-...-name",
      "test-...-name",
      "test...c-id",
    ];
    propsDataList.forEach((propsData, index) => {
      const componentOptions = {
        localVue,
        propsData,
      };
      widget = shallowMount(DappMosaicIcon as any, componentOptions);
      expect(widget.find("text").text()).to.equals(expectedText[index]);
    });
  });

  it("should display aliasName in full form in `title` element", () => {
    const propsDataList = [
      { mosaic: { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" } },
      { mosaic: { aliasName: "test-alias-name" } },
      { mosaic: { mosaicId: "test-mosaic-id" } },
      { mosaicId: "test-mosaic-id", aliasName: "test-alias-name" },
      { aliasName: "test-alias-name" },
      { mosaicId: "test-mosaic-id" },
    ];
    const expectedText = [
      "test-alias-name",
      "test-alias-name",
      "test-mosaic-id",
      "test-alias-name",
      "test-alias-name",
      "test-mosaic-id",
    ];
    propsDataList.forEach((propsData, index) => {
      const componentOptions = {
        localVue,
        propsData,
      };
      widget = shallowMount(DappMosaicIcon as any, componentOptions);
      expect(widget.find("title").text()).to.equals(expectedText[index]);
    });
  });

  it("should display correct elements", () => {
    const svgElement = widget.find("svg");
    const gElement = svgElement.find("g");
    const titleElement = gElement.find("title");
    const pathElement = gElement.find("path");
    const textElement = svgElement.find("text");
    // svg element
    expect(svgElement.exists()).to.be.true;
    expect(svgElement.attributes().version).to.equals("1.1");
    expect(svgElement.attributes().xmlns).to.equals(
      "http://www.w3.org/2000/svg"
    );
    expect(svgElement.attributes()["xmlns:xlink"]).to.equals(
      "http://www.w3.org/1999/xlink"
    );
    expect(svgElement.attributes().x).to.equals("0px");
    expect(svgElement.attributes().y).to.equals("0px");
    expect(svgElement.attributes().width).to.equals("261.333px");
    expect(svgElement.attributes().height).to.equals("131.313px");
    expect(svgElement.attributes().viewBox).to.equals("0 0 261.333 131.313");
    expect(svgElement.attributes()["xml:space"]).to.equals("preserve");
    expect(svgElement.attributes().class).to.equals("dappMosaicIcon-connector");
    // g element
    expect(gElement.exists()).to.be.true;
    // title element
    expect(titleElement.exists()).to.be.true;
    expect(titleElement.text()).to.equals("test-alias-name");
    // path element
    expect(pathElement.exists()).to.be.true;
    expect(pathElement.attributes()["fill-rule"]).to.equals("evenodd");
    expect(pathElement.attributes()["clip-rule"]).to.equals("evenodd");
    expect(pathElement.attributes().class).to.equals(
      "dappMosaicIcon-connector-body"
    );
    expect(pathElement.attributes().fill).to.equals("RGB(129,139,78)");
    expect(pathElement.attributes().d).to.equals(
      "M137.069,12c-.2686.0282-1.0885.1273-1.8237.2121-6.2769.7351-12.8366 4.1846-16.9929 8.9488-1.6823 1.9085-2.6861 3.4919-6.5879 10.2636-3.605 6.2628-8.8216 15.3106-13.6424 23.6656-3.2515 5.6125-4.0432 7.3514-4.8491 10.5463-.7493 2.9547-.9896 7.2383-.5796 10.2212 1.4986 10.716 8.7651 19.5942 18.746 22.9023 11.126 3.704 23.6374-.3817 30.8332-10.0515.5938-.8058 2.3609-3.6756 3.916-6.3617 1.5551-2.7002 4.6653-8.0865 6.9131-11.9742 2.2478-3.8877 5.3863-9.2598 6.9697-11.946 1.5834-2.6719 3.1526-5.4287 3.4919-6.1072 3.9584-7.9592 3.9443-17.3322-.0282-25.2773-3.8877-7.7613-11.7904-13.4586-20.5131-14.7734-1.4137-.2121-4.9338-.3817-5.8528-.2686zm5.1601 5.2166c6.5597 1.032 12.5538 5.2308 15.8054 11.0552 3.5201 6.3051 3.8736 14.1372.9472 20.4848-.5796 1.2582-5.6691 10.094-5.8104 10.094-.0566 0-6.0649-3.407-13.3455-7.5775-7.2948-4.1705-13.4728-7.6058-13.7272-7.6482-.7351-.1131-1.4279.0707-1.9651.5514-.9896.8624-1.1451 2.8133-.311 3.8171.1837.2262 5.867 3.5625 13.4586 7.9027 7.2383 4.1281 13.1758 7.5351 13.2042 7.5493.0282.0282-.7493 1.442-1.7247 3.1385-.9755 1.6965-3.6191 6.3193-5.8952 10.2919-3.7888 6.6303-5.8952 10.094-6.39 10.504-.1555.1131-.8624-.2262-3.2233-1.5834-25.6166-14.6179-24.6412-14.0806-25.3621-14.0806-.8199 0-1.3713.2686-1.8661.919-.41.5372-.5796 1.4279-.4241 2.2337.1979 1.0461.6644 1.3571 11.3239 7.5351 5.5983 3.2515 11.2109 6.5031 12.4831 7.2383 1.2582.721 2.2903 1.3713 2.2903 1.442 0 .1837-3.2515 1.7813-4.538 2.2337-8.0016 2.7992-17.1343.6786-23.1851-5.3863-3.7605-3.7605-5.9517-8.5106-6.3335-13.7696-.2828-3.7888.4665-7.8037 2.1064-11.3239.5372-1.131 3.9866-6.8707 4.227-7.012.0566-.0424 2.0075 1.032 4.3401 2.3751 2.3185 1.3431 8.0723 4.6512 12.7801 7.3514 4.7077 2.7144 8.7792 5.0611 9.0479 5.2449.6503.41 1.3431.5231 2.1772.3676 1.9651-.3676 2.785-2.5306 1.6116-4.2553-.3676-.5372-.2403-.4523-9.585-5.8246-3.8453-2.2195-9.4013-5.4145-12.3418-7.0968l-5.3297-3.082.5514-1.0179c2.9405-5.3015 12.8932-22.5064 13.1052-22.6478.2403-.1555 1.8802.7493 13.4869 7.3938 7.3796 4.227 13.4869 7.6341 13.812 7.7189 1.6823.41 3.4919-1.3148 3.2375-3.082-.2121-1.3713.1413-1.1451-13.7272-9.175-6.9979-4.0574-12.8083-7.422-12.9072-7.4786-.2121-.1413.8624-1.0037 2.8133-2.2619 3.1385-2.0357 6.0083-2.9829 10.2353-3.407.919-.0848 3.5767.0566 4.948.2686z"
    );
    // text element
    expect(textElement.exists()).to.be.true;
    expect(textElement.attributes().x).to.equals("130");
    expect(textElement.attributes().y).to.equals("122.8457");
    expect(textElement.attributes().class).to.equals(
      "dappMosaicIcon-mosaic-text"
    );
    expect(textElement.attributes()["text-anchor"]).to.equals("middle");
    expect(textElement.text()).to.equals("test-...-name");
  });
});
