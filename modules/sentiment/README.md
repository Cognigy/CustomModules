# Sentiment analysis

This module identifies sentiment of the text using [AFINN-based sentiment analysis](https://github.com/thisandagain/sentiment).

## Node: sentiment

As a result the node gives:
- **score**: sum of all sentiment values in the sentence 
- **comparative**: score divided by the number of tokens
- **calculation**: words that have some sentiment value, followed by their AFINN score
- **tokens**: all words from the input
- **words**: tokens that were found on the AFINN list
- **positive**: all tokens that have positive sentiment values
- **negative**: all tokens that have negative sentiment values

Sentiment values for the tokens are in the range from -5 (very negative) to 5 (very positive).

The result will be written into the context in the form:

```json
{
  "sentiment": {
    "score": 3,
    "comparative": 0.75,
    "calculation": [
      {
        "nice": 3
      }
    ],
    "tokens": [
      "nice",
      "to",
      "meet",
      "you"
    ],
    "words": [
      "nice"
    ],
    "positive": [
      "nice"
    ],
    "negative": []
  }
}
```