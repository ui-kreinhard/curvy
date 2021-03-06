require('../fn/curvy.js')
describe('curvy', function() {
    var anyFn = jasmine.any(Function)
    it('should extend the prototype of function', function() {
        expect(function() {}.curvy).toBeDefined();
    })
    describe('behaviour', function() {
        var testFun = function(a,b,c,d) {
            return true;
        }
        var obj = testFun.curvy();

        it('should expose parameters as function ', function() {
            expect(obj.a).toEqual(anyFn)
            expect(obj.b).toEqual(anyFn)
            expect(obj.c).toEqual(anyFn)
            expect(obj.d).toEqual(anyFn)

        })

        it('should call curvied function when all called', function() {
            expect(obj.a().b().c().d()).toBe(true)
        })

        it('should not set var twice', function() {
            expect(obj.a().a).toThrow(new Error('a already set'))
        })

        it('should be reentrance safe when correct', function() {
            function t(a,b) {
                return a && b;
            }
            var t1 = t.curvy()
            expect(t1.a(false).b(false)).toBe(false)
            expect(t1.a(true).b(false)).toBe(false)
            expect(t1.a(false).b(true)).toBe(false)
            expect(t1.a(true).b(true)).toBe(true)
        })
        it('should be reentrance safe when called wrong', function() {
            function t(a,b) {
                return a && b;
            }
            var t1 = t.curvy()
            expect(t1.a(false).a.fill(false)).toThrow()
            expect(t1.a(true).b(false)).toBe(false)
            expect(t1.a(false).b(true)).toBe(false)
            expect(t1.a(true).b(true)).toBe(true)
        })

        describe('order test', function() {
            var obj = testFun.curvy();

            it('bcda', function() {
                expect(obj.b().c().d().a()).toBe(true);
            })

            it('cdab', function() {
                expect(obj.c().d().a().b()).toBe(true);
            })
            it('dabc', function() {
                expect(obj.d().a().c().b()).toBe(true);
            })
        })

        it('should also work on objects', function() {
            var obj = {
                a: function(a1, a2) {
                },
                b: function(b1, b2) {

                }
            }
            expect(obj.a.curvy).toBeDefined();

            var curvy = obj.a.curvy();
            expect(curvy.a1).toEqual(anyFn)
            expect(curvy.a2).toEqual(anyFn)

            var bCurvy = obj.b.curvy();
            expect(bCurvy.b1).toEqual(anyFn)
            expect(bCurvy.b2).toEqual(anyFn)
        })

        describe('behaviour', function() {
            function t(a,b) {
                return a && b;
            }
            it('should pass the vars in order', function() {
                expect(t.curvy().a(true).b(true)).toBe(true)
            })
            it('should pass the vars not in order', function() {
                expect(t.curvy().b(true).a(true)).toBe(true)
            })
            it('should pass more tan one arguments as array', function() {
              function t2(a,b) {
                  return a.concat(b);
              }
              expect(t2.curvy().a(1,2,3).b(4)).toEqual([1,2,3,4])
            })
        });
    })

})

