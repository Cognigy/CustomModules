# Language detection

This module identifies the language of the text using [language-detection library](https://github.com/newmsz/node-language-detection) for node.js.

## Node: language

The node identifies the language of the input text. It gives a list of possible languages of the input text and for every detected language its probability.

The result will appear in either the Cognigy context or input object under the name given in the node's settings.

1. Input text: "Ich spreche deutsch."

```json
{
  "language": [
    {
      "lang": "de",
      "prob": 0.9999978786742062
    },
  ],
}
```


2. Input text: "I would like to order a pizza."

```json
{
  "language": [
    {
      "lang": "en",
      "prob": 0.857140726894406
    },
    {
      "lang": "af",
      "prob": 0.14285820780630548
    }
  ],
}
```
