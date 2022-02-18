#!/usr/bin/env node

import generateAppWithBrowser from '@/app/app';
import { PuppeteerLaunchOptions } from '@/utils/scrapper';

import debug from 'debug';
import http from 'http';
import puppeteer from 'puppeteer';

// init browser
const options: PuppeteerLaunchOptions = { args: ['--no-sandbox'] };

puppeteer
  .launch(options)
  .then((browser) => {
    console.log('Browser ON');

    /**
     * Normalize a port into a number, string, or false.
     * @param {string} val
     * @return {boolean|string|number}
     */
    const normalizePort = (val: string): boolean | string | number => {
      const port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    };

    const app = generateAppWithBrowser(browser);

    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    const server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);

    /**
     * Event listener for HTTP server "listening" event.
     */
    const onListening = () => {
      const addr = server.address();
      const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;

      debug('Listening on ' + bind);
    };

    server.on('listening', onListening);
  })
  .catch(() => console.error('Error on init browser'));
