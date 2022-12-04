/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";

// internal dependencies
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/concerns/Transferable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";
import { AssetDTO } from "./AssetDTO";

/**
 * @class Asset
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `assets` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo The {@link Asset} model does not need fields to be **public**.
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class Asset extends Transferable<AssetDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link AccountIntegrationDocument} or the model
   * {@link AccountIntegrationModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "assets";

  /**
   * This is the transaction hash that refers to a transaction which
   * included said asset(s) and transferred them over to the target
   * (destination) account.
   * <br /><br />
   * The destination address can be found in {@link userAddress}.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly transactionHash: string;

  /**
   * This is the user's address. The user corresponds to the
   * owner of said **assets**.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly userAddress: string;

  /**
   * This is the dHealth Network Mosaic ID that characterizes the assets
   * on the network and acts as an *identifier* for the asset. An asset
   * can always and *only* be obtained using a *transfer transaction* on
   * dHealth Network.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly mosaicId: string;

  /**
   * This is the **absolute** amount of assets that are transferred. An
   * amount is considered *absolute* when it is expressed in the *smallest*
   * possible unit of the asset.
   * <br /><br />
   * Note that *depending on the divisibility* of the dHealth Network Mosaic,
   * absolute amounts have to be *divided* correctly to represent relative
   * amounts, i.e. with a divisibility of 6, you should divide an absolute
   * amount by `1000000` to get its relative representation.
   * <br /><br />
   * Note that `Number.MAX_SAFE_INTEGER` takes a maximum value of:
   * `9007199254740991` and is thereby compatible with the maximum amount
   * that can be present in dHealth Network transfers: `8999999999999999`.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly amount: number;

  /**
   * The document's creation block number. This field **does** reflect the
   * time of creation of the assets in the end-user balance. You can use the
   * dHealth Network API to find out exact timestamp by block height.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public readonly creationBlock: number;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of creation of the
   * cached database entry.
   * <br /><br />
   * This field is added for consistency with the other database schema.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop({ index: true })
  public readonly createdAt?: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of update of the
   * cached database entry.
   * <br /><br />
   * This field is **optional** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  @Prop()
  public readonly updatedAt?: Date;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `operations`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, any> {
    const query: Record<string, any> = {};

    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    if (undefined !== this.userAddress) query["userAddress"] = this.userAddress;

    if (undefined !== this.mosaicId) query["mosaicId"] = this.mosaicId;

    return query;
  }

  /**
   * This *static* method populates a {@link AssetDTO} object from the
   * values of a {@link AssetDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {AssetDocument}   doc   The document as received from mongoose.
   * @param   {AssetDTO}        dto   The DTO object that will be populated with values.
   * @returns {AssetDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: AssetDocument, dto: AssetDTO): AssetDTO {
    dto.userAddress = doc.userAddress;
    dto.transactionHash = doc.transactionHash;
    dto.assetId = doc.mosaicId;
    dto.amount = doc.amount;
    dto.creationBlock = doc.creationBlock;
    return dto;
  }
}

/**
 * @type AssetDocument
 * @description This type is used to interface entities of the
 * `operations` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link AssetSchema}, we also define
 * `AssetDocument` which is a mixin that comprises of
 * {@link Asset} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type AssetDocument = Asset & Documentable;

/**
 * @class AssetModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `AssetModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Operation, AssetModel } from "./OperationSchema";
 *
 *   class MyOperationService {
 *     public constructor(
 *       @InjectModel(Operation.name) private readonly model: AssetModel
 *     )
 *
 *     public addEntry(data: Record<string, any>) {
 *       return this.model.create(data);
 *     }
 *   }
 * ```
 *
 * @since v0.3.0
 */
export class AssetModel extends Model<AssetDocument> {}

/**
 * @class AssetQuery
 * @description This class augments {@link Queryable} objects enabling
 * *operations* to be queried **by `userAddress`** and **by `transactionHash`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `assets` collection.
 *
 * @since v0.3.0
 */
export class AssetQuery extends Queryable<AssetDocument> {
  /**
   * Copy constructor for pageable queries in `operations` collection.
   *
   * @see Queryable
   * @param   {AssetDocument|undefined}   document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: AssetDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export AssetSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Asset} class and should be used mainly when
 * *inferring* the type of fields in a document for the corresponding
 * collection.
 *
 * @since v0.3.0
 */
export const AssetSchema = SchemaFactory.createForClass(Asset);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Operation} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
AssetSchema.loadClass(Asset, true);
