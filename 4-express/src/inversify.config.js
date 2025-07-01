import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types/types.js';
import { BrewsService } from './services/brews.service.js';
import './controllers/brews.controller.js';

const container = new Container();

container
    .bind(TYPES.BrewsService)
    .to(BrewsService)
    .inSingletonScope();

export default container;
