# Overview
Pattern matching Node for Cognigy.AI.

You can define patters which will be searched for in the input text or the alternate text which was provided. If a pattern is found, a compoundSlot group will be created in the input object.

## Patterns
Patterns can be any text and can contain references to slots by using the `@` symbol. 

Example: `@color @product`
A text like `I need a green shirt` would find the compound slot group and assign color = green and product = shirt

### Tags
Slots can be tagged in a pattern to be easier identifiable later.

Exampe: `from @city>origin to @city>destination`
A text like `I want to go from Düsseldorf to Tokyo` would find a compound group with origin and destination set.