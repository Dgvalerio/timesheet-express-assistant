import { signIn } from '@/scrapper/controller';

import { Router } from 'express';

const scrapperRouter = Router();

scrapperRouter.post('/sign-in', signIn);

export default scrapperRouter;
