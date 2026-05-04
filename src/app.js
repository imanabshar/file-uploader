import express from 'express';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './lib/prisma.js';
import configurePassport from './config/passport.js';
import { fileURLToPath } from 'url';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import folderRoutes from './routes/folderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// configure ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

// passport
const passport = configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// set locals user
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/folders', folderRoutes);

//global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).render('errorPage', {
    message: err.message || 'Something went wrong',
  });
});

export default app;
