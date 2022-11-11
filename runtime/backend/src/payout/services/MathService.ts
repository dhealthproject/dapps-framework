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
import { Injectable } from "@nestjs/common";

/**
 * @class MathService
 * @description The main service for handling certain mathematical
 * operations such as generating a random number, etc.
 *
 * @since v0.4.0
 */
@Injectable()
export class MathService {
  /**
   * The random number generator. By default, uses
   * Math.random.
   * @var {any|callable}
   */
  protected static RNG = Math.random;

  /**
   * Constructs an instance of the math service.
   *
   * @access public
   */
  constructor() {}

  /**
   * This method can be used to generate random numbers
   * for which the deviation from the mean value is given.
   * <br /><br />
   * The skew-normal distribution implementation  which
   * uses the {@link random} method to get the pair  of
   * random variates then calculates a coefficient  and
   * produces a skew-normal variate using the deviation
   * and skewness as described in the linked article.
   *
   * @link https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
   * @param   {number}  mean        The location or "mean" value.
   * @param   {number}  deviation   The standard deviation.
   * @param   {number}  skewness    The skewness, if 0 uses only deviation.
   * @returns {number}
   */
  public skewNormal(mean: number, deviation: number, skewness = 0): number {
    const [u0, v] = this.getRandomVariates();
    if (skewness === 0) {
      return mean + deviation * u0;
    }
    const coeff = skewness / Math.sqrt(1 + skewness * skewness);
    const u1 = coeff * u0 + Math.sqrt(1 - coeff * coeff) * v;
    const z = u0 >= 0 ? u1 : -u1;
    return mean + deviation * z;
  }

  /**
   * This method uses a Box-Muller transform to produce
   * two independent normal variates that will be  used
   * to get the skew-normal variate.
   *
   * @link https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
   * @returns   {number[]}
   */
  protected getRandomVariates(): number[] {
    let u1 = 0,
      u2 = 0;
    while (u1 === 0) u1 = MathService.RNG();
    while (u2 === 0) u2 = MathService.RNG();
    const mag = Math.sqrt(-2.0 * Math.log(u1));
    const dir = 2.0 * Math.PI * u2;
    return [mag * Math.cos(dir), mag * Math.sin(dir)];
  }
}
