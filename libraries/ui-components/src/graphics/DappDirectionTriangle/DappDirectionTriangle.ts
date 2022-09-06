/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Component, Prop, Vue } from "vue-property-decorator";

// internal dependencies
import type { Variant } from "@/types/Variant";
import type { DirectionTriangle } from "@/types/DirectionTriangle";

/**
 * @class DappDirectionTriangle
 * @description This component displays one or two triangle icon
 * in either or both `up` or `down` directions and uses the standard `<div>` tag.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappIcon component with variant and direction
 * variants and directions that are available with the components library
 * can take up values as defined in {@link Variant} and {@link DirectionTriangle}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappDirectionTriangle
 *      variant="primary"
 *      direction="up"
 *    />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 * @param  {Variant}              variant     The optional design variant (defaults to `"primary"`).
 * @param  {DirectionTriangle}    alt         The optional {@link DirectionTriangle} instance which defines direction & hence color of triangle(s).
 */
@Component({})
export default class DappDirectionTriangle extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The optional {@link DirectionTriangle} instance which
   * defines direction & hence color of triangle(s).
   *
   * @access protected
   * @var {DirectionTriangle}
   */
  @Prop()
  protected direction?: DirectionTriangle;
}
