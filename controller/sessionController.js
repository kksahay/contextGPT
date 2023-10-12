import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

export const sessionMiddleware = session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
});
