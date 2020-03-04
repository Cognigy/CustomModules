# Sentiment analysis

This module detects the language of the text and identifies its sentiment using [NLP.js](https://github.com/axa-group/nlp.js/tree/master/docs/v3).

### Language

To avoid errors due to the wrong language detection, you can choose the language of the input text.

The sentiment can be calculated for this languages:
- eu: Basque
- bn: Bengali
- ca: Catalan
- en: English
- es: Spanish
- nl: Dutch
- fr: French
- it: Italian
- de: German
- gl: Galician
- da: Danish
- fi: Finnish
- ru: Russian
- pt: Portuguese

## Node: multi_sentiment

As a result the node gives:
- **score**: sum of all sentiment values in the sentence 
- **comparative**: score divided by the number of words
- **vote**: says if the sentiment of the text is positive or negative, based on the score
- **numWords**: number of words from the input
- **numHits**: number of words with sentiment values
- **type**: shows which sentimental analyzer was used (Senticon, AFINN or Pattern)
- **language**: language detected by nlp.js

The result will be written into the context in the form:

1. Input: "I really don't like that"
```json
{
  "sentiment": {
    "score": -0.344,
    "comparative": -0.057333333333333326,
    "vote": "negative",
    "numWords": 6,
    "numHits": 2,
    "type": "senticon",
    "language": "en"
  }
}
```

2. Input: "The movie was very good"
```json
{
  "sentiment": {
    "score": 0.938,
    "comparative": 0.1876,
    "vote": "positive",
    "numWords": 5,
    "numHits": 3,
    "type": "senticon",
    "language": "en"
  }
}
```