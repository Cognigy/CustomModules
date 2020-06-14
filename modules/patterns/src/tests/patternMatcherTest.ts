import { patternMatcher } from '../lib/patternMatcher';

const input = {
    "intent": null,
    "type": "Statement",
    "currentTime": {
      "year": 2020,
      "month": 6,
      "day": 14,
      "hour": 18,
      "minute": 43,
      "second": 35,
      "milliseconds": 721,
      "weekday": 0,
      "dayOfWeek": "Sunday",
      "ISODate": "2020-06-14T18:43:35",
      "timezoneOffset": "Arctic/Longyearbyen"
    },
    "question": {
      "exists": false
    },
    "mode": "TextOnly",
    "slots": {
      "DATE": null,
      "NUMBER": [
        3
      ],
      "DURATION": null,
      "TEMPERATURE": null,
      "AGE": null,
      "PERCENTAGE": null
    },
    "intentScore": 0,
    "intentMapperResults": null,
    "intentOutOfState": null,
    "hashedIp": "f8ae92f97fa9f755a8b45045402a028ae53c9a1a",
    "state": "default",
    "channel": "adminconsole",
    "endpointType": "adminconsole",
    "userId": "p.heltewig@cognigy.com",
    "inputId": "e16e0aec-be50-4ae1-8ade-dc4b2e34c730",
    "sessionId": "26033da4-e436-484a-bdad-406b39ec8760",
    "flowParentId": "4f0c44160a86d1525b129eca0be9fa7e",
    "flowName": "Pattern",
    "URLToken": null,
    "frustration": 0,
    "completedGoals": [],
    "execution": 1,
    "data": {},
    "understood": true,
    "language": "en-US"
  };

  const args = {
    patterns: [
        "hello",
        "world"
    ],
    compoundGroupName: "",
    detailedCompoundSlots: false,
    tagExistingSlots: false,
    createNewSlots: false,
    alternateInput: ""
  };

  input["text"] = "I want 3 Berlin";

  // @ts-ignore
  console.log(JSON.stringify(patternMatcher(input, args.patterns, args.compoundGroupName, args.detailedCompoundSlots, args.tagExistingSlots, args.createNewSlots, args.alternateInput), undefined, 4));