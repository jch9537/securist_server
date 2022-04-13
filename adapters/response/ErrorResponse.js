module.exports = class ErrorResponse {
    constructor(
        code = 500,
        message = 'Internal Server Error',
        data = undefined
    ) {
        this.error = {
            code: code,
            // code: code === 400 ? 500 : code, // 상태코드
            message: message, // 에러 메세지
            data: data,
        };
    }
};

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

/*
401 '비밀번호가 맞지 않습니다. (Unauthenticated)';
400 '유효하지 않은 Password입니다.(Bad Request)';
400 'parameter에 잘못된 데이터가 있습니다..(Bad Request)';
409 '이미 가입된 email입니다.(Conflict)';
401 '로그인 시도횟수를 초과했습니다. 비밀번호 찾기 기능을 사용해주세요 (Unauthenticated)';
404 '계정을 확인해주세요. (Not Found)';  // this.userExist = false;
401 '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)';
403 '계정 비활성화 상태입니다. 관리자에게 문의해주세요';
403 '토큰이 만료되었습니다. (Forbidden)';    // this.isExpired = true;
401 '유효하지 않은 토큰입니다. (Unauthenticated)';    // this.logInRequired = true;
401 '토큰이 취소되었습니다. 로그인 서비스가 필요합니다.(Unauthorized)';   // this.logInRequired = true;
*/
