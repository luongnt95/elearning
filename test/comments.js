var test = require('tape');
var request = require('supertest');
var app = require('../app');

test('Correct comments post', function (t) {
    request(app)
        .post('/comments/new')
        .send({content:'Happy and fun', username: 'student', class_id:'575ad40d7672831100dbfb76', 
        	   lesson_number: '1', avatar_url:'a'})
        .expect(200)
        .end(function (err, res) {
            t.end();
        });
});