var firebase = new Firebase("https://timelinegame.firebaseio.com/syncstate");

var boxStyle = {
  backgroundColor: 'red',
  postion: 'absolute',
  top: 0,
  left: 0,
  width: 30,
  height: 30
};

var Main = React.createClass({
  getInitialState: function() {
    return {
      shared: {
        text: "",
        top: 0,
        left: 0
      }
    };
  },
  componentDidMount: function () {
    firebase.on('value', function(snapshot) {
      var v = snapshot.val();
      if(JSON.stringify(v) !== JSON.stringify(this.state)) {
        this.setState({
          shared: v
        });
      }
    }.bind(this));

    document.body.addEventListener('mousemove', this.onMouseMove);
    document.body.addEventListener('mouseup', this.onMouseUp);
  },
  componentDidUpdate: function() {
    var s = this.state.shared;
    firebase.transaction(function(currentSnapshot) {
      return s;
    }, function() {
    });
  },
  onChange: function(e) {
    this.setState({
      shared: {
        text: e.target.value,
        top: this.state.shared.top,
        left: this.state.shared.left
      }
    });
  },
  onMouseMove: function(e) {
    if(!this.state.mouseIsDown) return;

    this.setState({
      shared: {
        text: this.state.shared.text,
        top: e.clientY,
        left: e.clientX
      }
    });
  },
  onMouseDown: function() {
    this.setState({
      mouseIsDown: true
    });
  },
  onMouseUp: function() {
    this.setState({
      mouseIsDown: false
    });
  },
  render: function() {
    return (
      <div id="Main" style={{width: 1200, height: 1200, postion: 'relative'}}>
        <h1>{this.state.shared.text}</h1>
        <input onChange={this.onChange}/>
        {boxStyle.top + " " + boxStyle.left}
        <div style={{backgroundColor: 'red',
                    position: 'absolute',
                    top: this.state.shared.top,
                    left: this.state.shared.left,
                    width: 30,
                    height: 30}} onMouseDown={this.onMouseDown}/>
      </div>
    );
  }
});

React.render(<Main />, document.getElementById("react"));
