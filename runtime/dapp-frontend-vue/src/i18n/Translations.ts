/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import translationsEn from "../../resources/i18n/en.json";

/**
 * @class Translations
 * @description This class handles translation keys and
 * persistence of the currently active user language in
 * a browser environment. We highly recommend using the
 * snake_case format for translation keys to avoid keys
 * duplication and invalid keys content.
 * <br /><br />
 * You can augment and extend this class using protected
 * properties [as listed below](#properties).
 * <br /><br />
 * Warning: This class serves as a base for the translations
 * system as used in this software, modifying or extending
 * can potentially break your software. Please, always make
 * sure to check your translation files.
 * <br /><br />
 * @example Using the Translations class
 * ```typescript
 *   const i18n = new Translations();
 *   console.log(i18n.$t('translate_this_key'));
 *   console.log(i18n.translate('translate_this_key'));
 * ```
 *
 * <br /><br />
 * #### Properties
 *
 * @param  {WindowLocalStorage | Storage | any}     storageProvider           The storage provider used for persistence (defaults to window.localStorage).
 * @param  {string}                                 language                  The currently active language (defaults to "en").
 *
 * @since v0.1.0
 */
export class Translations {
  /**
   * The default language to use if none was persisted
   * by the user before (defaults to "en").
   *
   * @static
   * @var {string}
   */
  public static defaultLanguage = "en";

  /**
   * The default storage key as used by the persistence
   * layer to store the active language.
   *
   * @static
   * @var {string}
   */
  public static storageKey = "@dhealthdapps/frontend::language";

  /**
   * The storage provider used for persistence of the
   * active language (defaults to localStorage).
   *
   * You can also provider an arrow function which consists
   * in reading one value of your persistence layer. This
   * arrow function should return the current language value
   * using the [ISO-639-1:2002](https://wikipedia.org/wiki/ISO_639-1)
   * standard for language codes with 2 letter alphabet, e.g. "en".
   *
   * @var {WindowLocalStorage | Storage | ((key: string) => string)}
   */
  protected storageProvider:
    | WindowLocalStorage
    | Storage
    | ((key: string) => string);

  /**
   * The currently active language (defaults to "en").
   *
   * @var {string}
   */
  protected language: string;

  /**
   *
   */
  protected data = {
    "en-US": translationsEn,
  };

  /**
   * Constructs a translations module instance setting
   * the active language to the one as persisted using
   * the {@link storageProvider} property.
   *
   * Note that if you are using a forward predicate,
   * make sure to always return ISO-639-1:2002 compliant
   * language codes or the i18n features may break.
   *
   * @access public
   * @param   {string}                                                    storageKey    The storage key used for persistence.
   * @param   {WindowLocalStorage | Storage | ((key: string) => string)}  provider      The storage provider or arrow function.
   * @returns {Translations}
   */
  public constructor(
    storageKey: string = Translations.storageKey,
    provider:
      | WindowLocalStorage
      | Storage
      | ((key: string) => string) = localStorage
  ) {
    this.language = this.readFromStorage(storageKey);
    this.storageProvider = provider;
  }

  /**
   * Getter method for the active language. This method
   * uses the {@link storageProvider} to read the persisted
   * language, or falls back to using the default if none
   * was persisted before.
   *
   * @access public
   * @returns {Translations}
   */
  public getLanguage() {
    return this.language;
  }

  /**
   * Translation helper method for the active language. This
   * method uses the translations to find the corresponding
   * value for {@param translationKey}.
   *
   * @access public
   * @returns {Translations}
   */
  // public $t(
  //   translationKey: string,
  //   language?: string | undefined,
  // ): string {

  //   if (translationKey )

  //   if (
  //     language[key] !== null &&
  //     language[key] !== void 0
  //   )
  //     return language[key];
  //   else {
  //     console.warn("I18n: Cannot find name for '" + key + "' in language '" + language.langName + "'");
  //     return key;
  //   }
  // }

  /**
   * Helper method to read one value from the linked
   * {@link storageProvider} using either the `getItem`
   * method or calling the forward predicate if an arrow
   * function is passed to overwrite the persistence
   * for the active language definition.
   *
   * @access protected
   * @returns {Translations}
   */
  protected readFromStorage(storageKey: string): string {
    // by default, try using the localStorage flow
    if ("getItem" in this.storageProvider) {
      const fromStorage = this.storageProvider.getItem(storageKey);
      return !!fromStorage && fromStorage.length
        ? fromStorage
        : Translations.defaultLanguage;
    }

    // otherwise, try forwarding to the arrow function
    const fromPredicate = (
      this.storageProvider as (key: string) => string
    ).apply(this, [storageKey]);

    return !!fromPredicate && fromPredicate.length
      ? fromPredicate
      : Translations.defaultLanguage;
  }
}

// const languages = {
// 	'en': translationsEn,
// };

// const DEFAULT_LANGUAGE = 'en';

// const ;

// const setCurrentLanguage = (lang) => {
// 	if (lang != null && languages[lang] != null) {
// 		localStorage.setItem('userLanguage', lang);
// 		location.reload();
// 	}
// 	else throw Error("I18n: Cannot set language '" + lang + "'");
// };

// const getName = (language, key) => {

// };

// class I18n {
// 	constructor() {
// 		this.language = getUserLanguage();
// 		console.log('Language:', this.language.langName);
// 	}

// 	get languages() {
// 		return Object.keys(languages);
// 	}

// 	get currentLanguage() {
// 		return getUserLanguage();
// 	}
// 	setCurrentLanguage(lang) {
// 		return setCurrentLanguage(lang);
// 	}

// 	getName(key) {
// 		return getName(this.language, key);
// 	}
// }

// export default new I18n();
