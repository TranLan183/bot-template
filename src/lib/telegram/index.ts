import { createServer } from "http"
import { Telegraf } from "telegraf"
import { successConsoleLog } from "../../lib/color-log"
import { MILLISECOND_PER_ONE_SEC } from "../../lib/constants"
import { ErrorHandler } from "../../lib/error_handler"
import { sleep } from "../../lib/utils"
import { TelegramBotScript } from "./script"
import { TSendMessageError, TTeleErrorList, TTelegramBotInitOptions, TTelegramBotInitParams, TTelegramError } from "./type"
import { DEFAULT_DELAY_BOT_START } from "./constant"

class TelegramBotService<GReplyMarkup, GTemplate> {
    //Private variab
    private init_parameters: TTelegramBotInitParams<GReplyMarkup, GTemplate>
    private init_options: TTelegramBotInitOptions
    private startup_func: (bot_method: TelegramBotService<GReplyMarkup, GTemplate>) => void
    private bot_error_list: TTeleErrorList[]
    private stopListeningFromChatIdCache = new Map<string, number>()
    //Public variables
    public tele_bot: Telegraf
    public bot_script: TelegramBotScript<GReplyMarkup, GTemplate>
    public bot_start_at: Date = new Date()
    public last_bot_message_received_at: Date = new Date()
    public messageInQueue = new Map<number, { type: "start" | "command" | "action" | "message" | "inline_mode", ctx: any }>()

    constructor(
        parameters: TTelegramBotInitParams<GReplyMarkup, GTemplate>,
        options: TTelegramBotInitOptions,
        startup_func: (bot_method: TelegramBotService<GReplyMarkup, GTemplate>) => void
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
        this.bot_script = new TelegramBotScript(this.tele_bot, parameters.bot_config)
        this.bot_error_list = parameters.bot_error_list
    }

    public run = async () => {
        const { is_enable, bot_name } = this.init_parameters
        const { is_use_webhook, is_set_description } = this.init_options
        try {
            if (is_enable) {
                this.bot_script.setCommands(this.bot_script.all_commands())
                this.startup_func(this)

                if (is_use_webhook) {
                    const path = `/${this.tele_bot.secretPathComponent()}`
                    console.log({ path })
                    const webhook = this.tele_bot.webhookCallback(path)
                    createServer(webhook).listen(this.init_options.webhook_port!)
                    const response = await this.setWebhook(path)
                    console.log({ response })
                    successConsoleLog(`🚀 Telegram bot ${this.init_parameters.bot_name}: ready`)
                    await this.waitingLaunchStart()
                } else {
                    this.tele_bot.launch()
                    await this.waitingLaunchStart()
                    this.setLastMessageReceivedDate()
                    successConsoleLog(`🚀 Telegram bot ${this.init_parameters.bot_name}: ready`)
                    this.checkRestartBot()
                    this.warningErrorBot()
                }
                if (is_set_description) await this.setDescriptionBot()
            } else {
                console.log(`Disable Telegram Bot ... To open please change env ENABLE_TELEGRAM to true`)
            }
        } catch (e) {
            console.log(`Initialize ${bot_name} failed`)
            ErrorHandler(e, {}, `Initialize ${bot_name} failed!`)
        }
    }

    private warningErrorBot = () => {
        this.tele_bot.catch((err, ctx) => {
            console.log(`Polling error!`)
            console.log(err, ctx)
            this.tele_bot.launch()
        })
    }

    private setDescriptionBot = async () => {
        await Promise.all([
            this.bot_script.setDescription({ template: 'full_description' }),
            this.bot_script.setShortDescription({ template: "short_description" })
        ])
    }

    private waitingLaunchStart = async () => {
        while (!this.isBotReadyToStart()) {
            await sleep(1000)
            if (this.isBotReadyToStart()) {
                for (let [key, value] of this.messageInQueue.entries()) {
                    await this.bot_script.sendMessage(key, { template: 'waiting_bot' })
                    await sleep(100)
                }
            }
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

    public isBotReadyToStart = () => (+new Date() - +this.bot_start_at) > (this.init_options.delay_bot_start || DEFAULT_DELAY_BOT_START)
    public setLastMessageReceivedDate = () => this.last_bot_message_received_at = new Date()

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
        const convertErrKey = error_key.toLowerCase() as any
        if (context_id.length < 19 && use_lifetime) {
            return await this.bot_script.sendMessage(context_id, { ...params, template: convertErrKey, parse_mode: true, life_time: 'medium' })
        }
        return context_id.length < 19 ? await this.bot_script.sendMessage(context_id, { template: convertErrKey, args, language, message_id, parse_mode: true }) : await this.bot_script.sendAnswerCbQuery(context_id, { template: convertErrKey, args, language })
    }

    public ConvertTeleError = async (e: any, options: TTelegramError, funcName: string,) => {
        ErrorHandler(e, options.args, funcName)
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
                    await this.handleSendMessageError({ ...options, error_key: 'error', context_id: options.context_id.toString() })
                    break;
            }
        } catch (err) {
            console.log(err)
        } finally {
            this.setStopListeningFromChatId(options.context_id as string, NaN)
        }
        return
    }
}

export {
    TelegramBotService
}