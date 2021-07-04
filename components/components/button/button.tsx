import classnames from 'classnames';
import React, { FC,  PropsWithChildren } from 'react';
import { StandardProps } from '../types/index';

import "./SaleStageCompoment.less"

export interface XButtonProps extends StandardProps {
}

const prefixCls = 'x-button';
const Button: FC<XButtonProps> = (props: PropsWithChildren<XButtonProps>) => {
    const { className, children, ...otherProps } = props;

    const classNames = classnames(prefixCls, className);

    return (
        <div className={classNames} {...otherProps} >
        </div>
    );
};

export default Button;