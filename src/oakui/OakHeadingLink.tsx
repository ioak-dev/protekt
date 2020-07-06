import React, { useState, useEffect } from 'react';
import './styles/oak-heading-packet.scss';

interface Props {
  size?: 'large';
  link: {
    label: string;
    icon?: string;
    action: any;
  };
}

const OakHeadingLink = (props: Props) => {
  const getLinkSize = () => {
    return props.size === 'large' ? 'typography-5' : 'typography-4';
  };
  return (
    <div className="oak-heading-link" onClick={() => props.link.action()}>
      <i className="material-icons typography-6">{props.link.icon}</i>
      <div className={`heading-link-label ${getLinkSize()}`}>
        {props.link.label}
      </div>
    </div>
  );
};

export default OakHeadingLink;
