import { reactive, h } from './core/index.js'

export default {
    // template -> render
    render(context) {
        // ui
        // 优化
        // 跨端
        return h('div', {class: 'test', id: 'testId'}, [
            h('p', {}, 'nihao'),
            h('p', {}, String(context.obj.count))
        ])

        // return element
    },
    setup() {
        const obj = reactive({
            count: 1
        })
        window.obj = obj

        return {
            obj
        }
    }
}