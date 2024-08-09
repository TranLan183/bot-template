import numeral from "numeral";

const renderZero = (count: number) => {
    let stringZero = ""
    for (let i = 0; i < count; i++) {
        stringZero += "0"
    }
    return stringZero
}

const subScript = {
    0: "₀",
    1: "₁",
    2: "₂",
    3: "₃",
    4: "₄",
    5: "₅",
    6: "₆",
    7: "₇",
    8: "₈",
    9: "₉",
} as any

export const readableNumber = (e: string, maxLength?: number) => {
    let length = maxLength || 3;
    e = Number(e).toLocaleString("fullwide", { useGrouping: false, maximumFractionDigits: 20, maximumSignificantDigits: 20 })
    const f1 = e.split(".")[0];
    const f2 = e.split(".")[1];

    const rangeSort = Math.pow(10, length + 1)
    if (Number.isNaN(Number(e))) return "NaN"
    if (Number(f1) >= rangeSort) {
        const format = numeral(e).format(`0a,0.[${renderZero(length)}]`);
        return numeral(e).format(`0a,0.[${renderZero(length - format.split(".")[0].length)}]`)
    }
    if (Number(f1) >= 1) {
        return numeral(e).format(`0,0.[${renderZero(length - f1.length)}]`)
    }
    if (Number(e) < 1e-20) {
        return "0"
    }
    let finalFormat = "";
    for (let i = 0; i < f2.length; i++) {
        if (f2[i] !== "0") {
            let part0 = f2.slice(0, i);
            let partNumber = f2.slice(i, i + length);
            let sortPartNumber = numeral("0." + partNumber).format(`0.[${renderZero(length)}]`).split(".")[1];
            let maxZeroDecimalPart = 2;
            if (part0.length > maxZeroDecimalPart) {
                let count0 = part0.length.toString();
                let newFormatSub = "0"
                for (let i = 0; i < count0.length; i++) {
                    newFormatSub += subScript[count0[i]];
                }
                finalFormat = `0.${newFormatSub}${sortPartNumber}`
            } else {
                finalFormat = `0.${part0}${sortPartNumber}`
            }
            break;
        }
    }
    return finalFormat;
}