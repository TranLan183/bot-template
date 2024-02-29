import { IS_DEBUG, SERVER_CODE } from "../config"
import { CaptureException } from "../infra/logging/sentry"
import { HTTP_ERROR_CODE } from "./http-error"
import { convertErrorToString } from "./utils"

export const genCodeName = (msg: string, add_msg?: string) => `${SERVER_CODE}:${msg} ${ErrCodeMessage[SERVER_CODE + msg]}${add_msg ? ` ${add_msg}` : ""}`

export const ErrMsg = (msg: string, add_msg?: string) => {
    const gen = genCodeName(msg, add_msg)
    return new Error(gen)
}
export const validateMissing = (object: any) => {
    for (let el in object) {
        if (object[el] === null || object[el] === undefined || object[el] === "") throw ErrMsg(ERROR_CODE.MISSING_PARAMS, el)
    }
}

export const isInternalErrorCode = (e: any) => {
    let { message } = e
    return message.startsWith(`${SERVER_CODE}:`)
}

/**
 * Show the error and capture exception to Sentry
 * @param e error 
 * @param args params of user 
 * @param funcName Name of function
 */

export function ErrorHandler(e: any, args: any, funcName: string) {
    let { message } = e
    if (!message) message = ""
    const { password, ...params } = args
    if (message.startsWith(`${SERVER_CODE}:`)) {
        if (IS_DEBUG) {
            const errCode = message.substring(0, SERVER_CODE.length) + message.substring(SERVER_CODE.length + 1);
            console.log('\n========================================================================================\n')
            console.log('\x1b[33m%s\x1b[0m', `⚠️  WARNING : EXPECTED ERROR HAPPENED!\n`)
            console.log('Function:', funcName)
            console.log(`Argument:`, JSON.stringify(params))
            console.log(`Message:`, ErrCodeMessage[errCode] ? ErrCodeMessage[errCode] : message.substring(SERVER_CODE.length + 1))
            console.log(`Stack:`, e.stack)
            console.log('\n========================================================================================')
        }
    } else {
        console.log('\n========================================================================================\n')
        console.log('\x1b[31m%s\x1b[0m', `🔥  🔥  🔥  DANGER : UNEXPECTED ERROR HAPPENED!\n `)
        console.log('Function:', funcName)
        console.log(`Argument:`, JSON.stringify(params))
        console.log(`Stack:`, e?.stack || e)
        console.log('\n========================================================================================')
        CaptureException(e, { args: JSON.parse(JSON.stringify(args)) }, false)
        e = ErrMsg(ERROR_CODE.UNEXPECTED_ERROR, convertErrorToString(e))
    }
    return {
        throwErr: () => {
            throw e
        }
    }
}

const ErrCodeMessage = {
    RLS000: "UNEXPECTED_ERROR",
    RLS100: "SIGNATURE_INVALID",
    RLS101: "AUTHORIZATION_REQUIRED",
    RLS102: "HEADER_ADDRESS_REQUIRED",
    RLS103: "ADMIN_REQUIRED",
    RLS104: "SIGNATURE_OUTDATE",
    RLS105: "NOT_SUPPORT",
    RLS106: "API_KEY_REQUIRED",
    RLS107: "INVALID_API_KEY",

    RLS200: "SIGNATURE_INVALID",
    RLS201: "DOMAIN_NOT_EXIST",
    RLS202: "MUST_APPROVE_FIRST",
    RLS203: "INSUFFICIENT_WTRX",
    RLS204: "INVALID_API_KEY",
    RLS205: "INSUFFICIENT_BALANCE",
    RLS206: "INVALID_PAYMENT_METHOD",

    RLS212: "ADDRESS_INVALID",
    RLS213: "DURATION_INVALID",
    RLS214: "AlREADY_MINT_WTRX",
    RLS215: "USER_HAS_SET_PERMIT",
    RLS216: "PERMISSION_INVALID",
    RLS217: "USER_PERMISSION_NOT_EXIST",
    RLS218: "TRANSACTION_ID_ALREADY_EXISTS",
    RLS219: "NON_OWNER_TRANSACTION",
    RLS220: "ORDER_REQUEST_NOT_EXISTS",
    RLS221: "FEE_LIMIT_TOO_HIGH",
    RLS222: "ORDER_REQUEST_CAN_NOT_CANCEL",
    RLS223: "PARAMS_NOT_MATCH_TRANSACTION",
    RLS224: "REF_CODE_ALREADY_EXIST",
    RLS225: "ORDER_BUY_ENERGY_CAN_NOT_CREATE",
    RLS226: "ORDER_ALREADY_CANCEL",
    RLS227: "ORDER_ACTIVE_TIME_TOO_SHORT_TO_CANCEL",
    RLS228: "ORDER_ACTIVE_TIME_TOO_SHORT_TO_UPDATE",
    RLS229: "ORDER_CAN_NOT_UPDATE",
    RLS230: "SPONSOR_CODE_NOT_FOUND",
    RLS231: "CAN_NOT_REF_YOURSELF",
    RLS232: "ORDER_BUY_ENERGY_AMOUNT_TOO_SMALL",
    RLS233: "USER_TELE_NOT_FOUND",
    RLS234: "INVALID_CACHE_ORDER_IN_TELE",
    RLS235: "INVALID_CACHE_USER_STORAGE_IN_TELE",
    RLS236: "USER_REF_NOT_FOUND",
    RLS237: "MISSING_PERMISSIONS",
    RLS238: "CONTACT_NOT_EXISTS",
    RLS239: "USER_HAS_VERIFIED",
    RLS240: "TOO_FAST_ACTION",
    RLS241: "INVALID_VERIFY_CODE",
    RLS242: "VERIFY_CODE_NOT_FOUND",
    RLS243: "PENDING_ORDER_ALREADY_EXIST",
    RLS244: "PENDING_ORDER_NOT_EXIST",

    RLS400: "MISSING_PARAMS",
    RLS401: "INVALID_PAGE",
    RLS402: "INVALID_PAGESIZE",
    RLS403: "INVALID_VALID_UNTIL_TIME",
    RLS404: "INVALID_ERC20_ADDRESS",
    RLS405: "INVALID_VALUE",
    RLS406: "USER_NOT_EXIST",
    RLS407: "BALANCE_IS_NOT_ENOUGH",
    RLS408: "INVALID_PARAMS",
    RLS409: "PROJECT_NOT_EXISTS",
    RLS410: "PROJECT_NAME_EXISTS",
    RLS412: "TRANSACTION_IS_NOT_VALID_TRANSFER_TRX",
    RLS414: "MIN_TRANSFER_AMOUNT",
    RLS415: "ABI_INVALID",
    RLS416: "RECIPIENT_CONTRACT_NOT_EXISTS",
    RLS417: "RECIPIENT_CONTRACT_ALREADY_EXISTS",
    RLS418: "RECIPIENT_CONTRACT_INVALID",
    RLS419: "METHOD_CALLING_IS_NOT_SUPPORT",
    RLS420: "TRANSACTION_IS_NOT_DELEGATE_RESOURCE",
    RLS421: "TRANSACTION_IS_NOT_VALID_DELEGATE_RESOURCE",
    RLS422: "NOT_SUPPORT_PARTIAL_ORDER",
    RLS423: "ORDER_IS_FULLED",
    RLS424: "DELEGATED_FOR_USER_NOT_AVAILABLE",
    RLS425: "FAST_REQUEST",
    RLS426: "SINGEDTX_EXPIRED",
    RLS427: "REF_CODE_INVALID",
    RLS428: "USER_NOT_ENOUGH_COMMISSION",
    RLS429: "USER_ALREADY_EXISTS",
    RLS430: "TRANSACTION_IS_NOT_VALID_TRANSFER_TRC10",
    RLS431: "DELEGATE_RESOURCE_AMOUNT_OUT_OF_RANGE",
    RLS432: "DELEGATE_RESOURCE_LOCK_PERIOD_NOT_MATCHED",
    RLS433: "CANNOT_SET_PARTIAL_FULFILLED",
    RLS434: "TRANSFER_BALANCE_NOT_CORRECT",
    RLS435: "SINGED_TX_REQUIRED",
    RLS436: "INVALID_EXTEND_TIME",
    RLS437: "SOME_MATCHED_ORDER_CANNOT_EXTEND",
    RLS438: "NRG_TX_NOT_CORRECT",
    RLS439: "INTERNAL_ACCOUNT_NOT_FOUND",
    RLS440: "INTERNAL_BALANCE_ACCOUNT_NOT_ENOUGH",
    RLS441: "UNIT_PRICE_TOO_LOW",
    RLS442: "INIT_DATA_INVALID",
    RLS443: "MIN_STAKE_AMOUNT_INVALID",
    RLS444: "REMAINING_AMOUNT_INVALID",
    RLS445: "MIN_WITHDRAW_AMOUNT_INVALID",
    RLS446: "INVALID_USERNAME_TELEGRAM",
    RLS447: "TYPE_CONTACT_NOT_EXISTS",
    RLS448: "AMOUNT_ENERGY_TOO_LOW",
    RLS449: "RESOURCE_INVALID",
    RLS450: "CALCULATE_INVALID_ARGUMENTS",
    RLS451: "ENERGY_INVALID_ARGUMENTS",
    RLS452: "CHANGE_LANGUAGE_INVALID_ARGUMENTS",
    RLS453: "COMMAND_INVALID_ARGUMENTS",
    RLS454: "CANNOT_FULLFILED",
    RLS455: "PRICE_EXCEED_MAX_PRICE_REQUIRED",

    RLS501: "SERVER_MAINTAINED",
    RLS502: 'BOT_INSUFFICIENT_BALANCE',

    RLS600: "RATE_LIMIT",
}

export const ERROR_CODE = {
    //==========UNEXPECTED ERROR==========
    UNEXPECTED_ERROR: '000',
    SUCCESS: '001',
    //==========AUTH==============
    AUTHORIZATION_REQUIRED: '101',
    HEADER_ADDRESS_REQUIRED: '102',
    SIGNATURE_OUTDATE: '104',
    NOT_SUPPORT: '105',
    API_KEY_REQUIRED: '106',
    INVALID_API_KEY: "107",

    //==========FETCH DATA==========
    SIGNATURE_INVALID: '200',
    DOMAIN_NOT_EXIST: '201',
    MUST_APPROVE_FIRST: "202",
    INSUFFICIENT_WTRX: "203",
    INSUFFICIENT_BALANCE: "205",
    INVALID_PAYMENT_METHOD: "206",
    ADDRESS_INVALID: '212',
    DURATION_INVALID: '213',
    AlREADY_MINT_WTRX: '214',
    USER_HAS_SET_PERMIT: '215',
    PERMISSION_INVALID: '216',
    USER_PERMISSION_NOT_EXIST: '217',
    TRANSACTION_ID_ALREADY_EXISTS: '218',
    NON_OWNER_TRANSACTION: '219',
    ORDER_REQUEST_NOT_EXISTS: '220',
    FEE_LIMIT_TOO_HIGH: '221',
    ORDER_REQUEST_CAN_NOT_CANCEL: '222',
    PARAMS_NOT_MATCH_TRANSACTION: '223',
    REF_CODE_ALREADY_EXIST: '224',
    ORDER_BUY_ENERGY_CAN_NOT_CREATE: '225',
    ORDER_ALREADY_CANCEL: '226',
    ORDER_ACTIVE_TIME_TOO_SHORT_TO_CANCEL: '227',
    ORDER_ACTIVE_TIME_TOO_SHORT_TO_UPDATE: '228',
    ORDER_CAN_NOT_UPDATE: '229',
    SPONSOR_CODE_NOT_FOUND: '230',
    CAN_NOT_REF_YOURSELF: '231',
    ORDER_BUY_ENERGY_AMOUNT_TOO_SMALL: '232',
    USER_TELE_NOT_FOUND: '233',
    INVALID_CACHE_ORDER_IN_TELE: '234',
    INVALID_CACHE_USER_STORAGE_IN_TELE: '235',
    USER_REF_NOT_FOUND: '236',
    MISSING_PERMISSIONS: '237',
    CONTACT_NOT_EXISTS: '238',
    USER_HAS_VERIFIED: '239',
    TOO_FAST_ACTION: '240',
    INVALID_VERIFY_CODE: '241',
    VERIFY_CODE_NOT_FOUND: '242',
    PENDING_ORDER_ALREADY_EXIST: '243',
    PENDING_ORDER_NOT_EXIST: '244',

    //==========PARAMS==============
    MISSING_PARAMS: '400',
    INVALID_PAGE: '401',
    INVALID_PAGESIZE: '402',
    INVALID_VALID_UNTIL_TIME: '403',
    INVALID_VALUE: '405',
    USER_NOT_EXIST: '406',
    INVALID_PARAMS: '408',
    PROJECT_NOT_EXISTS: '409',
    PROJECT_NAME_EXISTS: '410',
    TRANSACTION_IS_NOT_VALID_TRANSFER_TRX: '412',
    MIN_TRANSFER_AMOUNT: '414',
    ABI_INVALID: '415',
    RECIPIENT_CONTRACT_NOT_EXISTS: '416',
    RECIPIENT_CONTRACT_ALREADY_EXISTS: '417',
    RECIPIENT_CONTRACT_INVALID: '418',
    METHOD_CALLING_IS_NOT_SUPPORT: '419',
    TRANSACTION_IS_NOT_DELEGATE_RESOURCE: '420',
    TRANSACTION_IS_NOT_VALID_DELEGATE_RESOURCE: '421',
    NOT_SUPPORT_PARTIAL_ORDER: '422',
    ORDER_IS_FULLED: '423',
    DELEGATED_FOR_USER_NOT_AVAILABLE: '424',
    FAST_REQUEST: '425',
    SINGEDTX_EXPIRED: '426',
    REF_CODE_INVALID: '427',
    USER_NOT_ENOUGH_COMMISSION: '428',
    USER_ALREADY_EXISTS: '429',
    TRANSACTION_IS_NOT_VALID_TRANSFER_TRC10: '430',
    DELEGATE_RESOURCE_AMOUNT_OUT_OF_RANGE: '431',
    DELEGATE_RESOURCE_LOCK_PERIOD_NOT_MATCHED: '432',
    CANNOT_SET_PARTIAL_FULFILLED: '433',
    TRANSFER_BALANCE_NOT_CORRECT: '434',
    SIGNED_TX_REQUIRED: '435',
    INVALID_EXTEND_TIME: '436',
    SOME_MATCHED_ORDER_CANNOT_EXTEND: '437',
    NRG_TX_NOT_CORRECT: '438',
    INTERNAL_ACCOUNT_NOT_FOUND: '439',
    INTERNAL_BALANCE_ACCOUNT_NOT_ENOUGH: '440',
    UNIT_PRICE_TOO_LOW: '441',
    INIT_DATA_INVALID: '442',
    MIN_STAKE_AMOUNT_INVALID: '443',
    REMAINING_AMOUNT_INVALID: '444',
    MIN_WITHDRAW_AMOUNT_INVALID: '445',
    INVALID_USERNAME_TELEGRAM: '446',
    TYPE_CONTACT_NOT_EXISTS: '447',
    AMOUNT_ENERGY_TOO_LOW: '448',
    RESOURCE_INVALID: '449',
    CALCULATE_INVALID_ARGUMENTS: '450',
    ENERGY_INVALID_ARGUMENTS: '451',
    CHANGE_LANGUAGE_INVALID_ARGUMENTS: '452',
    COMMAND_INVALID_ARGUMENTS: '453',
    CANNOT_FULFILLED: '454',
    PRICE_EXCEED_MAX_PRICE_REQUIRED: '455',

    //==========SERVER==============
    SERVER_MAINTAINED: '501',
    BOT_INSUFFICIENT_BALANCE: '502',
    //==========BUSINESS==============
    //==========RATELIMIT==============
    RATE_LIMIT: '600',
}

export const getHTTPErrorCode = (e: Error) => {
    const start_message = e.message?.substring(0, SERVER_CODE.length + 2)
    switch (start_message) {
        case `${SERVER_CODE}:1`:
            return HTTP_ERROR_CODE.UNAUTHORIZED_401
        case `${SERVER_CODE}:2`:
            return HTTP_ERROR_CODE.BAD_REQUEST_400
        case `${SERVER_CODE}:4`:
            return HTTP_ERROR_CODE.BAD_REQUEST_400
        case `${SERVER_CODE}:5`:
            return HTTP_ERROR_CODE.SERVICE_UNAVAILABLE_503
        case `${SERVER_CODE}:6`:
            return HTTP_ERROR_CODE.TOO_MANY_REQUESTS_429
        default:
            return HTTP_ERROR_CODE.NOT_FOUND_404
    }
}

export const getErrorMessage = (error_code: string) => {
    const code_name = `${SERVER_CODE}${error_code}`
    return ErrCodeMessage[code_name]
}

