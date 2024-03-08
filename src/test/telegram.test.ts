import { initRedis } from '../infra/cache/redis';
import { InitTelegramBot } from '../infra/telegram/telegram_bot/index'

const test = async () => {
    await initRedis()
    InitTelegramBot()
}
test()