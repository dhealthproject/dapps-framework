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
import type { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
import { Documentable } from "../../common/concerns/Documentable";
import { Transferable } from "../../common/concerns/Transferable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";
import { OperationDTO } from "../models/OperationDTO";

/**
 * @class Operation
 * @description This class defines the **exact** fields that are
 * stored in the corresponding MongoDB documents. It should be
 * used whenever database *documents* are being handled or read
 * for the `operations` collection.
 * <br /><br />
 * Note that this class uses the generic {@link Transferable} trait to
 * enable a `toDTO()` method on the model.
 *
 * @todo The {@link Operation} model does not need fields to be **public**.
 * @todo Timestamp fields should be **numbers** to avoid timezone issues.
 * @since v0.3.0
 */
@Schema({
  timestamps: true,
})
export class Operation extends Transferable<OperationDTO> {
  /**
   * This is the user's address. The user corresponds to the
   * issuer of said **operation** ("owner"). Note that this may
   * correspond to different fields inside a transaction, depending
   * on the operation type, i.e. for the `auth` contract, this field
   * shall contain the *signer address*; whereas for the `earn`
   * contract, this field shall contain the *recipient address*.
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public userAddress: string;

  /**
   * This is the transaction hash as defined by dHealth Network. It
   * contains an *immutable* sha3-256 hash created from the transaction
   * body.
   * <br /><br />
   * Due to the usage of sha3-256, this hash is **always** a **32 bytes**
   * transaction hash (64 characters in hexadecimal notation).
   *
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true, unique: true, type: String })
  public transactionHash: string;

  /**
   * This is the contract signature as presented inside a dHealth
   * Transfer Transaction.
   *
   * @example `"elevate:auth"`
   * @access public
   * @var {string}
   */
  @Prop({ required: true, index: true })
  public contractSignature: string;

  /**
   * This is the contract payload as presented inside a dHealth
   * Transfer Transaction. Typically, the contract payload is made
   * of the `contract` and `version` fields, adding to it the body
   * of the contract instance, i.e. the `Auth` contract would here
   * also include a `challenge` field.
   *
   * @example `{ contract: "elevate:auth", version: 1, challenge: "abcdef12" }`
   * @access public
   * @var {string}
   */
  @Prop({ required: true, type: Object })
  public contractPayload: ObjectLiteral;

  /**
   * The document's creation block number. This field **does** reflect the
   * time of creation of an operation. You can use the dHealth Network API
   * to find out exact timestamp by block height.
   *
   * @todo Note this is not protected for number overflows (but there is a long way until block numbers do overflow..)
   * @access public
   * @var {number}
   */
  @Prop()
  public creationBlock?: number;

  /**
   * The document's processing timestamp. This field **does not** reflect the
   * date of creation of an operation but rather the date of creation of the
   * cached database entry.
   *
   * @access public
   * @var {number}
   */
  @Prop({ index: true })
  public processedAt?: number;

  /**
   * The document's creation timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of creation of the
   * cached database entry.
   * <br /><br />
   * This field is added for consistency with the other database schema.
   *
   * @access public
   * @var {Date}
   */
  @Prop({ index: true })
  public createdAt: Date;

  /**
   * The document's update timestamp. This field **does not** reflect the
   * date of update of a transaction but rather the date of update of the
   * cached database entry.
   *
   * @access public
   * @var {Date}
   */
  @Prop()
  public updatedAt?: Date;

  /**
   * This method implements a specialized query format to query items
   * individually, as documents, in the collection: `operations`.
   *
   * @access public
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public get toQuery(): Record<string, any> {
    const query: Record<string, any> = {};

    if (undefined !== this.userAddress) query["userAddress"] = this.userAddress;

    if (undefined !== this.transactionHash)
      query["transactionHash"] = this.transactionHash;

    return query;
  }

  /**
   * This *static* method populates a {@link OperationDTO} object from the
   * values of a {@link OperationDocument} as presented by mongoose queries.
   *
   * @access public
   * @static
   * @param   {OperationDocument}   doc   The document as received from mongoose.
   * @param   {OperationDTO}        dto   The DTO object that will be populated with values.
   * @returns {OperationDTO}        The `dto` object with fields set.
   */
  public static fillDTO(
    doc: OperationDocument,
    dto: OperationDTO,
  ): OperationDTO {
    dto.userAddress = doc.userAddress;
    dto.transactionHash = doc.transactionHash;
    dto.contractSignature = doc.contractSignature;
    dto.creationBlock = doc.creationBlock;
    return dto;
  }
}

/**
 * @type OperationDocument
 * @description This type is used to interface entities of the
 * `operations` collection with *mongoose* and permits to
 * instanciate objects representing these entities.
 * <br /><br />
 * e.g. alongside {@link OperationSchema}, we also define
 * `OperationDocument` which is a mixin that comprises of
 * {@link Operation} and this `Documentable` class.
 * <br /><br />
 * In class {@link Queryable:COMMON}, the first generic accepted
 * permits to use *documents* that are typed with this, to filter
 * results in a documents query.
 *
 * @since v0.3.0
 */
export type OperationDocument = Operation & Documentable;

/**
 * @class OperationModel
 * @description This class defines the **model** or individual
 * **document** for one collection ("schema"). This class can
 * be *automatically* injected in services using the `@InjectModel`
 * decorator of `nestjs/mongoose`.
 * <br /><br />
 * @example Injecting and using the `OperationModel`
 * ```typescript
 *   import { InjectModel } from "@nestjs/mongoose";
 *   import { Operation, OperationModel } from "./OperationSchema";
 *
 *   class MyOperationService {
 *     public constructor(
 *       @InjectModel(Operation.name) private readonly model: OperationModel
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
export class OperationModel extends Model<OperationDocument> {}

/**
 * @class OperationQuery
 * @description This class augments {@link Queryable} objects enabling
 * *operations* to be queried **by `signerAddress`** and **by `transactionHash`.**
 * <br /><br />
 * The main purpose of this class shall be to perform queries against
 * the `operations` collection.
 *
 * @since v0.3.0
 */
export class OperationQuery extends Queryable<OperationDocument> {
  /**
   * Copy constructor for pageable queries in `operations` collection.
   *
   * @see Queryable
   * @param   {OperationDocument|undefined}   document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: OperationDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

/**
 * @export OperationSchema
 * @description This export creates a mongoose schema using the custom
 * {@link Operation} class and should be used mainly when
 * *inferring* the type of fields in a document for the corresponding
 * collection.
 *
 * @since v0.3.0
 */
export const OperationSchema = SchemaFactory.createForClass(Operation);

// This call to **loadClass** on the schema object enables instance
// methods on the {@link Operation} class to be called when the model gets
// instanciated by `mongoose` directly, e.g. as the result of a query.
OperationSchema.loadClass(Operation, true);
