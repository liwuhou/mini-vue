import { readonly } from '..'

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
    })

    it('readonly can\'t set any key', () => {
        console.error = jest.fn()

        const user = readonly({
            name: 'william'
        })

        user.name = 'jiehua'

        expect(console.error).toBeCalled()
    })
})