#! /usr/bin/env node

'use strict';

const Table = require('cli-table2');

const Logger = require('./logger');
const Scraper = require('./scraper');

const argv = require('yargs')
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
const logger = new Logger();
const scraper = new Scraper(logger);
const currencies = argv.all ? ['USD', 'EUR', 'RUB', 'GBP'] : [argv.currencies];

logger.startSpinner('Getting latest exchange rates');

scraper
  .getRates()
  .subscribe(rates => {
    logger.stopSpinner();
    console.log('Exchange rates for KZT (tenge):');

    let table = new Table({
      head: ['', 'Buy', 'Sell']
    });
    rates.forEach(rate => {
      if (currencies.indexOf(rate.currency) > -1) {
        table.push([rate.currency, rate.buy, rate.sell]);
      }
    });
    console.log(table.toString());

    process.exit();
  }, err => {
    logger.stopSpinner();
    logger.error('Something went wrong while loading: ' + err.message);

    process.exit(5);
  });
