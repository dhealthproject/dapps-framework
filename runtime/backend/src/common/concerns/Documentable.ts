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
import { Document } from "mongoose";

/**
 * @interface Documentable
 * @description This concern requires the presence of fields that
 * consist in delivering *documentable* information. This type of
 * information is persisted in MongoDB collection documents.
 * <br /><br />
 * e.g. alongside {@link StateSchema}, we define {@link StateDocument}
 * which is a mixin that comprises of {@link State} and this
 * `Documentable` class.
 *
 * @since v0.2.0
 */
export class Documentable extends Document {}
