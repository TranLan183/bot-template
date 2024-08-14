import { NODE_ENV } from "../config"
import { connectInfra } from "../infra"
import { createMongoIndex } from "../infra/database/mongo/mongo"
import { bot_template } from "../infra/telegram/telegram_bot/index"
import { successConsoleLog } from "./color-log"

const init = async () => {

}

const RunServer = async (is_main: boolean = true) => {
    try {
        console.log({ is_main })
        console.log("========================")
        successConsoleLog("SERVER STARTING")
        await connectInfra()
        await init()
        if (!is_main) {
            successConsoleLog(`🍴Run Fork Cluster Job ...`)
        } else {
            successConsoleLog(`👑 Run Main Cluster Job ...`)
            if (NODE_ENV === "dev") {
            }
            Promise.all([
                createMongoIndex(),
            ])
            bot_template.init()
            if (NODE_ENV !== "local") {
                await Promise.all([
                ])
            }
        }
    } catch (e) {
        console.log(e)
        throw e
    }
}
const IntervalCheckHealth = async () => {

}
export const Main = async (first_run: boolean = true, is_main: boolean = true) => {
    try {
        first_run && RunServer(is_main)
        !first_run && IntervalCheckHealth()
    } catch (e) {
        console.log(e)
    } finally {
        setTimeout(() => Main(false, is_main), 60000)
    }
}

