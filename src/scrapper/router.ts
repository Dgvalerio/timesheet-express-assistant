import { readAppointments, signIn } from '@/scrapper/controller';

import { Router } from 'express';

const scrapperRouter = Router();

scrapperRouter.post('/sign-in', signIn);

scrapperRouter.post('/read-appointments', readAppointments);

export default scrapperRouter;
