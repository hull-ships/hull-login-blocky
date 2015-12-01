import React from 'react';
import ReactDOM from 'react-dom';
import { Core } from 'hull-login';
import Main from './main';
import en from '../locales/en.json';

function onReady(hull, user, platform, organization) {
  const deployment = platform.deployments[0];

  deployment.organization = organization;

  deployment.settings = {};

  deployment.ship.translations = { en };

  deployment.ship.settings = {
    background_color: '#ffffff',
    button_border_radius: 3,
    custom_styles: '',
    disable_buttons_automatically: true,
    edit_profile_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F1f28dee4-7775-bc4a-5ad8-581539ad5ad4.png',
    hide_thanks_section_after: 2,
    light_text_color: '#ffffff',
    link_color: '#aaaaaa',
    login_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F77dddc47-19ab-8919-ea74-c7837ce7d211.png',
    logo_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2Ffc508c3b-6a1e-d8a5-124e-fac74eb645d4.png',
    overlay_border_radius: 6,
    primary_color: '#00a8e2',
    reset_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F77dddc47-19ab-8919-ea74-c7837ce7d211.png',
    reset_styles: false,
    show_classic_login: true,
    show_classic_login_as_button: true,
    show_inline: false,
    show_login: false,
    show_logout: false,
    show_name_field_on_sign_up: true,
    show_profile: true,
    show_sign_up_section_after: 0,
    show_signup: false,
    show_thanks_section_after_sign_up: false,
    signup_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F77dddc47-19ab-8919-ea74-c7837ce7d211.png',
    split_name_field: false,
    text_color: '#aaaaaa',
    thanks_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F1f28dee4-7775-bc4a-5ad8-581539ad5ad4.png',
    view_profile_image: 'https://hull-alpha-organizations-store.s3.amazonaws.com/hull-store%2Fsuper%2F531853659e62dd46360015b0%2F53175bb2635c78c8790032cd%2F5118c23db29c8d2a0d000001%2F1f28dee4-7775-bc4a-5ad8-581539ad5ad4.png'
  };


  deployment.ship.resources = {};

  const element = document.querySelector('#ship');

  const engine = Core.start(deployment, hull);
  ReactDOM.render(<Main engine={engine} actions={engine.getActions()} />, element);

  setTimeout(function() {
    Hull.emit('hull.login.showDialog');
  }, 500);
}

Hull.ready(onReady);
