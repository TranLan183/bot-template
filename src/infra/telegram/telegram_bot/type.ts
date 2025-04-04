import { TTemplate } from "."
import { TTelegramBot } from "../telegrot"
import { TDefaultReplyMarkup, TReplyMarkup } from "../telegrot/type"


type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
}

type BotServiceType = TTelegramBot<BotReplyMarkup, TTemplate>

export {
    BotReplyMarkup,
    BotServiceType
}