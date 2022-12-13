/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// -------
// CAUTION
// -------
// You should only import this file given a *fully configured*
// application is necessary for your tests. This file is needed
// only for end-to-end tests that assert the app configuration.

// This file contains **mocks** of the *configuration*
// for the backend runtime. Note that updates to fields
// in the configuration files MUST also update this file.

// #############################
// .env-sample / .env
// #############################
// overwrites mocked environment variables
process.env.ANOTHER_DB_NAME_THROUGH_ENV = "this-exists-only-in-mock";
process.env.DB_USER = "fake-user";
process.env.DB_PASS = "fake-pass";
process.env.DB_HOST = "localhost";
process.env.DB_PORT = "1234";
process.env.DB_NAME = "fake-db-name";
process.env.BACKEND_URL="http://fake.example.com:4321";
process.env.BACKEND_DOMAIN="fake.example.com";
process.env.BACKEND_PORT="4321";
process.env.BACKEND_USE_HTTPS="false";
process.env.FRONTEND_URL="http://fake.example.com";
process.env.FRONTEND_DOMAIN="fake.example.com";
process.env.FRONTEND_PORT="80";
process.env.FRONTEND_USE_HTTPS="false";
process.env.SECURITY_AUTH_TOKEN_SECRET="fake-auth-token";
process.env.SECURITY_AUTH_REGISTRIES_ADDRESS_1="NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY";
process.env.MAIN_PUBLIC_KEY="71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"; // NDAPPH6
process.env.MAIN_ADDRESS="NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY";
process.env.PAYOUT_GLOBAL_DRY_RUN="true";
process.env.PAYOUT_CONTRACT_ADDRESS="NCNQMX5JEENRMIGNFJC3UGHDUO3HAYQZK7ZIJUA";
process.env.PAYOUT_CONTRACT_PUBLIC_KEY="5CDA593C442F4DD827C1C7B15CE83FF8892D769F2DB130EBEB1D7DB080333C4D";
process.env.PAYOUT_ISSUER_PRIVATE_KEY="fake-issuer-private-key";
process.env.ASSETS_EARN_IDENTIFIER="4ADBC6CEF9393B90";
process.env.ASSETS_EARN_DIVISIBILITY="2";
process.env.ASSETS_EARN_SYMBOL="FIT";
process.env.ASSETS_BOOST5_IDENTIFIER="55E3CA759248A895";
process.env.ASSETS_BOOST5_DIVISIBILITY="0";
process.env.ASSETS_BOOST5_SYMBOL="BOOST";
process.env.ASSETS_BOOST10_IDENTIFIER="2CAA578DEE9043C4";
process.env.ASSETS_BOOST10_DIVISIBILITY="0";
process.env.ASSETS_BOOST10_SYMBOL="BOOST";
process.env.ASSETS_BOOST15_IDENTIFIER="002CE74736C839FE";
process.env.ASSETS_BOOST15_DIVISIBILITY="0";
process.env.ASSETS_BOOST15_SYMBOL="BOOST";
process.env.ASSETS_PROGRESS1_IDENTIFIER="55E3CA759248A895";
process.env.ASSETS_PROGRESS1_DIVISIBILITY="0";
process.env.ASSETS_PROGRESS1_SYMBOL="PROGRESS";
process.env.LOGS_DIRECTORY_PATH = "/logs";
process.env.MONITORING_ENABLE_ALERTS="false";
process.env.MONITORING_ENABLE_REPORTS="false";
process.env.MONITORING_ALERTS_MAIL="dev-alerts@dhealth.foundation";
process.env.MONITORING_REPORTS_MAIL="dev-reports@dhealth.foundation";
process.env.STRAVA_CLIENT_ID="12345";
process.env.STRAVA_CLIENT_SECRET="ThisIsObviouslyNotCorrect";
process.env.STRAVA_VERIFY_TOKEN="AndThisShouldNotBeYourVerifyToken";
process.env.ENABLE_MAILER="false";
process.env.SMTP_HOST="fake.smtp.server";
process.env.SMTP_PORT="587";
process.env.SMTP_USER="fakeMailerUser";
process.env.SMTP_PASSWORD="fakePassword";
process.env.FROM="Fake Mailer <mailer@dhealth.foundation>";

// #############################
// config/dapp.ts
// #############################
export const mockDappConfigLoaderCall = jest.fn().mockReturnValue({
  dappName: "FAKEDAPP",
  dappPublicKey: process.env.MAIN_PUBLIC_KEY,
  scopes: [
    "database",
    "discovery",
    "payout",
    "processor",
    "notifier",
    "statistics",
    "oauth",
    "users",
  ],
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
  },
  frontendApp: {
    url: process.env.FRONTEND_URL,
    host: process.env.FRONTEND_DOMAIN,
    port: process.env.FRONTEND_PORT,
    https: process.env.FRONTEND_USE_HTTPS === "true"
  },
  backendApp: {
    url: process.env.BACKEND_URL,
    host: process.env.BACKEND_DOMAIN,
    port: process.env.BACKEND_PORT,
    https: process.env.BACKEND_USE_HTTPS === "true"
  },
  discovery: {
    sources: [
      process.env.MAIN_ADDRESS,
      process.env.PAYOUT_CONTRACT_ADDRESS,
      process.env.SECURITY_AUTH_REGISTRIES_ADDRESS_1,
    ],
  }
})
jest.mock("../../config/dapp", () => mockDappConfigLoaderCall);

// #############################
// config/assets.ts
// #############################
export const mockAssetsConfigLoaderCall = jest.fn().mockReturnValue({
  assets: {
    base: {
      mosaicId: "39E0C49FA322A459",
      namespaceId: "9D8930CDBB417337",
      divisibility: 6,
      symbol: "DHP"
    },
    earn: {
      mosaicId: process.env.ASSETS_EARN_IDENTIFIER,
      divisibility: parseInt(process.env.ASSETS_EARN_DIVISIBILITY),
      symbol: process.env.ASSETS_EARN_SYMBOL
    }
  },
  boosters: {
    referral: {
      boost5: {
        mosaicId: process.env.ASSETS_BOOST5_IDENTIFIER,
        divisibility: parseInt(process.env.ASSETS_BOOST5_DIVISIBILITY),
        symbol: process.env.ASSETS_BOOST5_SYMBOL
      },
      boost10: {
        mosaicId: process.env.ASSETS_BOOST10_IDENTIFIER,
        divisibility: parseInt(process.env.ASSETS_BOOST10_DIVISIBILITY),
        symbol: process.env.ASSETS_BOOST10_SYMBOL
      },
      boost15: {
        mosaicId: process.env.ASSETS_BOOST15_IDENTIFIER,
        divisibility: parseInt(process.env.ASSETS_BOOST15_DIVISIBILITY),
        symbol: process.env.ASSETS_BOOST15_SYMBOL
      },
    },
    progress: {
      progress1: {
        mosaicId: process.env.ASSETS_PROGRESS1_IDENTIFIER,
        divisibility: parseInt(process.env.ASSETS_PROGRESS1_DIVISIBILITY),
        symbol: process.env.ASSETS_PROGRESS1_SYMBOL
      },
    }
  },
});
jest.mock("../../config/assets", () => mockAssetsConfigLoaderCall);

// #############################
// config/monitoring.ts
// #############################
export const mockMonitoringConfigLoaderCall = jest.fn().mockReturnValue({
  storage: [
    { type: "console", level: "debug" },
    { type: "filesystem", level: "info" },
  ],
  logLevels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  logDirectoryPath: "./logs/",
  logMaxFileSize: 1000,
  enableAlerts: true,
  alerts: {
    type: ["warn", "error"],
    transport: "mail",
    recipient: "recipient@example.com",
  },
  enableReports: true,
  reports: {
    type: ["warn", "error"],
    transport: "mail",
    period: "W",
    recipient: "recipient@example.com",
  },
});
jest.mock("../../config/monitoring", () => mockMonitoringConfigLoaderCall);

// #############################
// config/network.ts
// #############################
export const mockNetworkConfigLoaderCall = jest.fn().mockReturnValue({
  defaultNode: {
    url: "http://dual-02.dhealth.cloud:3000",
    publicKey: "613010BCE1FBF3CE1503DEF3003C76E451EA4DD9205FAD3530BFF7B1D78BC989"
  },
  apiNodes: [
    { "url": "http://dual-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-02.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-03.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-02.dhealth.cloud:3000", "port": 3000 }
  ],
  networkApi: "http://peers.dhealth.cloud:7903",
  network: {
    namespaceName: "dhealth.dhp",
    mosaicId: "39E0C49FA322A459",
    namespaceId: "9D8930CDBB417337",
    divisibility: 6,
    networkIdentifier: 104,
    epochAdjustment: 1616978397,
    generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
  }
});
jest.mock("../../config/network", () => mockNetworkConfigLoaderCall);

// #############################
// config/oauth.ts
// #############################
export const mockOauthConfigLoaderCall = jest.fn().mockReturnValue({
  providers: {
    strava: {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      verify_token: process.env.STRAVA_VERIFY_TOKEN,
      scope: "activity:read_all",
      api_url: "https://www.strava.com/api/v3",
      oauth_url: "https://www.strava.com/api/v3/oauth/authorize",
      token_url: "https://www.strava.com/api/v3/oauth/token",
      callback_url: `${process.env.FRONTEND_URL}/dashboard`,
      subscribe_url: `${process.env.BACKEND_URL}/webhook/strava`,
      webhook_url: `${process.env.BACKEND_URL}/webhook/strava`,
    }
  }
});
jest.mock("../../config/oauth", () => mockOauthConfigLoaderCall);

// #############################
// config/payout.ts
// #############################
export const mockPayoutConfigLoaderCall = jest.fn().mockReturnValue({
  globalDryRun: process.env.PAYOUT_GLOBAL_DRY_RUN === "true",
  payouts: {
    issuerPrivateKey: process.env.PAYOUT_ISSUER_PRIVATE_KEY,
    signerPublicKey: process.env.PAYOUT_CONTRACT_PUBLIC_KEY,
    enableBatches: false,
    batchSize: 100,
  }
});
jest.mock("../../config/payout", () => mockPayoutConfigLoaderCall);

// #############################
// config/processor.ts
// #############################
export const mockProcessorConfigLoaderCall = jest.fn().mockReturnValue({
  contracts: [
    "fakedapp:auth",
    "fakedapp:earn",
    "fakedapp:referral",
    "fakedapp:welcome",
  ],
  operations: [
    {
      contract: "fakedapp:auth",
      label: "Session|Sessions",
      query: {
        sourceAddress: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
        transactionMode: "incoming",
      }
    },
    {
      contract: "fakedapp:earn",
      label: "Activity|Activities",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "fakedapp:referral",
      label: "Referral|Referrals",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "fakedapp:welcome",
      label: "Greeting|Greetings",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
  ],
});
jest.mock("../../config/processor", () => mockProcessorConfigLoaderCall);

// #############################
// config/security.ts
// #############################
export const mockSecurityConfigLoaderCall = jest.fn().mockReturnValue({
  auth: {
    registries: [
      process.env.SECURITY_AUTH_REGISTRIES_ADDRESS_1,
    ],
    secret: process.env.SECURITY_AUTH_TOKEN_SECRET,
    challengeSize: 8,
  },
  cors: {
    origin: process.env.FRONTEND_URL,
  }
});
jest.mock("../../config/security", () => mockSecurityConfigLoaderCall);

// #############################
// config/social.ts
// #############################
export const mockSocialConfigLoaderCall = jest.fn().mockReturnValue({
  socialApps: {
    "whatsapp": {
      icon: "share/whatsapp.svg",
      title: "WhatsApp",
      shareUrl: `whatsapp://send?text=${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "facebook": {
      icon: "share/facebook.svg",
      title: "Facebook",
      appUrl: "https://www.facebook.com/ELEVATE",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=#${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "twitter": {
      icon: "share/twitter.svg",
      title: "Twitter",
      shareUrl: `http://twitter.com/share?text=Join me on Elevate&url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%&hashtags=fitness,sports`,
    },
    "linkedin": {
      icon: "share/linkedin.svg",
      title: "LinkedIn",
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%`,
    },
    "discord": {
      icon: "share/discord.svg",
      title: "Discord",
      shareUrl: "",
    },
    "telegram": {
      icon: "share/telegram.svg",
      title: "Telegram",
      shareUrl: `https://telegram.me/share/url?url=${process.env.FRONTEND_URL}/%REFERRAL_CODE%&text=Join me on Elevate`,
    }
  },
});
jest.mock("../../config/social", () => mockSocialConfigLoaderCall);

// #############################
// config/statistics.ts
// #############################
export const mockStatisticsConfigLoaderCall = jest.fn().mockReturnValue({
  statistics: {
    leaderboards: {
      daily_score: {
        type: "D",
        collection: "activities",
        fields: ["activityAssets.amount"],
      },
      weekly_score: {
        type: "W",
        collection: "activities",
        fields: ["activityAssets.amount"],
      },
      monthly_score: {
        type: "M",
        collection: "activities",
        fields: ["activityAssets.amount"],
      },
    }
  }
});
jest.mock("../../config/statistics", () => mockStatisticsConfigLoaderCall);

// #############################
// config/transport.ts
// #############################
export const mockTransportConfigLoaderCall = jest.fn().mockReturnValue({
  enableMailer: process.env.ENABLE_MAILER === "true",
  mailer: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },
});
jest.mock("../../config/transport", () => mockTransportConfigLoaderCall);
