require('dotenv').config();
const express = require('express');
const app = express();
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const {PORT = 3000, SENTRY_DSN, ENV} = process.env;

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // new ProfilingIntegration(),
        ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    environment: ENV
});
app.use(morgan('dev'));
app.use(express.json());

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.get('/', (req, res)=>{
            console.log(name);
    return res.json({
        status: true,
        message: 'Welcome Railway',
        error: null,
        data: null
    });
});

const authRouter = require('./routes/auth.routes');
app.use('/api/v1/auth', authRouter);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

//404
app.use((req, res, next)=>{
    res.status(404).json({
        status: false,
        message: 'Not Found!',
        err: err.message,
        data: null
    });
});

//505

app.listen(PORT, ()=> console.log('Listening on port', PORT));