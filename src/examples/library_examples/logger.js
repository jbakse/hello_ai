// this file demonstrates how to use the logger utility

// import it, make sure the path is correct!
import * as log from "../../shared/logger.ts";

// set the log level to what you want
// the default is log.LogLevel.LOG
// here we set it to log.LogLevel.DEBUG so we'll see all messages
log.setLogLevel(log.LogLevel.DEBUG);

// prints pretty messages to the console
// should include the file name and line number
log.debug("This is a debug message");
log.info("This is a info message");
log.log("This is a log message");
log.warn("This is a warn message");
log.error("This is a error message");

// should also include the containing function name
function main() {
    log.debug("This is a debug message");
    log.info("This is a info message");
    log.log("This is a log message");
    log.warn("This is a warn message");
    log.error("This is a error message");
}
main();

// should filter logs below the current level
// lets set it to WARN to hide DEBUG and INFO and LOG messages
log.setLogLevel(log.LogLevel.WARN);
log.debug("This is a debug message");
log.info("This is a info message");
log.log("This is a log message");
log.warn("This is a warn message");
log.error("This is a error message");

// can log objects too
log.setLogLevel(log.LogLevel.DEBUG);
const myObj = {
    name: "Ada",
    age: 209,
    city: "London",
};
log.log(myObj);
