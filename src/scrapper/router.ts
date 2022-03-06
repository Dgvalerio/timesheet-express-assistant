import {
  createAppointment,
  readAppointment,
  readAppointments,
  readClients,
  readTimeInterval,
  signIn,
} from '@/scrapper/controller';

import { Router } from 'express';
import { Browser } from 'puppeteer';

const generateScrapperRoutes = (browser: Browser) => {
  const scrapperRouter = Router();

  scrapperRouter.post('/sign-in', signIn(browser));

  scrapperRouter.post('/read-appointments', readAppointments(browser));

  scrapperRouter.post('/read-appointment', readAppointment());

  scrapperRouter.post('/read-clients', readClients());

  scrapperRouter.post('/create-appointment', createAppointment(browser));

  scrapperRouter.post('/read-time-interval', readTimeInterval(browser));

  return scrapperRouter;
};

export default generateScrapperRoutes;
