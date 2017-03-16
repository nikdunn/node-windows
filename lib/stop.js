// Handle input parameters
var Logger = require('./eventlog'),
    optimist = require('optimist'),
    p = require('path'),
    fs = require('fs'),
    argv = optimist
      .demand('log')
      .alias('l','log')
      .describe('log','The descriptive name of the log for the process')
      .default('eventlog','APPLICATION')
      .alias('e','eventlog')
      .describe('eventlog','The event log container. This must be APPLICATION or SYSTEM.')
      .argv,
    log = new Logger(argv.e == undefined ? argv.l : {source:argv.l,eventlog:argv.e});

log.info('Shutdown script called, writing shutdown file.');
fs.writeFileSync(p.join(__dirname, '.shutdown'), 'Go away');
