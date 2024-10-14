
import { users } from '../data/users.mjs';
import { pokemart_items } from '../data/items.mjs';
import { locations } from '../data/locations.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
 const router = express.Router();
// router.use(express.static(path.join(__dirname, 'public')));

//import methodOverride from 'method-override';

class Item_New {
    constructor(id, name, price, description, type, effect) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.type = type;
        this.effect = effect;
    }}

router.get('/items', (req, res) => {
    console.log(pokemart_items);
    res.json(pokemart_items);
    //res.render('index', { p_items: pokemart_items });
});



    router.get('/users/:uid/items/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const user_id = parseInt(req.params.uid);
        const item = pokemart_items.find(item => item.id === id);
    
        if (item) {
            const nextItemId = (id % pokemart_items.length) + 1; // Calculate next item ID
            const nextItemLink = `<a id="buttons" href="/mart/users/${user_id}/items/${nextItemId}">Next Item</a>`; // Create anchor tag for next item with user ID
            res.render('item_menu', { 
                id: item.id,
                name: item.name, 
                price: item.price, 
                description: item.description, 
                type: item.type, 
                effect: item.effect,
                nextItemLink: nextItemLink, // Correctly pass the nextItemLink variable
                user_id: user_id
            });
        } else {
            res.status(404).send('Item not found');
        }
    });

router.post('/items', (req, res) => {
    const item = new Item(pokemart_items.length + 1, req.body.name, req.body.price, req.body.description, req.body.type, req.body.effect);
    pokemart_items.push(item);
    res.json(item);
});

router.get('/users', (req, res) => {
    res.json(users);
});

router.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
     const buy_link= `<a id="buttons" href="/mart/users/${id}/money/100">Money</a>`
    console.log(buy_link);
    console.log(user.name);
    console.log(user.money);
    console.log(user.location);
    res.render('index', { name: user.name, money: user.money, location: user.location , backpack: user.backpack, party: user.party, id: user.id, buy_link: buy_link});
});


router.post('/users/:uid/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user_id = parseInt(req.params.uid);
    const user = users.find(user => user.id === user_id);
    const item = pokemart_items.find(item => item.id === id);
    if (user.money >= item.price) {
        user.money -= item.price;
        user.backpack.push(item.name);
        res.redirect(`./${id}`)
    } else {
        res.json({ message: "Not enough money." });
    }
});


router.post('/users/:id/items', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    const item = pokemart_items.find(item => item.id === req.body.id);
    if (user.money >= item.price) {
        user.money -= item.price;
        user.backpack.push(item);
        res.json(user);
    } else {
        res.json({ message: "Not enough money." });
    }
});

router.post('/users/:id/money/:amount', (req, res) => {
    try {
        console.log("Hello");
        const id = parseInt(req.params.id);
        const amount = parseFloat(req.body.money);
        const user = users.find(user => user.id === id);

        if (!user) {
            return res.status(404).send('User not found today');
        }

        user.money += amount;
        console.log(user.money);
        res.status(200)
        res.redirect("..")
    } catch (error) {
        res.status(400).send('Error updating user money');
    }
//     const id = parseInt(req.params.id);
//     const user = users.find(user => user.id === id);
//     user.money += req.body.money;
//     res.json(user);
//    // res.redirect('/users/:id');
    
});

// router.get('/users/:id/money/:amount', (req, res) => {
//     const id = parseInt(req.params.id);
//     const user = users.find(user => user.id === id);
//     user.money += parseInt(req.params.amount);
//     console.log("HEllo");

//     res.redirect("..");
//     //res.json(user);
// });




router.get('/locations', (req, res) => {
    res.json(locations);
});


export default router;