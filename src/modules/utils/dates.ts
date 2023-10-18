function formatTime(seconds: number, isShort?: boolean, hideSeconds?: boolean) {
    const years = Math.floor(seconds / 31536000);
    seconds -= years * 2592000;

    const months = Math.floor(seconds / 2592000);
    seconds -= months * 2592000;

    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const timeSegments = [];

    const shorten = (text: string) => {
        if (isShort) {
            return text.charAt(0) + "."
        }
        return text
    }

    if (years > 0) {
        const text = shorten(years === 1 ? 'year' : 'years')
        timeSegments.push(`${years} ${text}`);
    }

    if (months > 0) {
        const text = shorten(months === 1 ? 'month' : 'months')
        timeSegments.push(`${months} ${text}`);
    }

    if (days > 0) {
        const text = shorten(days === 1 ? 'day' : 'days')
        timeSegments.push(`${days} ${text}`);
    }

    if (hours > 0) {
        const text = shorten(hours === 1 ? 'hour' : 'hours')
        timeSegments.push(`${hours} ${text}`);
    }

    if (minutes > 0) {
        const text = shorten(minutes === 1 ? 'minute' : 'minutes')
        timeSegments.push(`${minutes} ${text}`);
    }

    if (seconds > 0 && !hideSeconds) {
        const text = shorten(seconds === 1 ? 'second' : 'seconds')
        timeSegments.push(`${Math.round(seconds)} ${text}`);
    }

    return timeSegments.join(' ');
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export {formatTime, sleep}