
import { users } from '../data/users.mjs';
import { pokemart_items } from '../data/items.mjs';
import express from 'express';

const router = express.Router();

class Item {
    constructor(id, name, price, description, type, effect) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.type = type;
        this.effect = effect;
    }}

router.get('/items', (req, res) => {
    res.json(pokemart_items);
});

router.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = pokemart_items.find(item => item.id === id);
    res.json(item);
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
    res.json(user);
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

router.put('/users/:id/money', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    user.money += req.body.money;
    res.json(user);
});



export default router;