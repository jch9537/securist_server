const UserEntity = require('../entity/userEntity');
const userData = {
    id: 'testid',
    email: 'test@example.com',
    password: '12345',
    phone_num: '010-1234-5678',
    name: '테스터',
    create_at: '20210224',
    user_type: 1,
    user_state: 1,
    login_failure_cnt: 0,
};

//id 유효성 검사
//test 1
const userData1 = {
    id: 'testid',
};
const testReqUserData1 = new UserEntity(userData1);
testReqUserData1.id = userData1.id;
test('요청 id가 유효성을 통과하면 같은 값을 Entity id프로퍼티에 할당한다', () => {
    expect(testReqUserData1.id).toEqual('testidaaa');
});

// test('요청 id가 유효성을 통과하면 같은 값을 Entity id프로퍼티에 할당한다', () => {
//     expect(userData1.id).toEqual(testReqUserData1.id);
// });
// //test 2
// const userData2 = {
//     id: 'id',
// };
// const testReqUserData2 = new UserEntity(userData2);
// //test 2-1
// test('사용자 id의 길이는 최소 4글자 이상이어야 한다', () => {
//     expect(userData2.id.length).toBeLessThan(4);
// });
// //test 2-2
// test('요청 id가 유효성을 통과하지 못하면 undefined 를 할당한다', () => {
//     console.log('---------------------', testReqUserData2.id);
//     expect(testReqUserData2.id).toEqual(null);
// });
// //test 2-3
// test('요청 id가 유효성을 통과하지 못하면 요청DATA.id를 Entity id 프로퍼티에 할당하지 않는다', () => {
//     expect(userData2.id).not.toEqual(testReqUserData2.id);
// });
// //test 3
// const userData3 = {
//     id: 'idtest1334567890',
// };
// const testReqUserData3 = new UserEntity(userData3);
// test('사용자 id의 길이는 최대 12글자 이하여야 한다', () => {
//     expect(userData3.id.length).not.toBeLessThan(12);
// });

// // //email 유효성 검사
// //test 4
// const userData4 = {
//     email: 'test@example.com',
// };
// const testReqUserData4 = new UserEntity(userData4);
// test('요청 email가 유효성을 통과하면 같은 값을 Entity email프로퍼티에 할당한다', () => {
//     expect(userData4.email).toEqual(testReqUserData4.email);
// });

// //test 5
// const userData5 = {
//     email: 'test!!@example.com',
// };
// const testReqUserData5 = new UserEntity(userData5);
// //test5-1
// test('요청 email가 유효성을 통과하지 못하면 undefined 를 할당한다', () => {
//     expect(testReqUserData5.email).toEqual(undefined);
// });
// //test 5-2
// test('요청 email가 유효성을 통과하지 못하면 요청DATA.email를 Entity email 프로퍼티에 할당하지 않는다', () => {
//     expect(userData5.email).not.toEqual(testReqUserData5.email);
// });
