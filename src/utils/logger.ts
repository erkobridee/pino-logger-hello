import pino, { type Logger } from "pino";

const isBrowser = typeof window !== "undefined";
const isProduction = process.env.MODE === "production";

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

  // Node.js transport (dev only, e.g. Vite SSR or scripts)
  ...(!isBrowser &&
    !isProduction && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: "SYS:standard",
        },
      },
    }),
});

export default logger;

// Child loggers per module
export function getLogger(module: string) {
  return logger.child({ module });
}
