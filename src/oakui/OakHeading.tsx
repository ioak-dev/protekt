import React, { useState, useEffect } from 'react';
import './styles/oak-heading-packet.scss';
import OakHeadingLink from './OakHeadingLink';

interface Props {
  title: any;
  subtitle?: string;
  links?: {
    label: string;
    icon?: string;
    action: any;
  }[];
  linkSize?: 'large';
  children?: any;
}

const OakHeading = (props: Props) => {
  return (
    <div className="oak-heading">
      <div className="heading-title typography-10">{props.title}</div>
      {props.subtitle && (
        <div className="heading-subtitle typography-4">{props.subtitle}</div>
      )}
      <div className="heading-links">
        {props.links?.map((item, index) => (
          <OakHeadingLink link={item} key={index} size={props.linkSize} />
        ))}
      </div>
      {props.children && (
        <div className="heading-children">{props.children}</div>
      )}
      <div className="heading-highlight" />
    </div>
  );
};

export default OakHeading;
