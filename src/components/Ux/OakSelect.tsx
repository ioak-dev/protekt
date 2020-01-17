import React from 'react';
import './OakSelect.scss';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
    //   margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  
interface Props {
  id: string,
  label?: string,
  handleChange: Function,
  error?: boolean,
  data: any,
  elements?: Array<string>,
  objects?: Array<any>,
  first?: string,
  firstAction?: string,
  maxWidth?: string
}

function OakSelect(props: Props) {
    const classes = useStyles();

    const { id, label, elements, objects, handleChange, data, first,firstAction } = props;
    let dropdownList: Array<any> = [];
    
    if (elements) {
      dropdownList = elements.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>);
    } else if (objects) {
      dropdownList = objects.map(item => <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>);
    }
    
    return (
        <>
        <FormControl className={"arc-select " + classes.formControl}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <Select
            value={data[id]}
            onChange={e => handleChange(e)}
            inputProps={{
                name: id,
                id: id,
            }}
            autoWidth
            className={props.maxWidth ? props.maxWidth : ""}
            >
                {first && <MenuItem value={first}>{first}</MenuItem>}
                {firstAction && <MenuItem value={firstAction}><em>{firstAction}</em></MenuItem>}
                {dropdownList}
            </Select>
        </FormControl>
        </>
    )
}

export default OakSelect;