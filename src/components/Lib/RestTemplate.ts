import axios from 'axios';
import sjcl from 'ioak-sjcl';
import CryptoJS from 'crypto-js';

const baseUrl = process.env.REACT_APP_API_URL;

const autoGeneratedFields = [
  '_id',
  'id',
  'createdAt',
  'lastModifiedAt',
  'userId'
];

const unprotectedEndpoints = [
  '/auth/keys',
  '/auth/signup',
  '/auth/keys/',
  '/auth/signin',
  '/auth/reset',
  '/auth/sendResetCode'
];

export function httpGet(
  endpoint: string,
  headers: any,
  password: string = '',
  skipFields: Array<string> = []
) {
  return axios.get(baseUrl + endpoint, headers).then(response => {
    if (!unprotectedEndpoints.find(item => endpoint.includes(item))) {
      response.data = decryptContent(response.data, password, skipFields);
    }
    return Promise.resolve(response);
  });
}

export function httpPost(
  endpoint: string,
  payload: any,
  headers: any,
  password: string = '',
  skipFields: Array<string> = []
) {
  if (!unprotectedEndpoints.find(item => endpoint.includes(item))) {
    payload = encryptContent(payload, password, skipFields);
  }
  return axios.post(baseUrl + endpoint, payload, headers).then(response => {
    if (!unprotectedEndpoints.find(item => endpoint.includes(item))) {
      response.data = decryptContent(response.data, password, skipFields);
    }
    return Promise.resolve(response);
  });
}

export function httpPut(
  endpoint: string,
  payload: any,
  headers: any,
  password: string = '',
  skipFields: Array<string> = []
) {
  if (!unprotectedEndpoints.find(item => endpoint.includes(item))) {
    payload = encryptContent(payload, password, skipFields);
  }
  return axios.put(baseUrl + endpoint, payload, headers).then(response => {
    if (!unprotectedEndpoints.find(item => endpoint.includes(item))) {
      response.data = decryptContent(response.data, password, skipFields);
    }
    return Promise.resolve(response);
  });
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

export function httpDelete(endpoint: string, headers: any) {
  return axios.delete(baseUrl + endpoint, headers);
  //     .then(function(response) {
  //         return Promise.resolve(response);
  //     }
  // )
}

function encryptContent(
  content,
  password: string = '',
  skipFields: Array<string> = []
) {
  if (Array.isArray(content)) {
    let encryptedContent: any = [];
    content.forEach(item =>
      encryptedContent.push(encryptObject(item, password, skipFields))
    );
    return encryptedContent;
  } else {
    return encryptObject(content, password, skipFields);
  }
}

function encryptObject(
  content,
  password: string = '',
  skipFields: Array<string> = []
) {
  let encryptedContent = {};
  for (let key in content) {
    if (
      content[key] &&
      !skipFields.includes(key) &&
      !autoGeneratedFields.includes(key)
    ) {
      encryptedContent[key] = encrypt(password, content[key], 'aasd');
    } else {
      encryptedContent[key] = content[key];
    }
  }
  return encryptedContent;
}

function decryptContent(
  encryptedContent,
  password: string = '',
  skipFields: Array<string> = []
) {
  if (Array.isArray(encryptedContent)) {
    let content: any = [];
    encryptedContent.forEach(item =>
      content.push(decryptObject(item, password, skipFields))
    );
    return content;
  } else {
    return decryptObject(encryptedContent, password, skipFields);
  }
}

function decryptObject(
  encryptedContent,
  password: string = '',
  skipFields: Array<string> = []
) {
  let content = {};

  for (let key in encryptedContent) {
    if (
      encryptedContent[key] &&
      !skipFields.includes(key) &&
      !autoGeneratedFields.includes(key)
    ) {
      content[key] = decrypt(password, encryptedContent[key]);
    } else {
      content[key] = encryptedContent[key];
    }
  }
  return content;
}

function encrypt(password, message, salt) {
  const config = {
    cipher: 'aes',
    iter: '12000',
    ks: 256,
    salt: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(salt))
  };
  return sjcl.encrypt(password, message, config);
}

function decrypt(password, ciphertext) {
  return sjcl.decrypt(password, ciphertext);
}
