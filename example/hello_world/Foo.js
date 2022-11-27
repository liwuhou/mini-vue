import { h } from "../../lib/guide-mini-vue-esm.js"

export const Foo = {
    setup(props) {
        console.log('🤔 ~ file: foo.js ~ line 3 ~ setup ~ props', props)
        props.count++
        console.log('🤔 ~ file: foo.js ~ line 3 ~ setup ~ props', props)

    },
    render() {
        return h('div', {}, 'foo' + this.count)
    }
}