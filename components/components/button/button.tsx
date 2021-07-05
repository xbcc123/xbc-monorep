import classnames from 'classnames';
import React, { FC,  PropsWithChildren } from 'react';
import { StandardProps } from '../types/common';

import "./SaleStageCompoment.less"

export interface XButtonProps extends StandardProps {
}

const prefixCls = 'x-button';
const Button: FC<XButtonProps> = (props: PropsWithChildren<XButtonProps>) => {
    const { className, children, ...restProps } = props;

    const classNames = classnames(prefixCls, className);

    return (
        <div className={classNames} {...restProps} >
        </div>
    );
};

export default Button;