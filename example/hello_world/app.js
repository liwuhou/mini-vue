import { h } from '../../lib/guide-mini-vue-esm.js'

export const App = {
    render() {
        window.a = this
        return h('div', {
            id: 'test',
            onClick: () => console.log('click'),
            onMouseDown: () => console.log('down')
        }, [
            h('span', {}, 'hi, '),
            h('b', { class: 'test1' }, this.msg)
        ])
    },
    setup() {
        return {
            msg: 'vue3'
        }
    }
}