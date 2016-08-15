# Hackathon2016
The DigiDeath project for Toronto Ethereum Hackathon 2016 


# Usage

Install dependencies


```
$ npm install
```

Compile contracts.

```
$ npm run build
```



Delete previous ethereum data directory and DAG file, and start
a new one connected to the testnet with 5 unlocked accounts.


```
$ geth/purge ethash
$ geth/start
```


A wallet creator should then open `dapp/creator/index.html` in chrome.
A wallet recoverer should then open `dapp/recoverer/index.html` in chrome.
