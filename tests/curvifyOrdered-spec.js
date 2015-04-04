require('../fn/curvy.js')
describe('curvifyOrdered', function() {
    var anyFn = jasmine.any(Function)
    it('should extend object prototype', function() {
        expect({}.curvifyOrdered).toEqual(anyFn)
    })

    describe('behaviour', function() {
        var methodTest = {
            aaa: function (a1, a2) {
                this.aaaCalled = true;
            },
            bbb: function (b1, b2) {
                this.bbbCalled = true;
            }
        };
        var newObject = methodTest.curvifyOrdered()
        beforeEach(function () {
            methodTest.aaaCalled = false
            methodTest.bbbCalled = false
            newObject = methodTest.curvifyOrdered();
        })

        it('should expose only first parameter', function() {
            expect(newObject.a1).toEqual(anyFn)
            expect(newObject.b1).toEqual(anyFn)

            expect(newObject.a2).not.toEqual(anyFn)
            expect(newObject.b2).not.toEqual(anyFn)
        })

        it('should expose second parameter when first is called', function() {
            expect(newObject.a1().a2).toEqual(anyFn)
            expect(newObject.b1().b2).toEqual(anyFn)
        })

        it('should call function when both are filled', function() {
            newObject.a1().a2()
            expect(methodTest.aaaCalled).toBeTruthy()
            expect(methodTest.bbbCalled).toBeFalsy()
            newObject.b1().b2()
            expect(methodTest.aaaCalled).toBeTruthy()
            expect(methodTest.bbbCalled).toBeTruthy()
        })
    });
})