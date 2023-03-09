# react-ssr-on-lambda

**Keywords:** React Server-side Rendering (SSR), AWS Lambda, serverless.

No Next.js, no Remix, no serverless adapter; this project provides the template for a serverless SSR-enabled React
webapp that can be run right off AWS Lambda. I would not recommend using this template if you want productivity and ease
of development, or especially need *server-side streaming* features (AWS Lambda does not support this). For that I'd
recommend using Next.js which heavily inspires this project. I chose to do this for my personal project because I wanted
to see if it can be done, and this proof of concept is pulled from that project.

# Getting Started
After cloning the repo, just run `npm run dev`, the browser will be opened to https://localhost:3000, and you should see
the "Under construction" message.

`npm run build` will produce a production build at `dist` directory. Check buildspec.yml on how to deploy:
* These files are zipped and uploaded to Lambda code: `dist/index.js`, `dist/index.js.map`, and `dist/manifest.json`.
The Lambda function (I named mined `webapp`) must have its handler set to `index.handler` (the default value when you 
create a Node.js Lambda function).
* Static resources are uploaded to S3 bucket.
* CloudFront is set up like this:
  * Path pattern `Default (*)` is sent to my Lambda's function URL with cache policy *CachingDisabled*, and origin request policy 
  *AllViewerExceptHost* (it is critical you do not send the *Host* header to any Lambda endpoint).
  * `/favicon.ico`, `/js/*`, and `/css/*` path patterns are sent to my S3 bucket.

# How does it work?

WIP.
