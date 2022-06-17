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
  <div class="onboarding">
    <Header :links="dummyLinks" />
    <DappQR :qrCode="getQR.createExportTransaction(createLoginContract())" />
    <Footer :links="dummyLinks" />
  </div>
</template>

<script lang="ts" src="./OnboardingPage.ts"></script>
