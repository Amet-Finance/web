function format(number: number) {
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

function formatLargeNumber(number: number) {
    const trillion = 1000000000000; // 1 trillion
    const billion = 1000000000;  // 1 billion
    const million = 1000000;  // 1 million
    const thousand = 1000; // 1 thousand

    if (number >= 10 * trillion) {
        return (number / 10 * trillion).toFixed(1) + 'T';
    } else if (number >= trillion) {
        return (number / trillion).toFixed(1) + 'T';
    } else if (number >= billion) {
        return (number / billion).toFixed(1) + 'B';
    } else if (number >= million) {
        return (number / million).toFixed(1) + 'M';
    } else {
        return number.toString();
    }
}

export {
    format,
    formatLargeNumber
}
