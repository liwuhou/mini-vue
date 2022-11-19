import { reactive, effect } from '..'

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

    it('runner', () => {
        let bar = 0
        const runner = effect(() => {
            bar++
            return 'bar'
        })

        expect(bar).toBe(1)
        const res = runner()
        expect(bar).toBe(2)
        expect(res).toBe('bar')
    })
})