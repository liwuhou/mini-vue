// import { reactive, effect } from './node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'
import { reactive, effect } from './core/index.js'

const user = reactive({
    name: 'William',
    age: 18
})

let age = 0;

effect(() => {
    age = user.age + 1
    console.log(`I will be ${age} years old`)
})
effect(() => {
    console.log(`I'm ${user.name}`)
})

user.age++
user.name = 'jiehua'