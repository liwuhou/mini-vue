
export type CreateElement = (type: string) => Element
export const createElement: CreateElement = (type) => {
    return document.createElement(type)
}