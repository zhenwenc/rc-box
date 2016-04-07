# TWRAP

A React table data manipulator / wrapper for TS/JS projects!

**WARNING:** This project is currently under development, use with your own risk!

## Installation

To install the latest version:

```bash
$ npm install --save-dev twrap
```

Most likely you'll also need [the Immutable.js](https://github.com/facebook/immutable-js) library.

```bash
$ npm install --save-dev immutable
```

## Documentation

[Read the docs](http://twrap.js.org)!

## Contributing

If you'd like to contribute to TWRAP, you'll need to run the following commands to get your environment set up:

```bash
$ git clone https://github.com/zhenwenc/twrap.git
$ cd twrap                  # go to the twrap directory
$ npm install               # install local npm build / test dependencies

# Available scripts:

$ npm run typings-install   # install external type definitions
$ npm run build             # compile typescript source code
$ npm run test              # run all unit test suits
$ npm run watch:test        # watch for source / test file changes
$ npm run docs              # generate documentation files
```

`npm run watch:test` will watch for changes in the `/src/` and `/test/` directory, compile the
source files when a change occurs. The output files are written to the `/dist/` directory. It will also re-run the unit tests every time you update any source files.


## License

`TWRAP` is [MIT-licensed](./LICENSE).
