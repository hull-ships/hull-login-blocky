'use strict';

import _ from 'underscore';
import React from 'react';
import { translate } from '../../lib/i18n';
import { getStyles } from './styles';
import transform from 'tcomb-json-schema';
import AsyncActionsMixin from '../../mixins/async-actions';
import Form from '../form';
import { TranslatedMessage } from '../i18n';

function getHelpMessage(v) {
  if (typeof v.help === 'string') { return v.help; }

  let m;
  if (v.minLength > 1 && v.maxLength > 1) {
    m = 'form help string between';
  } else if (v.minLength > 1) {
    m = 'form help string min';
  } else if (v.maxLength) {
    m = 'form help string max';
  }

  if (m != null) {
    return <TranslatedMessage message={m} variables={v} />;
  }
}

const DEFAULT_SCHEMA = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'title': translate('edit profile email field'),
      'format': 'email',
      'minLength': 1
    },
    'password': {
      'type': 'string',
      'title': translate('edit profile password field'),
      'format': 'password',
      'help': <TranslatedMessage message='edit profile password help text' />
    }
  },
  'required': [
    'name',
    'email'
  ]
};

export default React.createClass({
  displayName: 'LogInSection',

  mixins: [
    AsyncActionsMixin
  ],

  getAsyncActions() {
    return {
      updateUser: this.props.updateUser
    };
  },

  getSchema() {
    if (this.props.hasForm) {
      if (this.props.formIsSubmitted) {
        return {
          type: 'object',
          properties: {
            ...DEFAULT_SCHEMA.properties,
            ...this.props.form.fields_schema.properties
          },
          required: DEFAULT_SCHEMA.required.concat(this.props.form.fields_schema.required)
        };
      }

      return this.props.form.fields_schema;
    }

    return DEFAULT_SCHEMA;
  },

  getType() {
    return transform(this.getSchema());
  },

  getFields() {
    let errors = ((this.props.errors || {}).updateUser || {}).errors || {};

    let schema = this.getSchema();
    return _.reduce(schema.properties, function(m, v, k) {
      let label = v.title;
      let isRequired = _.include(schema.required, k);
      if (isRequired) { label += ' *'; }

      let help = getHelpMessage(v);

      let f = {
        label,
        help,
        hasError: !!errors[k]
      };

      if (v.type === 'string') {
        f.type = v.format === 'uri' ? 'url' : (v.format || 'text');
      }

      m[k] = f;

      return m;
    }, {});
  },

  handleLogOut(e) {
    e.preventDefault();

    this.props.logOut();
    this.props.hideDialog();
  },

  handleSubmit(value) {
    this.getAsyncAction('updateUser')(value);
  },

  render() {
    let subtitle = '';
    let button = '';
    let disabled = false;

    if (this.props.formIsSubmitted || !this.props.hasForm) {
      subtitle = <a href='javascript: void 0;' onClick={this.props.activateShowProfileSection}>
        {translate('edit profile cancel button')}
      </a>;
      button = translate('edit profile button text');
    } else {
      subtitle = <a href='javascript: void 0;' onClick={this.props.hideDialog}>
        {translate('edit profile cancel button when profile incomplete')}
      </a>;
      button = translate('edit profile button text when profile incomplete');
    }

    if (this.state.updateUserState === 'pending') {
      button = translate('edit profile button text when attempting edit');
      disabled = true;
    }

    let u = this.props.user;
    let value = {
      ...u,
      ...this.props.facebookProfile,
      ...(this.props.form.user_data && this.props.form.user_data.data)
    };
    let styles = getStyles();

    return (
      <div style={{ padding: '60px 0' }}>
        <Form type={this.getType()}
          fields={this.getFields()}
          value={value}
          submitMessage={button}
          onSubmit={this.handleSubmit}
          disabled={disabled}
          autoDisableSubmit={this.props.shipSettings.disable_buttons_automatically} />

        <div style={styles.stickySectionFooter}>
          <p style={styles.sectionText}>{subtitle}</p>
        </div>
      </div>
    );
  }
});
