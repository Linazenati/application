import 'reflect-metadata';
import 'module-alias/register';
import { Server } from '@app/server';
import { Container } from 'typedi';
// containeriser le server et le lancer
const server: Server = Container.get(Server);
server.init();
