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
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Model } from "mongoose";

// internal dependencies
import { Transferable } from "../../common/concerns/Transferable";
import { UserNotificationDTO } from "./UserNotificationDTO";
import { Documentable } from "../../common/concerns/Documentable";
import { Queryable, QueryParameters } from "../../common/concerns/Queryable";

@Schema({
  timestamps: true,
})
export class Notification implements Transferable<UserNotificationDTO> {
  /**
   * This field contains the *mongo collection name* for entries
   * that are stored using {@link ActivityDocument} or the model
   * {@link ActivityModel}.
   * <br /><br />
   * Note that this field **is not** part of document properties
   * and used only internally to perform queries that refer to
   * an individual collection name, e.g. `$unionWith`.
   *
   * @access public
   * @var {string}
   */
  public collectionName = "notifications";

  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   * <br /><br />
   * This field is **required** and *indexed*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false, index: true })
  public readonly address: string;

  /**
   * Subject id field, represents identifier
   * of subject which was received. Can be asset.id or activity.id
   * If !subjectId -> notification is for general purpose e.g. Register, strava integration, etc.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false })
  public readonly subjectId: string;

  /**
   * Subject id field, represents identifier
   * of subject which was received. Can be asset.id or activity.id
   * If !subjectId -> notification is for general purpose e.g. Register, strava integration, etc.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly subjectType: "assets" | "activities" | "general";

  /**
   * Title of the notification which
   * describes notification in 2-3 words.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly title: string;

  /**
   * Description of the notification
   * which explains notification in details.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly description: string;

  /**
   * Short description of the notifications
   * which should be displayed in notifications *preview*.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly shortDescription: string;

  /**
   * Property which represents date when user got read notification.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: false })
  public readonly readAt?: string;

  /**
   * Property which represents date when notification has been created.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  @Prop({ required: true })
  public readonly createdAt: string;

  public static fillDTO(
    doc: UserNotificationDocument,
    dto: UserNotificationDTO,
  ): UserNotificationDTO {
    dto.address = doc.address;
    dto.subjectId = doc.subjectId;
    dto.subjectType = doc.subjectType;
    dto.title = doc.title;
    dto.description = doc.description;
    dto.shortDescription = doc.shortDescription;
    dto.readAt = doc.readAt;
    dto.createdAt = doc.createdAt;
    return dto;
  }
}

export type UserNotificationDocument = Notification & Documentable;

export class UserNotificationModel extends Model<Notification> {}

export class UserNotificationQuery extends Queryable<UserNotificationDocument> {
  /**
   * Copy constructor for pageable queries in `notifications` collection.
   *
   * @see Queryable
   * @param   {AccountIntegrationDocument|undefined}     document          The *document* instance (defaults to `undefined`) (optional).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters} (optional).
   */
  public constructor(
    document?: UserNotificationDocument,
    queryParams: QueryParameters = undefined,
  ) {
    super(document, queryParams);
  }
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(Notification);
