// 受控组件 非受控组件 针对的是状态（state）
// 指的都是表单元素
// form可以校验表单
// 不让表单刷新可以将onSubmit preventDefault()掉 react包装好的
import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

class App extends Component {
    constructor() {
        super();
        this.state = { content: 'hello' }
    }
    handleSubmit = (e) => {
        e.preventDefault(); // 指的就是提交表单事件
    }
    render() {
        return (<form onSubmit={this.handleSubmit}>
            <input type="text" required={true} />
            <input type="submit" />
        </form>)
    }
}




render(<App></App>, window.root)