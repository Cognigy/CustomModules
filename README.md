# Cognigy Integration Framework Modules

In [Cognigy.AI](https://cognigy.com/product/), so-called [Flows](https://docs.cognigy.com/docs/flow) are used to build Conversational.AI. There, it could be the case that one needs to integrate a third-party system to store or retreive data. The [Cognigy Integration Framework](https://docs.cognigy.com/docs/integration-framework) enables anyone to build JavaScript modules and to expose them as [Flow Nodes](https://docs.cognigy.com/docs/general-usage-information) within Cognigy. There are no restrictions on node modules ([NPM](https://www.npmjs.com/)) or functionality.

## Overview

This repository contains the source code of existing modules which can be used as blueprints for further developments. Therefore, all of them are provided under the [MIT license](./LICENSE).

You are free to add a new module by creating a feature branch or suggest changes on already published modules. If you want test a module or include it into your existing Cognigy.AI project, please don't hesitate to [install one](./docs/installation.md).

## Contents

- [Get Started](./docs/get-started.md)
- [Best Practises](./docs/best-practises.md)
- [Installation](./docs/installation.md)


## Approval Process

sagen, dass der autor des modules dafuer verantwortlich ist dass sie funktioniert. module sind nicht vom support supported, sondern von der community.

wenn wir das custom module approven sollen, dann muessen secrets und beschreibung an support@cognigy.com senden. und den link zur PR.

wenn ein custom module gerade nicht funktionieren sollte, kann man gerne einen fix entwickeln und eine PR erstellen.

## Releases 

releases.md

hier kommen die releases rein, die gerade in reamde.io stehen

icon, name, version, link

1. ownership fuer funktionalitat liegt bei autor
    wenn approved werden soll, dann per mail die infos
    wir testen nur ob der code clean ist un ob er irgendneen scheiss macht
    l'sst es sich installiern?
2. es wird eine rlease.md erstellt, wo alle infomrationen ueber die released custom modules steht
3. alex reviewed