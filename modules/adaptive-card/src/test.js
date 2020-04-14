const ac = require('adaptivecards');

let card = new ac.AdaptiveCard();
card.version = new ac.Version(1, 0);

let columnSet = new ac.ColumnSet();

for (let i = 0; i <= 3; i++) {
    let column = new ac.Column('stretch');
    let image = new ac.Image()
    image.url = 'https://image.url/200'
    column.addItem(image)
    
    columnSet.addColumn(column);

}

card.addItem(columnSet);

let json = card.toJSON();

console.log(json);