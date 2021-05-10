//TODO : UPDATE, PATCH, DELETE 관련 태그제거 추가

const express = require('express');
// html 태그 제거 모듈 : XSS 공격방어 미들웨어 => 허용 태그, 속성들은 sanitizeHtml의 옵션에서 처리가능
const sanitizeHtml = require('sanitize-html');

module.exports = (req, res, next) => {
    console.log('리퀘스트 :', req.body);
    let filteredData = {};
    let filteredQuery = {};
    if (
        req.method === 'POST' ||
        req.method === 'PUT' ||
        req.method === 'DELETE'
    ) {
        console.log('body : ', req.body);
        if (req.body.formData) {
            req.body = JSON.parse(req.body.formData);
            console.log('~~~~~', req.body);
        }
        for (let key in req.body) {
            console.log('key: ', key, '// value :', req.body[key]);
            if (typeof req.body[key] === 'number') {
                filteredData[key] = Number(sanitizeHtml(req.body[key]));
            } else {
                filteredData[key] = sanitizeHtml(req.body[key]);
            }
        }
        console.log('body소독 : ', filteredData);
        req.filteredData = filteredData;
        console.log('바디데이터 : ', req.filteredData);
    } else if (req.method === 'GET') {
        // route에서 :id를 받기 전 request를 받으므로 req.params는 없음
        if (req.query) {
            if (Object.keys(req.query).length !== 0) {
                console.log('req.query : ', req.query);
                for (let key in req.query) {
                    console.log('key: ', key, 'value :', req.query[key]);
                    filteredQuery[key] = sanitizeHtml(req.query[key]);
                }
                console.log('query 소독 : ', filteredQuery);
            }
            req.filteredQuery = filteredQuery;
        }
    }
    if (req.headers.authorization) {
        let token = req.headers.authorization;
        let filteredToken = sanitizeHtml(token);
        console.log('autorization headers 소독 :', req.headers.authorization);
        req.filteredToken = filteredToken;
    }
    next();
};
