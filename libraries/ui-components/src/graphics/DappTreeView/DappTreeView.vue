<template>
  <li class="dappTreeView-item">
    <div class="dappTreeView-non-overflown" @click="toggle">
      <span
        :class="{
          'dappTreeView-field-name': true,
          'dappTreeView-bold': isExpandable,
        }"
      >
        {{ isExpandable ? name : `${name}:` }}
      </span>
      <span v-if="!isExpandable" :title="formatItem">
        {{ formatItem }}
      </span>
      <span
        v-if="isExpandable"
        class="dappTreeView-field-name dappTreeView-bold"
        >[{{ isOpen ? "-" : "+" }}]</span
      >
    </div>
    <ul v-show="isOpen" v-if="isExpandable">
      <DappTreeView
        v-for="(key, index) in Object.keys(item)"
        :key="index"
        :item="item[key]"
        :name="key"
      />
    </ul>
  </li>
</template>

<script lang="ts" src="./DappTreeView.ts"></script>

<style lang="postcss" scoped>
@import "./DappTreeView.scss";
</style>
