require('../fn/curvy.js')
describe('curvify object', function () {
    var anyFn = jasmine.any(Function);
    it('should extend object prototype', function () {
        expect({}.curvify).toBeDefined();
    })

    describe('behaviour', function () {
        var methodTest = {
            aaa: function (a1, a2) {
                this.aaaCalled = true;
            },
            bbb: function (b1, b2) {
                this.bbbCalled = true;
            }
        };
        var newObject = methodTest.curvify();
        beforeEach(function () {
            methodTest.aaaCalled = false
            methodTest.bbbCalled = false
        })

        it('should return an object with functions to the keys', function () {
            expect(newObject.a1).toEqual(anyFn)
            expect(newObject.a2).toEqual(anyFn)
            expect(newObject.b1).toEqual(anyFn)
            expect(newObject.b2).toEqual(anyFn)
        })

        it('should call aaa and bbb', function () {
            newObject.a1().a2()
            newObject.b1().b2()
            expect(methodTest.aaaCalled).toBe(true)
            expect(methodTest.bbbCalled).toBe(true)
        })
    });
});
