# Serverless React Graphql

## This README could use some love, if you try following these steps and run into trouble please let me know so I can update

## Pre Setup

- `npm i -g serverless`
- `sls login`
- set up a `personal` profile in `~/.aws/credentials`

```
[personal]
aws_access_key_id=your_aws_access_key
aws_secret_access_key=your_secret_access_key
```

## Setup

- `clone` and `cd` and `yarn`
- Comment out the `app` and `org` properties of `serverless.yml`
- Optionally change the `service` property.
- `sls`

## To run locally

- `yarn dev`

## To deploy

- `yarn deploy:dev|qa|prod`

The app should deploy to `http://<service-name>-<stage>-bucket.s3-website-us-east-1.amazonaws.com/`
