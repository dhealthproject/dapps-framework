/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/* eslint-disable no-useless-escape */
// external dependencies
import { Component, Prop, Vue } from "vue-property-decorator";

// internal dependencies
import { TransactionTypeTitle } from "@/types/TransactionTypeTitle";
import { TransactionType } from "@dhealth/sdk";

/**
 * @class DappGraphicComponent
 * @description This component is an abstract graphic component.
 * It provides common data, computed properties and methods for
 * other graphic components which extends it.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappGraphicComponent component
 * ```html
 *   <template>
 *     <DappGraphicComponent
 *      :x=123
 *      :y=321
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {number}     x       The optional x-axis position value (defaults to `0`).
 * @param  {number}     y       The optional y-axis position value (defaults to `0`).
 *
 * @since v0.1.0
 */
@Component({})
export default class DappGraphicComponent extends Vue {
  /**
   * The optional x-axis position value (defaults to `0`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 0,
  })
  protected x?: number;

  /**
   * The optional y-axis position value (defaults to `0`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 0,
  })
  protected y?: number;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      // Transaction graphic
      desktopTransactionGraphicViewbox: "140 200 700 200",
      mobileTransactionGraphicViewbox: "380 240 200 170",
      desktopTransactionGraphicWidth: 700,
      desktopTransactionGraphicHeight: 200,
      mobileTransactionGraphicWidth: 370,
      mobileTransactionGraphicHeight: 150,

      // Subject
      desktopSubjectPositionX: 112,
      desktopSubjectPositionY: 240,
      desktopSubjectWidth: 261.333,
      desktopSubjectHeight: 131.313,

      mobileSubjectPositionX: 200,
      mobileSubjectPositionY: 277,
      mobileSubjectWidth: 261,
      mobileSubjectHeight: 90,

      // Object
      desktopObjectPositionX: 614,
      mobileObjectPositionX: 505,

      // objectPositionY: 240,

      // Transaction type text
      transactionTypeTextPositionX: 485,
      transactionTypeTextPositionY: 361.9268,

      // Arrow
      arrowPositionX: 341,
      arrowPositionY: 305,

      // Circle icons
      circlesIconsPositionsX: [[466], [447, 485], [428, 466, 504]],
      circleIconPositionY: 300,
    };
  }

  /**
   * Computed property to check whether client is running with mobile.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isMobile(): boolean {
    const agent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    let check = false;
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        agent
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        agent.substr(0, 4)
      )
    )
      check = true;
    else if (
      Vue.config.devtools &&
      window.innerWidth <= 800 &&
      window.innerHeight <= 600
    )
      check = true;
    return check;
  }

  /**
   * Computed property to return this component's viewBox specifics
   * depending on if client is on mobile or not.
   *
   * @access protected
   * @returns {string}
   */
  protected get transactionGraphicViewbox(): string {
    return this.isMobile
      ? this.$data.mobileTransactionGraphicViewbox
      : this.$data.desktopTransactionGraphicViewbox;
  }

  /**
   * Calculate graphic width depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get transactionGraphicWidth(): number {
    return this.isMobile
      ? this.$data.mobileTransactionGraphicWidth
      : this.$data.desktopTransactionGraphicWidth;
  }

  /**
   * Calculate graphic height depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get transactionGraphicHeight(): number {
    return this.isMobile
      ? this.$data.mobileTransactionGraphicHeight
      : this.$data.desktopTransactionGraphicHeight;
  }

  /**
   * Returns adjusted position on x-axis depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get subjectPositionX(): number {
    return this.isMobile
      ? this.$data.mobileSubjectPositionX
      : this.$data.desktopSubjectPositionX;
  }

  /**
   * Returns adjusted position on y-axis depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get subjectPositionY(): number {
    return this.isMobile
      ? this.$data.mobileSubjectPositionY
      : this.$data.desktopSubjectPositionY;
  }

  /**
   * Returns object's position on x-axis depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get objectPositionX(): number {
    return this.isMobile
      ? this.$data.mobileObjectPositionX
      : this.$data.desktopObjectPositionX;
  }

  /**
   * Returns object's position on y-axis depending on platform.
   *
   * @access protected
   * @returns {number}
   */
  protected get objectPositionY() {
    return this.subjectPositionY;
  }

  /**
   * Returns subject width.
   *
   * @access protected
   * @returns {number}
   */
  protected get subjectWidth(): number {
    return this.isMobile
      ? this.$data.mobileSubjectWidth
      : this.$data.desktopSubjectWidth;
  }

  /**
   * Returns subject height.
   *
   * @access protected
   * @returns {number}
   */
  protected get subjectHeight(): number {
    return this.isMobile
      ? this.$data.mobileSubjectHeight
      : this.$data.desktopSubjectHeight;
  }

  // protected get nativeMosaicId() {
  // 	return http.networkCurrency.mosaicId;
  // }

  // protected get nativeMosaicAliasName() {
  // 	return http.networkCurrency.namespaceName;
  // }

  /**
   * Getter of prop `x`.
   * Return `x` in pixels.
   *
   * @access protected
   * @returns {string}
   */
  protected get _x(): string {
    if (!this.x) return "0px";
    return this.getPixels(this.x);
  }

  /**
   * Getter of prop `y`.
   * Return `y` in pixels.
   *
   * @access protected
   * @returns {string}
   */
  protected get _y(): string {
    if (!this.y) return "0px";
    return this.getPixels(this.y);
  }

  // protected get _height() {
  // 	return this.getPixels(this.height || '0');
  // }

  // protected get _width() {
  // 	return this.getPixels(this.width || '0');
  // }

  /**
   * Method to returns number of circles to display in this component.
   *
   * @access protected
   * @returns {number}
   */
  protected get circlesCount(): number {
    return Array.isArray((this as any).circleIconsToDisplay)
      ? (this as any).circleIconsToDisplay.reduce(
          (acc: string, value: string) => acc + value
        )
      : 0;
  }

  // protected getTranslation(key) {
  // 	return this.$store.getters['ui/getNameByKey'](key);
  // }

  /**
   * Method that takes an input of number and returns a string in form `"${number_value}px"`
   *
   * @param value
   * @returns
   */
  protected getPixels(value: number) {
    return value + "px";
  }

  // protected getIconColor(str: string) {
  // 	const color = helper.getColorFromHash(str, false);

  // 	return `RGB(${color.R},${color.G},${color.B})`;
  // }

  // protected getIconColorFromHex(str) {
  // 	const color = helper.getColorFromHash(str, true);

  // 	return `RGB(${color.R},${color.G},${color.B})`;
  // }

  // protected truncString(str, strLen) {
  // 	return helper.truncString(str, strLen);
  // }

  /**
   * Method to generate and return id for this component.
   *
   * @access protected
   * @param id
   * @returns {string}
   */
  protected getId(id: string): string {
    return id + "-" + Math.floor(Math.random() * Math.floor(1000));
  }

  /**
   * Get position on x-axis of the circle icon.
   *
   * @access protected
   * @param index
   * @returns
   */
  protected getCircleIconPositionX(index: number) {
    const circlesCount = this.circlesCount;
    const circleIconsToDisplay = (this as any).circleIconsToDisplay;

    switch (index) {
      case 0:
        if (circleIconsToDisplay[0])
          return this.$data.circlesIconsPositionsX[circlesCount - 1][0];
        break;
      case 1:
        if (circleIconsToDisplay[1]) {
          if (circleIconsToDisplay[0])
            return this.$data.circlesIconsPositionsX[circlesCount - 1][1];

          return this.$data.circlesIconsPositionsX[circlesCount - 1][0];
        }
        break;
      case 2:
        if (circleIconsToDisplay[2]) {
          if (circleIconsToDisplay[0] && circleIconsToDisplay[1])
            return this.$data.circlesIconsPositionsX[circlesCount - 1][2];
          if (circleIconsToDisplay[0] || circleIconsToDisplay[1])
            return this.$data.circlesIconsPositionsX[circlesCount - 1][1];
          return this.$data.circlesIconsPositionsX[circlesCount - 1][0];
        }
        break;
    }
  }

  // protected getMosaicName(mosaic) {
  // 	return helper.getMosaicName(mosaic);
  // }

  // protected getMosaicTitle(mosaic) {
  // 	return `Mosaic: ${this.getMosaicName(mosaic)}`;
  // }

  /**
   * Returns the title of address.
   * The format of title is `"Account: ${address}"`
   *
   * @param address
   * @returns {string}
   */
  protected getAddressTitle(address: string) {
    return `Account: ${address}`;
  }

  /**
   * Returns the transaction caption depending on transaction type.
   * Note that value will be extracted from {@link TransactionTypeTitle}.
   *
   * E.g. `TransactionType.TRANSFER` -> "Transfer"
   *
   * @param type
   * @returns {string}
   */
  protected getTransactionTypeCaption(type: TransactionType): string {
    return TransactionTypeTitle[type];
  }

  // protected onAccountClick(address) {
  // 	this.$store.dispatch(`ui/openPage`, {
  // 		pageName: 'account',
  // 		param: address
  // 	});
  // 	this.$emit('click', address);
  // }

  // protected onMosaicClick(mosaicId) {
  // 	this.$store.dispatch(`ui/openPage`, {
  // 		pageName: 'mosaic',
  // 		param: mosaicId
  // 	});
  // 	this.$emit('click', mosaicId);
  // }

  // protected onNamespaceClick(namespaceId) {
  // 	this.$store.dispatch(`ui/openPage`, {
  // 		pageName: 'namespace',
  // 		param: namespaceId
  // 	});
  // 	this.$emit('click', namespaceId);
  // }
}
