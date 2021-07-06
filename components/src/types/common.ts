import { CSSProperties, LegacyRef } from 'react';

export interface StandardProps<T = any> {
    /** 组件的唯一标示, 保持整个页面唯一 */
    id?: string
    className?: string
    style?: CSSProperties
    key?: string | number
    /** 组件是否显示, 所有组件默认显示 */
    hidden?: boolean
    /** 动画属性 */
    animation?: { actions: object[] }
    /** 引用 */
    ref?: LegacyRef<T>
}