import { cpus } from "os"
import { IS_FORK } from "./config"
import { CaptureException } from "./infra/logging/sentry"
import { ForkServer } from "./lib/fork_system"
import { Main } from "./lib/check_status"

/**
 * Database design: 
 * System flow: https://eips.ethereum.org/EIPS/eip-2771
 * Ticket Tracking: https://docs.google.com/spreadsheets/d/1L-PmEA1xTk2Abw_ce9wTHmbHbe-H1zQzxm2uEARKdLQ/edit#gid=0
 */


(async () => {
    try {
        ForkServer(Main, { is_use_fork: IS_FORK, number_of_cpu: cpus.length })
    } catch (e) {
        CaptureException(e, {})
    }
})()