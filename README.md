# kzt
**A cli tool to get latest KZT (tenge) exchange rates**

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url]

[![NodeICO][nodeico-image]][nodeico-url]

## Installation

``` bash
  $ [sudo] npm install kzt -g
```

## Usage

```bash
kzt [-h] [-c {"USD", "EUR", "RUB", "GBP"}] [-a]

Options:
  --currencies, -c  choose the currencies to display KZT exchange rates for
                          [choices: "USD", "EUR", "RUB", "GBP"] [default: "USD"]
  --all, -a         display all KZT exchange rates                     [boolean]
  --help            Show help                                          [boolean]
```

## The MIT License

Copyright (C) 2015  Ayan Yenbekbay

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[downloads-image]: https://img.shields.io/npm/dm/kzt.svg
[npm-url]: https://www.npmjs.com/package/kzt
[npm-image]: https://img.shields.io/npm/v/kzt.svg

[travis-url]: https://travis-ci.org/yenbekbay/kzt
[travis-image]: https://img.shields.io/travis/yenbekbay/kzt.svg

[nodeico-url]: https://nodei.co/npm/kzt
[nodeico-image]: https://nodei.co/npm/kzt.png?downloads=true&downloadRank=true
