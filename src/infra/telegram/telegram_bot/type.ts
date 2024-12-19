import { TDefaultReplyMarkup, TReplyMarkup } from "../telegrot/type"


type BotReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
}

export {
    BotReplyMarkup
}