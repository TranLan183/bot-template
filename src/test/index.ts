import { initRedis } from "../infra/cache/redis"
import { bot_template } from "../infra/telegram/telegram_bot/index"
import { connectInfra } from "../infra"
import { TTelegramBot } from "../infra/telegram/telegrot"
import { TeleConfigBotTemplate } from "../infra/telegram/telegram_bot/config_bot_script"

const test = async () => {
    await connectInfra()
    // initBotAgency()
}

test()
