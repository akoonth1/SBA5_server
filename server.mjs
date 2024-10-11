
//imports

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { users } from './data/users.mjs';
import { pokemart_items } from './data/items.mjs';
import { locations } from './data/locations.mjs';
import error from './utilities/error.mjs';
import router from './routes/mart_route.mjs';


const app = express();
const PORT = 3001;

//Body Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));



app.get('/users', (req, res) => {
    res.json(users);
    });

app.use('/mart', router);










































































//More Middleware for error handling and 404 not found
app.use((req, res, next) => {
    next(error(404, "Resources Not Found"))
  });
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
  });
  



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
