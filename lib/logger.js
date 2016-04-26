'use strict';

const colors = require('colors');
const ora = require('ora');

class Logger {
  startSpinner(message) {
    this.spinnerMessage = message;

    this.spinner = ora(message);
    this.spinner.start();
  }

  stopSpinner() {
    if (this.spinner) {
      this.spinner.stop();
      delete this.spinner;
    }
  }

  log(message, type) {
    if (!message || message.length === 0) {
      return;
    }

    if (this.spinner) {
      this.spinner.stop(true);
    }

    switch (type) {
      case 'error':
        console.error(message.red);
        break;
      case 'warning':
        console.error(message.yellow);
        break;
    }

    if (this.spinner && this.spinnerMessage) {
      this.spinner = ora(this.spinnerMessage);
      this.spinner.start();
    }
  }

  error(message) {
    this.log(message, 'error');
  }

  warning(message) {
    this.log(message, 'warning');
  }
}

module.exports = Logger;
