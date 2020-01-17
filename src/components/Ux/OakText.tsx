import React from 'react';
import './OakText.scss';

interface Props {
    label: string,
    id: string,
    data: any,
    type?: string,
    handleChange: any,
    errorFields?: any,
    disabled?: boolean,
    rows?: number,
    multiline?: boolean
}
function OakText(props: Props) {
    return (
        <div className="oak-text-field">
            <label>{props.label}</label>
            {!props.multiline && <input disabled={props.disabled} autoComplete="off"
                className={(props.errorFields && props.errorFields[props.id] ? "error" : "") + (props.disabled ? " disabled" : "")}
                type={props.type ? props.type : "text"} name={props.id} value={props.data[props.id]} onChange={props.handleChange}></input>}
            
            {props.multiline && <textarea disabled={props.disabled} rows={props.rows ? props.rows : 4}
                className={(props.errorFields && props.errorFields[props.id] ? "error" : "") + (props.disabled ? " disabled" : "")}
                name={props.id} value={props.data[props.id]} onChange={props.handleChange}></textarea>}
        </div>
    )
}

OakText.propTypes = {
};

export default OakText;
