import {toBN} from "@/modules/web3/util";

function format(number: number, maxDigestsForSmallNumbers = 4) {

    if (number < 1) {
        if (number.toString().length > maxDigestsForSmallNumbers) {
            return number.toFixed(maxDigestsForSmallNumbers)
        }
        return number;
    }

    // Convert the number to a string
    const numberString = number.toString();

    // Split the string into parts before and after the decimal point
    const parts = numberString.split('.');

    // Format the part before the decimal point with commas
    const formattedIntegerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts[1]) {
        const formattedDecimals = Math.round(Number(parts[1])).toString().substring(0, 2)
        return formattedIntegerPart + "." + formattedDecimals
    }

    // Combine the formatted integer part with the decimal part (if present)
    return parts.length === 2 ? formattedIntegerPart + '.' + parts[1] : formattedIntegerPart;
}

function formatLargeNumber(number: number, includeThousand?: boolean, maxFixedLength = 1) {
    if(!Number.isFinite(number)) return 0

    const trillion = 1000000000000; // 1 trillion
    const billion = 1000000000;  // 1 billion
    const million = 1000000;  // 1 million
    const thousand = 1000; // 1 thousand

    if (number >= 10 * trillion) {
        return (number / 10 * trillion).toFixed(maxFixedLength) + 'T';
    } else if (number >= trillion) {
        return (number / trillion).toFixed(maxFixedLength) + 'T';
    } else if (number >= billion) {
        return (number / billion).toFixed(maxFixedLength) + 'B';
    } else if (number >= million) {
        return (number / million).toFixed(maxFixedLength) + 'M';
    } else if (number >= thousand && includeThousand) {
        return (number / thousand).toFixed(maxFixedLength) + 'K';
    } else {
        return format(number, maxFixedLength);
    }
}

export {
    format,
    formatLargeNumber,
}
