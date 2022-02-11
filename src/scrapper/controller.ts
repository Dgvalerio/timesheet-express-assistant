import { Scrapper } from '@/types/scrapper';
import { getOptions } from '@/utils/chromeOptions';
import { scrapper } from '@/utils/scrapper';

import puppeteer, { Protocol, PuppeteerErrors } from 'puppeteer-core';

export const signIn: Scrapper.SignIn.Handler = async (req, res) => {
  const browser = await puppeteer.launch(await getOptions());
  const page = await browser.newPage();

  try {
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

    res.status(200).json({ cookies });
  } catch (e) {
    console.error({ e });
    res
      .status(500)
      .json({ error: `There was a login failure: ${JSON.stringify(e)}` });
  } finally {
    await page.close();
  }
};

export const readAppointments: Scrapper.Read.Appointments.Handler = async (
  req,
  res
) => {
  const cookies: Protocol.Network.CookieParam[] = req.body.cookies.map(
    ({ name, value }) => ({
      name,
      value,
    })
  );

  const browser = await puppeteer.launch(await getOptions());
  const page = await browser.newPage();

  try {
    await page.goto(scrapper.worksheetRead);

    const loadCookies = cookies.map(async (cookie) => {
      return await page.setCookie(cookie);
    });
    await Promise.all(loadCookies);

    await page.goto(scrapper.worksheetRead);

    await page.waitForSelector('#tbWorksheet', { timeout: 3000 });

    const appointments = await page.evaluate(() => {
      const items: Scrapper.Read.Appointments.Appointment[] = [];

      document
        .querySelectorAll('#tbWorksheet > tbody > tr')
        .forEach(({ children }) =>
          items.push({
            id: (children[9] as HTMLTableColElement)?.children[0].id,
            cliente: (children[0] as HTMLTableColElement)?.innerText,
            projeto: (children[1] as HTMLTableColElement)?.innerText,
            categoria: (children[2] as HTMLTableColElement)?.innerText,
            data: (children[3] as HTMLTableColElement)?.innerText,
            horaInicial: (children[4] as HTMLTableColElement)?.innerText,
            horaFinal: (children[5] as HTMLTableColElement)?.innerText,
            total: (children[6] as HTMLTableColElement)?.innerText,
            naoContabilizado: (
              (children[7] as HTMLTableColElement)
                ?.children[0] as HTMLInputElement
            ).checked,
            avaliacao: (children[8] as HTMLTableColElement)?.innerText,
          })
        );

      return items;
    });

    res.status(200).json({ appointments });
  } catch (e) {
    console.error({ e });
    if (
      (<Error>e).message ===
      'waiting for selector `#tbWorksheet` failed: timeout 3000ms exceeded'
    ) {
      try {
        await page.waitForSelector('.login-container');
        res.status(401).json({ error: `Cookies are invalid!` });
      } catch (e2) {
        res.status(500).json({
          error: `There was a list appointments failure: ${
            (<PuppeteerErrors>e2).message
          }`,
        });
      }
    } else {
      res.status(500).json({
        error: `There was a list appointments failure: ${
          (<PuppeteerErrors>e).message
        }`,
      });
    }
  } finally {
    await page.close();
  }
};
