var firebase = null;

var React = require("react");

var Shared = React.createClass({
  getInitialState() {
    firebase = new Firebase("https://<yourfirebase>.firebaseio.com/syncstate/" + this.props.syncId || "default");
    return {
      past: []
    };
  },

  componentDidMount() {
    firebase.on('value', function(snapshot) {
      var v = snapshot.val();
      if(!contains(this.state.past, partial(equals, v))) {
        this.state.past.push(v);
        this.props.updateState(v);
      }
    }.bind(this));
  },

  componentDidUpdate(prevProps, prevState) {
    var s = this.props.children[0]._owner.state;
    if(!contains(this.state.past, partial(equals, s))) {
      this.state.past.push(s);
      firebase.transaction(function(currentSnapshot) {
        return s;
      });
    }
  },

  render() {
    return <div id="shared">{this.props.children}</div>;
  }
});

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
  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
  if ( x.constructor !== y.constructor ) return false;
  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
    if ( ! y.hasOwnProperty( p ) ) return false;
    if ( x[ p ] === y[ p ] ) continue;
    if ( typeof( x[ p ] ) !== "object" ) return false;
    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
  }
  return true;
}



module.exports = Shared;