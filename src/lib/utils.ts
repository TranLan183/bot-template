import { MILLISECOND_PER_ONE_SEC } from "./constants"
var crypto = require('crypto');

export const sleep = async (ms: number) => {
    await new Promise((resolver, reject) => {
        setTimeout(() => resolver("OK"), ms)
    })
}


export const createRunePackArray = (runes: { runeId: number, quantity: number }[]) => {
    const results: number[] = []
    for (let rune of runes) {
        results[rune.runeId] = rune.quantity
    }
    for (let i = 0; i < 12; i++) {
        if (!results[i]) results[i] = 0
    }
    return results
}

/**
 * @param from start number
 * @param to end number
 * @returns random number in (from,to)
 */
export const randomBetween: (from: number, to: number) => number = (from: number, to: number) => {
    if (from > to) throw new Error("to must greater than from")
    const result = from + (Math.random() * (to - from))
    return result
}
export const getValuesFromArray = (arr: any[], n: number) => {
    const arr_random: number[] = []
    while (arr_random.length < n) {
        const random_index = Math.round(randomBetween(0, arr.length - 1))
        if (!arr_random.includes(random_index)) {
            arr_random.push(random_index)
        }
    }
    return arr_random.map(el => arr[el])
}

export const isAtTime = (start_time: number, dt_time: number, check_time: number) => {
    if (start_time <= check_time && start_time + dt_time > check_time) return true
    return false
}
/**
 * Get previous days of date
 * @param from 
 * @param days number of day in past
 * @returns 
 */
export const getPreviousDays = (from: Date, days: number) => {
    return new Date(from.getTime() - (days * 86400000))
}


export const getStartPreviousDays = (from: Date, days: number) => {
    return new Date(from.getTime() - (days * 86400000))
}

export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
export const generateCodeVerify = () => {
    let code: string = ''
    while (code.length < 6) {
        const number = Math.floor(Math.random() * 10)
        code += number.toString()
    }
    return code
}
export function getUniqueArr<T>(a: T[]) {
    return Array.from(new Set(a));
}

export function lowerCase(s: string) {
    return s?.toLowerCase()
}

const emailRegex = /^[a-z][a-z0-9_\.]{4,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}.*$/
const projectNameRegex = /^([a-zA-Z0-9-\s]){0,50}$/

export const isValidEmailAddress = (email: string) => email.match(emailRegex)
export const isValidProjectName = (project_name: string) => projectNameRegex.test(project_name)

export const getPreviousAndNextMonth = (date: Date | string | number = new Date(), typeOfMonth: 'previous' | 'next', quantity: number = 1) => {
    const convertDate: typeof date = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    let new_month: number = convertDate.getUTCMonth()
    typeOfMonth === 'previous' ? new_month -= quantity : new_month += quantity
    const new_date = new Date().setUTCMonth(new_month)
    return new Date(new_date)
}

export const getPreviousMonth = (date: Date | string | number = new Date()) => {
    const convertDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date
    const new_month = convertDate.getUTCMonth() - 1
    const new_date = new Date().setUTCMonth(new_month)
    return new Date(new_date)
}

export enum typeOfDate {
    firstOfMonth = 'firstOfMonth',
    lastOfMonth = 'lastOfMonth',
    startOfDay = 'startOfDay',
    endOfDay = 'endOfDay'
}

export const convertDateDayOrMonth = (date: Date | number, typeOfDay: typeOfDate) => {
    let convertedDate: typeof date = new Date(date)
    switch (typeOfDay) {
        case typeOfDate.firstOfMonth:
            const setFirstDate = convertedDate.setUTCDate(1)
            convertedDate = new Date(setFirstDate).setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.lastOfMonth:
            const setNextMonthToGetLastDate = convertedDate.setUTCMonth(convertedDate.getUTCMonth() + 1)
            const setLastDate = new Date(setNextMonthToGetLastDate).setUTCDate(0)
            convertedDate = new Date(setLastDate).setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.startOfDay:
            convertedDate = convertedDate.setUTCHours(0, 0, 0, 0)
            break
        case typeOfDate.endOfDay:
            convertedDate = convertedDate.setUTCHours(24, 0, 0, 0)
            break
    }
    return convertedDate
}


export const sortArrayByManyFields = <T>(array: T[], sort: { [Key in keyof T]: 1 | -1 }) => {
    const all_keys = Object.keys(sort);
    (array as Array<any>).sort((a, b) => {
        let index = 0
        for (let key of all_keys) {
            if (a[key] !== b[key]) return a[key] > b[key] ? sort[key] : sort[key] * -1
            index++
            if (index === all_keys.length - 1) break;
        }
        return a[all_keys[index]] > b[all_keys[index]] ? sort[all_keys[index]] : sort[all_keys[index]] * -1
    })
}

export const isNumberString = (n: string) => {
    return n && !Number.isNaN(Number(n))
}

export const HexToString = (hex: string) => {
    return Buffer.from(hex, "hex").toString("utf8")
}

export async function sha256(source) {
    const sourceBytes = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest("SHA-256", sourceBytes);
    const resultBytes = [...new Uint8Array(digest)];
    return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
}

export const ConvertMsToSec = (ms: number) => ~~(ms / MILLISECOND_PER_ONE_SEC)

export const convertErrorToString = (e: any) => {
    if (!e) return "UNKNOWN_ERROR"
    if (typeof e === "string") return e
    if (e.message && (typeof e.message === "string")) return e.message as string
    return JSON.stringify(e)
}

export const RoundNumber = (n: number) => {
    const round_step = (method: 'floor' | 'ceil' | 'round', step: number) => {
        if (step === 0) return n
        return Math[method](n / step) * step
    }
    const round = (method: 'floor' | 'ceil' | 'round', fraction_digits: number, step: number) => {
        const factor = 10 ** fraction_digits;
        return Math[method](round_step(method, step) * factor) / factor;
    };
    return {
        floor: (fraction_digits = 2, step = 0) => round('floor', fraction_digits, step),
        ceil: (fraction_digits = 2, step = 0) => round('ceil', fraction_digits, step),
        round: (fraction_digits = 2, step = 0) => round('round', fraction_digits, step),
    };
};

export const FormatNumberWithComma = (value: number | string): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const convertTimeTommDDDyyyy = (date: Date | string | number | undefined | null) => {
    if (!date) return "TBA"
    const new_date = new Date(date).toLocaleString('en-US', { timeZone: 'UTC' }).replace(',', '')
    const [day, time, period] = new_date.split(' ')
    return `${day} ${time} ${period} UTC`
}

export function toHex(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}