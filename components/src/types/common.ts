import { CSSProperties, LegacyRef } from 'react';

export interface StandardProps<T = any> {
    /** 组件类名 */
    className?: string
    /** 组件样式 */
    style?: CSSProperties
    /** 引用 */
    ref?: LegacyRef<T>
}
