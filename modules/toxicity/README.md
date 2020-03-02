# Toxicity classifier

This module is based on a TensorFlow.js model: [toxicity classifier](https://github.com/tensorflow/tfjs-models/tree/master/toxicity). 

## Node: toxicity

The node detects toxic content of the text and classifies it into seven categories: "identity attack", "insult", "obscene", "severe toxicity", "sexual explicit", "threat" and "toxicity". 
The results of the classification show probabilities for each category and give a **true** if the probabilty for **"1"** is above 0.9. 

The results will be written into the context in the form:

```json
[
  {
    "toxicity": [
      {
        "label": "identity_attack",
        "results": [
          {
            "probabilities": {
              "0": 0.986241340637207,
              "1": 0.013758664019405842
            },
            "match": false
          }
        ]
      },
      {
        "label": "insult",
        "results": [
          {
            "probabilities": {
              "0": 0.005167355760931969,
              "1": 0.9948325753211975
            },
            "match": true
          }
        ]
      },
      {
        "label": "obscene",
        "results": [
          {
            "probabilities": {
              "0": 0.9844827055931091,
              "1": 0.01551725808531046
            },
            "match": false
          }
        ]
      },
      {
        "label": "severe_toxicity",
        "results": [
          {
            "probabilities": {
              "0": 0.9999772310256958,
              "1": 0.00002282377317897044
            },
            "match": false
          }
        ]
      },
      {
        "label": "sexual_explicit",
        "results": [
          {
            "probabilities": {
              "0": 0.9973675608634949,
              "1": 0.0026324072387069464
            },
            "match": false
          }
        ]
      },
      {
        "label": "threat",
        "results": [
          {
            "probabilities": {
              "0": 0.9962361454963684,
              "1": 0.003763885237276554
            },
            "match": false
          }
        ]
      },
      {
        "label": "toxicity",
        "results": [
          {
            "probabilities": {
              "0": 0.005294577218592167,
              "1": 0.9947054386138916
            },
            "match": true
          }
        ]
      }
    ],
  }
]
```