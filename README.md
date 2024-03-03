## Config environment

```
cp .keep.env .env
```

Fill your `public key` and `private key`, your account must be have some BSC to create transactions.
Go to the [Deploy contract](#deploy-contract-to-bsc-testnet) section to get `contract address`.

## Compile contract

```
npm run compile
```

## Deploy contract to BSC Testnet

```
deploy:bsc_testnet
```

After deploy, the contract address will be show.

## Run the server

```
npm run start
```

The server running at `localhost:7777`. All the contract funtion will be show in UI.
