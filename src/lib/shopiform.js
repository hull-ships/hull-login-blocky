'use strict';

let { superagent, Promise } = Hull.utils;

const INEXISTANT_URL = '/___RETURN_TO___';

function wrap(data) {
  let h = {};

  for (let k in data) {
    if (data.hasOwnProperty(k) && data[k] != null) {
      h['customer[' + k + ']'] = data[k];
    }
  }

  return h;
}

export function logIn(data) {
  let o = document.location.origin;
  let url = o + '/account/login';

  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'customer_login',
      'return_to': INEXISTANT_URL,
      ...wrap(data)
    }).end((error, response) => {
      // When log in succeeds, the user is redirected to `return_to` value.
      if (o + INEXISTANT_URL === response.xhr.responseURL) {
        resolve();
      } else {
        reject(new Error('invalid credentials'));
      }
    });
  });
}

export function signUp(data) {
  let url = document.location.origin + '/account';
  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'create_customer',
      ...wrap(data)
    }).end((error, response) => {
      // When sign up succeeds, the user is redirected to the account page.
      if (url === response.xhr.responseURL) {
        resolve();
      } else {
        reject(new Error('email taken'));
      }
    });
  });
}

export function resetPassword(data) {
  let o = document.location.origin;
  let url = o + '/account/recover';

  return new Promise((resolve, reject) => {
    superagent.post(url).type('form').send({
      'form_types': 'recover_customer_password',
      'return_to': INEXISTANT_URL,
      ...data
    }).end((error, response) => {
      switch(response.status) {
        case 404:
          // We are redirected to our dummy URL,
          // which means that we're good
          resolve(true)
          break;
        case 429:
          reject(new Error('reset password too many requests error'));
          break;
        case 200:
          reject(new Error('reset password invalid email error'));
          break;
      }
    });
  });
}
