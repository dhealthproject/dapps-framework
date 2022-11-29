# Build and deploy dApps with dHealth Network

## Table of Contents

1. [Build server](#build-server-setup)  
1.1. [Create a new release](#create-a-new-release)  
1.2. [Deploy latest documentation](#deploy-latest-documentation)  
2. [Production server](#production-server-setup)  
2.1. [Server setup](#server-setup)  
2.1.1. [Verify server setup](#verify-server-setup)  
2.2. [SSL certificates](#ssl-certificates)  
2.3. [Nginx configuration](#nginx-configuration)  
3. [Network governance](#network-governance-setup)  
3.1. [Create maintenance accounts](#create-maintenance-accounts)  
3.1.1. [Manager accounts](#manager-accounts)  
3.1.2. [dApp Main Account](#dapp-main-account)  
3.1.3. [dApp Authentication Authority](#dapp-authentication-authority)  
3.1.4. [dApp Earn Authority](#dapp-earn-authority)  
3.2. [Initial funding](#initial-funding)  
3.4. [Accounts metadata](#accounts-metadata)  
3.5. [Create custom dApp tokens](#create-custom-dapp-tokens)  
3.5.1. [FIT token](#fit-token)  
3.5.2. [BOOST5 token](#boost5-token)  
3.5.3. [BOOST10 token](#boost10-token)  
3.5.4. [BOOST15 token](#boost15-token)  
3.5.5. [PROGRESS1 token](#progress1-token)  
3.6. [Verify network governance](#verify-network-governance)  
3.6.1. [Information about maintenance accounts](#information-about-maintenance-accounts)  
3.6.2. [Information about custom tokens](#information-about-custom-tokens)  
4. [Project configuration](#project-configuration)  
4.1. [Clone the project source code](#clone-the-project-source-code)  
4.2. [Setup data provider OAuth](#setup-data-provider-oauth)  
4.3. [Update environment configuration](#update-environment-configuration)  
4.3.1. [General configuration](#general-configuration)  
4.3.2. [Security configuration](#security-configuration)  
4.3.3. [Accounts configuration](#accounts-configuration)  
4.3.4. [Assets configuration](#assets-configuration)  
4.3.5. [Data provider configuration](#data-provider-configuration)  
4.3.6. [Optional monitoring configuration](#optional-monitoring-configuration)  
4.3.7. [Optional mailer configuration](#optional-mailer-configuration)  
4.4. [Verify project configuration](#verify-project-configuration)  
5. [Project deployment](#project-deployment)
5.1. [Start the backend runtime](#start-the-backend-runtime)
5.2. [Start the frontend runtime](#start-the-frontend-runtime)
6. [A thousand lines in the future](#a-thousand-lines-in-the-future)

## Build server setup

### Create a new release

with dapps-framework cloned at `/opt/dhealth/dapps-framework`
with current "package.json" version at `0.5.1`
the following will create/tag/deploy `0.5.2`

- code, commit, merge
- **release**
  - `lerna publish patch --dist-tag next|latest`
  - "patch" in the above command could be `minor` or `major`

### Deploy latest documentation

- `cd ..` (docs live outside of deployment)
- `git clone -b gh-pages git@github.com:dhealthproject/dapps-framework.git docs.dapps-framework/`
- `cd docs.dapps-framework/`
- `git checkout -b main origin/main`
- `lerna bootstrap`
- `lerna run docs --stream --scope @dhealth/contracts`
- `lerna run docs --stream --scope @dhealth/components`
- `lerna run docs --stream --scope @dhealthdapps/backend`
- `lerna run docs --stream --scope @dhealthdapps/frontend`
- `git checkout gh-pages`
- `git add docs/`
- `git commit -m "[framework] docs: add reference documentation for v0.5.2"`

## Production server setup

### Server setup

- install `dockerd` and `docker-compose`
  - `mkdir -p ~/.docker/cli-plugins/`
  - `curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose`
  - `chmod +x ~/.docker/cli-plugins/docker-compose`
- install `nvm`
  - `curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash`
  - `source ~/.bashrc`
- install **Node v16**
  - `nvm install v16`
  - `nvm use v16`
- install **Lerna v4**
  - `npm install -g lerna@4.0.0`
- install **Symbol CLI**
  - `npm install -g symbol-cli`
- install `nginx`
  - `sudo apt install nginx`
- install **Let's Encrypt** `certbot`
  - `sudo apt install certbot`
  - `sudo apt install python3-certbot-nginx`

#### Verify server setup

- `docker run hello-world | grep "Hello from Docker!"`
  - should print a *red* message with `Hello from Docker!`, if it prints anything
    else, you have to make your user part of the `docker` group and reboot/login again
- `node -v`
  - should print: `v16.18.1` (or later release of 16.x)
- `symbol-cli -v`
  - should print: `Symbol CLI v1.0.1` alongside usage information
- `sudo certbot --version`
  - should print `certbot 0.40.0` (or later release of 0.40.x)

### SSL certificates

- create a new certificate for *both* backend and frontend
  - **CAUTION**: replace the value for `-d` to contain the correct domain name
  - `sudo certbot run --nginx -m domains@dhealth.foundation -d elevate.dhealth.com`
  - after agreeing to terms and *not* accepting SPAM you should see:
```
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for elevate.dhealth.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/default
```
  - **Configure automatic HTTPS redirects** (Option 2).
  - after a *successful* execution, you should see:
```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/elevate.dhealth.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/elevate.dhealth.com/privkey.pem
```
  - Note the path to the certificate: `/etc/letsencrypt/live/elevate.dhealth.com/privkey.pem`

### Nginx configuration

Use the following **nginx** virtual host configuration to host both the backend
runtime and the frontend runtime on different ports at the same domain name.

Put the following content in the file `/etc/nginx/sites-enabled/default`:

```bash
# ELEVATE BACKEND
# server configuration for https://elevate.dhealth.com:7903
server {
    listen [::]:7904 ssl ipv6only=on;
    listen 7904 ssl;
    server_name elevate.dhealth.com;

    access_log              /var/log/nginx/elevate.dhealth.com-access.log;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/elevate.dhealth.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elevate.dhealth.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Redirect to docker image
    location / {
        proxy_set_header    Host $host;
        proxy_set_header    X-Real-IP $remote_addr;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;

        proxy_pass          http://localhost:7903;
        proxy_read_timeout  90;
        proxy_redirect      http://localhost:7903 https://elevate.dhealth.com:7903;
    }
}

# ELEVATE FRONTEND
# server configuration for https://elevate.dhealth.com
server {
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    server_name elevate.dhealth.com;

    access_log              /var/log/nginx/elevate.dhealth.com-access.log;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/elevate.dhealth.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elevate.dhealth.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Serve production build
    charset utf-8;
    root /opt/dhealth/ELEVATE/runtime/dapp-frontend-vue/dist;
    index index.html;

    # Always serve index.html
    location / {
        root /opt/dhealth/ELEVATE/runtime/dapp-frontend-vue/dist;
        try_files $uri /index.html;
    }
}

# automatic HTTP:HTTPS redirection
server {
    if ($host = elevate.dhealth.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80 ;
        listen [::]:80 ;
    server_name elevate.dhealth.com;
    return 404; # managed by Certbot
}
```

After this, save the file and restart the nginx server with:

```bash
sudo service nginx restart
```

## Network governance setup

### Create maintenance accounts

- in cases where maintenance accounts already exist use `symbol-cli` to *import* them
  using the correct mnemonic passphrase or private keys
- the following series of commands assumes that accounts must be imported using their
  respective *private keys*. A `--mnemonic` option can be used to specify the mnemonic
  and a `--path-number` option can be used to specify the derivation path
  - The default derivation path is used given no path: `m/44'/4343'/0'/0'/0'`

#### Manager accounts

**CAUTION**: We refer the the **manager account** as an account that **owns DHP**. This
account must be handled *with care* and it is recommended to use *multi-signature* features
to secure this account.

```bash
symbol-cli profile import \
  --profile "elevate.manager"  \
  --url "http://dual-02.dhealth.cloud:3000" \
  --network "MAIN_NET" \
  --generation-hash "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16" \
  --epoch-adjustment "1616978397" \
  --namespace-id "dhealth.dhp" \
  --divisibility "6" \
  --private-key "INSERT_PRIVATE_KEY_MANAGER_HERE"

✔ Do you want to set the account as the default profile? … no
✔ Enter your wallet password: …
```

**NOTE**: The first production environment of ELEVATE uses the `NDEVUP` account that
is owned by dHealth Foundation Developers and we do not use multi-signature in the 
setup process as to facilitate the maintenance and simplify the deployment processes.
The account has the following address: **`NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I`**.

**CAUTION**: Following the above note, please make sure to setup multi-signature for
the created accounts *after* you executed the setup process.

#### dApp Main Account

```bash
symbol-cli profile import \
  --profile "elevate.main"  \
  --url "http://dual-02.dhealth.cloud:3000" \
  --network "MAIN_NET" \
  --generation-hash "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16" \
  --epoch-adjustment "1616978397" \
  --namespace-id "dhealth.dhp" \
  --divisibility "6" \
  --private-key "INSERT_PRIVATE_KEY_MAIN_HERE"

✔ Do you want to set the account as the default profile? … no
✔ Enter your wallet password: …
```

**NOTE**: The first production environment of ELEVATE uses the `NDAPPXC` account that
is owned by dHealth Foundation Developers and we do not use multi-signature in the 
setup process as to facilitate the maintenance and simplify the deployment processes.
The account has the following address: **`NDAPPXCXL7OGYGZNQ24OK3DQQI3BNBHJADZDB4I`**.

**CAUTION**: Following the above note, please make sure to setup multi-signature for
the created accounts *after* you executed the setup process.

#### dApp Authentication Authority

```bash
symbol-cli profile import \
  --profile "elevate.auth0"  \
  --url "http://dual-02.dhealth.cloud:3000" \
  --network "MAIN_NET" \
  --generation-hash "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16" \
  --epoch-adjustment "1616978397" \
  --namespace-id "dhealth.dhp" \
  --divisibility "6" \
  --private-key "INSERT_PRIVATE_KEY_AUTH_HERE"

✔ Do you want to set the account as the default profile? … no
✔ Enter your wallet password: …
```

**NOTE**: The first production environment of ELEVATE uses the `NDAPPAA` account that
is owned by dHealth Foundation Developers and we do not use multi-signature in the 
setup process as to facilitate the maintenance and simplify the deployment processes.
The account has the following address: **`NDAPPAA43ZHNCFSGTGXATGCTASEY3YNOUEGRAXY`**.

**CAUTION**: Following the above note, please make sure to setup multi-signature for
the created accounts *after* you executed the setup process.

#### dApp Earn Authority

```bash
symbol-cli profile import \
  --profile "elevate.earn0"  \
  --url "http://dual-02.dhealth.cloud:3000" \
  --network "MAIN_NET" \
  --generation-hash "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16" \
  --epoch-adjustment "1616978397" \
  --namespace-id "dhealth.dhp" \
  --divisibility "6" \
  --private-key "INSERT_PRIVATE_KEY_EARN_HERE"

✔ Do you want to set the account as the default profile? … no
✔ Enter your wallet password: …
```

**NOTE**: The first production environment of ELEVATE uses the `NDAPPTO` account that
is owned by dHealth Foundation Developers and we do not use multi-signature in the 
setup process as to facilitate the maintenance and simplify the deployment processes.
The account has the following address: **`NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA`**.

**CAUTION**: Following the above note, please make sure to setup multi-signature for
the created accounts *after* you executed the setup process.

### Initial funding

- as a preparation step for the creation of custom tokens, you must send some `DHP`
  to the above created account. An amount of `100 DHP` is enough to cover for all
  the transactions created using this document.
  - Note that an amount of `100 DHP` equals to an *absolute* amount of `100000000`
    because of the divisibility of `DHP` that equals `6`.
- we use the **manager account** to send tokens to the contract accounts that will
  create transactions.
  - Note that you must replace the address with the correct `elevate.earn0` address.

```bash
symbol-cli transaction transfer \
  --profile "elevate.manager" \
  --mode "normal" \
  --max-fee 3500 \
  --recipient-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --message '{"contract": "dapp:config", "version": 1, "action": "funding", "asset": "39E0C49FA322A459"}' \
  --mosaics 39E0C49FA322A459::100000000
```

### Accounts metadata

- we also add metadata the dApp accounts that we created such that accounts are
  easily identifiable on the network and to remove confusions about using multiple
  accounts for different operations within a dApp runtime.

**NOTE**: We use a metadata scoped key of `8B5DD479E6AB718A` which equals to a key
name of **`NAME`** which can be displayed on client applications alongside other
account information such as the address and owned mosaics.

```bash
symbol-cli transaction accountmetadata \
  --profile "elevate.main" \
  --mode "normal" \
  --max-fee 0 \
  --target-address "NDAPPXCXL7OGYGZNQ24OK3DQQI3BNBHJADZDB4I" \
  --key "8B5DD479E6AB718A" \
  --value "ELEVATE Contract"
```

```bash
symbol-cli transaction accountmetadata \
  --profile "elevate.auth0" \
  --mode "normal" \
  --max-fee 0 \
  --target-address "NDAPPAA43ZHNCFSGTGXATGCTASEY3YNOUEGRAXY" \
  --key "8B5DD479E6AB718A" \
  --value "ELEVATE Authentication Contract"
```

```bash
symbol-cli transaction accountmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 0 \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "ELEVATE Earn Contract"
```

### Create custom dApp tokens

#### FIT token

The `FIT` token is a *transferable*, *supply mutable* and *restrictable* token issued
on dHealth network by the **EARN** contract (`--profile "elevate.earn0"`).

**CAUTION**: We use a **divisibility of 2** for the `FIT` token. If you want to use a
different divisibility (up to 6), please update the `--amount` argument accordingly.

**CAUTION**: The following command issues an initial supply of `1'000'000` tokens, or
*1 million tokens*. An aggregate complete transaction is created which hold both the
`MosaicDefinition` and `MosaicSupplyChange` transaction for dHealth Network Mosaics.

```bash
symbol-cli transaction mosaic \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --transferable \
  --supply-mutable \
  --restrictable \
  --non-expiring \
  --divisibility 2 \
  --amount 100000000
```

**NOTE**. The above command will display information about the **Mosaic ID**. Please
take note of this value as it will be required in the following command. The mosaic
identifier that was returned at the time of writing is: **`09DC02CE4DC5E140`**.

```bash
symbol-cli transaction mosaicmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --mosaic-id "09DC02CE4DC5E140" \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "FIT"
```

##### Verify `FIT` token using dHealth Network Explorer

**NOTE** The `FIT` token now created on dHealth Network, you can check the information
related to the token (such as the current supply), with the following link:

http://explorer.dhealth.com/mosaics/09DC02CE4DC5E140

#### BOOST5 token

The `BOOST5` token is a *non-transferable*, *supply mutable* and *non-restrictable* token issued
on dHealth network by the **EARN** contract (`--profile "elevate.earn0"`).

**CAUTION**: We use a **divisibility of 0** for the `BOOST5` token. If you want to use a
different divisibility (up to 6), please update the `--amount` argument accordingly.

**CAUTION**: The following command issues an initial supply of `1'000'000` tokens, or
*1 million tokens*. An aggregate complete transaction is created which hold both the
`MosaicDefinition` and `MosaicSupplyChange` transaction for dHealth Network Mosaics.

```bash
symbol-cli transaction mosaic \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --supply-mutable \
  --non-expiring \
  --divisibility 0 \
  --amount 1000000

✔ Enter your wallet password: … 
✔ Do you want this mosaic to be transferable? … no
? Do you want this mosaic to be restrictable? … no
```

**NOTE**. The above command will display information about the **Mosaic ID**. Please
take note of this value as it will be required in the following command. The mosaic
identifier that was returned at the time of writing is: **`45FB07FC71CF9228`**.

```bash
symbol-cli transaction mosaicmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --mosaic-id "45FB07FC71CF9228" \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "BOOST 5%"
```

##### Verify `BOOST5` token using dHealth Network Explorer

**NOTE** The `BOOST5` token now created on dHealth Network, you can check the information
related to the token (such as the current supply), with the following link:

http://explorer.dhealth.com/mosaics/45FB07FC71CF9228

#### BOOST10 token

The `BOOST10` token is a *non-transferable*, *supply mutable* and *non-restrictable* token issued
on dHealth network by the **EARN** contract (`--profile "elevate.earn0"`).

**CAUTION**: We use a **divisibility of 0** for the `BOOST10` token. If you want to use a
different divisibility (up to 6), please update the `--amount` argument accordingly.

**CAUTION**: The following command issues an initial supply of `1'000'000` tokens, or
*1 million tokens*. An aggregate complete transaction is created which hold both the
`MosaicDefinition` and `MosaicSupplyChange` transaction for dHealth Network Mosaics.

```bash
symbol-cli transaction mosaic \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --supply-mutable \
  --non-expiring \
  --divisibility 0 \
  --amount 1000000

✔ Enter your wallet password: … 
✔ Do you want this mosaic to be transferable? … no
? Do you want this mosaic to be restrictable? … no
```

**NOTE**. The above command will display information about the **Mosaic ID**. Please
take note of this value as it will be required in the following command. The mosaic
identifier that was returned at the time of writing is: **`13DAA8FA72F70CA3`**.

```bash
symbol-cli transaction mosaicmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --mosaic-id "13DAA8FA72F70CA3" \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "BOOST 10%"
```

##### Verify `BOOST10` token using dHealth Network Explorer

**NOTE** The `BOOST10` token now created on dHealth Network, you can check the information
related to the token (such as the current supply), with the following link:

http://explorer.dhealth.com/mosaics/13DAA8FA72F70CA3

#### BOOST15 token

The `BOOST15` token is a *non-transferable*, *supply mutable* and *non-restrictable* token issued
on dHealth network by the **EARN** contract (`--profile "elevate.earn0"`).

**CAUTION**: We use a **divisibility of 0** for the `BOOST15` token. If you want to use a
different divisibility (up to 6), please update the `--amount` argument accordingly.

**CAUTION**: The following command issues an initial supply of `1'000'000` tokens, or
*1 million tokens*. An aggregate complete transaction is created which hold both the
`MosaicDefinition` and `MosaicSupplyChange` transaction for dHealth Network Mosaics.

```bash
symbol-cli transaction mosaic \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --supply-mutable \
  --non-expiring \
  --divisibility 0 \
  --amount 1000000

✔ Enter your wallet password: … 
✔ Do you want this mosaic to be transferable? … no
? Do you want this mosaic to be restrictable? … no
```

**NOTE**. The above command will display information about the **Mosaic ID**. Please
take note of this value as it will be required in the following command. The mosaic
identifier that was returned at the time of writing is: **`4F4616FDD7292C50`**.

```bash
symbol-cli transaction mosaicmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --mosaic-id "4F4616FDD7292C50" \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "BOOST 15%"
```

##### Verify `BOOST15` token using dHealth Network Explorer

**NOTE** The `BOOST15` token now created on dHealth Network, you can check the information
related to the token (such as the current supply), with the following link:

http://explorer.dhealth.com/mosaics/4F4616FDD7292C50

#### PROGRESS1 token

The `PROGRESS1` token is a *non-transferable*, *supply mutable* and *non-restrictable* token issued
on dHealth network by the **EARN** contract (`--profile "elevate.earn0"`).

**CAUTION**: We use a **divisibility of 0** for the `PROGRESS1` token. If you want to use a
different divisibility (up to 6), please update the `--amount` argument accordingly.

**CAUTION**: The following command issues an initial supply of `1'000'000` tokens, or
*1 million tokens*. An aggregate complete transaction is created which hold both the
`MosaicDefinition` and `MosaicSupplyChange` transaction for dHealth Network Mosaics.

```bash
symbol-cli transaction mosaic \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --supply-mutable \
  --non-expiring \
  --divisibility 0 \
  --amount 1000000

✔ Enter your wallet password: … 
✔ Do you want this mosaic to be transferable? … no
? Do you want this mosaic to be restrictable? … no
```

**NOTE**. The above command will display information about the **Mosaic ID**. Please
take note of this value as it will be required in the following command. The mosaic
identifier that was returned at the time of writing is: **`10A55E48C2CFF79D`**.

```bash
symbol-cli transaction mosaicmetadata \
  --profile "elevate.earn0" \
  --mode "normal" \
  --max-fee 3500 \
  --mosaic-id "10A55E48C2CFF79D" \
  --target-address "NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA" \
  --key "8B5DD479E6AB718A" \
  --value "PROGRESS 1km"
```

##### Verify `PROGRESS1` token using dHealth Network Explorer

**NOTE** The `PROGRESS1` token now created on dHealth Network, you can check the information
related to the token (such as the current supply), with the following link:

http://explorer.dhealth.com/mosaics/10A55E48C2CFF79D

### Verify network governance

#### Information about maintenance accounts

| Name | Address |
| --- | --- |
| `elevate.manager` | [`NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I`](http://explorer.dhealth.com/accounts/NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I) |
| `elevate.main` | [`NDAPPXCXL7OGYGZNQ24OK3DQQI3BNBHJADZDB4I`](http://explorer.dhealth.com/accounts/NDAPPXCXL7OGYGZNQ24OK3DQQI3BNBHJADZDB4I) |
| `elevate.auth0` | [`NDAPPAA43ZHNCFSGTGXATGCTASEY3YNOUEGRAXY`](http://explorer.dhealth.com/accounts/NDAPPAA43ZHNCFSGTGXATGCTASEY3YNOUEGRAXY) |
| `elevate.earn0` | [`NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA`](http://explorer.dhealth.com/accounts/NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA) |

#### Information about custom tokens

| Token | Link | Divisibility | Transferable |
| --- | --- | --- | --- |
| `FIT` | [`09DC02CE4DC5E140`](http://explorer.dhealth.com/mosaics/09DC02CE4DC5E140) | `6` | :white_check_mark: |
| `BOOST5` | [`45FB07FC71CF9228`](http://explorer.dhealth.com/mosaics/45FB07FC71CF9228) | `0` | :x: |
| `BOOST10` | [`13DAA8FA72F70CA3`](http://explorer.dhealth.com/mosaics/13DAA8FA72F70CA3) | `0` | :x: |
| `BOOST15` | [`4F4616FDD7292C50`](http://explorer.dhealth.com/mosaics/4F4616FDD7292C50) | `0` | :x: |
| `PROGRESS1` | [`10A55E48C2CFF79D`](http://explorer.dhealth.com/mosaics/10A55E48C2CFF79D) | `0` | :x: |

## Project configuration

### Clone the project source code

**CAUTION**: The following commands assume that you created a version and tag named `v0.5.2`,
this tag is usually pushed to the dApp repository, in this example `dhealthproject/ELEVATE`.

- clone the version tag `v0.5.2` inside `/opt/dhealth/ELEVATE`
  - `mkdir -p /opt/dhealth/ELEVATE`
  - `git clone -b v0.5.2 --depth 1 git@github.com:dhealthproject/ELEVATE.git /opt/dhealth/ELEVATE/`
  - `cd /opt/dhealth/ELEVATE`
  - `git switch -c v0.5.2`

#### Install software dependencies

**NOTE**: We recommend to use `lerna` over `npm` to obtain better results. Use the following
command to install all software dependencies necessary to run the dapps-framework runtimes:

```bash
lerna bootstrap
```

### Setup data provider OAuth

**CAUTION**: Please, use a team-owned/shared account to register to Strava such that the OAuth
integration can be maintained by others on the team as well. It is important to note that the
integration process is split amongst several tasks as listed below.

#### Strava

- register a new account at Strava.com with e-mail `dapps@dhealth.foundation`
  - first name: `dHealth`
  - last name: `ELEVATE`
- go to your Strava.com `Settings` and look out for `My API Application`
  - Note that strava generates API keys *once a day* which means you have to wait
    a couple hours after registering the account before it can be used in API.
- https://www.strava.com/settings/api
  - Name: `dHealth ELEVATE`
  - Website: https://elevate.dhealth.com
  - Authorization Callback Domain: elevate.dhealth.com

**CAUTION**: Backup the following data related to the API Application you just
created on Strava.com:

- Client ID: **97774**
- Client Secret: `Your strava client secret`
- also, please generate a new and random 64-characters **verification token**.

We refer to the above values later in this document, respectively as:

- `STRAVA_CLIENT_ID`: Refers to your API Application Client ID.
- `STRAVA_CLIENT_SECRET`: Refers to your API Application Client Secret.
- `STRAVA_VERIFY_TOKEN`: Refers to your randomly generated verification token.

**NOTE**: The strava OAuth integration is not complete. A call to `/push_subscriptions`
will be necessary in a later step *when the backend runtime is running*. Please, make
backups of the above OAuth API details and handle these values carefully.

### Update environment configuration

**CAUTION**: Please do not forget *any* of the below configuration updates. It is recommended
to update these fields *one by one* such as to avoid mistakes in configuring your dApp.

- browse over to the deployment directory: `cd /opt/dhealth/ELEVATE`
- copy the `.env-sample` to `.env` for the production environment
  - `cp .env-sample .env`
  - `cp runtime/dapp-frontend-vue/.env-sample runtime/dapp-frontend-vue/.env`
- open the `.env` file, e.g. `vim .env`
- edit *each* of the following fields to contain the value *exactly* as displayed:
  - note that *passwords* and *secrets* or *private key* must be edited by yourself.

#### General configuration

**CAUTION**: **Configuration fields that are not listed below must remain unchanged in .env**.

```bash
#########################################
# BACKEND GENERAL CONFIGURATION
#########################################
DB_PASS="Add a very strong password for your mongo database here"
DB_NAME="db_elevate"

BACKEND_URL=https://elevate.dhealth.com:7903
BACKEND_DOMAIN=elevate.dhealth.com
FRONTEND_PORT=7903
BACKEND_USE_HTTPS="true"

FRONTEND_URL=https://elevate.dhealth.com
FRONTEND_DOMAIN=elevate.dhealth.com
FRONTEND_PORT=80
FRONTEND_USE_HTTPS="true"
```

#### Security configuration

**CAUTION**: **Configuration fields that are not listed below must remain unchanged in .env**.

**NOTE**: The field `SECURITY_AUTH_REGISTRIES_ADDRESS_1` uses the `elevate.auth0` account
address on dHealth Network. Please change if you are using different accounts.

```bash
#########################################
# SECURITY CONFIGURATION
#########################################
SECURITY_AUTH_TOKEN_SECRET="Add a long authentication secret for OAuth here"
SECURITY_AUTH_REGISTRIES_ADDRESS_1="NDAPPAA43ZHNCFSGTGXATGCTASEY3YNOUEGRAXY"
```

#### Accounts configuration

**CAUTION**: **Configuration fields that are not listed below must remain unchanged in .env**.

**NOTE**: The field `MAIN_ADDRESS` uses the `elevate.main` account address on dHealth
Network. Please change if you are using different accounts.

```bash
#########################################
# ACCOUNTS CONFIGURATION
# dHealth Network governance
#########################################
MAIN_PUBLIC_KEY="8890216D7B082E154318EDD0395555A9236EC59CB17AD2E73D19ABD7567012F6"
MAIN_ADDRESS="NDAPPXCXL7OGYGZNQ24OK3DQQI3BNBHJADZDB4I"

# CAUTION!
PAYOUT_GLOBAL_DRY_RUN="false"
PAYOUT_CONTRACT_ADDRESS="NDAPPTOZOIWBVJL5OVQF52EG63CQJQBBMKSTQSA"
PAYOUT_CONTRACT_PUBLIC_KEY="9E05CDCD7C9CB5109C7FFF9E5719F6DC896C78E60FB3F70FBBE7B3A202CB6436"
PAYOUT_ISSUER_PRIVATE_KEY="Add the private key of account elevate.earn0 here"
```

**CAUTION**: The above configures a *signer account* and **turns off dry-run mode** for
payouts. Please, make sure that the payout accounts are correctly configured to execute
payouts on dHealth Network.

#### Assets configuration

**CAUTION**: **Configuration fields that are not listed below must remain unchanged in .env**.

**NOTE**: Note that we use the custom token identifiers as created before. Please, refer
to the section [Information about custom tokens](#information-about-custom-tokens) for more details.

```bash
#########################################
# ASSETS CONFIGURATION
# dHealth Network tokenomics
#########################################
ASSETS_EARN_IDENTIFIER="09DC02CE4DC5E140"
ASSETS_EARN_DIVISIBILITY=2
ASSETS_EARN_SYMBOL="FIT"

ASSETS_BOOST5_IDENTIFIER="45FB07FC71CF9228"
ASSETS_BOOST5_DIVISIBILITY=0
ASSETS_BOOST5_SYMBOL="BOOST"

ASSETS_BOOST10_IDENTIFIER="13DAA8FA72F70CA3"
ASSETS_BOOST10_DIVISIBILITY=0
ASSETS_BOOST10_SYMBOL="BOOST"

ASSETS_BOOST15_IDENTIFIER="4F4616FDD7292C50"
ASSETS_BOOST15_DIVISIBILITY=0
ASSETS_BOOST15_SYMBOL="BOOST"

ASSETS_PROGRESS1_IDENTIFIER="10A55E48C2CFF79D"
ASSETS_PROGRESS1_DIVISIBILITY=0
ASSETS_PROGRESS1_SYMBOL="PROGRESS"
```

**CAUTION**: The above configures *assets* that must exist on dHealth Network. The above
configuration values should be taken from the earlier section: [Information about custom tokens](#information-about-custom-tokens).

#### Data provider configuration

**CAUTION**: **Configuration fields that are not listed below must remain unchanged in .env**.

**NOTE**: Make sure to use the values you created/received from Strava.com in the earlier section
named [Setup data provider OAuth](#setup-data-provider-oauth). The verification token can be *any*
string of minimum 8 characters and will be attached with *every* request from Strava.com to your
backend runtime.

```bash
#########################################
# OAUTH DATA PROVIDERS
#########################################
STRAVA_CLIENT_ID="97774"
STRAVA_CLIENT_SECRET="Your strava client secret"
STRAVA_VERIFY_TOKEN="Your strava verification token"
```

#### Optional monitoring configuration

Following configuration fields are optional and can be left with default values given
no specific use case for monitoring.

```bash
#########################################
# MONITORING CONFIGURATION
#########################################
LOGS_DIRECTORY_PATH=/logs
MONITORING_ENABLE_ALERTS="true"
MONITORING_ENABLE_REPORTS="true"
MONITORING_ALERTS_MAIL="dev-alerts@dhealth.foundation"
MONITORING_REPORTS_MAIL="dev-reports@dhealth.foundation"
```

#### Optional mailer configuration

Following configuration fields are optional and can be left with default values given
no specific use case for e-mail alerts and reports.

**NOTE**: We recommend using [sendinblue.com](https://sendinblue.com) because report
e-mails contain *attachments* and many APIs require paid accounts to allow this.

```bash
#########################################
# MAILER CONFIGURATION
# Sendinblue is recommended
#########################################
ENABLE_MAILER="true"
SMTP_HOST="smtp-relay.sendinblue.com"
SMTP_PORT=587
SMTP_USER="Your sendinblue username"
SMTP_PASSWORD="Your sendinblue API key"
SMTP_FROM="ELEVATE Mailer <elevate@dhealth.com>"
```

#### Frontend environment configuration

Edit the file at `runtime/dapp-frontend-vue/.env` so that it contains the following
configuration values:

```bash
VUE_APP_BACKEND_URL=https://elevate.dhealth.com:7904
VUE_APP_FRONTEND_URL=https://elevate.dhealth.com
VUE_APP_FRONTEND_DOMAIN=elevate.dhealth.com
VUE_APP_FRONTEND_PORT=80
```

### Verify project configuration

As for a final verification process of the project configuration, we recommend using
the bundled unit tests. Use the following commands to run the unit test suites bundled
with the dapps-framework:

```bash
# run the backend unit tests
lerna run test --stream --scope @dhealthdapps/backend
```

If everything is successfully configured, you should see a success message printed on
the terminal as the unit test suites complete their execution. The following message
will be printed when completion was successful: `lerna success - @dhealthdapps/backend`


Next, please execute the *frontend runtime* unit test suites:

```bash
# run the backend unit tests
lerna run test --stream --scope @dhealthdapps/frontend
```

If everything is successfully configured, you should see a success message printed on
the terminal as the unit test suites complete their execution. The following message
will be printed when completion was successful: `lerna success - @dhealthdapps/frontend`

## Project deployment

### Start the backend runtime

**CAUTION**: The following command **starts** the **backend runtime** in background
mode. Please, make sure that you have followed the above configuration processes and
that you successfully executed **unit test suites before you proceed**.

```bash
docker-compose up --build backend -d
```

### Start the frontend runtime

**NOTE**: The following command **creates a production build** of the **frontend runtime**
which can be hosted using any web server. Please, make sure that you have followed the above
configuration processes and that you successfully executed **unit test suites before you proceed**.

```bash
lerna run build --stream --scope @dhealthdapps/frontend
```

**CAUTION**: Preparing the above build will effectively *enable* the frontend runtime to
be accessed using the domain name configured during the [Nginx configuration](#nginx-configuration).

### Activate data provider webhooks

After a successful setup of both *backend runtime* and *frontend runtime*, we
can now proceed with **activating a webhooks subscription** for selected data
providers, i.e. *Strava*.

**NOTE**: Earlier in this document, we mentioned that the OAuth configuration
was not complete yet, and that a call to `/push_subscription` will be necessary
to finalize the integration. We will now prepare this call to the Strava API.

- Retrieve a **valid access token from Strava**
  - Go to `Settings`, then `My API Application`
  - Click **Show** for the field `Your Access Token`
    - This shows you an access token that should be valid in next 6 hours.
  - Copy the **access token**

#### Enable webhooks subscription 

- Open **Postman** with the ELEVATE request collection.
  - Under `ELEVATE > PROD` you can see `[CAUTION] SUBSCRIPTION STRAVA`.
  - Edit this request such that under `Authorization` it contains the correct
    *access token from Strava*.
  - Also edit this request's `Params` such that it uses the correct values for
    `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` and such that it also uses the
    correct *backend runtime* URL, in our case of ELEVATE, the `callback_url`
    parameter takes a value of: `https://elevate.dhealth.com:7904/webhook/strava`.

**CAUTION**: This command must *imperatively* be **executed only once** as it
will create a *webhooks subscription* in Strava and we only need *exactly one*
of these.

- **Send** the subscription request and Strava shall return a **subscription id**:

```json
{
  "id": 230540
}
```

## A thousand lines in the future

**Great! You have successfully configured your own dApp on dHealth Network.**
*Now, go ahead an verify that everything is up as it should*. You can use the
following commands to find out about the health of your running *backend* and
*frontend* runtimes:

- Status of the API: https://elevate.dhealth.com:7904/hello
- API Documentation: https://elevate.dhealth.com:7904/api
- dApp Config State: https://elevate.dhealth.com:7904/config
- dApp Frontend URL: https://elevate.dhealth.com

by dHealth Foundation and Team.