import React, { Component } from 'react';
import './OakTable.scss';
import OakPagination from './OakPagination';

interface Props {
    header: {
        key: string,
        label: string,
        dtype?: string
    }[],
    data: any,
    dense?: boolean,
    onChangePage?: any,
    totalRows?: number,
    material?: boolean
}

interface State {
    data: any,
    headerMap: any,
    pageNo: number,
    rowsPerPage: number,
    sortField: string,
    sortAsc: boolean
}

class OakTable extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        let headerMap = {};
        props.header.forEach(element => {
            headerMap[element.key] = element;
        });
        
        this.state = {
            data: props.data,
            headerMap: headerMap,
            pageNo: 1,
            rowsPerPage: 6,
            sortField: "",
            sortAsc: true
        }
    }

    pageChanged = () => {
        if (this.props.onChangePage) {
            this.props.onChangePage(this.state.pageNo, this.state.rowsPerPage, this.state.sortField, this.state.sortAsc);
        } else if (this.state.sortField) {
            this.setState({
                data: this.state.data.sort((a,b) => this.compare(a, b))
            });
        }
    }

    compare = (a, b) => {
        const sortField = this.state.sortField;
        const sortAsc = this.state.sortAsc;
        const headerElement = this.state.headerMap[sortField];
        if (!headerElement.dtype || headerElement.dtype === 'string') {
            if (sortAsc) {
                return a[this.state.sortField] > b[this.state.sortField] ? 1 : (a[this.state.sortField] < b[this.state.sortField] ? -1 : 0);
            } else {
                return a[this.state.sortField] < b[this.state.sortField] ? 1 : (a[this.state.sortField] > b[this.state.sortField] ? -1 : 0);
            }
        } else if (headerElement.dtype === 'number') {
            if (sortAsc) {
                return a[this.state.sortField] - b[this.state.sortField] > 0 ? 1 : (a[this.state.sortField] - b[this.state.sortField] < 0 ? -1 : 0);
            } else {
                return a[this.state.sortField] - b[this.state.sortField] < 0 ? 1 : (a[this.state.sortField] - b[this.state.sortField] > 0 ? -1 : 0);
            }
        }
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data !== this.state.data) {
            this.setState({
                data: nextProps.data
            })
        }
    }

    onChangePage = (pageNo: number, rowsPerPage: number) => {
        this.setState({
            pageNo: pageNo,
            rowsPerPage: rowsPerPage
        }, () => this.pageChanged());
    }

    sort = (fieldName) => {
        this.setState({
            sortField: fieldName,
            sortAsc: this.state.sortField === fieldName ? !this.state.sortAsc : true
        }, () => this.pageChanged());
    }

    formatDate = (dateText) => {
        if (!dateText || /^\s*$/.test(dateText)) {
            return '';
        } else {
            let date = new Date(dateText);
            return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
                + ' ' + date.getHours() + ':' + date.getMinutes();
        }
    }

    render() {
        let view: any[] = [];
        if (this.props.data && this.props.totalRows) {
            view = this.props.data;
        } else if (this.props.data && !this.props.totalRows) {
            view = this.props.data.slice((this.state.pageNo - 1) * this.state.rowsPerPage, this.state.pageNo * this.state.rowsPerPage);
        }
        let key = 0;

        return (
            <div className={this.props.material ? "oak-table material" : "oak-table"}>
                <div className="desktop-view">
                    <div className="table-container">
                        <table className = {this.props.dense ? "dense" : ""}>
                            <thead>
                                <tr>
                                    {this.props.header && this.props.header.map(item =>
                                        <>
                                        
                                        <th key={item.key}>
                                            <div className = "label" onClick={() => this.sort(item.key)}>
                                                {item.label}
                                                {this.state.sortField === item.key && this.state.sortAsc && 
                                                    <i className="material-icons">keyboard_arrow_up</i>}
                                                {this.state.sortField === item.key && !this.state.sortAsc && 
                                                    <i className="material-icons">keyboard_arrow_down</i>}
                                            </div>
                                        </th>
                                        </>
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                            {this.props.data && view.map(row => 
                                <tr key={key=key+1}>
                                    {this.props.header && this.props.header.map(column =>
                                        <>
                                        {(!this.state.headerMap[column.key].dtype || this.state.headerMap[column.key].dtype === 'string') && 
                                            <td key={key=key+1}>{row[column.key]}</td>
                                        }
                                        {this.state.headerMap[column.key].dtype === 'date' && 
                                            <td key={key=key+1} className="date">{this.formatDate(row[column.key])}</td>
                                        }
                                        {this.state.headerMap[column.key].dtype === 'number' && 
                                            <td key={key=key+1} className="number">{row[column.key]}</td>
                                        }
                                        </>)
                                    }
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <OakPagination onChangePage={this.onChangePage} totalRows={this.props.totalRows ? this.props.totalRows : this.props.data.length} />
                </div>

                <div className="mobile-view">
                    <div className="card-container">
                        {this.props.data && view.map(row => 
                            <div className="card" key={key=key+1}>
                                {this.props.header && this.props.header.map(column =>
                                    <div key={key=key+1}>
                                        <b>{column.label}</b>: {row[column.key]}
                                    </div>
                                    )
                                }
                            </div>
                            )}
                    </div>
                    <OakPagination onChangePage={this.onChangePage} totalRows={this.props.totalRows ? this.props.totalRows : this.props.data.length} label="Rows"/>
                </div>
            </div>
        )
    }
}

export default OakTable;
