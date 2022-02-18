import {
  createAppointment,
  readAppointments,
  readClients,
  signIn,
} from '@/scrapper/controller';

import { Router } from 'express';
import { Browser } from 'puppeteer';

const generateScrapperRoutes = (browser: Browser) => {
  const scrapperRouter = Router();

  scrapperRouter.post('/sign-in', signIn(browser));

  scrapperRouter.post('/read-appointments', readAppointments(browser));

  scrapperRouter.post('/read-clients', readClients());

  scrapperRouter.post('/create-appointment', createAppointment(browser));

  return scrapperRouter;
};

export default generateScrapperRoutes;
