import { h } from '../../lib/guide-mini-vue-esm.js'
import { Foo } from './Foo.js'

export const App = {
    render() {
        return h('div', {
            id: 'test',
        }, [
            h(Foo, {
                count: 1,
                onAdd: (a, b) => {
                    console.log('onAdd', a, b)
                },
                onAddFoo: () => {
                    console.log('ln:15 | MARK: addFoo')
                }
            })
        ])
    },
    setup() {
        return {
            msg: 'vue3'
        }
    }
}