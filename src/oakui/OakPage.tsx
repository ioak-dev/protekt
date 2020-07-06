import React, { useState, useEffect } from 'react';
import './styles/oak-page-packet.scss';

interface Props {
  children?: any;
}

const OakPage = (props: Props) => {
  return <div className="oak-page">{props.children}</div>;
};

export default OakPage;
