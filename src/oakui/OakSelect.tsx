import React, { useState } from 'react';
import './styles/oak-select.scss';

interface Props {
  id: string;
  label?: string;
  handleChange: any;
  error?: boolean;
  data: any;
  elements?: string[];
  objects?: Array<any>;
  first?: string;
  firstAction?: string;
  variant?: 'outline' | 'no-outline' | 'block' | 'normal';
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default';
  width?: 'width-25' | 'width-50' | 'width-75' | 'width-100';
}

const OakSelect = (props: Props) => {
  const [show, setShow] = useState(false);

  const changeSelection = (e, newValue) => {
    e.target.name = props.id;
    e.target.value = newValue;
    props.handleChange(e);
    setShow(!show);
  };

  const getStyle = () => {
    let style = props.theme ? props.theme : '';
    style += props.variant ? ` ${props.variant}` : '';
    style += props.width ? ` ${props.width}` : '';

    return style;
  };

  let dropdownList: Array<any> = [];

  if (props.elements) {
    dropdownList = props.elements.map(item => (
      <div
        className="option"
        key={item}
        onClick={e => changeSelection(e, item)}
      >
        {item}
      </div>
    ));
  } else if (props.objects) {
    dropdownList = props.objects.map(item => (
      <div
        className="option"
        key={item.key}
        onClick={e => changeSelection(e, item.key)}
      >
        {item.value}
      </div>
    ));
  }

  return (
    <div className="oak-select">
      <select
        onChange={props.handleChange}
        name={props.id}
        className="select"
        value={props.data[props.id]}
      >
        <option value=""> </option>
        {props.firstAction && (
          <option value={props.firstAction}>{props.firstAction}</option>
        )}
        {props.elements?.map(item => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
        {props.objects?.map(item => (
          <option value={item.key} key={item.key}>
            {item.value}
          </option>
        ))}
      </select>
      {props.label && (
        <label
          htmlFor={props.id}
          className={props.data[props.id] ? 'active' : ''}
        >
          {props.label}
        </label>
      )}
    </div>
  );
};

export default OakSelect;
