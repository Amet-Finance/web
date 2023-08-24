function format(number: number) {
    // Convert the number to a string
    const numberString = number.toString();

    // Split the string into parts before and after the decimal point
    const parts = numberString.split('.');

    // Format the part before the decimal point with commas
    const formattedIntegerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the formatted integer part with the decimal part (if present)
    const formattedNumber = parts.length === 2
        ? formattedIntegerPart + '.' + parts[1]
        : formattedIntegerPart;

    return formattedNumber;
}

export  {
    format
}