import React, { useState } from 'react';
import './style.scss';
import OakPrompt from '../../oakui/OakPrompt';

interface Props {
  editBookmark: Function;
  deleteBookmark: Function;
  searchByTag: Function;
  bookmark: any;
  id: string;
}

const BookmarkItem = (props: Props) => {
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const tags: any = [];

  if (props.bookmark.tags) {
    props.bookmark.tags.split(' ').map(item => {
      tags.push(
        <div className="tag" key={item} onClick={() => props.searchByTag(item)}>
          {item}
        </div>
      );
    });
  }

  return (
    <div className="item">
      <OakPrompt
        visible={showDeletePrompt}
        toggleVisibility={() => setShowDeletePrompt(!showDeletePrompt)}
        action={() => props.deleteBookmark(props.id)}
        text="Are you sure, you want to delete the bookmark?"
      />
      <div className="item-container">
        <div className="item-actions">
          <div className="item-edit">
            <i
              onClick={() => window.open(props.bookmark.href)}
              className="material-icons"
            >
              link
            </i>
          </div>
          <div className="item-edit">
            <i
              onClick={() => props.editBookmark(props.bookmark)}
              className="material-icons"
            >
              edit
            </i>
          </div>
          <div className="item-delete">
            <i
              onClick={() => setShowDeletePrompt(!showDeletePrompt)}
              className="material-icons"
            >
              delete
            </i>
          </div>
        </div>
        {/* <div className="item-divider"></div> */}
        <div className="item-content">
          <div className="title typography-4">{props.bookmark.title}</div>
          <div className="url typography-6">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={props.bookmark.href}
            >
              {props.bookmark.href}
            </a>
          </div>
          <div className="timestamp typography-6 space-bottom-1">
            {props.bookmark.createdAt}
          </div>
          {tags}
        </div>
      </div>
    </div>
  );
};

export default BookmarkItem;
