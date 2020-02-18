import React from 'react';
import './OakSelect.scss';

interface Props {
  id: string,
  label?: string,
  handleChange: Function,
  error?: boolean,
  data: any,
  elements?: string[],
  objects?: Array<any>,
  first?: string,
  firstAction?: string,
  variant?: 'outline' | 'no-outline' | 'block' | 'normal',
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default',
  width?: 'width-25' | 'width-50' | 'width-75' | 'width-100'
}
interface State {
  show?: boolean
}

export default class OakSelect extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.state = {
      show: false
    }
  }
  
  toggle = () => {
    this.setState({
      show: !this.state.show
    })
  }

  changeSelection = (e, newValue) => {
    e.target.name = this.props.id;
    e.target.value = newValue;
    this.props.handleChange(e);
    this.toggle();
  }
  
  getStyle = () => {
    let style = this.props.theme ? this.props.theme : "";
    style = style + (this.props.variant ? " " + this.props.variant : "");
    style = style + (this.props.width ? " " + this.props.width : "");

    return style;
  }

  render() {
    let dropdownList: Array<any> = [];

    if (this.props.elements) {
      dropdownList = this.props.elements.map(item => <div className="option" key={item} onClick={(e) => this.changeSelection(e, item)}>{item}</div>);
    } else if (this.props.objects) {
      dropdownList = this.props.objects.map(item => <div className="option" key={item} onClick={(e) => this.changeSelection(e, item.key)}>{item.value}</div>);
    }

    return (
      <>
        <div className={"oak-select " + this.getStyle()}>
          {this.props.label && <label>{this.props.label}</label>}
          <div className="select-button" onClick={() => this.toggle()}>
            {this.props.elements && <div>{this.props.data[this.props.id]}</div>}
            {this.props.objects && <div>{this.props.objects.find((element) => element.key === this.props.data[this.props.id]) && this.props.objects.find((element) => element.key === this.props.data[this.props.id]).value}</div>}
            {/*{this.props.objects && <div>{this.props.objects[0].value}</div>}*/}
            <div><i className="material-icons">keyboard_arrow_down</i></div>
          </div>
          <div className={this.state.show ? "dropdown show" : "dropdown hide"}>
            <div className="dropdown-content">
              {this.props.first && <div className="option" onClick={e => this.changeSelection(e, this.props.first)}>{this.props.first}</div>}
              {this.props.firstAction && <div className="option" onClick={e => this.changeSelection(e, this.props.firstAction)}>{this.props.firstAction}</div>}
              {dropdownList}
            </div>
          </div>
        </div>
      </>
    )
  }
}
