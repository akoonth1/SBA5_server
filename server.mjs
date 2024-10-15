
//imports

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { users } from './data/users.mjs';
import { pokemart_items } from './data/items.mjs';
import { locations } from './data/locations.mjs';
import error from './utilities/error.mjs';
import router from './routes/mart_route.mjs';
import methodOverride from 'method-override';


const app = express();
const PORT = 3001;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//static files
app.use(express.static(path.join(__dirname, 'public')));


// Register view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Body Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));



// Use method-override middleware
app.use(methodOverride('_method'));



//Routes

app.use('/mart', router);









//More Middleware for error handling and 404 not found
app.use((req, res, next) => {
    next(error(404, "Resources Not Found"))
  });
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('err404', { message: err.message });
  });
  



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
