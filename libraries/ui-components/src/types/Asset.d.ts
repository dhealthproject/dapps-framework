/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
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
   * Divisibility of the mosaic to be displayed.
   *
   * @var {number}
   */
  inputDecimals: number;

  /**
   * Number of fractional digits to display the amount to.
   *
   * @var {number}
   */
  outputDecimals: number;

  /**
   * The optional {@link AssetPriceInformation} instance.
   * Contains this asset's price information.
   *
   * @var {AssetPriceInformation}
   */
  priceInformation?: AssetPriceInformation;
};

/**
 * @type AssetPriceInformation
 * @description This type defines an *asset*'s price in fiats / other currencies.
 * It contains information about the current price of the asset.
 * <br /><br />
 * This type serves internally.
 *
 * @since v0.1.0
 */
export type AssetPriceInformation = {
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
