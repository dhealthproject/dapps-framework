/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth Contracts
 * @subpackage  API
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// parameters and configuration
import type { ContractParameters } from "@/types/ContractParameters";
import type { NetworkParameters } from "@/types/NetworkParameters";
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import type { TransactionParameters } from "@/types/TransactionParameters";
import type { Parameters } from "@/types/Parameters";

// base and factory
import { Contract } from "@/Contract";
import { Factory } from "@/Factory";

// utilities
import { Assertions } from "@/types/Assertions";
import { dHealthNetwork } from "@/types/dHealthNetwork";

// contracts and parameters
import { Auth, AuthParameters } from "@/contracts/Auth";
import { Earn, EarnParameters } from "@/contracts/Earn";
import { Referral, ReferralParameters } from "@/contracts/Referral";
import { Welcome, WelcomeParameters } from "@/contracts/Welcome";

// errors
import { InvalidArgumentError } from "@/errors/InvalidArgumentError";
import { InvalidContractError } from "@/errors/InvalidContractError";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { RuntimeError } from "@/errors/RuntimeError";
import { UnknownContractError } from "@/errors/UnknownContractError";

// export named modules as default
export {
  // generics
  Assertions,
  Contract,
  Factory,
  dHealthNetwork,

  // exported contracts
  Auth,
  Earn,
  Referral,
  Welcome,

  // exported errors
  InvalidArgumentError,
  InvalidContractError,
  MissingContractFieldError,
  RuntimeError,
  UnknownContractError,
};

// export *types* explicitly
export type {
  // generic interfaces
  ContractParameters,
  NetworkParameters,
  ObjectLiteral,
  TransactionParameters,
  Parameters,

  // per-contract parameters
  AuthParameters,
  EarnParameters,
  ReferralParameters,
  WelcomeParameters,
};
