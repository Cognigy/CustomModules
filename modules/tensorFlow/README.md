# Tensorflow Custom Module

This module shows how to use any TensorFlow.js model in Custom Module on the example of [toxicity model](https://github.com/tensorflow/tfjs-models/tree/master/toxicity).

First, go to https://www.tensorflow.org/js/models and find a model that you would like to use in your Custom Module. Follow the instructions in the model's documentation.

## Node: classifyText

This custom node takes an input text and classifies it based on the tensorflow model.

**Example:**

- Text: "Hello World"
- Response:

```json
"class": [
    {
      "label": "identity_attack",
      "results": [
        {
          "probabilities": {
            "0": 0.9998371601104736,
            "1": 0.00016279781993944198
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
            "0": 0.9985218644142151,
            "1": 0.0014781698118895292
          },
          "match": false
        }
      ]
    },
    {
      "label": "obscene",
      "results": [
        {
          "probabilities": {
            "0": 0.9996230602264404,
            "1": 0.00037690793396905065
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
            "0": 0.9999998807907104,
            "1": 1.0099909530936202e-7
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
            "0": 0.9999343156814575,
            "1": 0.00006565637158928439
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
            "0": 0.9998358488082886,
            "1": 0.00016409876116085798
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
            "0": 0.996985137462616,
            "1": 0.003014889545738697
          },
          "match": false
        }
      ]
    }
  ]
```

## TensorFlow to JavaScript

It is possible to convert any TensorFlow SavedModel, TensorFlow Hub module, Keras HDF5 or tf.keras SavedModel into TensorFlow.js. In order to do that follow the steps described [here](https://github.com/tensorflow/tfjs/tree/master/tfjs-converter).
