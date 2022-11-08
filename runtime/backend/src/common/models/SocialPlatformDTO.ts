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
import { ApiProperty } from "@nestjs/swagger";

// internal dependencies
import { BaseDTO } from "./BaseDTO";

/**
 * @class SocialPlatformDTO
 * @description A DTO class that consists of social platform information.
 * <br /><br />
 * This class is used to generate social platform links to resources like
 * the *sharer feature* or *like feature* of individual social platforms.
 *
 * @since v0.5.0
 */
export class SocialPlatformDTO extends BaseDTO {
  /**
   * The name of the social platform, e.g. \"facebook\" or \"twitter\".
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "facebook",
    description:
      'The name of the social platform, e.g. "facebook" or "twitter".',
  })
  public title?: string;

  /**
   * The URL used to *share content* on said social platform.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "https://example.com",
    description: "The URL used to *share content* on said social platform.",
  })
  public shareUrl: string;

  /**
   * The URL used to *share profiles* on said social platform.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "https://example.com/account1",
    description: "The URL used to *share profiles* on said social platform.",
  })
  public profileUrl?: string;

  /**
   * The URL used to *share the app* on said social platform. This
   * URL refers to the dApp's profile on the social platform.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "https://example.com",
    description:
      "The URL used to *share the app* on said social platform. This URL refers to the dApp's profile on the social platform.",
  })
  public appUrl?: string;
}
