# Serverless React Graphql

#### This README has not yet been tested by a new user. Tf you try following these steps and run into trouble please let me know so I can update.

## Pre Setup

- `npm i -g serverless`
- set up a `personal` profile in `~/.aws/credentials`
- `sls login`

```
[personal]
aws_access_key_id=your_personal_non_work_aws_access_key
aws_secret_access_key=your_personal_non_work_secret_access_key
```

## Setup

- `clone` and `cd` and `yarn`
- Change the `service` property in `serverless.yml` to something unique and delete the `app` and `org` properties.
- `sls` to add in your own `app` and `org`

## To deploy

- `yarn deploy:dev|qa|prod`

The very first time you deploy a stage, you actually need to run this command twice. The first time creates the resources, the second one builds the FE with the right environment variables after the resources exist.

The app should deploy to `http://<service-name>-<stage>-bucket.s3-website-us-east-1.amazonaws.com/`

## To run locally

- `yarn dev`

You need to have deployed `dev` at least once for this to work.
