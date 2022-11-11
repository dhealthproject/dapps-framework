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
import { Crypto } from "@dhealth/sdk";

/**
 * @enum  CipherAlgorithm
 * @description This type enumerates the *compatible* and *supported*
 * encryption algorithms that can be used with the below service to
 * encrypt and decrypt data.
 *
 * @since v0.4.0
 */
export enum CipherAlgorithm {
  PBKDF2 = 0,
}

/**
 * @class CipherService
 * @description The main service for handling encryption and
 * decryption of data across the app modules.
 *
 * @since v0.4.0
 */
@Injectable()
export class CipherService {
  /**
   * Constructs an instance of the encryption service.
   *
   * @access public
   */
  constructor() {}

  /**
   * This method executes *encryption of data* using the **PBKDF2* encryption
   * algorithm as implemented in `crypto-js`. It uses an `256-bits` key size
   * and executes `1024` iterations to produce the key. Additionally, it uses
   * a *random salt* of `16 bytes`. The underlying encryption key is passed
   * on to the **AES algorithm** to perform encryption.
   * <br /><br />
   * The resulting *string* is a **ciphertext** that starts with the random
   * **salt** (16 bytes), is followed by the **input vector** (16 bytes) and
   * ends with the **encrypted data**, i.e. the starting `32-bytes` are used
   * to decrypt the encrypted message.
   *
   * @access public
   * @param     {string}    data        The data that must be encrypted.
   * @param     {string}    password    The password used to generate an encryption key (PBKDF2).
   * @returns   {string}    The encrypted ciphertext with the starting `32-bytes` that consist of the salt and IV.
   */
  public encrypt(data: string, password: string): string {
    if (undefined === data || undefined === password) {
      throw new Error(`Encryption data and password cannot be undefined.`);
    }

    return Crypto.encrypt(data, password);
  }

  /**
   * This method executes *decryption of data* using the **PBKDF2* encryption
   * algorithm as implemented in `crypto-js`.  It uses an `256-bits` key size
   * and executes `1024` iterations to produce the key. Additionally, it uses
   * a *random salt* of `16 bytes`. The underlying encryption key is passed
   * on to the **AES algorithm** to perform decryption.
   * <br /><br />
   * Note that this method accepts a **ciphertext** as produced by the above
   * {@link CipherService.encrypt} method, as such it expects a random
   * salt and IV to be prepended to the ciphertext.
   *
   * @access public
   * @param     {string}    ciphertext  The data that must be decrypted.
   * @param     {string}    password    The password used to generate the decryption key (PBKDF2).
   * @returns   {string}    The decrypted ciphertext with the starting `32-bytes` that consist of the salt and IV.
   */
  public decrypt(ciphertext: string, password: string): string {
    if (undefined === ciphertext || undefined === password) {
      throw new Error(`Ciphertext and password cannot be undefined.`);
    }

    return Crypto.decrypt(ciphertext, password);
  }
}
