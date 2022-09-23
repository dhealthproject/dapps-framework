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
names that are used for the component styles. It is not recommended to use
dynamic class names (e.g. `'text-' + $var`) because TailWind would not
be able to optimize the resulting CSS of these classes and would omit
including them in the compiled CSS that is attached with this library.
-->
<template>
  <div
    :class="{
      'dappNavigation-base': true,
      'dappNavigation-style-primary': variant == 'primary',
      'dappNavigation-style-secondary': variant == 'secondary',
      'dappNavigation-style-tertiary': variant == 'tertiary',
    }"
  >
    <!-- Display a DappTitleBar always -->
    <DappTitleBar>
      <div slot="left" class="dappNavigation-start">
        <slot name="start" />
      </div>
      <div slot="center" class="dappNavigation-menuItems">
        <div
          v-for="n in Number(noOfMenuItems)"
          :key="'item_' + n"
          class="dappNavigation-menuItem"
        >
          <slot :name="`menuItem${n}`" />
        </div>
      </div>
      <div slot="center" class="dappNavigation-title">
        <DappTitle :text="title" />
      </div>
      <div slot="right" class="dappNavigation-end-lg">
        <slot name="end" />
      </div>
      <svg
        slot="right"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="dappNavigation-end"
        @click="drawerVisible = true"
      >
        <path
          d="M16 18V20H5V18H16ZM21 11V13H3V11H21ZM19 4V6H8V4H19Z"
          fill="#1D1843"
        />
      </svg>
    </DappTitleBar>
    <!--
        NOTE: Drawer element.
        This element will be displayed when screen size is medium or smaller (< 768px).
      -->
    <div
      class="right-drawer"
      :style="{
        width: drawerVisible ? '100%' : '0',
        paddingLeft: drawerVisible ? '10px' : '0',
      }"
    >
      <!-- drawer header -->
      <div class="drawer-header">
        <div style="text-align: right; margin: 5px">
          <button class="close" @click="drawerVisible = false">X</button>
        </div>
      </div>
      <!-- drawer content -->
      <div class="drawer-content">
        <div
          v-for="n in Number(noOfMenuItems)"
          :key="'item_' + n"
          class="dappNavigation-menuItem"
        >
          <slot :name="`menuItem${n}`" />
        </div>
        <slot name="end" />
      </div>
      <!-- drawer footer -->
      <div class="drawer-footer">
        <div class="power-div">
          <span class="power-span">Powered by</span>
          <svg
            width="23"
            height="26"
            viewBox="0 0 23 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5881 0.274284C10.2755 0.809513 8.54866 2.10214 7.27623 4.24306C6.87228 4.92977 4.29713 9.43377 4.00427 9.97909C3.95377 10.0902 3.71141 10.4941 3.48923 10.888C2.92371 11.8473 1.80276 13.8368 1.58059 14.2609C1.4897 14.4427 1.28773 14.9678 1.14635 15.4223C0.914077 16.1494 0.883781 16.4018 0.883781 17.8056C0.873682 19.2699 0.893879 19.4314 1.16654 20.2797C1.68157 21.845 2.65105 23.2689 3.86288 24.2182C4.18604 24.4707 4.4688 24.6726 4.4991 24.6726C4.53949 24.6726 4.74147 24.7837 4.96364 24.9251C5.18581 25.0665 5.79173 25.3291 6.30676 25.5007C7.17524 25.8037 7.32672 25.8239 8.64965 25.834C10.3159 25.834 10.8916 25.7027 12.3054 25.016C13.8 24.2788 14.8502 23.2083 15.9207 21.3401C16.1025 21.0371 16.5872 20.1787 17.0113 19.4415C17.4456 18.7043 17.7889 18.0782 17.7889 18.058C17.7889 18.0277 17.8899 17.8358 18.0212 17.6238C18.4352 16.9674 18.9705 16.0585 19.2734 15.4829C19.435 15.1799 19.637 14.8163 19.7178 14.675C20.0409 14.1599 21.1922 12.0796 21.4144 11.6151C21.9496 10.5143 22.1617 9.36308 22.1112 7.85838C22.0405 5.64677 21.2831 3.8997 19.7178 2.36471C18.8897 1.54671 17.8697 0.920599 16.6983 0.516653C15.9409 0.254087 15.6379 0.213692 14.5069 0.173298C13.6081 0.153101 13.0022 0.183397 12.5881 0.274284ZM15.7995 1.79918C17.0921 2.13244 18.5059 3.06151 19.2633 4.08148C19.9399 4.99036 20.1217 5.34381 20.4146 6.37387C20.9599 8.25222 20.7175 9.84781 19.5764 11.8978C19.2229 12.5341 18.4958 13.7964 18.4453 13.8469C18.4352 13.857 17.9202 13.5742 17.3042 13.2107C16.6882 12.8471 16.1631 12.5543 16.1429 12.5543C16.1227 12.5543 15.6985 12.3018 15.2037 11.9988C14.7088 11.6959 13.7394 11.1303 13.0426 10.7365C12.3458 10.3426 11.5581 9.87811 11.2753 9.70643C10.6997 9.35298 10.3058 9.31258 10.013 9.57515C9.7504 9.80742 9.7403 10.4436 9.99277 10.6557C10.0837 10.7365 11.1642 11.3828 12.3862 12.0998C17.8192 15.2708 17.6778 15.1799 17.6173 15.3617C17.5769 15.4526 17.4759 15.6444 17.385 15.7858C17.284 15.9272 16.8902 16.6038 16.5064 17.3006C16.1126 17.9974 15.6278 18.8558 15.4258 19.1992C15.2239 19.5526 15.0623 19.8657 15.0623 19.8859C15.0623 19.9061 14.9007 20.1686 14.7088 20.4716C14.517 20.7746 14.3554 21.0573 14.3554 21.0977C14.3554 21.1381 14.1736 21.4108 13.9413 21.7036C13.5071 22.2692 13.4465 22.2793 12.9416 21.946C12.5578 21.6834 10.5179 20.5019 9.55853 19.9869C9.44744 19.9263 9.24547 19.8051 9.10409 19.7142C7.68018 18.8053 5.57966 17.6743 5.33729 17.6743C4.96364 17.6743 4.63038 18.0176 4.63038 18.4014C4.63038 18.7952 4.75157 18.9366 5.54936 19.391C5.91291 19.6031 6.40775 19.8859 6.64002 20.0273C7.4883 20.5221 8.63955 21.1987 9.16468 21.4916C11.5682 22.8751 12.1236 23.2184 12.1337 23.3194C12.1337 23.481 10.8916 24.0263 10.1543 24.198C7.5085 24.7938 4.78186 23.6426 3.30746 21.3098C1.92394 19.1184 1.95424 16.4927 3.37815 14.1397C3.62052 13.7358 3.84269 13.3318 3.88308 13.2309C4.01436 12.8875 4.25673 12.9279 5.19591 13.4833C5.71094 13.7964 6.69051 14.372 7.38732 14.776C8.08412 15.1799 8.85162 15.6343 9.10409 15.7858C11.2753 17.0986 12.0933 17.5127 12.3761 17.442C12.8507 17.3208 13.0426 16.4826 12.6487 16.1696C12.4669 16.008 11.4268 15.392 8.59916 13.7661C5.59985 12.0392 4.87275 11.605 4.86265 11.5343C4.86265 11.4434 8.70014 4.74799 8.84152 4.59651C8.97281 4.45513 9.0031 4.47532 10.6896 5.50539C11.0329 5.71746 11.3359 5.88914 11.3561 5.88914C11.3864 5.88914 11.8105 6.13151 12.3054 6.43447C12.8002 6.72733 13.4061 7.08078 13.6485 7.22216C13.901 7.36354 14.517 7.717 15.0118 8.00986C16.6276 8.94903 16.769 9.01972 16.981 9.01972C17.2941 9.01972 17.6879 8.57538 17.6879 8.22193C17.6879 7.89877 17.4355 7.6564 16.6074 7.19186C16.3751 7.06058 15.7692 6.69703 15.2542 6.39407C14.7391 6.09111 14.1938 5.76795 14.0423 5.68716C13.8909 5.60637 13.4263 5.34381 13.0224 5.11154C10.6997 3.75832 10.0635 3.37457 10.0332 3.27359C9.95238 3.02112 11.6288 2.07185 12.6386 1.80928C13.3758 1.6174 15.0724 1.60731 15.7995 1.79918Z"
              fill="#150867"
            />
          </svg>
          <span class="dhealth-span">dHealth Network</span>
        </div>
        <div class="policy-div">
          <a href="https://www.dhealth.com">Privacy</a>
          <a href="https://www.dhealth.com">Terms of Service</a>
        </div>
      </div>
    </div>
    <!-- We will make the mask fill the screen while the menu is visible. Because its z-index is 1 less than that of the menu, the menu will still be displayed on top of it -->
    <div
      class="drawer-mask"
      :style="{
        width: drawerVisible ? '100vw' : '0',
        opacity: drawerVisible ? '0.6' : '0',
      }"
      @click="drawerVisible = false"
    ></div>
    <!-- End drawer. -->
  </div>
</template>

<script lang="ts" src="./DappNavigation.ts"></script>

<style lang="postcss" scoped>
@import "./DappNavigation.scss";
</style>
