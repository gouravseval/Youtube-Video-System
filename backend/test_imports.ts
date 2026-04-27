import dotenv from "dotenv";
dotenv.config({ path: './.env' });
console.log("1. Dotenv loaded");

import "reflect-metadata";
console.log("2. Reflect metadata loaded");

import { connectDB } from './src/db/index.js';
console.log("3. connectDB imported");

import { app } from './app.js';
console.log("4. app imported");
