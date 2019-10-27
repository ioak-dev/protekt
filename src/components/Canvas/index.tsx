import React, { Component } from 'react';
import './style.scss';
import { fabric } from 'fabric';

let isDown, origX, origY, stroke;

interface Props {
    attributes: any,
    data: any,
    edit?: boolean,
    handleChange: Function
}

interface State {
    backgroundColor: string,
    data: any,
    width: number,
    height: number
}

export default class Canvas extends Component<Props, State> {
    
    viewPort = window.matchMedia("(max-width: 767px)");

    viewPortChange = (port) => {
        this.setState({
            width: port.matches ? window.innerWidth - 100 : window.innerWidth - 1000,
            height: port.matches ? window.innerHeight - 100 : window.innerHeight
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: this.props.attributes && this.props.attributes.backgroundColor ? this.props.attributes.backgroundColor : 'red',
            data: this.props.data ? this.props.data : null
        }
        this.refreshCanvas();
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            backgroundColor: nextProps.attributes && nextProps.attributes.backgroundColor ? nextProps.attributes.backgroundColor : 'red',
            data: nextProps.data ? nextProps.data : null
        }, () => this.refreshCanvas());
    }

    componentDidMount() {
        let canvas = this.refreshCanvas();
        this.mouseDown(canvas);
        this.mouseMove(canvas);
        this.mouseUp(canvas);

        this.refreshCanvas();
        this.viewPort.addListener(this.viewPortChange);
    }

    refreshCanvas() {
        // this.viewPortChange(this.viewPort);
        
        let width = this.viewPort.matches ? window.innerWidth - 35 : window.innerWidth - 700;
        let height = this.viewPort.matches ? window.innerHeight - 200 : window.innerHeight;

        let canvas = new fabric.Canvas('c', {
            backgroundColor: this.state.backgroundColor,
            width: width,
            height: height
        });
        canvas.isDrawingMode = this.props.edit;
        if (this.state.data) {
            canvas.loadFromDatalessJSON(this.state.data);
            canvas.backgroundColor = this.state.backgroundColor;
        }

        canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
        canvas.freeDrawingBrush.width=10;
        canvas.freeDrawingBrush.color='#D2E4C4';
        canvas.renderAll();

        return canvas;
    }

    mouseDown(canvas) {
        let that = this;
        canvas.on('mouse:down', function(o) {
            canvas.backgroundColor = that.state.backgroundColor;
            isDown = true;
		    let pointer = canvas.getPointer(o.e);
		    origX = pointer.x;
		    origY = pointer.y;
            stroke = new fabric.Line({
                strokeWidth:5,
            });
            canvas.add(stroke);
        });
    }

    mouseMove(canvas) {
        canvas.on('mouse:move', function(o) {
            if (isDown) {
                var pointer = canvas.getPointer(o.e);
        
                    if(origX>pointer.x){
                        stroke.set({ left: Math.abs(pointer.x) });
                    }
                    if(origY>pointer.y){
                        stroke.set({ top: Math.abs(pointer.y) });
                    }
                    
                    stroke.set({ width: Math.abs(origX - pointer.x) });
                    stroke.set({ height: Math.abs(origY - pointer.y) });
            }
        });
    }

    mouseUp(canvas) {
        let that = this;
        canvas.on('mouse:up', function(o) {
                isDown = false;
                // sessionStorage.setItem('canvas', JSON.stringify(canvas));
                that.props.handleChange({
                    height: that.state.height,
                    width: that.state.width,
                    backgroundColor: that.state.backgroundColor,
                }, JSON.stringify(canvas));
        });
    }
    
	// generateUUID() {
	//     var d = new Date().getTime();
	//     if(window.performance && typeof window.performance.now === "function"){
	//         d += performance.now(); //use high-precision timer if available
	//     }
	//     var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	//         var r = (d + Math.random()*16)%16 | 0;
	//         d = Math.floor(d/16);
	//         return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
	//     });
	//     return uuid;
	// }

    render() {
        return (
            <div className="canvas">
                <canvas id="c" />
            </div>
        );
    }
}