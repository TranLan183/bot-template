import { TDefaultReplyMarkup, TReplyMarkup } from "../../../lib/telegram/type"


type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
}

export {
    BotReplyMarkup
}