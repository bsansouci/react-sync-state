"use strict";

var React = require("react");
var Shared = require("../shared-component");

var boxStyle = {
  backgroundColor: 'red',
  position: 'absolute',
  top: 0,
  left: 0,
  width: 30,
  height: 30
};

var Main = React.createClass({
  getInitialState() {
    return {
      text: "",
      top: 0,
      left: 0
    };
  },
  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);
  },
  onChange(e) {
    this.setState({
      text: e.target.value,
      top: this.state.top,
      left: this.state.left
    });
  },
  onMouseMove(e) {
    if(!this.state.mouseIsDown) return;

    this.setState({
      text: this.state.text,
      top: e.clientY,
      left: e.clientX
    });
  },
  onMouseDown() {
    this.setState({
      mouseIsDown: true
    });
  },
  onMouseUp() {
    this.setState({
      mouseIsDown: false
    });
  },
  render() {
    boxStyle.top = this.state.top;
    boxStyle.left = this.state.left;
    return (
      <div id="Main" style={{width: 1200, height: 1200}}>
        <Shared updateState={this.setState.bind(this)} syncId="example1">
          <h1>{this.state.text}</h1>
          <input onChange={this.onChange}/>
          {boxStyle.top + " " + boxStyle.left}
          <div style={boxStyle} onMouseDown={this.onMouseDown}/>
        </Shared>
      </div>
    );
  }
});

module.exports = Main;
