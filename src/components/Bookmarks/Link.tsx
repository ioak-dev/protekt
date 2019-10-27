import React, { Component } from 'react';
import './style.scss';

interface Props {
    editBookmark: Function,
    deleteBookmark: Function,
    searchByTag: Function,
    bookmark: any,
    id: string
}
interface State {
}

class Link extends Component<Props, State> {

    edit = () => {
        this.props.editBookmark(this.props.bookmark);
    }

    delete = () => {
        this.props.deleteBookmark(this.props.id);
    }

    render() {
        const tags: any = [];
        if (this.props.bookmark.tags) {
            this.props.bookmark.tags.split(" ").map(item => {
                tags.push(<div className="tag" key={item} onClick={() => this.props.searchByTag(item)}>{item}</div>);
            })
        }
        
        return (
            <div>
                <div className="title typography-4">{this.props.bookmark.title}
                    <div className="action-icon">
                        <i onClick={this.edit} className="material-icons">edit</i>
                        <i onClick={this.delete} className="material-icons">delete</i>
                    </div>
                </div>
                <div className="url typography-6"><a target="_blank" rel="noopener noreferrer" href={this.props.bookmark.href}>{this.props.bookmark.href}</a></div>
                <div className="timestamp typography-6 space-bottom-1">{this.props.bookmark.createdAt}</div>
                {tags}
            </div>
        )
    }
}

export default Link;
