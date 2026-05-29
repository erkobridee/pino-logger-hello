import type { Logger, TransportTargetOptions } from "pino";

import pino from "pino";

const isBrowser = typeof window !== "undefined";
const isProduction = process.env.MODE === "production";

interface Transports {
  targets: TransportTargetOptions[];
}

const transport: Transports = {
  targets: [
    {
      target: "pino-opentelemetry-transport",
      options: {
        "service.name": process.env.OTEL_SERVICE_NAME || "my-node-api",
        "service.version": "1.0.0",
        "deployment.environment": process.env.NODE_ENV || "development",
      },
    },
  ],
};

// Node.js transport (dev only, e.g. Vite SSR or scripts)
if (!isBrowser && !isProduction) {
  transport.targets.push({
    target: "pino-pretty",
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: "SYS:standard",
    },
  });
}

const logger: Logger = pino({
  level: process.env.LOG_LEVEL || "debug",

  // Browser-specific config (pino-pretty NOT available here)
  ...(isBrowser && {
    browser: {
      asObject: true,
      write: (logObj) => {
        const { level, msg, time, ...rest } = logObj as Record<string, unknown>;
        const levelLabel = String(level).toUpperCase();
        const timestamp = new Date(time as number).toISOString();
        console.log(`[${timestamp}] ${levelLabel}: ${msg}`, rest);
      },
      formatters: {
        level: (label) => ({ level: label }),
      },
    },
  }),

  transport,
});

export default logger;

// Child loggers per module
export function getLogger(module: string) {
  return logger.child({ module });
}
