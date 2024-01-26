function tColor(amount: number) {
    if (amount === 0) {
        return "text-red-500"
    } else if (amount <= 25) {
        return "text-orange-700"
    } else if (amount <= 50) {
        return "text-orange-500"
    } else if (amount <= 75) {
        return "text-yellow-500"
    } else if (amount <= 90) {
        return "text-lime-500"
    } else if (amount <= 100) {
        return "text-green-500"
    } else {
        return "text-green-500"
    }
}

export {
    tColor
}
