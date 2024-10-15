
import { users } from '../data/users.mjs';
import { pokemart_items } from '../data/items.mjs';
import { locations } from '../data/locations.mjs';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

 const router = express.Router();

class Item_New {
    constructor(id, name, price, description, type, effect) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.type = type;
        this.effect = effect;
    }}


class User_New {
    constructor(id, name, money, backpack, party, location) {
        this.id = id;
        this.name = name;
        this.money = money;
        this.backpack = backpack;
        this.party = party;
        this.location = location;
    }
}

router.get('/newuser', (req, res) => {
    const link = "/mart/newuser";
    const id = users.length + 1;
    const fields = [
        { id: "id", name: "id", label: "ID", type: "number", value: id, required: false },
        { id: "name", name: "name", label: "Name", type: "text", value: "", required: true },
        { id: "money", name: "money", label: "Money", type: "number", value: 0, required: true },
        { id: "backpack", name: "backpack", label: "Backpack", type: "hidden", value: "[]", required: false },
        { id: "party", name: "party", label: "Party", type: "hidden", value: "[]", required: false },
        { id: "location", name: "location", label: "Location", type: "text", value: "", required: true }
    ];

    res.render('newentry', {
        title: "Create New User",
        action: "/mart/newuser",
        link: link,
        fields: fields,
        buttonText: "Create User"
    });
});

router.get('/newitem', (req, res) => {
    const link = "/mart/newitem";
    const id = pokemart_items.length + 1;
    const fields = [
        { id: "id", name: "id", label: "ID", type: "number", value: id, required: true },
        { id: "name", name: "name", label: "Name", type: "text", value: "", required: true },
        { id: "price", name: "price", label: "Price", type: "number", value: 0, required: true },
        { id: "description", name: "description", label: "Description", type: "text", value: "", required: true },
        { id: "type", name: "type", label: "Type", type: "text", value: "", required: true},
        {id: "effect", name: "effect", label: "Effect", type: "text", value: "", required: true}
    ];

    res.render('newentry', {
        title: "Create New Item",
        action: "/mart/newitem",
        link: link,
        fields: fields,
        buttonText: "Create Item"
    });
});



// Render edit user form
router.get('/users/:id/edit', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        const fields = [
            { id: "id", name: "id", label: "", type: "hidden", value: user.id, required: true },
            { id: "name", name: "name", label: "Name", type: "text", value: user.name, required: true },
            { id: "money", name: "money", label: "Money", type: "number", value: user.money, required: true },
            { id: "location", name: "location", label: "Location", type: "text", value: user.location, required: true },
            { id: "backpack", name: "backpack", label: "Backpack", type: "text", value: user.backpack.join(', '), required: false },
            { id: "party", name: "party", label: "Party", type: "text", value: user.party.join(', '), required: false }
        ];

        res.render('edit', {
            title: "Edit User",
            action: `/mart/users/${id}?_method=PATCH`,
            link: `/mart/users/${id}`,
            fields: fields,
            buttonText: "Update User",
            method: "PATCH",
            id: id
        });
    } else {
        res.status(404).send('User not found');
    }
});

// Handle edit user form submission
router.patch('/users/:id/edit', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        user.name = req.body.name;
        user.money = parseInt(req.body.money);
        user.location = req.body.location;
        user.backpack = req.body.backpack.split(',').map(item => item.trim());
        user.party = req.body.party.split(',').map(member => member.trim());
        res.redirect(303, `/mart/users/${id}`);
    } else {
        res.status(404).send('User not found');
    }
});








// Push data for new user to users array
router.post('/newuser', (req, res) => {
    const user = new User_New(users.length + 1, req.body.name, req.body.money, req.body.backpack, req.body.party, req.body.location);
    users.push(user);
    res.redirect('/mart/users');
}
);

// Push data for new item to items array
router.post('/newitem', (req, res) => {
    const item = new Item_New(pokemart_items.length + 1, req.body.name, req.body.price, req.body.description, req.body.type, req.body.effect);
    pokemart_items.push(item);
    res.redirect('/mart/items');
}
);

//json data for users to check
router.get('/users', (req, res) => {
    let user_list = users.map(user => {
        return {id: user.id, name: user.name, money: user.money, location: user.location, backpack: user.backpack, party: user.party};
    });
    res.render('all', { users: user_list });
});


//json data for items to check
router.get('/items', (req, res) => {
    res.json(pokemart_items);

});


//show single item
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


//show single user
router.get('/users/:id', (req, res) => {
    
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    // const buy_link= `<a id="buttons" href="/mart/users/${id}/money/100">Money</a>`
    if (user) {
        const nextUserId = (id % users.length) + 1;
        const nextUserLink = `<a id="buttons" href="/mart/users/${nextUserId}">Next User</a>`;
        res.render('index', { name: user.name, money: user.money, location: user.location , backpack: user.backpack, party: user.party, id: user.id, buy_link: nextUserLink});
    }
    else {
        res.status(404).send('User not found');
    }

  
});

//add item to user
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



//add money to user
router.post('/users/:id/money/:amount', (req, res) => {
    try {
        //console.log("test");
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

    
});

//add money from url params
router.get('/users/:id/money/:amount', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    user.money += parseInt(req.params.amount);
    console.log("HEllo");

    res.redirect("..");
    //res.json(user);
});




router.get('/locations', (req, res) => {
    res.json(locations);
});


//Pokemon menu
router.get('/users/:uid/pokemon', (req, res) => {
    const id = parseInt(req.params.uid);
console.log("Hello");
console.log(req.params.uid);
    res.render('pokemart',{id: id});
});


//Add Pokemon to user
router.post(`/users/:uid/submit-pokemon`, (req, res) => {
    const pokemonName = req.body.pokemonName;
    const user_id = parseInt(req.params.uid);
    const user = users.find(user => user.id === user_id);

    // Assuming user is defined and accessible


    if (user && pokemonName && pokemonName.length > 0 && user.party.length < 6) {
        user.party.push(pokemonName);
        //res.send(`You submitted: ${pokemonName}`);
        res.redirect(`../${user_id}/pokemon`);
    } else {
        res.status(400).send('Invalid user, Pokémon name, or party size');
    }
});


router.delete('/users/:id', (req, res) => {
    console.log("deltest");
    const id = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === id);
    if (index > -1) {
        users.splice(index, 1);
        res.redirect('/mart/users');
    } else {
        res.status(404).send('User not found');
    }
});






export default router;