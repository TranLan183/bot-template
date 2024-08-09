import { TReplyMarkup } from "../telegram_script/type"


type BotReplyMarkup = {
    welcome: () => TReplyMarkup
}

export {
    BotReplyMarkup
}