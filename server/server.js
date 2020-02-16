require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const { restaurants } = require('./data/restaurants');
const yelp = require('yelp-fusion');
const app = express();

app.use(express.static(path.join(__dirname, '..', '/public')));

app.use('*', (req, res, next) => {
  console.log(req.url);
  next();
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/scene', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/scenery.html'));
});

app.get('/scanner', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/scanner.html'));
});

app.get('/restaurants/', (req, res, next) => {
  res.status(200).send(restaurants);
});

app.get('/ft/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/FTDEMO.html'));
});

app.get('/yelp/search/lat/:lat/lng/:lng', (req, res, next) => {
  const API_KEY = process.env.YELP_API_KEY;
  const yelpClient = yelp.client(API_KEY);
  yelpClient
    .search({
      latitude: req.params.lat,
      longitude: req.params.lng,
      radius: 1000,
      limit: 20,
      term: 'pizza'
    })
    .then(restaurants => res.status(200).send(restaurants))
    .catch(error => {
      console.log(error);
      res.status(400).send({ error });
    });
});

app.listen(PORT, () => {
  console.log(`listening at PORT: ${PORT}`);
});
