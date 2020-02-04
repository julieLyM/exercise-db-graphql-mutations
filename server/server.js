const express = require('express');
const middlewares = require('./middlewares');
const PORT = process.env.PORT || 5000;

const app = express();

middlewares(app);

app.listen(PORT, () => console.log(`listen the PORT ${PORT}`));
