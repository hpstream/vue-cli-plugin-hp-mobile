// 时间转换，秒=>时分秒
export default function(countDownSeconds) {
    const days = parseInt(countDownSeconds / (60 * 60 * 24));
    let hours = parseInt(countDownSeconds / (60 * 60) - days * 24);
    let minutes = parseInt(countDownSeconds / 60 - hours * 60 - days * 24 * 60);
    let seconds = parseInt(countDownSeconds - minutes * 60 - hours * 60 * 60 - days * 24 * 60 * 60);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    };
}
