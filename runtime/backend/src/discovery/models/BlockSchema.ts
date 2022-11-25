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
import { BlockDTO } from "./BlockDTO";

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
 * @since v0.3.2
 */
@Schema({
  timestamps: true,
})
export class Block extends Transferable<BlockDTO> {
  /**
   * This is the block height that refers to the order in which
   * blocks were added to the network.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true, index: true })
  public readonly height: number;

  /**
   * This is the block's harvester address, corresponds to the
   * account that has *harvested* this block.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public readonly harvester: string;

  /**
   * This block's creation timestamp. This field reflects the
   * time of the creation of the block.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true })
  public readonly timestamp: number;

  /**
   * The total number of transactions included in this block.
   * <br /><br />
   * This field is **required** and *not indexed*.
   *
   * @access public
   * @readonly
   * @var {number}
   */
  @Prop({ required: true })
  public readonly countTransactions: number;

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
  public readonly createdAt: Date;

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
   * Constructor for `Block`.
   *
   * @param {number} height The height of this block.
   * @param {string} harvester The harvester wallet address.
   * @param {number} timestamp Timestamp of the block, in standard nano seconds.
   * @param {number} countTransactions The number of transactions included in this block.
   */
  constructor(
    height?: number,
    harvester?: string,
    timestamp?: number,
    countTransactions?: number,
  ) {
    super();
    this.height = height;
    this.harvester = harvester;
    this.timestamp = timestamp;
    this.countTransactions = countTransactions;
  }

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `operations`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, any> {
    const query: Record<string, any> = {};

    if (undefined !== this.height) query["height"] = this.height;

    if (undefined !== this.harvester) query["harvester"] = this.harvester;

    if (undefined !== this.timestamp) query["timestamp"] = this.timestamp;

    if (undefined !== this.countTransactions)
      query["countTransactions"] = this.countTransactions;

    return query;
  }

  /**
   * This *static* method populates a {@link BlockDTO} object from the
   * values of a {@link BlockDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {BlockDocument}   doc   The document as received from mongoose.
   * @param   {BlockDTO}        dto   The DTO object that will be populated with values.
   * @returns {BlockDTO}        The `dto` object with fields set.
   */
  public static fillDTO(doc: BlockDocument, dto: BlockDTO): BlockDTO {
    dto.height = doc.height;
    dto.harvester = doc.harvester;
    dto.timestamp = doc.timestamp;
    dto.countTransactions = doc.countTransactions;
    return dto;
  }
}

/**
 * @type BlockDocument
 * @description This type is used to interface entities of the
 * `operations` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link BlockSchema}, we also define
 * `BlockDocument` which is a mixin that comprises of
 * {@link Block} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.2
 */
export type BlockDocument = Block & Documentable;

/**
 * @class BlockModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `BlockModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Operation, BlockModel } from "./OperationSchema";
 *
 *   class MyOperationService {
 *     public constructor(
 *       @InjectModel(Operation.name) private readonly model: BlockModel
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
export class BlockModel extends Model<BlockDocument> {}

/**
 * @class BlockQuery
 * @description This class augments {@link Queryable} objects enabling
 * *operations* to be queried **by `height`** and **by `harvester`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `blocks` collection.
 *
 * @since v0.3.0
 */
export class BlockQuery extends Queryable<BlockDocument> {
  /**
   * Copy constructor for pageable queries in `operations` collection.
   *
   * @see Queryable
   * @param   {BlockDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}   queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: BlockDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export BlockSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Block} class and should be used mainly when
 * *inferring* the type of fields in a document for the corresponding
 * collection.
 *
 * @since v0.3.0
 */
export const BlockSchema = SchemaFactory.createForClass(Block);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Operation} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
BlockSchema.loadClass(Block, true);
