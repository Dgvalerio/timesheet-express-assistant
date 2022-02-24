import { Scrapper } from '@/types/scrapper';
import { scrapper } from '@/utils/scrapper';

import axios, { AxiosError } from 'axios';
import { Browser, Page, Protocol, PuppeteerErrors } from 'puppeteer';

export const signIn =
  (browser: Browser): Scrapper.SignIn.Handler =>
  async (req, res) => {
    console.log('Initiate Sign In process!');
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
      if (
        (<Error>e).message ===
        'waiting for selector `.sidebar-menu` failed: timeout 3000ms exceeded'
      ) {
        try {
          await page.waitForSelector('.login-container');
          res.status(401).json({ error: `Login is invalid!` });
        } catch (e2) {
          res.status(500).json({
            error: `There was a login failure: ${
              (<PuppeteerErrors>e2).message
            }`,
          });
        }
      } else {
        res.status(500).json({
          error: `There was a login failure: ${(<PuppeteerErrors>e).message}`,
        });
      }
    } finally {
      await page.close();
      console.log('Finalize Sign In process!');
    }
  };

export const readAppointments =
  (browser: Browser): Scrapper.Read.Appointments.Handler =>
  async (req, res) => {
    console.log('ReadAppointments: Initiate Read Appointments process!');
    if (!req.body.cookies || req.body.cookies.length === 0) {
      return res.status(401).json({ error: `Cookies not informed` });
    }
    console.log('ReadAppointments: Cookies are ok!');

    const cookies: Protocol.Network.CookieParam[] = req.body.cookies.map(
      ({ name, value }) => ({
        name,
        value,
      })
    );

    const page = await browser.newPage();
    console.log('ReadAppointments: new page created!');

    try {
      await page.goto(scrapper.worksheetRead);

      const loadCookies = cookies.map(async (cookie) => {
        return await page.setCookie(cookie);
      });
      await Promise.all(loadCookies);
      console.log('ReadAppointments: Cookies injected!');

      await page.goto(scrapper.worksheetRead);

      await page.waitForSelector('#tbWorksheet', { timeout: 3000 });
      console.log('ReadAppointments: Page loaded!');

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
      console.log('ReadAppointments: Finalize Read Appointments process!');
    }
  };

export const readAppointment =
  (): Scrapper.Read.Appointment.Handler => async (req, res) => {
    console.log('ReadAppointment: Initiate Read Appointment process!');
    if (!req.body.cookies || req.body.cookies.length === 0) {
      return res.status(401).json({ error: `Cookies not informed` });
    }

    const cookie: string = req.body.cookies.reduce(
      (previous, { name, value }) => `${previous} ${name}=${value};`,
      ''
    );

    const api = axios.create({
      baseURL: 'https://luby-timesheet.azurewebsites.net',
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'x-requested-with': 'XMLHttpRequest',
        cookie,
        Referer: 'https://luby-timesheet.azurewebsites.net/Worksheet/Read',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });

    /**
     * Get Appointment
     * @param {number} id
     * */
    const getAppointment = async (id: number) => {
      try {
        const { data } = await api.get<Scrapper.Read.Appointment.Appointment>(
          `/Worksheet/Update?id=${id}`
        );

        res.status(200).json({ appointment: data });
      } catch (e) {
        console.error(
          'Error on get appointment: ',
          (<AxiosError>e).response?.data
        );
        res.status(500).json({
          error: `Error on get appointment: ${(<AxiosError>e).response?.data}`,
        });
      }
    };

    await getAppointment(+req.body.appointmentId);

    console.log('ReadAppointment: Finalize Read Appointment process!');
  };

export const readClients =
  (): Scrapper.Read.Clients.Handler => async (req, res) => {
    console.log('Initiate Read Clients process!');
    if (!req.body.cookies || req.body.cookies.length === 0) {
      return res.status(401).json({ error: `Cookies not informed` });
    }

    const cookie: string = req.body.cookies.reduce(
      (previous, { name, value }) => `${previous} ${name}=${value};`,
      ''
    );

    const api = axios.create({
      baseURL: 'https://luby-timesheet.azurewebsites.net',
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'x-requested-with': 'XMLHttpRequest',
        cookie,
        Referer: 'https://luby-timesheet.azurewebsites.net/Worksheet/Read',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    });

    /**
     * ReadCategory
     * @param {number} idProject
     * */
    const listCategories = async (
      idProject: number
    ): Promise<Scrapper.Read.Clients.Category[]> => {
      try {
        const response = await api.post(
          '/Worksheet/ReadCategory',
          `idproject=${idProject}`
        );

        return response.data;
      } catch (e) {
        console.error('Error on list categories: ', e);
        return [];
      }
    };

    /**
     * ReadProjectProgress
     * @param {number} idProject
     * */
    const showProjectProgress = async (
      idProject: number
    ): Promise<Scrapper.Read.Clients.ProjectProgress> => {
      try {
        const response = await api.post(
          '/Worksheet/ReadProjectProgress',
          `idproject=${idProject}`
        );

        return response.data;
      } catch (e) {
        console.error('Error on show project progress: ', idProject);
        return {
          Budget: 0,
          CellName: null,
          ConsumedTimeInProject: '',
          CustomerName: '',
          EndDate: '',
          HourLimitPerMonth: null,
          Id: 0,
          IdCell: null,
          IdCustomer: 0,
          IdProject: idProject,
          IsMaintenance: false,
          NotMonetize: false,
          ProjectName: '',
          StartDate: '',
          TotalTime: '',
          TotalTimeInProject: '',
          TotalTimeMounth: '',
        };
      }
    };

    /**
     * ReadProject
     * @param {number} idCustomer
     * */
    const listProjects = async (
      idCustomer: number
    ): Promise<Scrapper.Read.Clients.Project[]> => {
      try {
        const { data } = await api.post<
          {
            Id: number;
            Name: string;
            StartDate: string;
            EndDate: string;
            IdCustomer: number;
          }[]
        >('/Worksheet/ReadProject', `idcustomer=${idCustomer}`);

        const projects = await data.map(async (project) => {
          const categories = await listCategories(project.Id);
          const progress = await showProjectProgress(project.Id);

          return { ...project, categories, progress };
        });

        return await Promise.all(projects);
      } catch (e) {
        console.error('Error on list projects: ', e);
        return [];
      }
    };

    /**
     * Read
     * */
    const listClients = async () => {
      try {
        const response = await api.get('/Worksheet/Read');

        const html: string = response.data;

        const regex = /(name="IdCustomer">)([\w\W]+?)(<\/select>)/gm;

        const search: string = (html.match(regex) || [''])[0];

        const cleanedSearch = search.split(/\r\n/gm).join('');

        const values = cleanedSearch.match(/value="([\S\s]+?)??">([\S\s]+?)</g);

        if (!values) {
          if (html.match('<div class="login-content">')) {
            res.status(401).json({ error: `Cookies are invalid!` });
          } else {
            res.status(500).json({ error: 'Options not found!' });
          }
          return;
        }

        const clientsPromise: Promise<Scrapper.Read.Clients.Client>[] =
          values.map(async (option) => {
            const [id, title] = option
              .replace(/value="([\S\s]+?)??">([\S\s]+?)</g, '$1|$2')
              .split('|');

            const projects = await listProjects(+id);

            return { id: id || '-1', title, projects };
          });

        const clients: Scrapper.Read.Clients.Client[] = await Promise.all(
          clientsPromise
        );

        res.status(200).json({ clients });
      } catch (e) {
        console.error('Error on list clients: ', e);
      }
    };

    await listClients();
    console.log('Finalize Read Clients process!');
  };

const checkValue = async (
  page: Page,
  selector: string,
  value: string | boolean
) => {
  console.log(`CreateAppointment: Check value of ${selector}...`);
  const response = await page.evaluate(
    (aSelector, aValue) => {
      const value = (<HTMLInputElement>document.querySelector(aSelector))[
        typeof aValue === 'boolean' ? 'checked' : 'value'
      ];

      if (value !== aValue) {
        if (typeof aValue === 'boolean')
          (<HTMLInputElement>document.querySelector(aSelector)).checked =
            aValue;
        else
          (<HTMLInputElement>document.querySelector(aSelector)).value = aValue;

        return false;
      }
      return true;
    },
    selector,
    value
  );

  if (response) {
    console.log(`CreateAppointment: ${selector} typed!`);
  } else {
    await checkValue(page, selector, value);
  }
};

export const createAppointment =
  (browser: Browser): Scrapper.Create.Appointment.Handler =>
  async (req, res) => {
    console.log('CreateAppointment: Initiate Create Appointments process!');
    if (!req.body.cookies || req.body.cookies.length === 0) {
      res.status(401).json({ error: `Cookies not informed` });
      return;
    }
    console.log('CreateAppointment: Cookies are ok!');

    const cookies: Protocol.Network.CookieParam[] = req.body.cookies.map(
      ({ name, value }) => ({ name, value })
    );

    const page = await browser.newPage();
    console.log('CreateAppointment: new page created!');

    try {
      await page.goto(scrapper.worksheetRead);
      const loadCookies = cookies.map(async (cookie) => {
        return await page.setCookie(cookie);
      });
      await Promise.all(loadCookies);
      console.log('CreateAppointment: Cookies injected!');
      await page.goto(scrapper.worksheetRead);
      await page.waitForSelector('#tbWorksheet', {
        visible: true,
        timeout: 3000,
      });
      console.log(`CreateAppointment: Now in ${scrapper.worksheetRead}!`);

      await page.select('#IdCustomer', req.body.customer);
      await page.waitForResponse((response) =>
        response.url().includes('/Worksheet/ReadProject')
      );
      console.log('CreateAppointment: #IdCustomer typed!');

      await page.select('#IdProject', req.body.project);
      await page.waitForResponse((response) =>
        response.url().includes('/Worksheet/ReadCategory')
      );
      await page.waitForResponse((response) =>
        response.url().includes('/Worksheet/ReadProjectProgress')
      );
      console.log('CreateAppointment: #IdProject typed!');

      await page.select('#IdCategory', req.body.category);
      console.log('CreateAppointment: #IdCategory typed!');

      await page.waitForSelector('#Description', {
        visible: true,
        timeout: 3000,
      });
      await page.click('#Description');
      await page.keyboard.type(req.body.description);
      await checkValue(page, '#Description', req.body.description);

      await page.waitForSelector('#InformedDate', {
        visible: true,
        timeout: 3000,
      });
      await page.click('#InformedDate');
      await page.keyboard.type(req.body.informedDate);
      await checkValue(page, '#InformedDate', req.body.informedDate);

      if (req.body.commit) {
        await page.waitForSelector('#CommitRepository', {
          visible: true,
          timeout: 3000,
        });
        await page.click('#CommitRepository');
        await page.keyboard.type(req.body.commit);
        await checkValue(page, '#CommitRepository', req.body.commit);
      }

      if (req.body.notMonetize) {
        await page.click('#NotMonetize');
        await checkValue(page, '#NotMonetize', req.body.notMonetize);
      }

      await page.waitForSelector('#StartTime', {
        visible: true,
        timeout: 3000,
      });
      await page.click('#StartTime');
      await page.keyboard.type(req.body.startTime);
      await checkValue(page, '#StartTime', req.body.startTime);

      await page.waitForSelector('#EndTime', { visible: true, timeout: 3000 });
      await page.click('#EndTime');
      await page.keyboard.type(req.body.endTime);
      await checkValue(page, '#EndTime', req.body.endTime);

      await page.click('[type="submit"]');
      console.log('CreateAppointment: form submitted!');
      await page.waitForSelector('.alert.alert-warning', { timeout: 3000 });
      res.status(200).json({ data: 'Success!' });
      console.log('CreateAppointment: Success!');
    } catch (e) {
      console.log('CreateAppointment: ok, we have a problem...');

      console.error({ e });

      switch ((<Error>e).message) {
        case 'waiting for selector `#tbWorksheet` failed: timeout 3000ms exceeded':
          console.log(
            'CreateAppointment: case waiting for selector `#tbWorksheet`'
          );
          try {
            await page.waitForSelector('.login-container');
            res.status(401).json({ error: `Cookies are invalid!` });
            console.log('CreateAppointment: Cookies are invalid!');
          } catch (e2) {
            res.status(500).json({
              error: `There was a create appointments failure: ${
                (<PuppeteerErrors>e).message
              }`,
            });
            console.log(
              `CreateAppointment: There was a create appointments failure: ${
                (<PuppeteerErrors>e).message
              }`
            );
          }
          break;
        case 'waiting for selector `.alert.alert-warning` failed: timeout 3000ms exceeded':
          console.log(
            'CreateAppointment: case waiting for selector `.alert.alert-warning`'
          );
          try {
            await page.waitForSelector('.alert.alert-danger', {
              visible: true,
              timeout: 3000,
            });
            const response = await page.evaluate(
              () => document.querySelector('.alert.alert-danger')?.textContent
            );

            res.status(500).json({
              error: response
                ? response.replace(/\n[\s]+/gm, '')
                : `There was a create appointments failure: ${
                    (<PuppeteerErrors>e).message
                  }`,
            });
            console.log(
              `CreateAppointment: ${
                response
                  ? response.replace(/\n[\s]+/gm, '')
                  : `There was a create appointments failure: ${
                      (<PuppeteerErrors>e).message
                    }`
              }`
            );
          } catch (e2) {
            res.status(500).json({
              error: `There was a create appointments failure: ${
                (<PuppeteerErrors>e2).message
              }`,
            });
            console.log(
              `CreateAppointment: There was a create appointments failure: ${
                (<PuppeteerErrors>e2).message
              }`
            );
          }
          break;
        default:
          console.log('CreateAppointment: default case');
          res.status(500).json({
            error: `There was a create appointments failure: ${
              (<PuppeteerErrors>e).message
            }`,
          });
          console.log(
            `CreateAppointment: There was a create appointments failure: ${
              (<PuppeteerErrors>e).message
            }`
          );
      }
    } finally {
      await page.close();
      console.log('CreateAppointment: Finalize Create Appointments process!');
    }
  };
