const { log } = require("../src/insightLog");

function runDemo() {
    log.info("Starting the app...");
    log.warn("This might not age well");
    log.error("Oops. Something broke.");
    log.success("It worked! 🎉");
    log.debug("You’re not supposed to see this");
}

runDemo();
