/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
* @interface Module
* @description This interface represents individual dynamic
* modules as loaded by the frontend. Per each module we then
* define page details, components and state discoveries that
* are specific to a module.
* <br /><br />
* Typically, module configuration files will have either of a
* `.json` or `.jsonc` extension, depending on whether you like
* to document/comment module definition files or not.
* <br /><br />
* @example Using the Module interface
* ```typescript
*   const config = require("./module.json");
*
*   // using the interface directly
*   const module1 = config as Module;
*
*   // or using a module factory
*   const module2 = createModule(config);
* ```
*
* <br /><br />
* #### Properties
*
* @param  {string}            identifier           The module identifier, this is a kebab-case formatted name, e.g. "game-leaderboard".
* @param  {Map<string, Schema>}      pageSchemas          The page schema(s) that are built to present the module at a end-user level, i.e. {@link PageSchema}.
* @param  {}
*
* @since v0.1.0
*/
export interface Module {
}
