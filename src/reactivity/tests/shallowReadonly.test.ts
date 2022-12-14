import { isProxy, isReadonly, shallowReadonly } from '..'

describe('shallowReadonly', () => {
    it('should not maoke non-reacitve properties reactive', () => {
        const props = shallowReadonly({ n: { foo: 1 } })
        expect(isReadonly(props)).toBeTruthy()
        expect(isReadonly(props.n)).toBeFalsy()
    })

    it('shallowReaconly data can\'t change any properites', () => {
        console.error = jest.fn()

        const user = shallowReadonly({
            name: 'william'
        })

        // @ts-ignore: change readonly properties 
        user.name = 'jiehua'

        expect(console.error).toBeCalled()
    })

    it('is_proxy', () => {
        const shallowReadonlyData = shallowReadonly({ foo: 1, bar: { baz: 2 } })

        expect(isProxy(shallowReadonly(shallowReadonlyData))).toBeTruthy()
        expect(isProxy(shallowReadonlyData.bar)).toBeFalsy()
    })
})