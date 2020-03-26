# Installation

In order to install a module, we provide two different ways:

- Install from download
- Install from source code

## Download
The easiest way of integrating a already pusblished module to your existing Cognigy.AI project, is to download the released  ready-to-use ZIP file:

1. Download the module you'd like to install from our [Releases](./releases.md) page.
2. Upload the zipped module into your Cognigy.AI installation through the [Cognigy Integration Framework manager](https://docs.cognigy.com/docs/integration-framework#section-4-upload-your-module).

## Source Code

The other way is to build the module on your own. All modules in this repository are provided as [TypeScript](https://www.typescriptlang.org/) source code which can be transpiled to JavaScript. In order to use them in your Cognigy.AI installation, you need to perform the following steps:

1. Clone the repository
2. Navigate to a module folder (e.g. modules/salesforce), run `npm install` to install dependencies and `tsc` to transpile the module from TypeScript to JavaScript
3. If the build process didn't zipped the files already, zip the root of the module and the /build folder
    - `zip module-name.zip build/* icon.png icon-large.png README.md package.json package-lock.json`
4. Upload the zipped module into your Cognigy.AI installation through the [Cognigy Integration Framework manager](https://docs.cognigy.com/docs/integration-framework#section-4-upload-your-module).