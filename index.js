const express = require('express');
const app = express();

app.get('/', (req, res) => {
  require('fs').createReadStream('index.html').pipe(res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('App listening...');
});
