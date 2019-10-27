import React from 'react';
import { TextField } from '@material-ui/core';

interface Props {
    id: string,
    label: string,
    handleChange: any,
    error?: boolean,
    data: any,
    rows?: number,
    multiline?: boolean,
    type?: string
};
function ArcTextField(props: Props) {
    const { id, label, handleChange, error, rows, multiline, data, type,  ...rest } = props;
    return (
        <TextField
                id={id}
                label={label}
                name={id}
                value={data[id]}
                onChange={e => handleChange(e)}
                margin="normal"
                variant="standard"
                fullWidth
                error={error}
                multiline={multiline}
                rows={rows}
                type={type}
                {...rest}
                />
    )
}

export default ArcTextField;
