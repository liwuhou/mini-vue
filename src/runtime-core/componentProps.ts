import { ComponentInstance } from "./component";
import { Props } from "./vnode";

export type InitProps = (instance: ComponentInstance, rawProps?: Props) => void
export const initProps: InitProps = (instance, rawProps = {}) => {
    instance.props = rawProps
}
