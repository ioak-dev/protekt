import React, { Component } from 'react';
import './OakPagination.scss';
import OakSelect from './OakSelect';

interface Props {
    onChangePage: any,
    totalRows: number,
    label?: string
}

interface State {
    pageNo: number,
    rowsPerPage: number
}

class OakPagination extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            pageNo: 1,
            rowsPerPage: 6
        }
    }

    previousPage = () => {
        if (this.state.pageNo !== 1) {
            this.setState({
                pageNo: this.state.pageNo - 1
            }, () => this.pageChanged());
        }
    }

    pageChanged = () => {
        this.props.onChangePage(this.state.pageNo, this.state.rowsPerPage);
    }

    nextPage = () => {
        if (Math.ceil(this.props.totalRows / this.state.rowsPerPage) !== this.state.pageNo) {
            this.setState({
                pageNo: this.state.pageNo + 1
            }, () => this.pageChanged());
        }
    }

    handleRowCountChange = (event) => {
        this.setState(
            {
                ...this.state,
                [event.target.name]: event.target.value,
                pageNo: 1
            }
            , () => this.pageChanged()
        );
    }

    render() {
        return (
            <div className="oak-pagination">
                <div className="space-right-3">{this.props.label ? this.props.label : "Rows per page"}</div>
                <div className="space-right-3">
                    <OakSelect data={this.state} id="rowsPerPage" handleChange={e => this.handleRowCountChange(e)} elements={["6","10","20","50"]} />
                </div>
                <div className="page-number space-right-3">
                    <div>{(this.state.pageNo - 1) * this.state.rowsPerPage + 1} 
                            - {(this.state.pageNo * this.state.rowsPerPage < this.props.totalRows) ? this.state.pageNo * this.state.rowsPerPage : this.props.totalRows}
                            &nbsp;of&nbsp; {this.props.totalRows} </div>
                </div>
                <div className="page-nav">
                    <div className="space-right-2"><i className={this.state.pageNo === 1 ? "material-icons disabled" : "material-icons"} onClick={this.previousPage}>keyboard_arrow_left</i></div>
                    <div><i className={Math.ceil(this.props.totalRows / this.state.rowsPerPage) === this.state.pageNo ? "material-icons disabled" : "material-icons"} onClick={this.nextPage}>keyboard_arrow_right</i></div>
                </div>
            </div>
        )
    }
}

export default OakPagination;
