// 评论组件外层的comments是智能组件，可以获取数据传给子组件
// 一条条的评论是木偶组件，自负责展示




import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import axios from 'axios'
class Comments extends Component {
    constructor() {
        super()
    }
    componentWillMount() { }    // WillMount组件将要挂载完 (16.3已经移除)没什么用
    componentDidMount() {       // DidMount组件已经挂载完
        // 在react中发送ajax请求 fetch比较底层，不推荐
        // axios 封装了RESTFul风格，基于promise,不支持jsonp,可以用在客户端
    }
    render() {
        return (
            <React.Fragment>
                
            </React.Fragment>
        )
    }
}
render(<Comments></Comments>, window.root)
