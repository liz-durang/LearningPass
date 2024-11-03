# Learning Pass

<a name="readme-top"></a>


🗒️ A blockchain learning platform that boosts student engagement and rewards their efforts, democratizing education and decentralizing knowledge 

<div align="center">
  <a href="https://github.com/liz-durang/LearningPass/blob/main/packages/nextjs/public/LearningPass.jpg">
    <img src="/LearningPass.jpg">
  </a>


  <p align="center">

  [Hackathon Women Web3]([https://ethglobal.com/events/london2024/](https://dorahacks.io/hackathon/441/detail))

   <br />
    <a href="[https://github.com/EthPocketHQ/Pocket](https://www.canva.com/design/DAGVXEOJ04k/7rsqLpVYTujeQXPW5HqSVg/edit?utm_content=DAGVXEOJ04k&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)"><strong>Presentation»</strong></a>
    <br />
    <a href="https://github.com/liz-durang/LearningPass">View Demo</a>
  </p>
</div>

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`
