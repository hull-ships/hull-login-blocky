'use strict';

import React from 'react';
import assign from 'object-assign';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';
import LayeredComponentMixin from 'react-components/layered-component-mixin';
import { translate } from '../lib/i18n';
import Overlay from './overlay';
import Styles from './styles';
import sections from './sections';
import { TranslatedMessage } from './i18n';
import OrganizationImage from './sections/organization-image';

export default React.createClass({
  displayName: 'Ship',

  mixins: [
    LayeredComponentMixin
  ],

  getInitialState() {
    return this.props.engine.getState();
  },

  componentWillMount() {
    this.props.engine.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    this.props.engine.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(this.props.engine.getState());
  },

  getScope() {
    return `ship-${this.state.ship.id}`;
  },

  getResetStyles() {
    return this.state.shipSettings && this.state.shipSettings.reset_styles;
  },

  renderOverlay() {
    if (!this.state.dialogIsVisible) { return null; }

    const d = { organization: this.state.organization.name };
    const name = {
      logIn: 'log-in',
      signUp: 'sign-up',
      resetPassword: 'reset password',
      showProfile: 'view profile',
      editProfile: 'edit profile',
      thanks: 'thanks'
    };

    const signUpNav = {
      name: 'Sign up',
      action: this.props.actions.activateSignUpSection
    };
    const logInNav = {
      name: 'Log in',
      action: this.props.actions.activateLogInSection
    };
    const viewProfileNav = {
      name: 'View Profile',
      action: this.props.actions.activateShowProfileSection
    };
    const logOutNav = {
      name: 'Log out',
      action: this.props.actions.logOut
    };

    const navs = {
      logIn: [signUpNav, assign({ current: true }, logInNav)],
      signUp: [assign({ current: true }, signUpNav), logInNav],
      resetPassword: [signUpNav, assign({ current: true }, logInNav)],
      showProfile: [assign({ current: true }, viewProfileNav), logOutNav],
      editProfile: [assign({ current: true }, viewProfileNav, { name: 'Edit Profile' }), logOutNav],
      thanks: null
    };

    const Section = sections[this.state.activeSection];
    const overlayTitle = translate(name[this.state.activeSection] + ' header', d);
    const nav = navs[this.state.activeSection];

    const photos = {
      logIn: this.state.shipSettings.login_image,
      signUp: this.state.shipSettings.signup_image,
      resetPassword: this.state.shipSettings.reset_image,
      showProfile: this.state.shipSettings.view_profile_image,
      editProfile: this.state.shipSettings.edit_profile_image,
      thanks: this.state.shipSettings.thanks_image
    };

    const photo = photos[this.state.activeSection];
    const leftTitle = name[this.state.activeSection] + ' photo header';
    const description = name[this.state.activeSection] + ' description';

    return (
      <Overlay className={this.getScope()}
        onClose={this.props.actions.hideDialog}
        title={overlayTitle}
        nav={nav}
        visible={true}
        image={photo}>
        <div>
          <OrganizationImage src={this.state.shipSettings.logo_image} />
          <TranslatedMessage tag='h1'
            className='hull-login__modal__description__title'
            style={{ textAlign: 'center', color: this.state.shipSettings.light_text_color, fontSize: 50, fontWeight: 'bold' }}
            message={leftTitle}
            variables={{ d }} />
          <TranslatedMessage tag='p'
            className='hull-login__modal__description__paragraph'
            style={{ textAlign: 'center', color: this.state.shipSettings.light_text_color }}
            message={description} />
        </div>
        <Section {...this.state} {...this.props.actions} />
      </Overlay>
    );
  },

  renderLayer() {
    return (
      <ReactTransitionGroup>{this.renderOverlay()}</ReactTransitionGroup>
    );
  },

  render() {
    const u = this.state.user;

    let buttons = [];
    if (u) {
      if (this.state.shipSettings.show_profile) {
        if (this.state.hasForm && !this.state.formIsSubmitted) {
          let b = <TranslatedMessage tag='a'
            href='#'
            key='complete-profile'
            className='hull-login__button hull-login__button--edit-profile'
            onClick={this.props.actions.activateEditProfileSection}
            message='nav complete profile link' />;
          buttons.push(b);
        } else {
          let b = <a href='#'
            key='show-profile'
            className='hull-login__button hull-login__button--show-profile'
            onClick={this.props.actions.activateShowProfileSection}>{u.name || u.username || u.email}</a>;
          buttons.push(b);
        }
      }

      if (this.state.shipSettings.custom_buttons.length) {
        for (let i = 0; i < this.state.shipSettings.custom_buttons.length; i++) {
          let { url, popup, text } = this.state.shipSettings.custom_buttons[i];
          let b = <a href={url}
            key={`custom-action-${i}`}
            target={popup ? '_blank' : ''}
            className='hull-login__button hull-login__button'>{text}</a>;
          buttons.push(b);
        }
      }

      let b = <TranslatedMessage tag='a'
        href='#'
        className='hull-login__button hull-login__button--log-out'
        onClick={this.props.actions.logOut}
        message='nav logout link' />;
      buttons.push(b);
    } else {
      if (this.state.shipSettings.show_login) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='log-in'
          className='hull-login__button hull-login__button--log-in'
          onClick={this.props.actions.activateLogInSection}
          message='nav login link' />;
        buttons.push(b);
      }

      if (this.state.shipSettings.show_signup) {
        let b = <TranslatedMessage tag='a'
          href='#'
          key='sign-up'
          className='hull-login__button hull-login__button--sign-up'
          onClick={this.props.actions.activateSignUpSection}
          message='nav sign-up link' />;
        buttons.push(b);
      }
    }

    let s = this.getScope();
    let r = this.getResetStyles();
    return (
      <div className='hull-login'>
        <Styles scope={s} reset={r} />
        {buttons}
      </div>
    );
  }
});
