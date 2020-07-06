import React, { ReactNode, useState, useEffect } from 'react';
import './styles/oak-chip-group.scss';
import OakText from './OakText';
import { newId } from '../events/MessageService';
import { isEmptyOrSpaces } from '../components/Utils';

interface Props {
  label?: string;
  placeholder?: string;
  objects?: any;
  elements?: any;
  data: any;
  id: string;
  handleAddition: Function;
  handleRemoval: Function;
}

const OakChipGroup = (props: Props) => {
  const [id, setId] = useState(newId());
  const [searchOn, setSearchOn] = useState(false);
  const [criteria, setCriteria] = useState({
    [id]: '',
  });
  const [dropdownFiltered, setDropdownFiltered] = useState<any>(undefined);

  useEffect(() => {
    updateSearchResults(criteria[id]);
  }, [props.objects]);

  const selected = key => {
    setSearchOn(false);
    props.handleAddition(key);
    setCriteria({ [id]: '' });
  };

  const handleFocus = () => {
    setSearchOn(true);
  };

  const handleChange = event => {
    setSearchOn(true);
    setCriteria({ [event.target.name]: event.target.value });
    updateSearchResults(event.target.value);
  };
  const updateSearchResults = searchCriteria => {
    if (props.elements) {
      setDropdownFiltered(
        props.elements.filter(item =>
          item.toLowerCase().includes(searchCriteria.toLowerCase())
        )
      );
    } else {
      setDropdownFiltered(
        props.objects.filter(item =>
          item.value?.toLowerCase().includes(searchCriteria.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    window.addEventListener('click', (e: any) => {
      if (!document.getElementById(id)?.contains(e.target)) {
        setSearchOn(false);
      }
    });
  }, []);

  const handleSubmit = (event, key) => {
    event.preventDefault();
    if (!isEmptyOrSpaces(key)) {
      selected(key);
    }
  };

  return (
    <div className="oak-chip-group" id={id}>
      <div
        className={`search-bar ${
          props.data[props.id]?.length > 0 ? 'hide-label' : ''
        }`}
      >
        <div className="chip-group">
          {props.data[props.id].map(item => (
            <div className="chip" key={item}>
              {item}
              <i
                className="material-icons"
                onClick={() => props.handleRemoval(item)}
              >
                close
              </i>
            </div>
          ))}
        </div>
        <form
          method="GET"
          onSubmit={event => handleSubmit(event, criteria[id])}
          noValidate
        >
          <OakText
            id={id}
            data={criteria}
            label={props.label}
            handleFocus={handleFocus}
            handleChange={handleChange}
            placeholder={props.placeholder}
          />
        </form>
      </div>
      {searchOn && dropdownFiltered && dropdownFiltered.length > 0 && (
        <div className="results">
          {props.elements &&
            dropdownFiltered?.map(item => (
              <div
                className="element"
                key={item}
                onClick={() => selected(item)}
              >
                {props.elements ? item : item.value}
              </div>
            ))}
          {props.objects &&
            dropdownFiltered?.map(item => (
              <div
                className="element"
                key={item.key}
                onClick={() => selected(item.key)}
              >
                {props.elements ? item : item.value}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OakChipGroup;
