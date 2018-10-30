/**
 * JSON web-token standard
 * securing communication user-server
 * - cryptoJS is a library containing encrypting alorithms
 * - jsonwebtoken is a lib to help with web-tokens auth 
 */

/* const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const pass = 'this is a password';
const hash = SHA256(pass).toString();

console.log(hash);

const data = {
  id: 4
};

const token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'salt').toString()
};

// faking ID
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

const resultHash = SHA256(JSON.stringify(data) + 'salt').toString();

if(resultHash === token.hash){
  console.log('not changed');
} else {
  console.log('data changed');
} */

/**
 * jsonwebtoken
 */
//jwt.sign
//jwt.verify

/* const data2 = {
  id: 10
}

const token2 = jwt.sign(data2, 'secretString');

console.log(token2);
 */

 /**
  * Bcryptjs
  * hashing passwords
  * 
  */

const bcrypt = require('bcryptjs');

const password = '123abc!';

// hashing and salting
// rounds param: slowing down checking password process - prevent to do millions of password checks in short period of time, some people user 120 rounds - test to see how long it takes optimally
bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    if(err){

    } else {
      console.log(hash);
      //save hash to db
    }
  })
});

//when somebody is logging in:

const hashedPassword = '$2a$10$e4er40Cie5vFNqTulCPYkuAu41tCy3sagbfqkJ5r8Ci7P2aEf7Y4K';
bcrypt.compare(password, hashedPassword).then((res) => console.log(res));
