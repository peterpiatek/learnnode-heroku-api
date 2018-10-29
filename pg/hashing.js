/**
 * JSON web-token standard
 * securing communication user-server
 * - cryptoJS is a library containing encrypting alorithms
 * - jsonwebtoken is a lib to help with web-tokens auth 
 */

const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const pass = 'this i a password';
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
}

/**
 * jsonwebtoken
 */
//jwt.sign
//jwt.verify

const data2 = {
  id: 10
}

const token2 = jwt.sign(data2, 'secretString');

console.log(token2);
