# Chiquito Site Documentation

> Chiquitos Site
> Developed By: Omnifi Ltd


## Branch Strategy
Please follow these guidelines when merging code or creating pull requests. The order for merging pull requests should be as follows:
* Your Branch
* Development
* QA
* Staging
* Production

Here are the environments as follows:
### Production
* Git : `master`
* AWS Pipeline: `chiquito-prod`
* AWS Beanstalk: `chiquito-production`
* Contentful: `master` (alias)
* URL: https://www.chiquito.co.uk/

### Staging
* Git : `staging`
* AWS Pipeline: `chiquito-stage`
* AWS Beanstalk: `chiquito-staging`
* Contentful: `staging` (alias)
* URL: https://chiquito-new-staging.omnifitrgsites.co.uk/

### QA
* Git : `qa`
* AWS Pipeline: `chiquito-qa-old`
* AWS Beanstalk: `chiquito-qa-old`
* Contentful: `qa` (alias)
* URL: https://chiquito-qa.omnifitrgsites.co.uk/

### Development
* Git : `dev`
* AWS Pipeline: `chiquito-oat`
* AWS Beanstalk: `chiquito-development`
* Contentful: `development` (non-aliased)
* URL: https://chiquito-development.omnifitrgsites.co.uk/

## Dev Environment

``` bash
$ npm install
$ npm run dev

ENV variables are required for this file to be ran locally. These ENVs can be found in passpack under "Chiquito Brand Site ENVs" within TRG
```

## Staging Environment

``` bash
$ npm install
$ npm run start:stage
```

## Production Environment

``` bash
$ npm install
$ npm run start:prod
```



## Monitoring



### Instance Type

Dev: `Single local Instance`
Staging: `Duo Cluster managed by PM2`
Production: `Duo Cluster managed by PM2`

## Deployment Pipeinline

## Content Management

Dev: `Preview` - `no-cache`
Staging: `Preview` - `no-cache`
Production: `Live` - `1 Week Cache`


## WAF Cache

To reset WAF cache - hit this endpoint:
https://waf.sucuri.net/api?k=127eea61cb2889e84718b0aeb44ec45f&s=a78cc0be44539a0530b4face532c9240&a=clearcache
