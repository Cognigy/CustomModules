import { fuseSearch } from './module';

const items = [ "42 hr top",
  "top 20 20"
  ];
const options = {};
const pattern = "top 42";

(async () => {
    console.log(await fuseSearch(items, options, pattern));
})();
