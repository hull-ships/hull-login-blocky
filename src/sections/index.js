import { Sections, Components } from 'hull-login';

const sectionFooter = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  textAlign: 'center',
  padding: 30
};


class logIn extends Sections.logIn {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
}


class signUp extends Sections.signUp {
  renderHeader() {}
  getStyles() {
    return {
      ...super.getStyles(),
      sectionFooter
    };
  }
}


class resetPassword extends Sections.resetPassword {
  renderHeader() {}
}


class showProfile extends Sections.showProfile {

}


class editProfile extends Sections.editProfile {
}


class thanks extends Sections.thanks {
}


export default {
  logIn,
  signUp,
  resetPassword,
  showProfile,
  editProfile,
  thanks
};

