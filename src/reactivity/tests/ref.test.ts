import { ref, effect, reactive, isRef, unRef, proxyRef } from '..'

describe('ref', () => {
    it("happy path", () => {
        const a = ref<number>(1)
        expect(a.value).toBe(1)
    })

    it("should be reactive", () => {
        const a = ref<number>(1)
        let dummy
        let calls = 0

        effect(() => {
            calls++
            dummy = a.value
        })

        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        // same value should not trigger.
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
    })

    it('should make nested properties reactive', () => {
        const a = ref({
            count: 1,
        })
        let dummy

        effect(() => {
            dummy = a.value.count
        })

        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
    })

    it('isRef', () => {
        const a = ref(1)
        const user = reactive({
            age: 1
        })

        expect(isRef(a)).toBeTruthy()
        expect(isRef(1)).toBeFalsy()
        expect(isRef(user)).toBeFalsy()
    })

    it('unRef', () => {
        const a = ref(1)
        const b = 2
        const user = ref({
            age: 1
        })

        expect(unRef(a)).toBe(1)
        expect(unRef(b)).toBe(2)
        expect(unRef(user)).toEqual({ age: 1 })

    })

    it('proxyRefs', () => {
        const user = {
            age: ref<number>(10),
            name: 'william'
        }

        // get
        const proxyUser = proxyRef(user)
        expect(user.age.value).toBe(10)
        expect(proxyUser.age).toBe(10)
        expect(proxyUser.name).toBe('william')

        // set
        // @ts-ignore: FIXME: proxyRef's nested ref type
        proxyUser.age = 20
        expect(proxyUser.age).toBe(20)
        expect(user.age.value).toBe(20)

        proxyUser.age = ref(10)
        expect(proxyUser.age).toBe(10)
        expect(user.age.value).toBe(10)
    })
})