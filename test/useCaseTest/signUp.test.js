const SignUp = require('../../domain/user/useCases/signUp');

const signUp = new SignUp();

test('해시 값은 문자열이어야한다', () => {
    console.log('--------------------', signUp.hashPassword('a'));
    expect(typeof signUp.hashPassword('a')).toBe('string');
});
