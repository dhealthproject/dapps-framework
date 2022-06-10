<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
-->

<template>
  <div class="hello">
    <h1 class="text-4xl hover:text-blue-400">{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a href="https://docs.dhealth.com" target="_blank" rel="noopener"
        >dHealth Documentation</a
      >.
    </p>
    <h3>Essential Links</h3>
    <ul>
      <li>
        <a href="https://docs.dhealth.com" target="_blank" rel="noopener"
          >dHealth Documentation</a
        >
      </li>
    </ul>
    <!--
    <TokenAmount
      :value="1.234"
      :decimals="2"
      :currency="'DHP'"
      :fade-decimals="true"
    />
    -->
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
//import { TokenAmount } from "@dhealth/components";

// @Options({
//   // components: {
//   //   TokenAmount,
//   // },
//   props: {
//     msg: String,
//   },
// })

export default class HelloWorld extends Vue {
  @Prop() readonly msg!: string;
  // msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
