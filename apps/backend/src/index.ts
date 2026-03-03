import { isProduction } from "@filmato/utils";
import { configure, getConsoleSink, getJsonLinesFormatter } from "@logtape/logtape";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import { env } from "./config/env.config.js";
import { appLogger } from "./config/loggers.config.js";
import { auth } from "./lib/auth.js";

dotenv.config();

await configure({
    sinks: {
        console: getConsoleSink({
            formatter: getJsonLinesFormatter({
                categorySeparator: ":",
                properties: "nest:props"
            })
        })
    },
    loggers: [
        { category: ["meta"], sinks: ["console"], lowestLevel: "debug" },
        { category: ["express"], sinks: ["console"], lowestLevel: isProduction(process.env.NODE_ENV) ? "info" : "debug" },
        { category: ["auth"], sinks: ["console"], lowestLevel: isProduction(process.env.NODE_ENV) ? "info" : "debug" }
    ]
});

const app = express();

app.use(cors({
    origin: env?.ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["x-retry-after"]
}));

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());

app.listen(env.PORT, '0.0.0.0', () => {
    appLogger.info(`@filmato/backend running on port: ${env?.PORT}`);
})