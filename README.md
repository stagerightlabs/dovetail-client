# Dovetail Server

Dovetail is an open source platform for laboratory notebooks, similar to E-LabFTW.  This repository contains the frontend client, a Vue/Typescript single page application.

## Local Development

Install the dependencies

```
npm install
```

Adjust your local configuration

```
cp .env.local.example .env.local
```

Make sure to update your `.env.local` file with the URL of your local Dovetail Server instance.

Launch the development server

```
npm run serve
```

## Run the tests
```
npm run test
```
