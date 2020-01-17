import React from 'react';
import { getProfile, setProfile, persistProfile } from '../../actions/ProfileActions';
import './style.scss';
import View from '../Ux/View';
import ViewResolver from '../Ux/ViewResolver';
import { Switch } from '@material-ui/core';
import { connect } from 'react-redux';
import {importBookmarks} from '../Bookmarks/BookmarkService';
import { isEmptyOrSpaces } from '../Utils';
import {signin, updateUserDetails, preSignin} from '../Auth/AuthService';
import { Authorization, Profile } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import { httpGet } from "../Lib/RestTemplate";
import {constants} from "../Constants";
import {sendBookmarkExportEmail} from "./SettingsService";
import OakText from "../Ux/OakText";
import OakButton from "../Ux/OakButton";

interface Props {
  profile: Profile,
  getProfile: Function,
  setProfile: Function,
  persistProfile: Function,
  authorization: Authorization
}

interface State {
  oldPassword: string,
  newPassword: string,
  repeatPassword: string,
  name: string,
  email: string,
  data:any
}

class Settings extends React.Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
      data: []
    }
  }

  componentDidMount() {
    this.setState({
      // name: this.props.cookies.get('name'),
      // email: this.props.cookies.get('email')
    })
  }

  handleChange = (event) => {
    this.setState(
        {
          ...this.state,
            [event.currentTarget.name]: event.currentTarget.value
        }
    )
  }

  toggleDarkMode = () => {
      if (this.props.profile.theme === 'theme_dark') {
          this.props.persistProfile(this.props.authorization, {
              ...this.props.profile,
              theme: 'theme_light'
          })
      } else  {
          this.props.persistProfile(this.props.authorization, {
              ...this.props.profile,
              theme: 'theme_dark'
          })
      }
  }

  changeTextSize = (size) => {
      this.props.persistProfile(this.props.authorization, {
          ...this.props.profile,
          textSize: size
      })
  }

  changeThemeColor = (color) => {
      this.props.persistProfile(this.props.authorization, {
          ...this.props.profile,
          themeColor: color
      })
  }

  changePassword = () => {
    if (isEmptyOrSpaces(this.state.oldPassword)) {
      sendMessage('notification', true, {message: 'Old password not provided', type: 'failure', duration: 5000});
      return;
    }

    if (isEmptyOrSpaces(this.state.newPassword) || isEmptyOrSpaces(this.state.repeatPassword)) {
      sendMessage('notification', true, {message: 'New password not provided', type: 'failure', duration: 5000});
      return;
    }

    if (this.state.newPassword !== this.state.repeatPassword) {
      sendMessage('notification', true, {message: 'New password not provided', type: 'failure', duration: 5000});
      return;
    }

    this.checkOldPassword('oldpassword');
  }

  checkOldPassword = (type) => {
    preSignin(this.state.email).then((response) => {
      if (response.status === 200) {
          signin({
              email: this.state.email,
              password: this.state.oldPassword
              }, response.data)
              .then((response) => {
                  if (response.status === 200) {
                      this.updateUserDetailsImpl('password');
                      // sendMessage('notification', true, {message: 'Passphrase updated successfully', type: 'success', duration: 3000});
                  } else if (response.status === 401) {
                      sendMessage('notification', true, {message: 'Incorrect passphrase', type: 'failure', duration: 3000});
                  } else {
                      sendMessage('notification', true, {message: 'Unknown response from server. Please try again or at a later time', type: 'failure', duration: 3000});
                  }
              })
              .catch((error) => {
                  sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
              })
      }
    })
  }



  updateUserDetails = () => {
    if (isEmptyOrSpaces(this.state.name)) {
      sendMessage('notification', true, {message: 'Name not provided', type: 'failure', duration: 5000});
      return;
    }

    if (isEmptyOrSpaces(this.state.email)) {
      sendMessage('notification', true, {message: 'Email not provided', type: 'failure', duration: 5000});
      return;
    }

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
      sendMessage('notification', true, {type: 'failure', message: 'Email ID is invalid', duration: 3000});
      return;
    }

    this.updateUserDetailsImpl('user');

  }

  updateUserDetailsImpl = (type) => {
    updateUserDetails({
      name: this.state.name,
      email: this.state.email,
      password: this.state.newPassword
    }, this.props.authorization, type)
    .then((response: any) => {
      if (response.status === 201) {
        if (type === 'password') {
          sendMessage('notification', true, {message: 'Password updated successfully', type: 'success', duration: 3000});
        } else{
          // this.props.cookies.set('name', this.state.name);
          // this.props.cookies.set('email', this.state.email);
          sendMessage('notification', true, {message: 'User account updated successfully', type: 'success', duration: 3000});
        }
      } else {
        sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
      }
    })
    .catch((error) => {
        sendMessage('notification', true, {'type': 'failure', message: 'Unknown error. Please try again or at a later time', duration: 3000});
    })
  }

  fileChoosen = (event) => {
    event.preventDefault();
    const that = this;
    var reader = new FileReader();
    sendMessage('spinner');
    reader.onload = function(event: any) {
      importBookmarks({
        content: event.target.result
      }, that.props.authorization.token)
      .then(function(response) {
        sendMessage('notification', true, {message: 'Imported (' + response.data.length + ') bookmarks successfully', type: 'success', duration: 6000});
      });
    }
    reader.readAsText(event.target.files[0]);
    event.target.value = '';
  }

  exportBookmark = () => {
    const that = this;
    httpGet(constants.API_URL_BOOKMARK,
        {
          headers: {
            Authorization: 'Bearer ' + that.props.authorization.token
          }
        }, that.props.authorization.password)
        .then(function(response) {
          let staticContent = '<META HTTP-EQUIV="Content-Type" CONTENT="text/html;' +
              ' charset=UTF-8"><TITLE>Bookmarks</TITLE><H1>Bookmarks</H1>';

          that.setState({data: response.data});

          that.state.data.map(function(bookmark, i){
            let htmlContent = '<DL><p>' + '<DT>' + '<A ' + 'HREF="' + bookmark.href + '">' + bookmark.title + '</A>' + '</DL><p>';
            staticContent = staticContent+htmlContent;
          })

          console.log(staticContent);
          that.sendExportEmail(staticContent);
        }
        );

  }
  sendExportEmail = (staticContent) => {

    sendBookmarkExportEmail({
          email: this.state.email,
          content: staticContent
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.props.authorization.token
          }
        })
        .then((response: any) => {
          if (response === 200) {
            sendMessage('notification', true, {message: 'Check your mail for bookmark attachment', type: 'success', duration: 3000});
          }
        })
        .catch((error) => {
          sendMessage('notification', true, {'type': 'failure', message: 'Bad request', duration: 3000});
        })
  }
  render() {

    return (
      <div className="settings">
        <ViewResolver sideLabel='More options'>
          <View main>
          <div className="typography-3">Import Bookmarks</div>
          <div className="space-top-2 space-left-2">
            <label className="file-upload">
              <input type="file" name="file" onChange={this.fileChoosen} />
              Import
            </label>
          </div>


          <div className="typography-3 space-top-4">Export Bookmarks</div>
          <div className="space-top-2 space-left-2"><OakButton theme="secondary" variant="animate in" action={this.exportBookmark}>Export</OakButton></div>


          <div className="typography-3 space-top-4">Appearance</div>
          <div className="appearance">
            <div className="typography-5">Dark mode</div>
            <div>
                <Switch
                checked={this.props.profile.theme === 'theme_dark'}
                onChange={this.toggleDarkMode}
                inputProps={{ 'aria-label': 'primary checkbox' }}/>
            </div>

            <div className="typography-5 space-bottom-2">Text Size</div>
            <div className=" space-bottom-2">
              <div className={"text-size size-1 space-right-1 " + (this.props.profile.textSize === 'textsize_tiny' ? 'active' : '')}  onClick={() => this.changeTextSize('textsize_tiny')}>Az</div>
              <div className={"text-size size-2 space-right-1 " + (this.props.profile.textSize === 'textsize_small' ? 'active' : '')}  onClick={() => this.changeTextSize('textsize_small')}>Az</div>
              <div className={"text-size size-3 space-right-1 " + (this.props.profile.textSize === 'textsize_medium' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_medium')}>Az</div>
              <div className={"text-size size-4 " + (this.props.profile.textSize === 'textsize_large' ? 'active' : '')} onClick={() => this.changeTextSize('textsize_large')}>Az</div>
            </div>

            <div className="typography-5">Color Scheme</div>
            <div>
              <div className="theme-color color-1" onClick={() => this.changeThemeColor('themecolor_1')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_1' && 'check'}</i></div>
              <div className="theme-color color-2" onClick={() => this.changeThemeColor('themecolor_2')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_2' && 'check'}</i></div>
              <div className="theme-color color-3" onClick={() => this.changeThemeColor('themecolor_3')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_3' && 'check'}</i></div>
              <div className="theme-color color-4" onClick={() => this.changeThemeColor('themecolor_4')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_4' && 'check'}</i></div>
              <div className="theme-color color-5" onClick={() => this.changeThemeColor('themecolor_5')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_5' && 'check'}</i></div>
              <div className="theme-color color-6" onClick={() => this.changeThemeColor('themecolor_6')}><i className="material-icons">{this.props.profile.themeColor === 'themecolor_6' && 'check'}</i></div>
            </div>
          </div>

          <div className="typography-3 space-top-4">User Account</div>
          <div><OakText label="Name" data={this.state} id="name" handleChange={e => this.handleChange(e)} /></div>
          <div><OakText label="Email" data={this.state} id="email" handleChange={e => this.handleChange(e)} /></div>
          <div className="space-top-1"><OakButton theme="secondary" variant="animate in" action={this.updateUserDetails}>Update details</OakButton></div>

          <div className="typography-3 space-top-4">Password</div>
          <div><OakText type="password" label="Old Password" data={this.state} id="oldPassword" handleChange={e => this.handleChange(e)} /></div>
          <div><OakText type="password" label="New Password" data={this.state} id="newPassword" handleChange={e => this.handleChange(e)} /></div>
          <div><OakText type="password" label="Repeat New Password" data={this.state} id="repeatPassword" handleChange={e => this.handleChange(e)} /></div>
          <div className="space-top-1"><OakButton theme="secondary" variant="animate in" action={this.changePassword}>Change Password</OakButton></div>
          </View>
        </ViewResolver>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfile, setProfile, persistProfile })(Settings);