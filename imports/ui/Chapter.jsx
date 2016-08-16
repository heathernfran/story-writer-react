import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// import { Chapters } from '../api/chapters.js';

// Chapter component - represents a single todo item
export default class Chapter extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('chapters.setChecked', this.props.chapter._id, !this.props.chapter.checked);
  }

  deleteThisChapter() {
    Meteor.call('chapters.remove', this.props.chapter._id);
  }

  togglePrivate() {
    Meteor.call('chapters.setPrivate', this.props.chapter._id, ! this.props.chapter.private);
  }

  render() {
    // Give chapters a different className when they are checked off,
    // so that we can style them nicely in CSS
    const chapterClassName = classnames({
      checked: this.props.chapter.checked,
      private: this.props.chapter.private,
    });
    return (
      <li className={chapterClassName}>
        <button className="delete" onClick={this.deleteThisChapter.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.chapter.checked}
          onClick={this.toggleChecked.bind(this)}
        />

      { this.props.showPrivateButton ? (
        <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
          { this.props.chapter.private ? 'Private' : 'Public' }
        </button>
      ) : ''}

        <span className="text">
          <strong>{this.props.chapter.username}</strong>: {this.props.chapter.text}
        </span>
      </li>
    );
  }
}

Chapter.propTypes = {
  // This component gets the chapter to display through a React prop.
  // We can use propTypes to indicate it is required
  chapter: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};
