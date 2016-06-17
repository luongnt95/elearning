var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('Correct users login', function (t) {
    request(app)
        .post('/users/login')
        .send({username:'student', password:'1'})
        .expect(200)
        .end(function (err, res) {
            t.end();
        });
});

test('Correct users login', function (t) {
    request(app)
        .post('/users/login')
        .send({username:'teacher', password:'1'})
        .expect(200)
        .end(function (err, res) {
            t.end();
        });
});

test('Correct users signup', function (t) {
    request(app)
        .post('/users/signup')
        .send({username:'sky', password:'12345678', password2: '12345678', email: 'sky@mail.com', 
               type: 'student', last_name: 'sky', first_name: 'son tung'})
        .expect(200)
        .end(function (err, res) {
            t.end();
        });
});

test('Correct users login', function (t) {
    request(app)
        .post('/users/login')
        .send({username:'sky', password:'12345678'})
        .expect(200)
        .end(function (err, res) {
            t.end();
        });
});

// test('Correct users returned', function (t) {
//     request(app)
//         .post('/login')
//         .expect(200)
//         .end(function (err, res) {
//             var expectedUsers = ['John', 'Betty', 'Hal'];

//             t.error(err, 'No error');
//             t.same(res.body, expectedUsers, 'Users as expected');
//             t.end();
//         });
// });
