require('../fn/curvy.js')

describe('define and usage', function () {
    var sql = {
        columnsToSelect: [],
        table: [],
        joins: [],
        whereConditions: [],

        entry: function (select, from) {
            console.log('select is ' + select)
            this.columnsToSelect = select;
            this.from = from;
            return Object.merge(
                this.joinPart.curvyOrdered(this),
                this.wherePart.curvyOrdered(this)
            );
        },

        joinPart: function (join, table, on) {
            this.joins.push(arguments.pack())
            return Object.merge(
                this.joinPart.curvyOrdered(this),
                this.wherePart.curvyOrdered(this)
            )
        },

        wherePart: function (where, operator, val) {
            this.whereConditions.push(arguments.pack())
        },

        printSql: function () {
            var s = 'select '
            s += this.columnsToSelect.join() + ' '
            s += 'from ' + this.from + ' ';
            s += 'where '
            s += this.whereConditions.reduce(function (previous, val) {
                return val.where + val.operator + val.val + ' '
            }, '')
            return s;
        }

    }

    it('should return joinPart and where part', function () {
        var s = sql.entry.curvyOrdered(sql);
        expect(s.select().from().join).toBeDefined();
        expect(s.select().from().join().table).toBeDefined();
        expect(s.select().from().join().table().on).toBeDefined();
        expect(s.select().from().where).toBeDefined();
    })

    it('should return where part', function () {
        var s = sql.entry.curvyOrdered(sql);
        expect(s.select().from().where).toBeDefined();
    })

    it('should return join and where when joined', function () {
        var s = sql.entry.curvyOrdered(sql);
        expect(s.select().from().join().table().on().join).toBeDefined();
        expect(s.select().from().join().table().on().where).toBeDefined();
    })

    it('should return simple select', function () {
        var s = sql.entry.curvyOrdered(sql);
        s.select('a', 'b', 'c').from('myTable').where('a').operator('=').val('asdf')
        expect(sql.printSql())
            .toBe('select a,b,c from myTable where a=asdf ');
    })
})
