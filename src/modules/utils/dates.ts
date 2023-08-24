function formatTime(seconds: number) {
    const months = Math.floor(seconds / 2592000);
    seconds -= months * 2592000;

    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const timeSegments = [];

    if (months > 0) {
        timeSegments.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    if (days > 0) {
        timeSegments.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    }

    if (hours > 0) {
        timeSegments.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0) {
        timeSegments.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    if (seconds > 0) {
        timeSegments.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    }

    return timeSegments.join(' ');
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}



export {formatTime, sleep}