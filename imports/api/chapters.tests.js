/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';

import { Chapters } from './chapters.js';

if (Meteor.isServer) {
  describe('Chapters', () => {
    describe('methods', () => {
      const userId = Random.id();
      let chapterId;

      beforeEach(() => {
        Chapters.remove({});
        chapterId = Chapters.insert({
          text: 'test chapter',
          createdAt: new Date(),
          owner: userId,
          username: 'hnf',
        });
      });

      it('can delete owned chapter', () => {
        // Find the internal implementation of the chapter method so we can
        // test it in isolation
        const deleteChapter = Meteor.server.method_handlers['chapters.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteChapter.apply(invocation, [chapterId]);

        // Verify that the method does what we expect
        assert.equal(Chapters.find().count(), 0);
      });
    });
  });
}
