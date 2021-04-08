module.exports = {
    getDateTime: () => {
        let now = new Date();
        let year = now.getFullYear() + '-';
        let month =
            now.getMonth() + 1 < 10
                ? '0' + (now.getMonth() + 1) + '-'
                : now.getMonth() + 1 + '-';
        let date =
            now.getDate() < 10
                ? '0' + now.getDate() + ' '
                : now.getDate() + ' ';
        let hours =
            now.getHours() < 10
                ? '0' + now.getHours() + ':'
                : now.getHours() + ':';
        let minutes =
            now.getMinutes() < 10
                ? '0' + now.getMinutes() + ':'
                : now.getMinutes() + ':';
        let seconds =
            now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();

        let currentTime = year + month + date + hours + minutes + seconds;
        return currentTime;
    },
};
