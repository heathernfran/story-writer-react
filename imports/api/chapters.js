import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Chapters = new Mongo.Collection('chapters');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish chapters that are public or belong to the current user
  Meteor.publish('chapters', function chaptersPublication() {
    return Chapters.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'chapters.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a chapter
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Chapters.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'chapters.remove'(chapterId) {
    check(chapterId, String);

    const chapter = Chapters.findOne(chapterId);
    if (chapter.private && chapter.owner !== this.userId) {
      // If the chapter is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Chapters.remove(chapterId);
  },
  'chapters.setChecked'(chapterId, setChecked) {
    check(chapterId, String);
    check(setChecked, Boolean);

    const chapter = Chapters.findOne(chapterId);
    if (chapter.private && chapter.owner !== this.userId) {
      // If the chapter is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Chapters.update(chapterId, { $set: { checked: setChecked } });
  },
  'chapters.setPrivate'(chapterId, setToPrivate) {
    check(chapterId, String);
    check(setChecked, Boolean);

    const chapter = Chapters.findOne(chapterId);

    // Make sure only the chapter owner can make a chapter private
    if (chapter.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Chapters.update(chapterId, { $set: { private: setToPrivate } });
  }
});
