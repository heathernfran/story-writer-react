import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Chapters } from '../api/chapters.js';

import Chapter from './Chapter.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('chapters.insert', text);

    Chapters.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(), // _id of logged in user
      username: Meteor.user().username, // username of logged in user
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  // getChapters() {
  //   return [
  //     { _id: 1, text: 'This is chapter 1' },
  //     { _id: 2, text: 'This is chapter 2' },
  //     { _id: 3, text: 'This is chapter 3' },
  //   ];
  // }

  renderChapters() {
    let filteredChapters = this.props.chapters;
    if (this.state.hideCompleted) {
      filteredChapters = filteredChapters.filter(chapter => !chapter.checked);
    }
    return filteredChapters.map((chapter) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = chapter.owner === currentUserId;

      return (
        <Chapter
          key={chapter._id}
          chapter={chapter}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Chapters
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-chapter" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new chapters"
              />
            </form> : ''
          }
        </header>

        <ul>
          {this.renderChapters()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  chapters: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('chapters');

  return {
    chapters: Chapters.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Chapters.find({ checked: { $ne: true} }).count(),
    currentUser: Meteor.user(),
  }
}, App);
