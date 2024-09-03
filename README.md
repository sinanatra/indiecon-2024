Requirements
----------

+ [Node.js](https://nodejs.org/en/) and [yarn](https://yarnpkg.com/).


Run
-----

1. Install libraries with `yarn install`

1. Run locally with: `yarn dev -- --open`

1. Build it with: `yarn build`

1. You can preview the production build with `yarn preview`


Run Locally 
-----

0. Install [node](https://nodejs.org/en/download/package-manager)
0. Edit the .env file adding: `DB_URI=mongodb://localhost:27017
`
1. You don’t have brew? Find a way to install it, as well as python3
2. `brew tap mongodb/brew`
3. `brew install mongodb-community@7.0`
4. `brew services start mongodb-community@7.0`
5. Install the [mongodb app ](https://www.mongodb.com/products/tools/compass)
5. Download the questions and import them into the mongodb app. You can find them [here](https://gist.githubusercontent.com/sinanatra/0743c040d934caa132cf400168f4a486/raw/caf77aa4117ae2a19c9437315d412d2fb516e29b/indiecon.question.json)