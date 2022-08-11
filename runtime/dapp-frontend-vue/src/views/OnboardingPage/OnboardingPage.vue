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
  <div class="dapp-screen-onboarding">
    <Header :links="dummyLinks" />
    <Loader v-if="isLoading" />
    <DappQR v-else :qrCode="createLoginContract()" />
    <Footer :links="dummyLinks" />
  </div>
</template>

<script lang="ts" src="./OnboardingPage.ts"></script>
