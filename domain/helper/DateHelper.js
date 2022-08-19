module.exports = class Dater {
    constructor() {
        this.convertDateToString = this.convertDateToString.bind(this);
        this.convertStringToDate = this.convertStringToDate.bind(this);
        this.convertTimeToString = this.convertTimeToString.bind(this);
        this.convertKST = this.convertKST.bind(this);
        this.addDate = this.addDate.bind(this);
        this.makeDateToString = this.makeDateToString.bind(this);
        this.makeCurrentTimeToString = this.makeCurrentTimeToString.bind(this);
        this.transformDateType = this.transformDateType.bind(this);
        this.compareDateToToday = this.compareDateToToday.bind(this);
        this.compareDateTimeToCurrent = this.compareDateTimeToCurrent.bind(
            this
        );
        this.makeDateToStringForMessages = this.makeDateToStringForMessages.bind(
            this
        );
        this.makeTimeStringForMessages = this.makeTimeStringForMessages.bind(
            this
        );
    }
    // var date = new Date()
    // date.setHours(date.getHours() + 9) // 한국 날짜 시간
    // date_format = date.toISOString().replace('T', ' ').substring(0, 19) 문자열 처리

    // Date 객체 > 문자열 변경 : YYYY-MM-DD
    convertDateToString(date) {
        return `${date.getFullYear()}-${
            date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1
        }-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
    }
    // 문자열(YYYY-MM-DD) > Date 객체 변경
    convertStringToDate(dateString) {
        let dividedString = dateString.split('-');
        return new Date(
            dividedString[0], // 년
            Number(dividedString[1]) + 1, // 월
            dividedString[2] // 일
        );
    }
    // Date 객체 > 시간을 문자열로 추출 : hh:mm:ss
    convertTimeToString(dateTime) {
        return `${
            dateTime.getHours() < 10
                ? '0' + dateTime.getHours()
                : dateTime.getHours()
        }:${
            dateTime.getMinutes() < 10
                ? '0' + dateTime.getMinutes()
                : dateTime.getMinutes()
        }:${
            dateTime.getSeconds() < 10
                ? '0' + dateTime.getSeconds()
                : dateTime.getSeconds()
        }`;
    }
    // KST로 변환(UTC + 09:00) : ex) 2022-04-16T00:00:00.000Z -> 2022-04-16T14:00:00.000Z
    convertKST(date, time) {
        if (time) {
            let splitTimeString = time.split(':').map((item) => Number(item));
            date.setHours(
                splitTimeString[0] + 9, // 한국 시간대로 수정 : 확인하기 편함
                splitTimeString[1],
                splitTimeString[2]
            );
        } else {
            date.setHours(date.getHours() + 9);
        }
    }
    // 날짜 더하기
    addDate(targetDate, dateToAdd) {
        return targetDate.setDate(targetDate.getDate() + dateToAdd);
    }
    // 오늘 날짜(또는 오늘날짜 00일 이후) 문자열로 가져오기 : yyyy-mm-dd
    makeDateToString(dateToAdd) {
        let targetDate = new Date();
        console.log('현재 UTC 날짜 : ', targetDate);

        if (dateToAdd) {
            this.addDate(targetDate, dateToAdd);
        }
        console.log('변경 후 시험 날짜 : ', targetDate);
        return this.convertDateToString(targetDate);
    }

    // 현재 시간 문자열로 가져오기 : hh:mm:ss
    makeCurrentTimeToString() {
        let now = new Date();
        return this.convertTimeToString(now);
    }

    // 날짜 변환 : 문자열 > Date 객체 / Date 객체 > 문자열
    transformDateType(date) {
        console.log('도착 =============== ', date, typeof date);
        if (typeof date === 'object') {
            return this.convertDateToString(date);
        } else {
            //typeof date === 'string'
            return this.convertStringToDate(date);
        }
    }

    // 오늘 날짜 + 조건일을 더한 날짜와 인자 날짜의 비교
    compareDateToToday(date, conditionDays) {
        // 인자 date : Date 객체, conditionDays : 숫자 (조건일)

        let now = new Date();
        console.log('적용 전 현재 날짜', now);
        // 조건이 있는 경우
        if (conditionDays) {
            // now.setDate(now.getDate() + conditionDays); //오늘 날짜 +- 조건 날짜
            this.addDate(now, conditionDays); //오늘 날짜 +- 조건 날짜
        }
        console.log('적용 후 현재 날짜', now);

        let paramDateToString = this.transformDateType(date); // 인자 날짜(문자열)
        let compareDateToString = this.transformDateType(now); // 비교할(오늘+조건) 날짜(문자열)
        console.log(
            '인자 날짜 : ',
            paramDateToString,
            ' 현재+조건 날짜 : ',
            compareDateToString
        );

        return paramDateToString >= compareDateToString;
        // 오늘 날짜보다 조건 날짜가 크거나 같다면 true / 작다면 false
    } // ----------------------------------------------------- 오전 시간 다시 확인!!!!!!!!!!!!

    // 현재 날짜&시간 기준으로 날짜/시간 비교 : Date 객체 간 비교
    compareDateTimeToCurrent(date, time, conditionDays) {
        console.log('날짜에 시간 추가 + 한국 시간 적용 전', date, typeof date);
        this.convertKST(date, time); // 날짜에 시간 추가
        console.log('날짜에 시간 추가 + 한국 시간 적용 후', date);

        let now = new Date();
        // 조건이 있는 경우 날짜 추가
        if (conditionDays) {
            console.log('조건 적용 전 현재 날짜시간', now);
            this.addDate(now, conditionDays);
        }
        this.convertKST(now); // 한국 시간 : 확인편리차 수정
        console.log('조건 시간 적용 후 날짜 시간', now);

        console.log('인자 날짜시간 : ', date, ' 현재+조건 날짜 시간 : ', now);
        return date.getTime() >= now.getTime();
        // 현재 시간보다 조건 시간이 크거나 같으면 true, 작으면 false
    } // ----------------------------------------------------- 오전 시간 다시 확인!!!!!!!!!!!!

    // compareDates() {} // 두 날짜 간 비교, compareDateTimes() {} // 두 날짜 시간 간 비교

    // 메세지용 날짜 > 문자열 변환 : YYYY년 MM월 DD일
    makeDateToStringForMessages(date) {
        let dateString;
        if (typeof date === 'object') {
            dateString = `${date.getFullYear()}년 ${
                date.getMonth() + 1
            }월 ${date.getDate()}일`;
        } else {
            let splitDateTimeString = date.split('T');
            let splitDateString = splitDateTimeString.split('-');
            dateString = `${Number(splitDateString[0])}년 ${Number(
                splitDateString[1]
            )}월 ${Number(splitDateString[2])}일`;
        }
        return dateString;
    }
    // 메세지용 시간 > 문자열 변환 : HH:MM
    makeTimeStringForMessages(time) {
        console.log('시간 ', time, ' 시간 타입 ', typeof time);
        let extractTime = time.slice(0, -3);
        return extractTime;
    }
};

// // 지정 날짜시간 비교 함수 ======================== 수정 처리!!!!!!!!!!!!!!!!!!!!!!

// dateTimeFilter(date, time, conditionDays) {
//     let dateArray = date.split('-'); // 날짜 split
//     let dateTime = `${dateArray[0]}-${
//         Number(dateArray[1]) < 10 ? '0' + dateArray[1] : dateArray[1]
//     }-${
//         Number(dateArray[2]) < 10 ? '0' + dateArray[2] : dateArray[2]
//     }T${time}`; // Date로 넣을 값 가공  ex) '2022-01-01T14:00:00'

//     let targetDate = new Date(dateTime); // 비교할 날짜 시간
//     let now = new Date(); // 현재 날짜시간

//     let conditionDaysMs = conditionDays * 60 * 60 * 24 * 1000; // 날짜 시간 MS로 변환
//     let betweenMs = targetDate.getTime() - now.getTime(); // 시험날짜시간 - 현재날짜시간 MS로 계산

//     return betweenMs > conditionDaysMs; // 시간아(시험-현재) > 조건날짜 크기비교 리턴
// }
