#! /usr/bin/env node

var logger = require('./logger');
var scraper = require('./scraper');
var Table = require('cli-table2');
var argv = require('yargs')
  .option('currencies', {
    alias: 'c',
    describe: 'choose the currencies to display KZT exchange rates for',
    choices: ['USD', 'EUR', 'RUB', 'GBP'],
    default: 'USD'
  })
  .option('all', {
    alias: 'a',
    describe: 'display all KZT exchange rates',
    type: 'boolean'
  })
  .help('help')
  .argv;

var currencies = argv.all ? ['USD', 'EUR', 'RUB', 'GBP'] : [argv.currencies];
showRates();

function showRates() {
  logger.startSpinner('Getting latest exchange rates');
  scraper.getRates().subscribe(function(rates) {
    logger.stopSpinner();
    console.log('Exchange rates for KZT (tenge):');
    var table = new Table({
      head: ['', 'Buy', 'Sell']
    });
    for (var i = 0; i < rates.length; i++) {
      var rate = rates[i];
      if (currencies.indexOf(rate.currency) > -1) {
        table.push([rate.currency, rate.buy, rate.sell]);
      }
    }
    console.log(table.toString());
  }, function(err) {
    logger.error('Please check your internet connection');
  });
}
