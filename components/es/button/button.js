var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import classnames from 'classnames';
import React from 'react';
import "./SaleStageCompoment.less";
const prefixCls = 'x-button';
const Button = (props) => {
    const { className, children } = props, restProps = __rest(props, ["className", "children"]);
    const classNames = classnames(prefixCls, className);
    return (React.createElement("div", Object.assign({ className: classNames }, restProps)));
};
export default Button;
