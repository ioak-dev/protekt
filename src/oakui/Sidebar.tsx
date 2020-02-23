import React, { useState, useEffect } from 'react';
import './Sidebar.scss';
import { sendMessage, receiveMessage } from '../events/MessageService';

interface Props {
  show?: boolean;
  elements?: Array<any>;
  label: string;
  icon: string;
  number?: number;
  animate?: boolean;
  children?: any;
}

const Sidebar = (props: Props) => {
  const [show, setShow] = useState(false);
  const [elementList, setElementList] = useState([{}]);

  useEffect(() => {
    sendMessage('sidebarExpanded', show, { label: props.label });
  }, [show]);

  useEffect(() => {
    setShow(!!props.show);
    setElementList(props.elements ? props.elements : []);
    const eventBus = receiveMessage().subscribe(message => {
      if (
        message.name === 'sidebarExpanded' &&
        message.signal &&
        message.data &&
        message.data.label !== props.label
      ) {
        setShow(false);
      }
    });
    return () => eventBus.unsubscribe();
  }, []);

  const elements = elementList.map((item: any) => (
    <div key={item.label} className="element" onClick={item.action}>
      <i className="material-icons">{item.icon}</i>
      {item.label}
    </div>
  ));
  return (
    <div className="sidebar">
      <div
        className={show ? 'header active' : 'header'}
        onClick={() => setShow(!show)}
      >
        <div className="label">
          <i className="material-icons">{props.icon}</i>
          {props.label}
          {props.number !== undefined && (
            <div className="number">{props.number}</div>
          )}
        </div>
        {/* <div className="aria"><i className="material-icons">{this.state.show ? 'expand_less' : 'expand_more'}</i></div> */}
        <div className="aria">
          <i className={show ? 'material-icons collapse' : 'material-icons'}>
            keyboard_arrow_left
          </i>
        </div>
      </div>
      <div
        className={
          show
            ? `content show ${props.animate ? 'animate in' : 'static'}`
            : `content hide ${props.animate ? 'animate in' : 'static'}`
        }
      >
        {elements}
        {props.children}
      </div>
    </div>
  );
};

export default Sidebar;
