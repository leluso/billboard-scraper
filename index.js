'use strict';

let cheerio = require('cheerio');
let program = require('commander');
let request = require('request');
let mongoose = require('mongoose');
let async = require('async');

let Song = mongoose.model('Song', new mongoose.Schema({
  title: String,
  artist: String,
  year: Number,
  points: Number,
  first: Date,
}));

mongoose.connect('mongodb://localhost:27017/musicelo');

program
  .version('1.0.0')  
  .option('-d, --date [date]', 'Specify a date. Defaults to latest')
  .parse(process.argv);
  
let date = new Date(); // default to today
if(program.date) {
  date = new Date(program.date);
}

date = getSaturday(date);

let year = date.getFullYear();
let month = leftPad(date.getMonth() + 1, 2);
let day = leftPad(date.getDate(), 2);
let uri = `http://www.billboard.com/charts/country-songs/${year}-${month}-${day}`;

console.log(uri);
request(uri, (e, r, b) => {
  let $ = cheerio.load(b);
  let songs = $('.chart-row__song');
  let artists = $('.chart-row__artist');
  async.forEachOfSeries(songs, (song, i, cb) => {
    let title = songs[i].children[0].data.trim();
    let artist = artists[i].children[0].data.trim();
    let query = { title: title, artist: artist };
    let newDate = {};
    Song.findOneAndUpdate(query, {
      title: title,
      artist: artist,
      year: year,
      points: 1500,
      first: date,
    }, { upsert: true }, cb);
  }, (err) => {
    if(err) {
      console.error(err);
      process.exit(1);
    }
    else {
      process.exit(0);
    }
  });
});

function getSaturday( date ) {
  let day = date.getDay() || 7;  
  if( day !== 6 ) 
    date.setHours(-24 * (day - 6)); 
  
  date.setDate(date.getDate() + 7);
  return date;
}

function leftPad(s, length)
{
  s = '' + s;
  return stringNTimes('0', length - s.length) + s;
}

function stringNTimes(s, n)
{
  let r = '';
  for(let i = 0; i < n; i++) r += s;
  return r;
}