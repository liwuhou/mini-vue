// import { ref, effect } from '@vue/reactivity'
import { ref, effect } from './core/index.js'

const a = ref(0)
let b = 0;

effect(() => {
  b = a.value + 10;
  console.log(b)
})

a.value = 20;

