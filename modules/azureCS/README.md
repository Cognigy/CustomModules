# Microsoft Azure Cognitive Services
Integrates Cognigy with the Microsoft Azure Cognitive Services ([Cognitive Services | Microsoft Azure](https://azure.microsoft.com/de-de/services/cognitive-services/))

## Secrets
This model needs several **CognigySecrets** to be defined and passed to the Nodes. To include these APIs into Cognigy you need the **API Token** and create a Cognigy Secret for each of these APIs.

You will require the following Secrets for the respective Nodes:

- **Spellcheck**
  - key (API Key)
- **Named Entity Recognition**, **Extract Keyphrases**, **Recognize Language**
  - key (API Key)
  - region (Azure Region)
- **Bing Web Search**, **Bing News Search**
  - key (API Key)
- **Text Translator**
  - key (API Key)

## Node: Spell Check
 [Resource](https://docs.microsoft.com/de-de/azure/cognitive-services/bing-spell-check/quickstarts/nodejs) 

Finds spelling mistakes in the **text** input and predicts the correct word: 
```json
  "spellCheck": {
    "_type": "SpellCheck",
    "flaggedTokens": [
      {
        "offset": 0,
        "token": "thi",
        "type": "UnknownToken",
        "suggestions": [
          {
            "suggestion": "the",
            "score": 0.778841524178657
          },
          {
            "suggestion": "this",
            "score": 0.734106408066573
          }
        ]
      },
    ]
  }
```
You have to specify the **language** of the given text, so that Microsoft is able to compare it. 

## Node: Recognize Language 
This node recognizes the language of the given **text**: 
```json
"recognizeLanguage": {
    "documents": [
      {
        "id": "1",
        "detectedLanguages": [
          {
            "name": "English",
            "iso6391Name": "en",
            "score": 0.875
          }
        ]
      }
    ],
    "errors": []
  }
```

## Node: Extract Keyphrases
This node extracts **Keyphrases** from a given **text**, by which you must specify the **language** of the given input: 
```json
  "keyphrases": {
    "documents": [
      {
        "id": "1",
        "keyPhrases": [
          "company",
          "Germany",
          "Cognigy",
          "Düsseldorf"
        ]
      }
    ],
    "errors": []
  }
```

## Node:  Named Entity Recgonition
Unlike the **Extract Keyphrases** node, this one detects entities such as locations, organizations or persons and responses these. You have to define the **language** and the **text**. 
```json
"ner": {
    "documents": [
      {
        "id": "1",
        "entities": [
          {
            "name": "Cognigy",
            "matches": [
              {
                "text": "Cognigy",
                "offset": 0,
                "length": 7
              }
            ],
            "type": "Person"
          },
          {
            "name": "Germany",
            "matches": [
              {
                "text": "Germany",
                "offset": 26,
                "length": 7
              }
            ],
            "wikipediaLanguage": "en",
            "wikipediaId": "Germany",
            "wikipediaUrl": "https://en.wikipedia.org/wiki/Germany",
            "bingId": "75c62d8e-1449-4e4d-b188-d9e88f878dd9",
            "type": "Location"
          }
        ]
      }
    ],
    "errors": []
  }
```

## Node: Bing Web Search
This node only needs a **query** and a location to store the response. Since the search results are very huge, the response is stored in the CognigyInput: 
```json
"store": {
    "_type": "SearchResponse",
    "queryContext": {
      "originalQuery": "hund"
    },
    "webPages": {
      "webSearchUrl": "https://www.bing.com/search?q=hund",
      "totalEstimatedMatches": 17800000,
      "value": [
        {
          "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
          "name": "Haushund – Wikipedia",
          "url": "https://de.wikipedia.org/wiki/Haushund",
          "isFamilyFriendly": true,
          "displayUrl": "https://de.wikipedia.org/wiki/Haushund",
          "snippet": "Hund ist eine Weiterleitung auf diesen Artikel. Weitere Bedeutungen sind unter Hund (Begriffsklärung) aufgeführt.",
          "dateLastCrawled": "2019-02-07T00:35:00.0000000Z",
          "language": "de",
          "isNavigational": false
        },

```

## Node: Bing News Search
Such as the other search node you only need a **term** in this case and it will search the internet for news related to this term — example: „hollywood“. The response is stored in the CognigyInput:
```json
"news": {
    "_type": "News",
    "readLink": "https://api.cognitive.microsoft.com/api/v7/news/search?q=hollywood",
    "queryContext": {
      "originalQuery": "hollywood",
      "adultIntent": false
    },
    "totalEstimatedMatches": 36,
    "sort": [
      {
        "name": "Höchste Übereinstimmung",
        "id": "relevance",
        "isSelected": true,
        "url": "https://api.cognitive.microsoft.com/api/v7/news/search?q=hollywood"
      },
      {
        "name": "Neueste",
        "id": "date",
        "isSelected": false,
        "url": "https://api.cognitive.microsoft.com/api/v7/news/search?q=hollywood&sortby=date"
      }
    ],
    "value": [
      {
        "name": "Stadtkapelle Lohr goes Hollywood",
        "url": "https://www.mainpost.de/regional/main-spessart/Stadtkapelle-Lohr-goes-Hollywood;art774,10175543",
        "image": {
          "thumbnail": {
            "contentUrl": "https://www.bing.com/th?id=ON.9C0542B13CF5B4CDBF5E6A873EE17F20&pid=News",
            "width": 480,
            "height": 270
          }
        },
        "description": "Musikalische Highlights der Filmgeschichte gibt es am Freitag, 29. März, in der Stadthalle Lohr zu hören. Unter dem Motto ...",
        "provider": [
          {
            "_type": "Organization",
            "name": "mainpost"
          }
        ],
        "datePublished": "2019-02-11T13:59:00.0000000Z",
        "category": "Entertainment"
      },
```

## Node: Bing Image Search
This node searches for pictures related to a given **term**, in this case „hollywood“. The results are stored in the CognigyInput:
```json
"imageResponse": {
    "_type": "Images",
    "instrumentation": {
      "_type": "ResponseInstrumentation"
    },
    "readLink": "https://api.cognitive.microsoft.com/api/v7/images/search?q=hollywood",
    "webSearchUrl": "https://www.bing.com/images/search?q=hollywood&FORM=OIIARP",
    "queryContext": {
      "originalQuery": "hollywood",
      "alterationDisplayQuery": "hollywood",
      "alterationOverrideQuery": "+hollywood",
      "alterationMethod": "AM_JustChangeIt",
      "alterationType": "CombinedAlterationsChained"
    },
```

## Node: Text Translator
This node translates a given **text** in a specified **language**. You can translate the text into 60 languages — Microsoft detects the original language. The result is stored in the CognigyContext or CognigyInput: 

Example sentence: *Cognigy is a company from Düsseldorf in Germany.*
```json
"translated": [
    {
      "detectedLanguage": {
        "language": "en",
        "score": 0.88
      },
      "translations": [
        {
          "text": "Cognigy es una empresa de Düsseldorf en Alemania.",
          "to": "es"
        }
      ]
    }
  ]
```
