<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

NOTE: The below `:class` assignations *must* explicitely list the class
names that are used for the button styles. It is not recommended to use
dynamic class names (e.g. `'text-' + $var`) because TailWind would not
be able to optimize the resulting CSS of these classes and would omit
including them in the compiled CSS that is attached with this library.
-->
<template>
  <img
    :src="src"
    :alt="alt"
    :class="{
      'style-small': size == 'small',
      'style-medium': size == 'medium',
      'style-large': size == 'large',
    }"
  />
</template>

<script lang="ts" src="./DappIcon.ts"></script>

<style scoped>
@import "./DappIcon.scss";
</style>
