import classnames from 'classnames';
import React, { FC,  PropsWithChildren } from 'react';
import { StandardProps } from '../../types/common';

export interface XButtonProps extends StandardProps {
}

const prefixCls = 'x-button';
const XButton: FC<XButtonProps> = (props: PropsWithChildren<XButtonProps>) => {
    const { className, children, ...restProps } = props;

    const classNames = classnames(prefixCls, className);

    return (
        <div className={classNames} {...restProps} >
            我是一个demo按钮
        </div>
    );
};

export default XButton;
