import { Scrapper } from '@/types/scrapper';
import { getOptions } from '@/utils/chromeOptions';
import { scrapper } from '@/utils/scrapper';

import puppeteer from 'puppeteer-core';

export const signIn: Scrapper.SignIn.Handler = async (req, res) => {
  try {
    const browser = await puppeteer.launch(await getOptions());

    const page = await browser.newPage();

    await page.goto(scrapper.accountLogin);

    await page.waitForSelector('form');

    await page.type('#Login', req.body.login);

    await page.type('#Password', req.body.password);

    await page.click('[type="submit"]');

    await page.waitForSelector('.sidebar-menu', { timeout: 3000 });

    if (page.url() !== scrapper.homeIndex) {
      return res.status(406).json({ error: 'Invalid login' });
    }

    const cookies = await page.cookies();

    await page.close();

    res.status(200).json({ cookies });
  } catch (e) {
    console.error({ e });
    res
      .status(500)
      .json({ error: `There was a login failure: ${JSON.stringify(e)}` });
  }
};
