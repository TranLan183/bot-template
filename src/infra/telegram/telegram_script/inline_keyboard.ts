import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram"
import { TInputMultipleInlineKeyboard, TTemplateMessage, TTemplateMessageConfig } from "./type"

class TelegramBotInlineKeyBoard {
    constructor(private templateMessage: TTemplateMessage, private customInlineKeyboard, private callback_data) {
    }
    public handleMultipleInlineKeyBoard = (parameters: TInputMultipleInlineKeyboard) => {
        const { callback_key, number_btn_row = 3, message_data, } = parameters
        const message = message_data ? message_data : this.templateMessage(parameters as TTemplateMessageConfig)
        if (!message) return []
        const extra_callback_key = parameters?.extra_callback_key || callback_key
        const arr_message = message.split('@')
        const keyboardRows: InlineKeyboardButton[][] = []
        arr_message.forEach((current_value: string, current_index: number) => {
            const rowIndex = Math.floor(current_index / number_btn_row)
            if (!keyboardRows[rowIndex]) keyboardRows[rowIndex] = []
            keyboardRows[rowIndex].push(this.customInlineKeyboard({ arr_message, callback_key, current_value, current_index, extra_callback_key }))
        })
        return keyboardRows
    }

    public handlePaginationInlineKeyBoard = (params: {
        page: number, page_size: number, total_data: number, callback_key: string, use_time_refresh?: boolean, use_infinity?: boolean
    }) => {
        const { page, page_size, total_data, callback_key, use_time_refresh = false, use_infinity = false } = params
        const totalPages = Math.ceil(total_data / page_size)
        if (totalPages <= 1 || totalPages === Infinity) return []
        const timeRefresh = use_time_refresh ? `&${Date.now()}` : ''
        const keyboardRows: { text: string; callback_data: string }[] = [
            { text: `${page === totalPages ? totalPages : page + 1}/${totalPages}`, callback_data: this.callback_data.unknown_callback }
        ]
        if (page > 0) {
            keyboardRows.unshift({ text: '<', callback_data: `${callback_key}&${page - 1}&${page_size}${timeRefresh}` })
        } else {
            if (use_infinity) keyboardRows.unshift({ text: '<', callback_data: `${callback_key}&${totalPages - 1}&${page_size}${timeRefresh}` })
        }
        if (page < totalPages - 1) {
            keyboardRows.push({ text: '>', callback_data: `${callback_key}&${page + 1}&${page_size}${timeRefresh}` })
        } else {
            if (use_infinity) keyboardRows.push({ text: '>', callback_data: `${callback_key}&${0}&${page_size}${timeRefresh}` })
        }
        return keyboardRows
    }
}

export {
    TelegramBotInlineKeyBoard
}