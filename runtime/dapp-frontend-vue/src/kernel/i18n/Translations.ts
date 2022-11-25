/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { get } from "lodash";
// internal dependencies
import translationsEn from "../../../resources/i18n/index";

/**
 *
 */
export type TranslationDataset = {
  [lang: string]: Record<string, string | any>;
};

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
 * @param  {string}               language      The currently active language (defaults to "en").
 * @param  {TranslationDataset}   data          The translations dataset (translated keys).
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
   * The currently active language (defaults to "en").
   *
   * @var {string}
   */
  protected language: string;

  /**
   *
   */
  protected data: TranslationDataset = {
    en: translationsEn,
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
   * @param   {string}    language    The currently active language.
   * @returns {Translations}
   */
  public constructor(language = "en") {
    this.language = language;
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
   * <br /><br />
   * A warning will be issued on the console if a translation
   * key is untranslated and requested here.
   *
   * @access public
   * @returns {string}
   */
  public $t(
    translationKey: string,
    customLanguage?: string | undefined
  ): string {
    // determines which dataset must be used
    const language =
      !!customLanguage && customLanguage in this.data
        ? customLanguage
        : this.language;

    // finds translation key in dataset
    const translations = this.data[language];
    const fallbackI18n = this.data[Translations.defaultLanguage];
    const nestedTranslations = get(translations, translationKey);
    if (
      (translations !== undefined &&
        translationKey in translations &&
        translations[translationKey] !== null &&
        translations[translationKey] !== undefined) ||
      (nestedTranslations !== undefined && nestedTranslations !== null)
    ) {
      // returns translated
      return translations[translationKey]
        ? translations[translationKey]
        : get(translations, translationKey);
    }
    // or try to fallback to default language
    else if (
      fallbackI18n !== undefined &&
      translationKey in fallbackI18n &&
      fallbackI18n[translationKey] !== null &&
      fallbackI18n[translationKey] !== undefined
    ) {
      // returns translated using fallback
      return fallbackI18n[translationKey];
    }

    // warn about missing translation and returs *untranslated*
    console.warn(
      `[@dhealthdapps/frontend][i18n] Caution: Cannot find translation for key "${translationKey}" in language "${language}".`
    );
    return translationKey;
  }

  /**
   * Proxy method for {@link $t}.
   *
   * @see {Translations.$t}
   * @access public
   * @returns {string}
   */
  public translate(k: string, l: string | undefined): string {
    return this.$t(k, l);
  }

  /**
   * Proxy method for {@link $t}.
   *
   * @see {Translations.$t}
   * @access public
   * @returns {string}
   */
  public call(k: string, l: string | undefined): string {
    return this.$t(k, l);
  }
}
