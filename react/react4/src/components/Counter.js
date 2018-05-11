import React, { Component } from 'react';
import actions from '../store/actions/counter';
import { connect } from 'react-redux';
class Counter extends Component {
    constructor() {
        super();
    }
    // componentDidMount() {
    //     // 组件挂载完成后需要订阅一个更新状态的方法
    //     this.unsub = store.subscribe(() => {
    //         this.setState({ number: store.getState().counter.number });
    //     });
    // }
    // componentWillUnmount() {
    //     this.unsub();
    // }
    handleIncrement = () => {
        this.props.add(2);
    }
    handleDecrement = () => {
        this.props.minus(1);
    }
    render() {
        return (<div>
            计数器{this.props.n}
            <button onClick={this.handleIncrement}>+</button>
            <button onClick={this.handleDecrement}>-</button>
        </div>)
    }
}
export default connect(
    state => ({ n: state.getIn(['counter', 'number']) }),
    actions
)(Counter);