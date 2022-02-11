import {
  createAppointment,
  readAppointments,
  readClients,
  signIn,
} from '@/scrapper/controller';

import { Router } from 'express';

const scrapperRouter = Router();

scrapperRouter.post('/sign-in', signIn);

scrapperRouter.post('/read-appointments', readAppointments);

scrapperRouter.post('/read-clients', readClients);

scrapperRouter.post('/create-appointment', createAppointment);

export default scrapperRouter;
