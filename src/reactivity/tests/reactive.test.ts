import { reactive, effect, isReactive } from '..'

describe('reactive', () => {

    it('happy path', () => {
        const original = { foo: 1 }
        const observed = reactive(original)

        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        let nextFoo = 0
        effect(() => {
            nextFoo = observed.foo + 1
        })
        expect(nextFoo).toBe(2)
        observed.foo++
        expect(nextFoo).toBe(3)
    })

    it('is_reactive', () => {
        const original = { foo: 1 }
        const observed = reactive(original)

        expect(isReactive(original)).toBeFalsy()
        expect(isReactive(observed)).toBeTruthy()
    })
})