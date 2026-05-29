import { getLogger } from "@/utils/logger";

const log = getLogger("TestLogger");

log.trace("trace message");

log.debug("debug message");

log.info({ userId: 42 }, "User logged in");

log.warn("Rate limit approaching");

log.error(new Error("DB connection failed"), "Fatal service error");

log.fatal("fatal error");
