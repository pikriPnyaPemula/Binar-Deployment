require('dotenv').config();
const express = require('express');
const app = express();
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const {PORT = 3000, SENTRY_DSN, RAILWAY_ENVIRONMENT_NAME} = process.env;

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
    environment: RAILWAY_ENVIRONMENT_NAME
});

app.use(morgan('dev'));
app.use(express.json());

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.get('/', (req, res)=>{
    console.log(name);
    return res.json({
        status: true,
        message: 'Welcome To Railway',
        error: null,
        data: {
            env: RAILWAY_ENVIRONMENT_NAME
        }
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
        err: null,
        data: null
    });
});

//505
app.use((err, req, res, next) => {
    res.status(500).json({
        status: false,
        message: 'Internal Server Error',
        error: err.message,
        data: {
            env: RAILWAY_ENVIRONMENT_NAME
        }
    });
});

app.listen(PORT, ()=> console.log('Listening on port', PORT));