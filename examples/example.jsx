var firebase = new Firebase("https://timelinegame.firebaseio.com/syncstate");

var boxStyle = {
  backgroundColor: 'red',
  position: 'absolute',
  top: 0,
  left: 0,
  width: 30,
  height: 30
};
function partial(fn) {
  var slice = Array.prototype.slice;
  var stored_args = slice.call(arguments, 1);
  return function () {
    var new_args = slice.call(arguments);
    var args = stored_args.concat(new_args);
    return fn.apply(null, args);
  };
}
function contains(coll, f) {
  for (var i = coll.length - 1; i >= 0; i--) {
    if(f(coll[i])) return true;
  }
  return false;
}

function equals(x, y) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}

var Main = React.createClass({
  getInitialState: function() {
    return {
      shared: {
        text: "",
        top: 0,
        left: 0
      },
      past: []
    };
  },
  componentDidMount: function () {
    firebase.on('value', function(snapshot) {
      var v = snapshot.val();
      if(!contains(this.state.past, partial(equals, v))) {
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
    });
  },
  onChange: function(e) {
    var newShared = {
      text: e.target.value,
      top: this.state.shared.top,
      left: this.state.shared.left
    };
    this.state.past.push(newShared);
    this.setState({
      shared: newShared,
      past: this.state.past
    });
  },
  onMouseMove: function(e) {
    if(!this.state.mouseIsDown) return;

    var newShared = {
      text: this.state.shared.text,
      top: e.clientY,
      left: e.clientX
    };
    this.state.past.push(newShared);
    this.setState({
      shared: newShared,
      past: this.state.past
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
    boxStyle.top = this.state.shared.top;
    boxStyle.left = this.state.shared.left;
    return (
      <div id="Main" style={{width: 1200, height: 1200}}>
        <h1>{this.state.shared.text}</h1>
        <input onChange={this.onChange}/>
        {boxStyle.top + " " + boxStyle.left}
        <div style={boxStyle} onMouseDown={this.onMouseDown}/>
      </div>
    );
  }
});

React.render(<Main />, document.getElementById("react"));
