import { patternMatcher } from '../lib/patternMatcher';

const input = {
    "text": "test",
    "processText": "test",
    "intent": null,
    "type": "Statement",
    "currentTime": {
      "year": 2020,
      "month": 6,
      "day": 14,
      "hour": 19,
      "minute": 35,
      "second": 5,
      "milliseconds": 615,
      "weekday": 0,
      "dayOfWeek": "Sunday",
      "ISODate": "2020-06-14T19:35:05",
      "timezoneOffset": "Arctic/Longyearbyen"
    },
    "question": {
      "exists": false
    },
    "mode": "TextOnly",
    "slots": {
      "DATE": [
        {
          "start": {
            "day": 15,
            "month": 6,
            "year": 2020,
            "hour": 12,
            "minute": 0,
            "second": 0,
            "millisecond": 0,
            "text": "tomorrow",
            "weekday": 1,
            "dayOfWeek": "Monday",
            "ISODate": "2020-06-15T12:00:00"
          },
          "end": null
        }
      ],
      "NUMBER": [
        3,
        4
      ],
      "DURATION": null,
      "TEMPERATURE": [30],
      "AGE": [22],
      "PERCENTAGE": [100],
      "city": [
        {
          "keyphrase": "Berlin",
          "lower": "berlin",
          "neg": false,
          "number": 3,
          "synonym": "berlin",
          "count": 1,
          "data": {}
        },
        {
            "keyphrase": "Los Angeles",
            "lower": "los angeles",
            "neg": false,
            "number": 3,
            "synonym": "los angeles",
            "count": 1,
            "data": {}
          }
      ]
    },
    "intentScore": 0,
    "intentMapperResults": null,
    "intentOutOfState": null,
    "hashedIp": "f8ae92f97fa9f755a8b45045402a028ae53c9a1a",
    "state": "default",
    "channel": "adminconsole",
    "endpointType": "adminconsole",
    "userId": "p.heltewig@cognigy.com",
    "inputId": "4f639f2b-598c-48e5-82ce-fdfe4b018e66",
    "sessionId": "91dc2bd8-38b6-4ad4-8e5c-55b0bbc738dd",
    "flowParentId": "4f0c44160a86d1525b129eca0be9fa7e",
    "flowName": "Pattern",
    "URLToken": null,
    "frustration": 0,
    "completedGoals": [],
    "execution": 2,
    "data": {},
    "understood": true,
    "language": "en-US",
    "compoundSlots": [
      { "test": 1 }
    ]
  };

  const args = {
    patterns: [
        "from @city>origin to @city>destination at @NUMBER>time or @NUMBER>atime @DATE>date if its @TEMPERATURE>celsius degrees and I am @AGE>userage years old @PERCENTAGE>perc"
    ],
    compoundGroupName: "group",
    detailedCompoundSlots: false,
    tagExistingSlots: false,
    createNewSlots: false,
    alternateInput: ""
  };

  input.processText = "I want to fly from bErlin to los angEles at 3 or 4 tomorrow if its 30 degrees and I am 22 years old 100%";

  // @ts-ignore
  console.log(JSON.stringify(patternMatcher(input, args.patterns, args.compoundGroupName, args.detailedCompoundSlots, args.tagExistingSlots, args.createNewSlots, args.alternateInput), undefined, 4));