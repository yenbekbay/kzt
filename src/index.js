#! /usr/bin/env node

'use strict';

const updateNotifier = require('update-notifier');

const Formatter = require('./formatter');
const Logger = require('./logger');
const pkg = require('../package.json');
const Scraper = require('./scraper');

const argv = require('yargs')
  .usage('kzt [-h] [-c {"USD", "EUR", "RUB"}] [-a]')
  .option('c', {
    alias: 'currencies',
    describe: 'choose the currencies to display KZT exchange rates for',
    choices: ['USD', 'EUR', 'RUB'],
    default: ['USD', 'EUR', 'RUB'],
    type: 'array'
  })
  .option('a', {
    alias: 'all',
    describe: 'display KZT exchange rates from all sources',
    type: 'boolean'
  })
  .help('h')
  .alias('h', 'help')
  .example('kzt -a -c USD', 'display exchange rates to USD from all sources')
  .example('kzt -c USD EUR', 'display average exchange rates to USD and EUR')
  .argv;
const logger = new Logger();
const scraper = new Scraper(logger);
const currencies = argv.currencies;
const displayAllSources = argv.all;

updateNotifier({ pkg }).notify();
logger.startSpinner('Getting latest exchange rates');

scraper
  .getRates()
  .subscribe(rates => {
    logger.stopSpinner();
    console.log('Exchange rates for KZT (tenge):');

    const formatter = new Formatter(rates, currencies);

    if (displayAllSources) {
      formatter
        .tablesForAllSources()
        .forEach(table => console.log(table.toString()));
    } else {
      console.log(formatter.tableForAverageRates().toString());
    }

    process.exit();
  }, err => {
    logger.stopSpinner();
    logger.error('Something went wrong while loading: ' + err.message);

    process.exit(5);
  });
