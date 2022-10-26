import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import { Engine } from './engine/Engine';

const engine = new Engine();
engine.start();
