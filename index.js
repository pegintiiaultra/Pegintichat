'use strict';
const express = require('express');
const PegintiRouter = require('./src/router');
const app = express();
app.use(express.json({limit: '2mb'}));
app.use('/peginti', PegintiRouter);
app.listen(4000, '0.0.0.0', () => console.log('🚀 PEGINTI v2.0 → http://127.0.0.1:4000'));
