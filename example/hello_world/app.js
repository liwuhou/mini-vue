import { h } from '../../lib/guide-mini-vue-esm.js'
import { Foo } from './Foo.js'

export const App = {
    render() {
        window.a = this
        return h('div', {
            id: 'test',
            onClick: () => console.log('click'),
            onMouseDown: () => console.log('down')
        }, [
            h(Foo, { count: 1 })
        ])
    },
    setup() {
        return {
            msg: 'vue3'
        }
    }
}