import { createServer } from "http"
import { Telegraf } from "telegraf"
import { successConsoleLog } from "../../lib/color-log"
import { MILLISECOND_PER_ONE_SEC } from "../../lib/constants"
import { ErrorHandler } from "../../lib/error_handler"
import { sleep } from "../../lib/utils"
import { TErrorKey, TSendMessageError, TTeleErrorList, TTelegramError } from "./telegram.type"
import { TelegramBotScript } from "./telegram_script"
import { TTemplate } from "./telegram_script/type"

type TTelegramBotInitParams<T> = {
    bot_name: string
    bot_token: string
    is_enable: boolean
    bot_error_list: TTeleErrorList[]
    bot_script: (tele_bot: Telegraf, bot_id?: string) => TelegramBotScript<T>
}
type TTelegramBotInitOptions = {
    is_use_local_telegram?: boolean
    local_telegram_url?: string
    is_use_webhook?: boolean
    webhook_url?: string
    webhook_port?: number
    delay_bot_start?: number
}
class TTelegramBot<T> {
    //Private variables
    private init_parameters: TTelegramBotInitParams<T>
    private init_options: TTelegramBotInitOptions
    private startup_func: () => void
    private DEFAULT_DELAY_BOT_START = 2000
    private RATE_LIMIT_RESPONSE = 4 * MILLISECOND_PER_ONE_SEC
    private bot_error_list: TTeleErrorList[]
    //Public variables
    public bot_steps = {
        welcome: "welcome",
        finish: "finish",
    }
    public tele_bot: Telegraf
    public bot_script: TelegramBotScript<T>
    public bot_start_at: Date = new Date()
    public last_bot_message_received_at: Date = new Date()
    public messageInQueue = new Map<number, { type: "start" | "command" | "action" | "message" | "inline_mode", ctx: any }>()
    
    constructor(
        parameters: TTelegramBotInitParams<T>,
        options: TTelegramBotInitOptions,
        startup_func: () => void
    ) {
        this.startup_func = startup_func
        this.init_parameters = parameters
        this.init_options = options
        const { bot_token } = this.init_parameters
        const { is_use_local_telegram, local_telegram_url, is_use_webhook, webhook_port, webhook_url } = options
        if (is_use_local_telegram) {
            if (!local_telegram_url) throw new Error(`Missing [local_telegram_url] option param when enable local telegram`)
        }
        if (is_use_webhook) {
            if (!webhook_url) throw new Error(`Missing [webhook_url] option param when enable webhook`)
            if (!webhook_port) throw new Error(`Missing [webhook_port] option param when enable webhook`)
        }
        this.tele_bot = new Telegraf(bot_token, {
            telegram: {
                apiRoot: is_use_local_telegram ? local_telegram_url : undefined,
                webhookReply: is_use_webhook
            }
        })
        this.bot_script = parameters.bot_script(this.tele_bot)
        this.bot_error_list = parameters.bot_error_list
    }

    public init = async () => {
        try {
            if (this.init_parameters.is_enable) {
                this.startup_func()
                this.bot_script.setCommands(this.bot_script.all_commands())
                const holdStart = async () => {
                    while (!this.isBotReadyToStart()) {
                        await sleep(1000)
                        if (this.isBotReadyToStart()) {
                            for (let [key, value] of this.messageInQueue.entries()) {
                                await this.bot_script.sendMessage(key, {
                                    template: "bot_message",
                                    args: {
                                        message: "🤖 Thanks for waiting, TOB Bot is available now!"
                                    }
                                })
                                await sleep(100)
                            }
                        }
                    }
                }

                if (this.init_options.is_use_webhook) {
                    const path = `/${this.tele_bot.secretPathComponent()}`
                    console.log({ path })
                    const webhook = this.tele_bot.webhookCallback(path)
                    createServer(webhook).listen(this.init_options.webhook_port!)
                    const response = await this.setWebhook(path)
                    console.log({ response })
                    successConsoleLog(`🚀 Telegram bot ${this.init_parameters.bot_name}: ready`)
                    await holdStart()
                } else {
                    this.tele_bot.launch()
                    await holdStart()
                    this.setLastMessageReceivedDate()
                    successConsoleLog(`🚀 Telegram bot ${this.init_parameters.bot_name}: ready`)
                    this.checkRestartBot()
                    this.tele_bot.catch((err, ctx) => {
                        console.log(`Polling error!`)
                        console.log(err, ctx)
                        this.tele_bot.launch()
                    })
                }
                await this.tele_bot.telegram.setMyDescription(this.bot_script.templateMessage({ template: "full_description" }))
                await this.tele_bot.telegram.setMyShortDescription(this.bot_script.templateMessage({ template: "short_description" }))
            } else {
                console.log(`Disable Telegram Bot ... To open please change env ENABLE_TELEGRAM to true`)
            }
        } catch (e) {
            console.log(`Initialize ${this.init_parameters.bot_name} failed`)
            ErrorHandler(e, {}, `Initialize ${this.init_parameters.bot_name} failed!`)
        }
    }

    private setWebhook = async (path: string) => {
        const telegram_url: string = this.init_options.is_use_local_telegram ? this.init_options.local_telegram_url! : "https://api.telegram.org"
        const url = `${telegram_url}/bot${this.init_parameters.bot_token}/setWebhook?url=${this.init_options.webhook_url}:${this.init_options.webhook_port}${path}`
        const data = await fetch(url)
        return (await data.json())
    }

    private checkRestartBot = async () => {
        try {
            if (+new Date() > +this.last_bot_message_received_at + 2 * 60 * MILLISECOND_PER_ONE_SEC) {
                console.log(`Restarting Bot ...`)
                this.tele_bot.stop()
                await sleep(3000)
                this.tele_bot.launch()
                console.log(`Bot restart successfully`)
                this.last_bot_message_received_at = new Date()
            }
        } catch (e) {
            console.log(e)
        } finally {
            setTimeout(this.checkRestartBot, 3000)
        }
    }

    public isBotReadyToStart = () => (+new Date() - +this.bot_start_at) > (this.init_options.delay_bot_start || this.DEFAULT_DELAY_BOT_START)
    public setLastMessageReceivedDate = () => this.last_bot_message_received_at = new Date()

    private stopListeningFromChatIdCache = new Map<string, number>()
    public isStopListeningFromChatId = (chat_id: string) => {
        const stop_listen_to = this.stopListeningFromChatIdCache.get(chat_id)
        if (!stop_listen_to) return false
        if (new Date().getTime() > stop_listen_to) {
            this.stopListeningFromChatIdCache.delete(chat_id)
            return false
        }
        return true
    }
    public setStopListeningFromChatId = (chat_id: string, stop_time_ms: number) => {
        this.stopListeningFromChatIdCache.set(chat_id, new Date().getTime() + stop_time_ms)
    }

    private handleSendMessageError = async (params: TSendMessageError) => {
        const { context_id, args, language, message_id, error_key, use_lifetime = false } = params
        const convertErrKey = error_key.toLowerCase() as TTemplate
        if (context_id.length < 19 && use_lifetime) {
            return await this.bot_script.sendMessage(context_id, { ...params, template: convertErrKey, parse_mode: true, life_time: 'medium' })
        }
        return context_id.length < 19 ? await this.bot_script.sendMessage(context_id, { template: convertErrKey, args, language, message_id, parse_mode: true }) : await this.bot_script.sendAnswerCbQuery(context_id, { template: convertErrKey, args, language })
    }

    public ConvertTeleError = async (e: any, options: TTelegramError) => {
        try {
            const message = e.message as string
            switch (true) {
                case Object.keys(this.bot_error_list[0]).includes(message):
                    await this.handleSendMessageError({ ...options, error_key: this.bot_error_list[0][message], context_id: options.context_id.toString() })
                    break;
                case Object.keys(this.bot_error_list[1]).includes(message):
                    await this.handleSendMessageError({ ...options, error_key: this.bot_error_list[1][message], context_id: options.context_id.toString(), use_lifetime: true })
                    break;
                default:
                    await this.handleSendMessageError({ ...options, error_key: 'error' as TErrorKey, context_id: options.context_id.toString() })
                    break;
            }
        } catch (err) {
            console.log(err)
        }
        return
    }
}

export {
    TTelegramBot
}
