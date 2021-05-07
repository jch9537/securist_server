const UserEntity = require('../../domain/user/entity/userEntity');
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
const userData1 = {
    id: 'testId',
};
const testReqUserData1 = new UserEntity(userData1);

//test 1-1
test('사용자 id의 길이는 최소 4글자 이상이어야 한다', () => {
    expect(userData1.id.length).toBeGreaterThan(4);
});
//test 1-2
test('사용자 id의 길이는 최대 12글자 이하여야 한다', () => {
    expect(userData1.id.length).toBeLessThan(12);
});
//test 1-3
test('요청 id가 유효성을 통과하면 같은 값을 Entity id프로퍼티에 할당한다', () => {
    expect(testReqUserData1.id).toEqual(userData1.id);
});
//test 1-4
const userData2 = {
    id: 'id',
};
const testReqUserData2 = new UserEntity(userData2);

//test 1-5
// test('요청 id가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData2.id).toEqual('에러');
// });
//test 1-6
test('요청 id가 유효성을 통과하지 못하면 요청DATA.id를 Entity id 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData2.id).not.toEqual(userData2.id);
});

// //email 유효성 검사
//test 2-1
const userData4 = {
    email: 'test@example.com',
};
const testReqUserData4 = new UserEntity(userData4);
test('요청 email이 유효성을 통과하면 같은 값을 Entity email프로퍼티에 할당한다', () => {
    expect(testReqUserData4.email).toEqual(userData4.email);
});

//test 2-2
const userData5 = {
    email: 'testexampleEmail',
};
const testReqUserData5 = new UserEntity(userData5);
//test 2-3
// test('요청 email가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData5.email).toEqual(null);
// });
//test 2-4
test('요청 email가 유효성을 통과하지 못하면 요청DATA.email를 Entity email 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData5.email).not.toEqual(userData5.email);
});

//password 유효성 검사
//test 3-1
const userData6 = {
    password: 'testpassword1',
};
const testReqUserData6 = new UserEntity(userData6);

//test 3-3
test('사용자 password의 길이는 최소 6글자 이상이어야 한다', () => {
    expect(userData6.password.length).toBeGreaterThan(6);
});
//test 3-4
test('사용자 password의 길이는 최대 20글자 이하여야 한다', () => {
    expect(userData6.password.length).toBeLessThan(20);
});
test('요청 password가 유효성을 통과하면 같은 값을 Entity password프로퍼티에 할당한다', () => {
    expect(testReqUserData6.password).toEqual(userData6.password);
});
//test 3-2
const userData7 = {
    password: 'XX',
};
const testReqUserData7 = new UserEntity(userData7);
//test 3-5
// test('요청 password가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData7.password).toEqual('에러');
// });
//test 3-6
test('요청 password가 유효성을 통과하지 못하면 요청DATA.password를 Entity password 프로퍼티에 할당하지 않는다', () => {
    console.log('-----------------------------', testReqUserData7.password);
    expect(testReqUserData7.password).not.toEqual(userData7.password);
});

//name 유효성 검사
//test 4-1
const userData8 = {
    name: '테스터',
};
const testReqUserData8 = new UserEntity(userData8);

//test 4-2
test('사용자 name의 길이는 최소 2글자 이상이어야 한다', () => {
    expect(userData8.name.length).toBeGreaterThan(2);
});
//test 4-3
test('사용자 name의 길이는 최대 15글자 이하여야 한다', () => {
    expect(userData8.name.length).toBeLessThan(15);
});
test('요청 name가 유효성을 통과하면 같은 값을 Entity name프로퍼티에 할당한다', () => {
    expect(testReqUserData8.name).toEqual(userData8.name);
});

const userData9 = {
    name: 'X',
};
const testReqUserData9 = new UserEntity(userData9);
//test 4-4
// test('요청 name가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData9.name).toEqual('에러');
// });
//test 4-5
test('요청 name이 유효성을 통과하지 못하면 요청 DATA.name를 Entity name 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData9.name).not.toEqual(userData9.name);
});

//휴대폰번호 유효성 검사
//test 5-1
const userData10 = {
    // phone_num: '010-1234-5678',
    phone_num: '01012345678',
};
const testReqUserData10 = new UserEntity(userData10);

//test 5-2
test('요청 phone_num가 유효성을 통과하면 같은 값을 Entity phone_num프로퍼티에 할당한다', () => {
    expect(testReqUserData10.phone_num).toEqual(userData10.phone_num);
});

const userData11 = {
    phone_num: '03-1-3214565',
};
const testReqUserData11 = new UserEntity(userData11);
//test 5-4
// test('요청 phone_num가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData11.phone_num).toEqual('에러');
// });
//test 5-5
test('요청 phone_num이 유효성을 통과하지 못하면 요청 DATA.phone_num를 Entity phone_num 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData11.phone_num).not.toEqual(userData11.phone_num);
});

//사용자 타입 유효성 검사
//test 6-1
const userData12 = {
    user_type: 1,
};
const testReqUserData12 = new UserEntity(userData12);

//test 6-2
test('요청 user_type이 유효성을 통과하면 같은 값을 Entity user_type프로퍼티에 할당한다', () => {
    expect(testReqUserData12.user_type).toEqual(userData12.user_type);
});

const userData13 = {
    user_type: '11',
};
const testReqUserData13 = new UserEntity(userData13);
//test 6-3
// test('요청 user_type가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData13.user_type).toEqual('에러');
// });
//test 6-4
test('요청 user_type이 유효성을 통과하지 못하면 요청 DATA.user_type를 Entity user_type 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData13.user_type).not.toEqual(userData13.user_type);
});

//사용자 상태 유효성 검사
//test 7-1
const userData14 = {
    user_state: 2,
};
const testReqUserData14 = new UserEntity(userData14);

//test 7-2
test('요청 user_state이 유효성을 통과하면 같은 값을 Entity user_state프로퍼티에 할당한다', () => {
    expect(testReqUserData14.user_state).toEqual(userData14.user_state);
});

const userData15 = {
    user_state: '11',
};
const testReqUserData15 = new UserEntity(userData15);
//test 7-3
// test('요청 user_state가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData15.user_state).toEqual('에러');
// });
//test 7-4
test('요청 user_state이 유효성을 통과하지 못하면 요청 DATA.user_state를 Entity user_state 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData15.user_state).not.toEqual(userData15.user_state);
});

//로그인 실패 횟수 유효성 검사
//test 7-1
const userData16 = {
    login_failure_cnt: 1,
};
const testReqUserData16 = new UserEntity(userData16);

//test 7-2
test('요청 login_failure_cnt이 유효성을 통과하면 같은 값을 Entity login_failure_cnt프로퍼티에 할당한다', () => {
    expect(testReqUserData16.login_failure_cnt).toEqual(
        userData16.login_failure_cnt
    );
});

const userData17 = {
    login_failure_cnt: 6,
};
const testReqUserData17 = new UserEntity(userData17);
//test 7-3
// test('요청 login_failure_cnt가 유효성을 통과하지 못하면 에러를 반환한다', () => {
//     expect(testReqUserData17.login_failure_cnt).toEqual('에러');
// });
//test 7-4
test('요청 login_failure_cnt이 유효성을 통과하지 못하면 요청 DATA.login_failure_cnt를 Entity login_failure_cnt 프로퍼티에 할당하지 않는다', () => {
    expect(testReqUserData17.login_failure_cnt).not.toEqual(
        userData17.login_failure_cnt
    );
});
