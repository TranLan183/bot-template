import { initRedis } from '../infra/cache/redis';
import { bot_template } from '../infra/telegram/telegram_bot/index';

const test = async () => {
    await initRedis()
    bot_template.init()
}
test()