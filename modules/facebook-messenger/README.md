# Facebook Messenger

Custom nodes for Messenger usage.

**Secret**

- key: key
- value: Google API Key (Geolocation API)

## Get User Location

This node returns the coordinates and the address from the Facebook user:

``` json
{
    "location": {
        "user": {
            "latitude": 51.12355,
            "longitude": 6.23534
        },
        "address": "Speditionstraße 1, 40221 Düsseldorf, Germany"
    }
}
```