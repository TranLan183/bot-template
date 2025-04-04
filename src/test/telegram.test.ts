import { initRedis } from '../infra/cache/redis';
import { bot_example } from '../infra/telegram/telegram_bot/index';

const test = async () => {
    await initRedis()
    bot_example.init()
}
test()