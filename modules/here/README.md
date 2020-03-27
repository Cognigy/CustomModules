Adds [**Here**](https://developer.here.com/) specific features as Flow Nodes to Cognigy.AI. 

### Secret
This modules needs a CognigySecret to be defined and passed to the Nodes. The secret must have the following keys:

- **key**:  app_id,
- **value**:  Your APP ID for the HERE REST APIs 
- **key**:  app_code
- **value**:  Your APP CODE for the HERE REST APIs 

You you can generate the APP ID and an APP CODE for the **Here** REST APIs for free with your **Here** developer account [here](https://developer.here.com/develop/rest-apis?create=Freemium-Basic).

## Node: geocoderGeocode

Get current geolocation by free text in a format of

```json
{
    "Response": {
      "MetaInfo": {
        "Timestamp": "2019-06-12T19:32:50.461+0000"
      },
      "View": [
        {
          "_type": "SearchResultsViewType",
          "ViewId": 0,
          "Result": [
            {
              "Relevance": 0.93,
              "MatchLevel": "houseNumber",
              "MatchQuality": {
                "City": 1,
                "Street": [
                  0.73
                ],
                "HouseNumber": 1
              },
              "MatchType": "pointAddress",
              "Location": {
                "LocationId": "NT_lE1o1Ri7.vBNAEUyzR6qUC_xA",
                "LocationType": "point",
                "DisplayPosition": {
                  "Latitude": 51.21412,
                  "Longitude": 6.74894
                },
                "NavigationPosition": [
                  {
                    "Latitude": 51.21417,
                    "Longitude": 6.74883
                  }
                ],
                "MapView": {
                  "TopLeft": {
                    "Latitude": 51.2152442,
                    "Longitude": 6.7471454
                  },
                  "BottomRight": {
                    "Latitude": 51.2129958,
                    "Longitude": 6.7507346
                  }
                },
                "Address": {
                  "Label": "Speditionstraße 1, 40221 Düsseldorf, Deutschland",
                  "Country": "DEU",
                  "State": "Nordrhein-Westfalen",
                  "County": "Düsseldorf",
                  "City": "Düsseldorf",
                  "District": "Hafen",
                  "Street": "Speditionstraße",
                  "HouseNumber": "1",
                  "PostalCode": "40221",
                  "AdditionalData": [
                    {
                      "value": "Deutschland",
                      "key": "CountryName"
                    },
                    {
                      "value": "Nordrhein-Westfalen",
                      "key": "StateName"
                    },
                    {
                      "value": "Düsseldorf",
                      "key": "CountyName"
                    }
                  ]
                }
              }
            }
          ]
        }
      ]
    }
}
```

You can easlily retrieve the geolocation with the geocoderGeocode Node, for instance like this:

```javascript
cc.latitude = cc.STORE.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
cc.longitude = cc.STORE.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
```

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name given in the node's settings.

Handles the authentication (using a Cognigy Secret with `app_id` and `app_code`).

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 

Usage is explained in the **Here** developer [documentation](https://developer.here.com/documentation#geocoder).

## Node: placesDiscoverSearch

Get places by free text via discovery search at geolocation in a format of

```json
{
    "results": {
      "next": "https://places.api.here.com/places/v1/discover/search;context=Zmxvdy1pZD1kNWU5YzRjZS1mOGViLTUyOTItYTk2Yy02Mjg1OWMxMDc0YTNfMTU2MDM2ODc4MzY3Nl81ODQyXzM1NjEmb2Zmc2V0PTIwJnNpemU9MjA?at=51.21564%2C6.77666&q=Coffee&app_id=****************&app_code=****************",
      "items": [
        {
          "position": [
            51.2194,
            6.77669
          ],
          "distance": 418,
          "title": "ALEX Dusseldorf",
          "averageRating": 0,
          "category": {
            "id": "restaurant",
            "title": "Restaurant",
            "href": "https://places.api.here.com/places/v1/categories/places/restaurant?app_id=****************&app_code=****************",
            "type": "urn:nlp-types:category",
            "system": "places"
          },
          "icon": "https://download.vcdn.data.here.com/p/d/places2/icons/categories/03.icon",
          "vicinity": "Graf-Adolf-Platz 15<br/>Unterbilk, 40213 Dusseldorf",
          "having": [],
          "type": "urn:nlp-types:place",
          "href": "https://places.api.here.com/places/v1/places/276jx7ps-ba3559ebe1a70b5e89478c74c198cefd;context=Zmxvdy1pZD1kNWU5YzRjZS1mOGViLTUyOTItYTk2Yy02Mjg1OWMxMDc0YTNfMTU2MDM2ODc4MzY3Nl81ODQyXzM1NjEmcmFuaz0w?app_id=****************&app_code=****************",
          "tags": [
            {
              "id": "european",
              "title": "European",
              "group": "cuisine"
            },
            {
              "id": "international",
              "title": "International",
              "group": "cuisine"
            }
          ],
          "id": "276jx7ps-ba3559ebe1a70b5e89478c74c198cefd",
          "openingHours": {
            "text": "Mon-Thu: 08:00 - 00:00<br/>Fri, Sat: 08:00 - 01:00<br/>Sun: 09:00 - 00:00",
            "label": "Opening hours",
            "isOpen": true,
            "structured": [
              {
                "start": "T080000",
                "duration": "PT16H00M",
                "recurrence": "FREQ:DAILY;BYDAY:MO,TU,WE,TH"
              },
              {
                "start": "T080000",
                "duration": "PT17H00M",
                "recurrence": "FREQ:DAILY;BYDAY:FR,SA"
              },
              {
                "start": "T090000",
                "duration": "PT15H00M",
                "recurrence": "FREQ:DAILY;BYDAY:SU"
              }
            ]
          },
          "chainIds": [
            "27234"
          ],
          "alternativeNames": [
            {
              "name": "ALEX Düsseldorf",
              "language": "de"
            }
          ]
        }
      ]
    }
}
```
You can easlily retrieve places with the placesDiscoverSearch Node, for instance like this:

```javascript
cc.title = cc.STORE.results.items[0].title;
cc.vicinity = cc.STORE.results.items[0].vicinity.split("<br/>").join(", ");
```

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name given in the node's settings.

Handles the authentication (using a Cognigy Secret with `app_id` and `app_code`).

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 

Usage is explained in the **Here** developer [documentation](https://developer.here.com/documentation#places).

## Node: mapsImageMapview

Get an image URL for a place at geolocation.

The result will be stored in either the Cognigy context (`cc.STORE`) or input object (`ci.STORE`) using the store name given in the node's settings.

Handles the authentication (using a Cognigy Secret with `app_id` and `app_code`).

In case of an error, this is stored in either the Cognigy context (`cc.STORE.error`) or input object (`ci.STORE.error`). 

Usage is explained in the **Here** developer [documentation](https://developer.here.com/documentation#map_image).