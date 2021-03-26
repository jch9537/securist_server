// 비밀번호 만료일 확인 함수
module.exports = (updateAt) => {
    const passwordExp = Number(updateAt) + 60 * 60 * 24 * 90;
    const now = Math.floor(new Date().valueOf() / 1000);
    return passwordExp < now ? true : false;
};
