// // ** this.message = 에러 로그 처리 메세지
// // ** this.errMessage = 클라이언트 응답 메세지

// // DB 에러 //1062
// module.exports = class UpdatedDatabaseError extends Error {
//     constructor(message, errno) {
//         // detail > errno로 변경!!
//         super();
//         // 로그용 데이터
//         this.message = message; // 메세지
//         this.location = 'Database'; // 에러 발생 위치 : 로그
//         // 클라이언트 응답 데이터
//         this.statusCode = this.setStatusCode(errno);
//         this.errMessage = this.setErrMessage(errno);
//         // this.name = 'DatabaseError'; // 에러명
//     }
//     // 에러 번호에 따라 응답 코드 지정 errno
//     setStatusCode(errno) {
//         console.log('코드용 에러 번호 ', errno);
//         let statusCode;
//         console.log('DatabaseError 에러 번호 : ', errno);
//         switch (errno) {
//             case 1062: // 중복됨(이미 등록)
//                 statusCode = 409;
//                 break;
//             default:
//                 statusCode = 500;
//         }
//         return statusCode;
//     }
//     // 에러 번호에 따라 응답 메세지 지정
//     setErrMessage(errno) {
//         console.log('메세지용 에러 번호 ', errno);
//         let errMessage;
//         switch (errno) {
//             case 1062: // 중복됨(이미 등록)
//                 errMessage = 'Already exist';
//                 break;
//             default:
//                 errMessage = undefined;
//         }
//         return errMessage;
//     }
// };

// // module.exports = class {
// //     constructor(errMessage, errno, errStack, errSql) {
// //         this.stausCode = 500;
// //         this.errMessage = errMessage;
// //         this.errno = errno;
// //         this.errStack = errStack;
// //         this.errSql = errSql;
// //     }
// // };
