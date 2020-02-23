import React from 'react';

interface Props {
  main?: any;
  side?: any;
  children?: any;
}

const View = (props: Props) => {
  return (
    <div>
      {/* {this.props} */}
      {props.children}
    </div>
  );
};

export default View;
