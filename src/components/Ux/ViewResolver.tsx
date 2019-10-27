import React, { Component } from 'react';
import './ViewResolver.scss';
import { sendMessage, receiveMessage } from '../../events/MessageService';

interface Props {
    sideLabel?: string
}

interface State {
    views: any,
    main?: any,
    side?: any,
    showSide: boolean,
    mobileViewPort: any
}

class ViewResolver extends Component<Props, State> {
    
    viewPort = window.matchMedia("(max-width: 767px)");

    viewPortChange = (port) => {
        this.setState({
            mobileViewPort: port.matches
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            views: this.props.children,
            showSide: false,
            mobileViewPort: false
        }
    }

    componentWillMount() {
        this.initializeViews();
    }

    componentDidMount() {
        this.viewPortChange(this.viewPort);
        this.viewPort.addListener(this.viewPortChange);

        receiveMessage().subscribe(message => {
            if (message.name === 'sidebar') {
                this.setState({
                    showSide: message.signal
                })
            }
        })
    }

    initializeViews() {
        React.Children.toArray(this.state.views).forEach((node) => {
            // node.type.name is minified after build and so static build result has different alphabet
            // if (node.type.name === 'View') {
                if (node.props.main) {
                    this.setState({
                        main: node
                    })
                } else if (node.props.side) {
                    this.setState({
                        side: node
                    })
                }
            // }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.children) {
            this.setState({
                views: nextProps.children
            }, () => {
                this.initializeViews();
            })
        }
    }

    toggleSideView = () => {
        sendMessage('sidebar', !this.state.showSide);
    }

    render() {
        return (
            <>
            {!this.state.mobileViewPort && <div className="view-desktop">
                {this.state.side && <div className="view-side">
                    {this.state.side}
                </div>}
                <div className={'view-content' + (this.state.side ? ' side-present' : '')}>
                    {this.state.main}
                </div>
            </div>}

            {this.state.mobileViewPort && <div className="view-mobile">
                <div className={(this.state.showSide ? "slider show" : "slider hide")}>
                    <div className="topbar" onClick={this.toggleSideView}>
                        <div>
                            <button className="default hidden" onClick={this.toggleSideView}>
                                {!this.state.showSide && <><i className="material-icons">expand_more</i>{this.props.sideLabel ? this.props.sideLabel : 'Menu'}</>}
                                {this.state.showSide && <><i className="material-icons">expand_less</i>Collapse</>}
                            </button>
                        </div>
                    </div>
                    <div className="view-side">
                        {this.state.showSide && this.state.side}
                    </div>
                </div>
                {!this.state.showSide && <div className="view-main">
                    {this.state.main}
                </div>}
            </div>}
            </>
        )
    }
}

export default ViewResolver;