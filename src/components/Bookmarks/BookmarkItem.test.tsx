import * as React from 'react';
import { shallow } from 'enzyme';

import BookmarkItem from './BookmarkItem';

describe('BookmarkItem component interaction', () => {
  const mockFn = jest.fn();
  let mockEditBookmarkFunction;

  beforeEach(() => {
    mockEditBookmarkFunction = jest.fn();
  });

  it('should load when initialized', () => {
    const bookmark = { tags: 'test tag' };
    const wrapper = shallow(
      <BookmarkItem
        id="1"
        bookmark={bookmark}
        editBookmark={mockFn}
        deleteBookmark={mockFn}
        searchByTag={mockFn}
      />
    );
    expect(wrapper.find('.item')).toHaveLength(1);
  });

  it('should call edit bookmark function when edit icon is clicked', () => {
    const bookmark = { tags: 'test tag' };
    const wrapper = shallow(
      <BookmarkItem
        id="1"
        bookmark={bookmark}
        editBookmark={mockEditBookmarkFunction}
        deleteBookmark={mockFn}
        searchByTag={mockFn}
      />
    );
    wrapper.find('[data-test="bookmark-edit"]').simulate('click');
    expect(mockEditBookmarkFunction).toBeCalledTimes(1);
  });
});
