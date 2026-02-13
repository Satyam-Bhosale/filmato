import { configure, getAnsiColorFormatter, getConsoleSink, getLogger } from "@logtape/logtape";
import express from "express";
import { env } from "./config/env.config.js";


await configure({
    sinks: {console: getConsoleSink({
        formatter: getAnsiColorFormatter({
            timestampStyle: 'italic',
            timestampColor: 'cyan',
            level: "FULL"
        })
    })},
    loggers:[
        {category: ["express"], sinks: ["console"], lowestLevel: "info"}
    ]
});

const logger = getLogger('express');

const app = express();
app.use(express.json());

app.listen(env.PORT, () => {
    logger.info(`@filmato/backend running on port: ${env.PORT}`);
})