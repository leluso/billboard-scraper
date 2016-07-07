'use strict';

let spawn = require('child_process').spawn;
let whilst = require('async').whilst;

let START = new Date();
let END = new Date('April 1, 1998');

let date = START;
whilst(
  condition => date > END,
  callback => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let dateArg = year + '-' + month + '-' + day;
    console.log(dateArg);
    let c = spawn('node', ['index.js', '-d', dateArg]);
    date.setDate(date.getDate() - 7);
    c.stdout.on('data', data => console.log(data.toString()));
    c.on('close', (code) => {
      if(code === 0) {
        callback(null);
      }
      else {
        console.log('Whoa doggy');
        process.exit(1);
      }
    });
  },
  process.exit
);