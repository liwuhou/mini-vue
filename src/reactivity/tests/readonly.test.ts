import { readonly, isReadonly, isProxy } from '..'

describe('readonly', () => {
    it('happy path', () => {
        // can't set anything
        const original = {
            foo: 1,
            bar: { baz: 2 }
        }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1)
        expect(isReadonly(wrapped.bar)).toBeTruthy()
    })

    it('readonly can\'t set any key', () => {
        console.error = jest.fn()

        const user = readonly({
            name: 'william'
        })

        // change readonly properties 
        user.name = 'jiehua'

        expect(console.error).toBeCalled()
    })

    it('is_readonly', () => {
        const original = { foo: 1 }
        const readonlyData = readonly(original)

        expect(isReadonly(original)).toBeFalsy()
        expect(isReadonly(readonlyData)).toBeTruthy()
    })

    it('is_proxy', () => {
        const readonlyData = readonly({ foo: 1, bar: { baz: 2 } })

        expect(isProxy(readonlyData)).toBeTruthy()
        expect(isProxy(readonlyData.bar)).toBeTruthy()
    })
})