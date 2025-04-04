import { TDefaultReplyMarkup, TReplyMarkup } from "../../telegrot/type"


type AgencyReplyMarkup = TDefaultReplyMarkup & {
    welcome: () => TReplyMarkup
}

export {
    AgencyReplyMarkup
}