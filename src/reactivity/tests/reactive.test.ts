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

    it('should return a runner when call effect', () => {
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

    it('scheduler', () => {
        let dummy
        let run: any
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        // should not run yet
        expect(dummy).toBe(1)
        // manually run
        run()
        // should have run
        expect(dummy).toBe(2)
    })
})