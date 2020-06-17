# Serverless React Graphql

## This README could use some love, if you try following these steps and run into trouble please let me know so I can update

## Pre Setup

- `npm i -g serverless`
- set up a `personal` profile in `~/.aws/credentials`
- `sls login`

```
[personal]
aws_access_key_id=your_aws_access_key
aws_secret_access_key=your_secret_access_key
```

## Setup

- `clone` and `cd` and `yarn`
- Configure the `app`, `org` `custom.siteName` and `custom.tableName` properties of the `serverless.yml` file.
- `sls`

## To run locally

- `yarn start`

## To deploy

- `yarn deploy`

The app should deploy to `http://<custom.siteName>.s3-website-us-east-1.amazonaws.com/`
