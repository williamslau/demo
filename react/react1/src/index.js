
class Element {
    constructor(type, props) {
        this.type = type;
        this.props = props;

    }
}


let React = {
    createElement(type, props, ...children) {
        if (children.length === 1) children = children[0];
        return new Element(type, { ...props, children });
    }
}
let ele = React.createElement(
    "h1",
    { className: "red" },
    React.createElement(
        "h1",
        { className: "red" },
        "hello,world"
    ),
    "hello,world"
);