import { reactive, h } from './core/index.js'

export default {
    // template -> render
    render(context) {
        // ui
        // 优化
        // 跨端
        // return h('div', {class: 'test', id: 'testId'}, [
        //     h('p', {}, 'nihao'),
        //     h('p', {}, String(context.obj.count))
        // ])

        // test
        window.h = h
        return h('div', {}, obj.children)
        // return element
    },
    setup() {
        const obj = reactive({
            count: 1,
            children: [h('p', {}, '1'), h('p', {}, '2')]
        })
        window.obj = obj

        return {
            obj
        }
    }
}