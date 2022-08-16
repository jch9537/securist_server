module.exports = class SuccessResponse {
    constructor(code = 200, result = {}) {
        this.code = code;
        this.message = this.setMessage(result, code); // 수정 코드 작성
        // this.data = code === 201 || code === 204 ? undefined : data;
        this.data = this.getData(result, code);
    }
    // 메세지에 따라 응답 코드 지정
    setMessage(result, code) {
        let successMessage;

        // 전달할 특이 메세지가 있다면 그대로 전달
        if (result.message) {
            successMessage = result.message;
        } else {
            // 없다면 응답 메세지 유형으로 전달
            switch (code) {
                case 201:
                    successMessage = 'Created';
                    break;
                case 202:
                    successMessage = 'Accepted';
                    break;
                case 204:
                    successMessage = 'No Content';
                    break;
                case 205:
                    successMessage = 'Reset Content';
                    break;
                default:
                    successMessage = 'Ok';
            }
        }
        return successMessage;
    }
    getData(result, code) {
        let resultData;

        // 메세지가 있다면 결과값 내 데이터 추출 후 응답
        if (!result.message) {
            // 특이 메세지가 없다면 코드에 따라 데이터 전달 X 또는 결과값 그대로 전달
            switch (code) {
                case 201:
                    resultData = undefined;
                    break;
                case 202:
                    resultData = undefined;
                    break;
                case 204:
                    resultData = undefined;
                    break;
                default:
                    resultData = result;
            }
        } else {
            resultData = result.data;
        }
        return resultData;
    }
};

// module.exports = class {
//     constructor(message, code = 200, data) {
//         this.code = code;
//         this.message = message;
//         this.data = code === 201 || code === 204 ? undefined : data;
//     }
// };

/*
200 '요청 성공 (OK)' ex. resource 목록/ resource 상세/ resource 수정/ 그외 대부분의 성공 API 
201 '요청 성공 (Created)'ex. resource 생성 성공
204 '요청 성공 (No Content)' ex. resource 삭제 성공

301 페이지 이동 
307 임시 페이지 이동

400 request 실패(Bad Request) ex. 유효성 검사 통과 실패, 잘못된 요청
401 인증 실패(Unauthorized) ex. 세션 없음, 로그인 실패
403 인증 성공 & 권한 없음(Forbidden) ex. 권한 없는 자원에 접근
404 요청한 API는 없음(Not Found) ex. route 조회 실패
409 충돌(Conflict) ex. 수정을 해야하는데 어떤 이유로 수정할 수 없다던지 // 삭제를 처리해야하는데 사용자의 프로젝트가 있다던지 삭제를 처리할 수 없는 경우와 같이 처리에 충돌 요소가 있는 경우 등 

500 서버 내부 오류(Internal Server Error) ex. 서버 오류/exception
 */

/*
라우터 접근 이전 (미들웨어 등) 에러 발생 : 에러 클래스 없이 처리
서버 에러 발생 : exception 처리 
DB 에러 발생 : DatabaseError 클래스 처리
*/
