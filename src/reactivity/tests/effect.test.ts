import { reactive, effect, stop } from '..'

describe('effect', () => {

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

    it('stop', () => {
        let dummy
        const obj = reactive({ prop: 1 })
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop = 3
        obj.prop++
        expect(dummy).toBe(2)

        // stopped effect should still be manually callable
        runner()
        expect(dummy).toBe(3)
    })

    it('onStop', () => {
        const onStop = jest.fn()
        const runner = effect(() => { }, {
            onStop
        })

        stop(runner)
        expect(onStop).toHaveBeenCalled()
    })
})