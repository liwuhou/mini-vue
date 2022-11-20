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

    it('nested reactive', () => {
        const original = {
            nested: {
                foo: 1,
            },
            array: [{ bar: 2 }]
        }

        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBeTruthy()
        expect(isReactive(observed.array)).toBeTruthy()
        expect(isReactive(observed.array[0])).toBeTruthy()
    })
})