# Call contract function with command line

## Config environment

```
cp .keep.env .env
```

Fill your `public key` and `private key`, your account must be have some native token if your want to create transactions.

## Execute command

1. Make sure you are full fill all env variables.
2. Paste the ABI of the contract to `cmd/abi.json` file.
3. From the command line. Run the following command.

```

npm run cmd -- call -f approve -r <Function name> -r <Parameter 1> -r <Parameter 2>

Ex:
npm run cmd -- call -f name
npm run cmd -- call -f balances -r 0x78dB8E6ee5901218bD5CB919F21FDD8B9B158419
npm run cmd -- call -f approve -r 0x78dB8E6ee5901218bD5CB919F21FDD8B9B158419 -r 10000000

```

# Call contract function with UI

We implement following features:

1. Create, build and deploy contract to BSC testnet.
2. Call the contract function from the browser (We select the function and provide its parameters in the browser. Call it from the backend and return to the browser)

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
