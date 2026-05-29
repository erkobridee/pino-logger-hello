import pino from "pino";

const transport = pino.transport({
  target: "pino-opentelemetry-transport",
});

const logger = pino(transport);

transport.on("ready", () => {
  logger.info("test log to OneUptime");
});
