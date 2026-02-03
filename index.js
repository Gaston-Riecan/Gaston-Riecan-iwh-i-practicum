require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.REPLACE_WITH_ACCESS_TOKEN;

app.get('/', async (req, res) => {
    const petsUrl = 'https://api.hubapi.com/crm/v3/objects/2-57046401';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: 'name,especie,edad'
    };
    try {
        const resp = await axios.get(petsUrl, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I: Foundations' });
});

app.post('/update-cobj', async (req, res) => {
    const updateUrl = 'https://api.hubapi.com/crm/v3/objects/2-57046401';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const newRecord = {
        properties: {
            "name": req.body.newName,
            "especie": req.body.newEspecie,
            "edad": req.body.newEdad
        }
    };
    try {
        await axios.post(updateUrl, newRecord, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));