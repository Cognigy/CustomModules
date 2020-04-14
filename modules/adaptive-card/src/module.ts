import * as ac from 'adaptivecards';

/**
 * Generates an adaptive card with n images in a column.
 * @arg {CognigyScript} `imageUrl` The url of the used image to display in the column
 * @arg {CognigyScript} `frequency` How often to show the column
 * @arg {CognigyScript} `contextStore` Where to store the result
 */

async function createAdapticveCard(input: any, args: { imageUrl: string, frequency: number, contextStore: string }): Promise<IFlowInput | {}> {

  const { imageUrl, frequency, contextStore } = args;

  if (!imageUrl) throw new Error('No image url defined. You need this to generate the set of pictures in the adaptive card.');
  if (!frequency) throw new Error('No frequency is defined.');
  if (!contextStore) throw new Error('No context store is defined. Where the result should be stored in the Cognigy context object.');

  let card = new ac.AdaptiveCard();
  card.version = new ac.Version(1, 0);

  let columnSet = new ac.ColumnSet();

  for (let i = 0; i <= 3; i++) {
      let column = new ac.Column('stretch');
      let image = new ac.Image();
      image.url = imageUrl;

      column.addItem(image);
      columnSet.addColumn(column);
  }

  card.addItem(columnSet);

  let json = card.toJSON();

  input.actions.addToContext(contextStore, json, 'simple');

  return input;
}

module.exports.createAdapticveCard = createAdapticveCard;