# Client overview

The client is the main part of the system.
It is divided into 4 pages: login, admin, presentation editor and active competitions (presentations).
The presentations is also further divided into four different views: operator view, audience view, team view and judge view.

## Competitions and Presentations

In this project competitions are often refered to when meaning un-active competitions while presentations are refered to when meaning active competitions involving multiple users and sockets connecting them.

## File structure

All of the source code for the pages in the system is stored in the `client/src/pages/` folder.
For each of the different parts there is a corresponding file that ends in Page, for example `JudgeViewPage.tsx` or `LoginPage.tsx`.
This is the main file for that page.
All of these pages also has their own and shared components, in the folder relative to the page `./components/`.
Every React component should also have their responding test file.

## Routes

All pages have their own route which is handled in `client/src/Main.tsx`. Futhermore the admin page has one route for each of the tabs which helps when reloading the site to select the previously selected tab. There is also a route for logging in with code which makes it possible to go to for example `localhost:3000/CODE123` to automatically join a competition with that code.

## Authentication

Authentication is managed by using JWT from the API. The JWT for logging in is stored in local storage under `token`. The JWT for active presentations are stored in local storage `RoleToken` so for example the token for Operator is stored in local storage under `OperatorToken`.

## Prettier and Eslint

[Eslint](https://eslint.org/) is used to set rules for syntax, [prettier](https://prettier.io/) is then used to enforce these rules when saving a file. Eslint is set to only warn about linting warnings. These libraries have their own config files which can be used to change their behavior: `client/.eslintrc` and `client/.prettierrc`

## Redux

[Redux](https://eslint.org/) is used for state management along with the [thunk](https://github.com/reduxjs/redux-thunk) middleware which helps with asynchronous actions. Action creators are under `client/src/actions.ts`, these dispatch actions to the reducers under `client/src/reducers.ts` that update the state. The interfaces for the states is saved in each reducer along with their initial state. When updating the state in the reducers the action payload is casted to the correct type to make the store correctly typed.

## Interfaces

In `client/src/interfaces` all interfaces that are shared in the client is located. `client/src/interfaces/ApiModels.ts` and `client/src/interfaces/ApiRichModels.ts` includes all models from the api and should always be updated when editing models on the back-end. This folder also includes some more specific interfaces that are re-used in the client.
