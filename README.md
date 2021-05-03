# AdaKerja Challange - Messenger bot

## Pre-requisites

-   NodeJS 14
-   SQLite3
-   Facebook Page, Facebook Developer Account, Facebook App, ngrok

## Installation

-   clone the project.
-   create database at `/db/messages.db`.
-   run `npm install`.
-   open first terminal and run `npm run dev` to start dev server.
-   open second terminal run `./ngrok http <your port>` - change your port to your desire port.
-   setup [Facebook App](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup).
-   create `.env` file in your root folder.
    -   copy Facebook access token into `PAGE_ACCESS_TOKEN`.
    -   create var `VERIFY_TOKEN` and put any string you like there.
-   Test the bot in by sending message to your Facebook Page.

## Demo

Send Facebook message to [AdaKerja - Software company](https://www.facebook.com/AdaKerja-107353434841954)
![project demo in gif](https://github.com/padunk/adakerja-challenge-nodejs/blob/main/media/adaKerja.gif?raw=true)
