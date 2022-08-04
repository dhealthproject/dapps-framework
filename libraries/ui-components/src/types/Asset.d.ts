/**
 * @type Asset
 * @description This type defines a transfer transaction *asset*.
 * It contains certain associated information about the transaction's
 * asset such as in-scope mosaic id, mosaic label, its price in fiat
 * and the specific fiat currency that the price refers to.
 * <br /><br />
 * This type serves internally.
 *
 * @since v0.1.0
 */
export type Asset = {
  /**
   * Id of the mosaic to be displayed.
   *
   * @var {string}
   */
  mosaicId: string;

  /**
   * The mosaic name label.
   * This will be used to display as
   * unit behind the amount.
   * e.g. `DHP`, `FIT` etc.
   *
   * @var {string}
   */
  label: string;

  /**
   * The fiat currency that the price refers to.
   * This is an ISO 4217:2015 code.
   * @see https://www.iso.org/standard/64758.html
   * e.g. USD, EUR etc.
   *
   * @var {string}
   */
  priceCurrency: string;

  /**
   * The current market price of the associated mosaic token.
   *
   * @var {number}
   */
  price: number;
};
