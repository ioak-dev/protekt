import * as React from 'react';
import { shallow, mount } from 'enzyme';

import BookmarkView from './BookmarkView';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
const bookmarks = [
  {
    _id: '5e51310b9491c70022bd470e',
    title: 'Google',
    href: 'https://google.com',
    tags: 'adsfs',
    userId: '5dd7e6790b65f20022289139',
    createdAt: '2020-02-22T13:47:55.808Z',
    lastModifiedAt: '2020-02-23T19:41:49.846Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd4',
    userId: '5dd7e6790b65f20022289139',
    href: 'fdsfds',
    title: 'dsfads',
    tags: '',
    createdAt: '2020-02-23T13:37:55.167Z',
    lastModifiedAt: '2020-02-23T13:37:55.167Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd5',
    userId: '5dd7e6790b65f20022289139',
    href: 'adsfsdf',
    title: 'dsfsdfa',
    tags: '',
    createdAt: '2020-02-23T13:37:55.168Z',
    lastModifiedAt: '2020-02-23T13:37:55.168Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd6',
    userId: '5dd7e6790b65f20022289139',
    href: 'dsfasd',
    title: 'sadsafd',
    tags: '',
    createdAt: '2020-02-23T13:37:55.169Z',
    lastModifiedAt: '2020-02-23T13:37:55.169Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd7',
    userId: '5dd7e6790b65f20022289139',
    href: 't',
    title: 'test 123',
    tags: '',
    createdAt: '2020-02-23T13:37:55.170Z',
    lastModifiedAt: '2020-02-23T13:37:55.170Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd9',
    userId: '5dd7e6790b65f20022289139',
    href: 'dsfs',
    title: 'sad',
    tags: '',
    createdAt: '2020-02-23T13:37:55.172Z',
    lastModifiedAt: '2020-02-23T13:37:55.172Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bdb',
    userId: '5dd7e6790b65f20022289139',
    href: 'sfdsfds',
    title: 'dxsad',
    tags: '',
    createdAt: '2020-02-23T13:37:55.173Z',
    lastModifiedAt: '2020-02-23T13:37:55.174Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bda',
    userId: '5dd7e6790b65f20022289139',
    href: 'sfds',
    title: 'sdsad',
    tags: '',
    createdAt: '2020-02-23T13:37:55.172Z',
    lastModifiedAt: '2020-02-23T13:37:55.173Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bd8',
    userId: '5dd7e6790b65f20022289139',
    href: 'dfsaf',
    title: 'sadsa',
    tags: '',
    createdAt: '2020-02-23T13:37:55.171Z',
    lastModifiedAt: '2020-02-23T13:37:55.171Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bdc',
    userId: '5dd7e6790b65f20022289139',
    href: 'sadsad',
    title: 'asd',
    tags: '',
    createdAt: '2020-02-23T13:37:55.175Z',
    lastModifiedAt: '2020-02-23T13:37:55.176Z',
    __v: 0,
  },
  {
    _id: '5e528033d8356100229c1bdd',
    userId: '5dd7e6790b65f20022289139',
    href: 'fcdsfvdsgvgd',
    title: 'd',
    tags: '',
    createdAt: '2020-02-23T13:37:55.176Z',
    lastModifiedAt: '2020-02-23T13:37:55.176Z',
    __v: 0,
  },
];

describe('BookmarkView component interaction', () => {
  const mockFn = jest.fn();

  it('should load when initialized', () => {
    const bookmark = { tags: 'test tag' };
    const wrapper = shallow(
      <BookmarkView
        bookmark={bookmark}
        selectBookmark={mockFn}
        deleteBookmark={mockFn}
        searchByTag={mockFn}
        searchPref={{ filtered: false }}
        view={bookmarks}
        handleBookmarkDataChange={mockFn}
        handleSearchPrefDataChange={mockFn}
        toggleSearchPref={mockFn}
        clearSearch={mockFn}
        update={mockFn}
        search={mockFn}
      />
    );
    expect(wrapper.find('.bookmarks')).toHaveLength(1);
  });

  it('should render 6 (default page size) bookmarks', () => {
    const bookmark = { tags: 'test tag' };
    const wrapper = mount(
      <BookmarkView
        bookmark={bookmark}
        selectBookmark={mockFn}
        deleteBookmark={mockFn}
        searchByTag={mockFn}
        searchPref={{ filtered: false }}
        view={bookmarks}
        handleBookmarkDataChange={mockFn}
        handleSearchPrefDataChange={mockFn}
        toggleSearchPref={mockFn}
        clearSearch={mockFn}
        update={mockFn}
        search={mockFn}
      />
    );
    expect(wrapper.find('.item-container')).toHaveLength(6);
  });
});
