import React from 'react';
import './ArcText.scss';

function ArcText(props) {
    return (
        <div className="arc-text-field">
            <label>{props.label}</label>
            <input type="text" name={props.name} value={props.value} onChange={props.handleChange}></input>
        </div>
    )
}

ArcText.propTypes = {
};

export default ArcText;
