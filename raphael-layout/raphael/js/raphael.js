(function (i) {
    var e = "0.4.2", j = "hasOwnProperty", b = /[\.\/]/, a = "*", g = function () {
    }, f = function (m, l) {
        return m - l
    }, d, h, k = {n: {}}, c = function (m, C) {
        m = String(m);
        var v = k, s = h, w = Array.prototype.slice.call(arguments, 2), y = c.listeners(m), x = 0, u = false, p, o = [], t = {}, q = [], n = d, A = [];
        d = m;
        h = 0;
        for (var r = 0, B = y.length; r < B; r++) {
            if ("zIndex" in y[r]) {
                o.push(y[r].zIndex);
                if (y[r].zIndex < 0) {
                    t[y[r].zIndex] = y[r]
                }
            }
        }
        o.sort(f);
        while (o[x] < 0) {
            p = t[o[x++]];
            q.push(p.apply(C, w));
            if (h) {
                h = s;
                return q
            }
        }
        for (r = 0; r < B; r++) {
            p = y[r];
            if ("zIndex" in p) {
                if (p.zIndex == o[x]) {
                    q.push(p.apply(C, w));
                    if (h) {
                        break
                    }
                    do {
                        x++;
                        p = t[o[x]];
                        p && q.push(p.apply(C, w));
                        if (h) {
                            break
                        }
                    } while (p)
                } else {
                    t[p.zIndex] = p
                }
            } else {
                q.push(p.apply(C, w));
                if (h) {
                    break
                }
            }
        }
        h = s;
        d = n;
        return q.length ? q : null
    };
    c._events = k;
    c.listeners = function (l) {
        var t = l.split(b), r = k, x, s, m, p, w, o, q, u, v = [r], n = [];
        for (p = 0, w = t.length; p < w; p++) {
            u = [];
            for (o = 0, q = v.length; o < q; o++) {
                r = v[o].n;
                s = [r[t[p]], r[a]];
                m = 2;
                while (m--) {
                    x = s[m];
                    if (x) {
                        u.push(x);
                        n = n.concat(x.f || [])
                    }
                }
            }
            v = u
        }
        return n
    };
    c.on = function (l, o) {
        l = String(l);
        if (typeof o != "function") {
            return function () {
            }
        }
        var q = l.split(b), p = k;
        for (var m = 0, n = q.length; m < n; m++) {
            p = p.n;
            p = p.hasOwnProperty(q[m]) && p[q[m]] || (p[q[m]] = {n: {}})
        }
        p.f = p.f || [];
        for (m = 0, n = p.f.length; m < n; m++) {
            if (p.f[m] == o) {
                return g
            }
        }
        p.f.push(o);
        return function (r) {
            if (+r == +r) {
                o.zIndex = +r
            }
        }
    };
    c.f = function (m) {
        var l = [].slice.call(arguments, 1);
        return function () {
            c.apply(null, [m, null].concat(l).concat([].slice.call(arguments, 0)))
        }
    };
    c.stop = function () {
        h = 1
    };
    c.nt = function (l) {
        if (l) {
            return new RegExp("(?:\\.|\\/|^)" + l + "(?:\\.|\\/|$)").test(d)
        }
        return d
    };
    c.nts = function () {
        return d.split(b)
    };
    c.off = c.unbind = function (m, r) {
        if (!m) {
            c._events = k = {n: {}};
            return
        }
        var t = m.split(b), s, v, n, p, w, o, q, u = [k];
        for (p = 0, w = t.length; p < w; p++) {
            for (o = 0; o < u.length; o += n.length - 2) {
                n = [o, 1];
                s = u[o].n;
                if (t[p] != a) {
                    if (s[t[p]]) {
                        n.push(s[t[p]])
                    }
                } else {
                    for (v in s) {
                        if (s[j](v)) {
                            n.push(s[v])
                        }
                    }
                }
                u.splice.apply(u, n)
            }
        }
        for (p = 0, w = u.length; p < w; p++) {
            s = u[p];
            while (s.n) {
                if (r) {
                    if (s.f) {
                        for (o = 0, q = s.f.length; o < q; o++) {
                            if (s.f[o] == r) {
                                s.f.splice(o, 1);
                                break
                            }
                        }
                        !s.f.length && delete s.f
                    }
                    for (v in s.n) {
                        if (s.n[j](v) && s.n[v].f) {
                            var l = s.n[v].f;
                            for (o = 0, q = l.length; o < q; o++) {
                                if (l[o] == r) {
                                    l.splice(o, 1);
                                    break
                                }
                            }
                            !l.length && delete s.n[v].f
                        }
                    }
                } else {
                    delete s.f;
                    for (v in s.n) {
                        if (s.n[j](v) && s.n[v].f) {
                            delete s.n[v].f
                        }
                    }
                }
                s = s.n
            }
        }
    };
    c.once = function (l, m) {
        var n = function () {
            c.unbind(l, n);
            return m.apply(this, arguments)
        };
        return c.on(l, n)
    };
    c.version = e;
    c.toString = function () {
        return "You are running Eve " + e
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = c) : (typeof define != "undefined" ? (define("eve", [], function () {
        return c
    })) : (i.eve = c))
})(this);
(function (b, a) {
    if (typeof define === "function" && define.amd) {
        define(["eve"], function (c) {
            return a(b, c)
        })
    } else {
        a(b, b.eve)
    }
}(this, function (aS, bb) {
    function bh(g) {
        if (bh.is(g, "function")) {
            return K ? g() : bb.on("raphael.DOMload", g)
        } else {
            if (bh.is(g, u)) {
                return bh._engine.create[br](bh, g.splice(0, 3 + bh.is(g[0], bi))).add(g)
            } else {
                var b = Array.prototype.slice.call(arguments, 0);
                if (bh.is(b[b.length - 1], "function")) {
                    var d = b.pop();
                    return K ? d.call(bh._engine.create[br](bh, b)) : bb.on("raphael.DOMload", function () {
                        d.call(bh._engine.create[br](bh, b))
                    })
                } else {
                    return bh._engine.create[br](bh, arguments)
                }
            }
        }
    }

    bh.version = "2.1.0";
    bh.eve = bb;
    var K, bu = /[, ]+/, at = {
        circle: 1,
        rect: 1,
        path: 1,
        ellipse: 1,
        text: 1,
        image: 1
    }, W = /\{(\d+)\}/g, by = "prototype", bv = "hasOwnProperty", a4 = {
        doc: document,
        win: aS
    }, aD = {was: Object.prototype[bv].call(a4.win, "Raphael"), is: a4.win.Raphael}, bI = function () {
        this.ca = this.customAttributes = {}
    }, an, bz = "appendChild", br = "apply", au = "concat", O = ("ontouchstart" in a4.win) || a4.win.DocumentTouch && a4.doc instanceof DocumentTouch, bm = "", bg = " ", k = String, l = "split", bA = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[l](bg), bo = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    }, ai = k.prototype.toLowerCase, aH = Math, bH = aH.max, ah = aH.min, aj = aH.abs, aR = aH.pow, af = aH.PI, bi = "number", a = "string", u = "array", s = "toString", A = "fill", aL = Object.prototype.toString, bB = {}, r = "push", aa = bh._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i, Z = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i, B = {
        "NaN": 1,
        "Infinity": 1,
        "-Infinity": 1
    }, am = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, C = aH.round, P = "setAttribute", bL = parseFloat, bJ = parseInt, aT = k.prototype.toUpperCase, bp = bh._availableAttrs = {
        "arrow-end": "none",
        "arrow-start": "none",
        blur: 0,
        "clip-rect": "0 0 1e9 1e9",
        cursor: "default",
        cx: 0,
        cy: 0,
        fill: "#fff",
        fillfit: "",
        "fill-opacity": 1,
        font: '10px "Arial"',
        "font-family": '"Arial"',
        "font-size": "10",
        "font-style": "normal",
        "font-weight": 400,
        gradient: 0,
        height: 0,
        href: "http://raphaeljs.com/",
        "letter-spacing": 0,
        opacity: 1,
        path: "M0,0",
        r: 0,
        rx: 0,
        ry: 0,
        src: "",
        stroke: "#000",
        "stroke-dasharray": "",
        "stroke-linecap": "butt",
        "stroke-linejoin": "butt",
        "stroke-miterlimit": 0,
        "stroke-opacity": 1,
        "stroke-width": 1,
        target: "_blank",
        "text-anchor": "middle",
        title: "Raphael",
        transform: "",
        width: 0,
        x: 0,
        y: 0
    }, bn = bh._availableAnimAttrs = {
        blur: bi,
        "clip-rect": "csv",
        cx: bi,
        cy: bi,
        fill: "colour",
        "fill-opacity": bi,
        "font-size": bi,
        height: bi,
        opacity: bi,
        path: "path",
        r: bi,
        rx: bi,
        ry: bi,
        stroke: "colour",
        "stroke-opacity": bi,
        "stroke-width": bi,
        transform: "transform",
        width: bi,
        x: bi,
        y: bi
    }, bs = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g, be = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/, aw = {
        hs: 1,
        rg: 1
    }, aM = /,?([achlmqrstvxz]),?/gi, bf = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig, ac = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig, ao = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig, a1 = bh._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, M = {}, x = function (g, d) {
        return g.key - d.key
    }, bt = function (g, d) {
        return bL(g) - bL(d)
    }, ad = function () {
    }, av = function (b) {
        return b
    }, q = bh._rectPath = function (b, E, d, g, i) {
        if (i) {
            return [["M", b + i, E], ["l", d - i * 2, 0], ["a", i, i, 0, 0, 1, i, i], ["l", 0, g - i * 2], ["a", i, i, 0, 0, 1, -i, i], ["l", i * 2 - d, 0], ["a", i, i, 0, 0, 1, -i, -i], ["l", 0, i * 2 - g], ["a", i, i, 0, 0, 1, i, -i], ["z"]]
        }
        return [["M", b, E], ["l", d, 0], ["l", 0, g], ["l", -d, 0], ["z"]]
    }, U = function (b, i, g, d) {
        if (d == null) {
            d = g
        }
        return [["M", b, i], ["m", 0, -d], ["a", g, d, 0, 1, 1, 0, 2 * d], ["a", g, d, 0, 1, 1, 0, -2 * d], ["z"]]
    }, ae = bh._getPath = {
        path: function (b) {
            return b.attr("path")
        }, circle: function (d) {
            var b = d.attrs;
            return U(b.cx, b.cy, b.r)
        }, ellipse: function (d) {
            var b = d.attrs;
            return U(b.cx, b.cy, b.rx, b.ry)
        }, rect: function (d) {
            var b = d.attrs;
            return q(b.x, b.y, b.width, b.height, b.r)
        }, image: function (d) {
            var b = d.attrs;
            return q(b.x, b.y, b.width, b.height)
        }, text: function (b) {
            var d = b._getBBox();
            return q(d.x, d.y, d.width, d.height)
        }, set: function (b) {
            var d = b._getBBox();
            return q(d.x, d.y, d.width, d.height)
        }
    }, Q = bh.mapPath = function (bP, S) {
        if (!S) {
            return bP
        }
        var bN, R, g, b, bO, E, d;
        bP = bj(bP);
        for (g = 0, bO = bP.length; g < bO; g++) {
            d = bP[g];
            for (b = 1, E = d.length; b < E; b += 2) {
                bN = S.x(d[b], d[b + 1]);
                R = S.y(d[b], d[b + 1]);
                d[b] = bN;
                d[b + 1] = R
            }
        }
        return bP
    };
    bh._g = a4;
    bh.type = (a4.win.SVGAngle || a4.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
    if (bh.type == "VML") {
        var a6 = a4.doc.createElement("div"), a7;
        a6.innerHTML = '<v:shape adj="1"/>';
        a7 = a6.firstChild;
        a7.style.behavior = "url(#default#VML)";
        if (!(a7 && typeof a7.adj == "object")) {
            return (bh.type = bm)
        }
        a6 = null
    }
    bh.svg = !(bh.vml = bh.type == "VML");
    bh._Paper = bI;
    bh.fn = an = bI.prototype = bh.prototype;
    bh._id = 0;
    bh._oid = 0;
    bh.is = function (d, b) {
        b = ai.call(b);
        if (b == "finite") {
            return !B[bv](+d)
        }
        if (b == "array") {
            return d instanceof Array
        }
        return (b == "null" && d === null) || (b == typeof d && d !== null) || (b == "object" && d === Object(d)) || (b == "array" && Array.isArray && Array.isArray(d)) || aL.call(d).slice(8, -1).toLowerCase() == b
    };
    function bk(g) {
        if (Object(g) !== g) {
            return g
        }
        var d = new g.constructor;
        for (var b in g) {
            if (g[bv](b)) {
                d[b] = bk(g[b])
            }
        }
        return d
    }

    bh.angle = function (E, S, g, R, d, i) {
        if (d == null) {
            var b = E - g, bN = S - R;
            if (!b && !bN) {
                return 0
            }
            return (180 + aH.atan2(-bN, -b) * 180 / af + 360) % 360
        } else {
            return bh.angle(E, S, d, i) - bh.angle(g, R, d, i)
        }
    };
    bh.rad = function (b) {
        return b % 360 * af / 180
    };
    bh.deg = function (b) {
        return b * 180 / af % 360
    };
    bh.snapTo = function (d, E, b) {
        b = bh.is(b, "finite") ? b : 10;
        if (bh.is(d, u)) {
            var g = d.length;
            while (g--) {
                if (aj(d[g] - E) <= b) {
                    return d[g]
                }
            }
        } else {
            d = +d;
            var R = E % d;
            if (R < b) {
                return E - R
            }
            if (R > d - b) {
                return E - R + d
            }
        }
        return E
    };
    var aP = bh.createUUID = (function (b, d) {
        return function () {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(b, d).toUpperCase()
        }
    })(/[xy]/g, function (g) {
        var d = aH.random() * 16 | 0, b = g == "x" ? d : (d & 3 | 8);
        return b.toString(16)
    });
    bh.setWindow = function (b) {
        bb("raphael.setWindow", bh, a4.win, b);
        a4.win = b;
        a4.doc = a4.win.document;
        if (bh._engine.initWin) {
            bh._engine.initWin(a4.win)
        }
    };
    var J = function (g) {
        if (bh.vml) {
            var b = /^\s+|\s+$/g;
            var R;
            try {
                var S = new ActiveXObject("htmlfile");
                S.write("<body>");
                S.close();
                R = S.body
            } catch (bN) {
                R = createPopup().document.body
            }
            var d = R.createTextRange();
            J = H(function (i) {
                try {
                    R.style.color = k(i).replace(b, bm);
                    var bO = d.queryCommandValue("ForeColor");
                    bO = ((bO & 255) << 16) | (bO & 65280) | ((bO & 16711680) >>> 16);
                    return "#" + ("000000" + bO.toString(16)).slice(-6)
                } catch (bP) {
                    return "none"
                }
            })
        } else {
            var E = a4.doc.createElement("i");
            E.title = "Rapha\xebl Colour Picker";
            E.style.display = "none";
            a4.doc.body.appendChild(E);
            J = H(function (i) {
                E.style.color = i;
                return a4.doc.defaultView.getComputedStyle(E, bm).getPropertyValue("color")
            })
        }
        return J(g)
    }, ay = function () {
        return "hsb(" + [this.h, this.s, this.b] + ")"
    }, bl = function () {
        return "hsl(" + [this.h, this.s, this.l] + ")"
    }, w = function () {
        return this.hex
    }, G = function (R, E, d) {
        if (E == null && bh.is(R, "object") && "r" in R && "g" in R && "b" in R) {
            d = R.b;
            E = R.g;
            R = R.r
        }
        if (E == null && bh.is(R, a)) {
            var i = bh.getRGB(R);
            R = i.r;
            E = i.g;
            d = i.b
        }
        if (R > 1 || E > 1 || d > 1) {
            R /= 255;
            E /= 255;
            d /= 255
        }
        return [R, E, d]
    }, N = function (R, E, d, S) {
        R *= 255;
        E *= 255;
        d *= 255;
        var i = {r: R, g: E, b: d, hex: bh.rgb(R, E, d), toString: w};
        bh.is(S, "finite") && (i.opacity = S);
        return i
    };
    bh.color = function (b) {
        var d;
        if (bh.is(b, "object") && "h" in b && "s" in b && "b" in b) {
            d = bh.hsb2rgb(b);
            b.r = d.r;
            b.g = d.g;
            b.b = d.b;
            b.hex = d.hex
        } else {
            if (bh.is(b, "object") && "h" in b && "s" in b && "l" in b) {
                d = bh.hsl2rgb(b);
                b.r = d.r;
                b.g = d.g;
                b.b = d.b;
                b.hex = d.hex
            } else {
                if (bh.is(b, "string")) {
                    b = bh.getRGB(b)
                }
                if (bh.is(b, "object") && "r" in b && "g" in b && "b" in b) {
                    d = bh.rgb2hsl(b);
                    b.h = d.h;
                    b.s = d.s;
                    b.l = d.l;
                    d = bh.rgb2hsb(b);
                    b.v = d.b
                } else {
                    b = {hex: "none"};
                    b.r = b.g = b.b = b.h = b.s = b.v = b.l = -1
                }
            }
        }
        b.toString = w;
        return b
    };
    bh.hsb2rgb = function (S, bP, bN, i) {
        if (this.is(S, "object") && "h" in S && "s" in S && "b" in S) {
            bN = S.b;
            bP = S.s;
            S = S.h;
            i = S.o
        }
        S *= 360;
        var E, bO, d, g, b;
        S = (S % 360) / 60;
        b = bN * bP;
        g = b * (1 - aj(S % 2 - 1));
        E = bO = d = bN - b;
        S = ~~S;
        E += [b, g, 0, 0, g, b][S];
        bO += [g, b, b, g, 0, 0][S];
        d += [0, 0, g, b, b, g][S];
        return N(E, bO, d, i)
    };
    bh.hsl2rgb = function (bN, bP, E, i) {
        if (this.is(bN, "object") && "h" in bN && "s" in bN && "l" in bN) {
            E = bN.l;
            bP = bN.s;
            bN = bN.h
        }
        if (bN > 1 || bP > 1 || E > 1) {
            bN /= 360;
            bP /= 100;
            E /= 100
        }
        bN *= 360;
        var S, bO, d, g, b;
        bN = (bN % 360) / 60;
        b = 2 * bP * (E < 0.5 ? E : 1 - E);
        g = b * (1 - aj(bN % 2 - 1));
        S = bO = d = E - b / 2;
        bN = ~~bN;
        S += [b, g, 0, 0, g, b][bN];
        bO += [g, b, b, g, 0, 0][bN];
        d += [0, 0, g, b, b, g][bN];
        return N(S, bO, d, i)
    };
    bh.rgb2hsb = function (bO, bN, d) {
        d = G(bO, bN, d);
        bO = d[0];
        bN = d[1];
        d = d[2];
        var R, E, i, bP;
        i = bH(bO, bN, d);
        bP = i - ah(bO, bN, d);
        R = (bP == 0 ? null : i == bO ? (bN - d) / bP : i == bN ? (d - bO) / bP + 2 : (bO - bN) / bP + 4);
        R = ((R + 360) % 6) * 60 / 360;
        E = bP == 0 ? 0 : bP / i;
        return {h: R, s: E, b: i, toString: ay}
    };
    bh.rgb2hsl = function (d, bN, bQ) {
        bQ = G(d, bN, bQ);
        d = bQ[0];
        bN = bQ[1];
        bQ = bQ[2];
        var bR, R, bP, bO, E, i;
        bO = bH(d, bN, bQ);
        E = ah(d, bN, bQ);
        i = bO - E;
        bR = (i == 0 ? null : bO == d ? (bN - bQ) / i : bO == bN ? (bQ - d) / i + 2 : (d - bN) / i + 4);
        bR = ((bR + 360) % 6) * 60 / 360;
        bP = (bO + E) / 2;
        R = (i == 0 ? 0 : bP < 0.5 ? i / (2 * bP) : i / (2 - 2 * bP));
        return {h: bR, s: R, l: bP, toString: bl}
    };
    bh._path2string = function () {
        return this.join(",").replace(aM, "$1")
    };
    function c(E, g) {
        for (var b = 0, d = E.length; b < d; b++) {
            if (E[b] === g) {
                return E.push(E.splice(b, 1)[0])
            }
        }
    }

    function H(i, d, b) {
        function g() {
            var E = Array.prototype.slice.call(arguments, 0), S = E.join("\u2400"), R = g.cache = g.cache || {}, bN = g.count = g.count || [];
            if (R[bv](S)) {
                c(bN, S);
                return b ? b(R[S]) : R[S]
            }
            bN.length >= 1000 && delete R[bN.shift()];
            bN.push(S);
            R[S] = i[br](d, E);
            return b ? b(R[S]) : R[S]
        }

        return g
    }

    var D = bh._preload = function (g, d) {
        var b = a4.doc.createElement("img");
        b.style.cssText = "position:absolute;left:-9999em;top:-9999em";
        b.onload = function () {
            d.call(this);
            this.onload = null;
            a4.doc.body.removeChild(this)
        };
        b.onerror = function () {
            a4.doc.body.removeChild(this)
        };
        a4.doc.body.appendChild(b);
        b.src = g
    };

    function h() {
        return this.hex
    }

    bh.getRGB = H(function (b) {
        if (!b || !!((b = k(b)).indexOf("-") + 1)) {
            return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: h}
        }
        if (b == "none") {
            return {r: -1, g: -1, b: -1, hex: "none", toString: h}
        }
        !(aw[bv](b.toLowerCase().substring(0, 2)) || b.charAt() == "#") && (b = J(b));
        var E, d, g, S, i, bO, bN, R = b.match(Z);
        if (R) {
            if (R[2]) {
                S = bJ(R[2].substring(5), 16);
                g = bJ(R[2].substring(3, 5), 16);
                d = bJ(R[2].substring(1, 3), 16)
            }
            if (R[3]) {
                S = bJ((bO = R[3].charAt(3)) + bO, 16);
                g = bJ((bO = R[3].charAt(2)) + bO, 16);
                d = bJ((bO = R[3].charAt(1)) + bO, 16)
            }
            if (R[4]) {
                bN = R[4][l](be);
                d = bL(bN[0]);
                bN[0].slice(-1) == "%" && (d *= 2.55);
                g = bL(bN[1]);
                bN[1].slice(-1) == "%" && (g *= 2.55);
                S = bL(bN[2]);
                bN[2].slice(-1) == "%" && (S *= 2.55);
                R[1].toLowerCase().slice(0, 4) == "rgba" && (i = bL(bN[3]));
                bN[3] && bN[3].slice(-1) == "%" && (i /= 100)
            }
            if (R[5]) {
                bN = R[5][l](be);
                d = bL(bN[0]);
                bN[0].slice(-1) == "%" && (d *= 2.55);
                g = bL(bN[1]);
                bN[1].slice(-1) == "%" && (g *= 2.55);
                S = bL(bN[2]);
                bN[2].slice(-1) == "%" && (S *= 2.55);
                (bN[0].slice(-3) == "deg" || bN[0].slice(-1) == "\xb0") && (d /= 360);
                R[1].toLowerCase().slice(0, 4) == "hsba" && (i = bL(bN[3]));
                bN[3] && bN[3].slice(-1) == "%" && (i /= 100);
                return bh.hsb2rgb(d, g, S, i)
            }
            if (R[6]) {
                bN = R[6][l](be);
                d = bL(bN[0]);
                bN[0].slice(-1) == "%" && (d *= 2.55);
                g = bL(bN[1]);
                bN[1].slice(-1) == "%" && (g *= 2.55);
                S = bL(bN[2]);
                bN[2].slice(-1) == "%" && (S *= 2.55);
                (bN[0].slice(-3) == "deg" || bN[0].slice(-1) == "\xb0") && (d /= 360);
                R[1].toLowerCase().slice(0, 4) == "hsla" && (i = bL(bN[3]));
                bN[3] && bN[3].slice(-1) == "%" && (i /= 100);
                return bh.hsl2rgb(d, g, S, i)
            }
            R = {r: d, g: g, b: S, toString: h};
            R.hex = "#" + (16777216 | S | (g << 8) | (d << 16)).toString(16).slice(1);
            bh.is(i, "finite") && (R.opacity = i);
            return R
        }
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: h}
    }, bh);
    bh.hsb = H(function (i, g, d) {
        return bh.hsb2rgb(i, g, d).hex
    });
    bh.hsl = H(function (g, d, b) {
        return bh.hsl2rgb(g, d, b).hex
    });
    bh.rgb = H(function (E, i, d) {
        return "#" + (16777216 | d | (i << 8) | (E << 16)).toString(16).slice(1)
    });
    bh.getColor = function (d) {
        var g = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: d || 0.75
            }, b = this.hsb2rgb(g.h, g.s, g.b);
        g.h += 0.075;
        if (g.h > 1) {
            g.h = 0;
            g.s -= 0.2;
            g.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: g.b})
        }
        return b.hex
    };
    bh.getColor.reset = function () {
        delete this.start
    };
    function al(E, bN) {
        var S = [];
        for (var g = 0, b = E.length; b - 2 * !bN > g; g += 2) {
            var R = [{x: +E[g - 2], y: +E[g - 1]}, {x: +E[g], y: +E[g + 1]}, {
                x: +E[g + 2],
                y: +E[g + 3]
            }, {x: +E[g + 4], y: +E[g + 5]}];
            if (bN) {
                if (!g) {
                    R[0] = {x: +E[b - 2], y: +E[b - 1]}
                } else {
                    if (b - 4 == g) {
                        R[3] = {x: +E[0], y: +E[1]}
                    } else {
                        if (b - 2 == g) {
                            R[2] = {x: +E[0], y: +E[1]};
                            R[3] = {x: +E[2], y: +E[3]}
                        }
                    }
                }
            } else {
                if (b - 4 == g) {
                    R[3] = R[2]
                } else {
                    if (!g) {
                        R[0] = {x: +E[g], y: +E[g + 1]}
                    }
                }
            }
            S.push(["C", (-R[0].x + 6 * R[1].x + R[2].x) / 6, (-R[0].y + 6 * R[1].y + R[2].y) / 6, (R[1].x + 6 * R[2].x - R[3].x) / 6, (R[1].y + 6 * R[2].y - R[3].y) / 6, R[2].x, R[2].y])
        }
        return S
    }

    bh.parsePathString = function (b) {
        if (!b) {
            return null
        }
        var g = aQ(b);
        if (g.arr) {
            return aX(g.arr)
        }
        var i = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0}, d = [];
        if (bh.is(b, u) && bh.is(b[0], u)) {
            d = aX(b)
        }
        if (!d.length) {
            k(b).replace(bf, function (R, E, bO) {
                var bN = [], S = E.toLowerCase();
                bO.replace(ao, function (bQ, bP) {
                    bP && bN.push(+bP)
                });
                if (S == "m" && bN.length > 2) {
                    d.push([E][au](bN.splice(0, 2)));
                    S = "l";
                    E = E == "m" ? "l" : "L"
                }
                if (S == "r") {
                    d.push([E][au](bN))
                } else {
                    while (bN.length >= i[S]) {
                        d.push([E][au](bN.splice(0, i[S])));
                        if (!i[S]) {
                            break
                        }
                    }
                }
            })
        }
        d.toString = bh._path2string;
        g.arr = aX(d);
        return d
    };
    bh.parseTransformString = H(function (d) {
        if (!d) {
            return null
        }
        var g = {r: 3, s: 4, t: 2, m: 6}, b = [];
        if (bh.is(d, u) && bh.is(d[0], u)) {
            b = aX(d)
        }
        if (!b.length) {
            k(d).replace(ac, function (E, i, bN) {
                var S = [], R = ai.call(i);
                bN.replace(ao, function (bP, bO) {
                    bO && S.push(+bO)
                });
                b.push([i][au](S))
            })
        }
        b.toString = bh._path2string;
        return b
    });
    var aQ = function (d) {
        var b = aQ.ps = aQ.ps || {};
        if (b[d]) {
            b[d].sleep = 100
        } else {
            b[d] = {sleep: 100}
        }
        setTimeout(function () {
            for (var g in b) {
                if (b[bv](g) && g != d) {
                    b[g].sleep--;
                    !b[g].sleep && delete b[g]
                }
            }
        });
        return b[d]
    };
    bh.findDotsAtSegment = function (d, b, b4, b2, S, E, bP, bN, bX) {
        var bU = 1 - bX, bZ = aR(bU, 3), b0 = aR(bU, 2), bR = bX * bX, bO = bR * bX, bT = bZ * d + b0 * 3 * bX * b4 + bU * 3 * bX * bX * S + bO * bP, bQ = bZ * b + b0 * 3 * bX * b2 + bU * 3 * bX * bX * E + bO * bN, bY = d + 2 * bX * (b4 - d) + bR * (S - 2 * b4 + d), bW = b + 2 * bX * (b2 - b) + bR * (E - 2 * b2 + b), b3 = b4 + 2 * bX * (S - b4) + bR * (bP - 2 * S + b4), b1 = b2 + 2 * bX * (E - b2) + bR * (bN - 2 * E + b2), bV = bU * d + bX * b4, bS = bU * b + bX * b2, i = bU * S + bX * bP, g = bU * E + bX * bN, R = (90 - aH.atan2(bY - b3, bW - b1) * 180 / af);
        (bY > b3 || bW < b1) && (R += 180);
        return {x: bT, y: bQ, m: {x: bY, y: bW}, n: {x: b3, y: b1}, start: {x: bV, y: bS}, end: {x: i, y: g}, alpha: R}
    };
    bh.bezierBBox = function (d, b, i, g, bO, S, R, E) {
        if (!bh.is(d, "array")) {
            d = [d, b, i, g, bO, S, R, E]
        }
        var bN = aW.apply(null, d);
        return {
            x: bN.min.x,
            y: bN.min.y,
            x2: bN.max.x,
            y2: bN.max.y,
            width: bN.max.x - bN.min.x,
            height: bN.max.y - bN.min.y
        }
    };
    bh.isPointInsideBBox = function (d, b, g) {
        return b >= d.x && b <= d.x2 && g >= d.y && g <= d.y2
    };
    bh.isBBoxIntersect = function (g, d) {
        var b = bh.isPointInsideBBox;
        return b(d, g.x, g.y) || b(d, g.x2, g.y) || b(d, g.x, g.y2) || b(d, g.x2, g.y2) || b(g, d.x, d.y) || b(g, d.x2, d.y) || b(g, d.x, d.y2) || b(g, d.x2, d.y2) || (g.x < d.x2 && g.x > d.x || d.x < g.x2 && d.x > g.x) && (g.y < d.y2 && g.y > d.y || d.y < g.y2 && d.y > g.y)
    };
    function aB(b, S, R, E, i) {
        var g = -3 * S + 9 * R - 9 * E + 3 * i, d = b * g + 6 * S - 12 * R + 6 * E;
        return b * d - 3 * S + 3 * R
    }

    function ba(bY, R, bX, g, bW, d, bT, b, bQ) {
        if (bQ == null) {
            bQ = 1
        }
        bQ = bQ > 1 ? 1 : bQ < 0 ? 0 : bQ;
        var bR = bQ / 2, bS = 12, bN = [-0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699, 0.7699, -0.9041, 0.9041, -0.9816, 0.9816], bV = [0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601, 0.1069, 0.1069, 0.0472, 0.0472], E = 0;
        for (var bU = 0; bU < bS; bU++) {
            var bO = bR * bN[bU] + bR, bP = aB(bO, bY, bX, bW, bT), bZ = aB(bO, R, g, d, b), S = bP * bP + bZ * bZ;
            E += bV[bU] * aH.sqrt(S)
        }
        return bR * E
    }

    function aJ(g, bR, d, bQ, b, bO, bT, bN, bP) {
        if (bP < 0 || ba(g, bR, d, bQ, b, bO, bT, bN) < bP) {
            return
        }
        var bS = 1, i = bS / 2, R = bS - i, E, S = 0.01;
        E = ba(g, bR, d, bQ, b, bO, bT, bN, R);
        while (aj(E - bP) > S) {
            i /= 2;
            R += (E < bP ? 1 : -1) * i;
            E = ba(g, bR, d, bQ, b, bO, bT, bN, R)
        }
        return R
    }

    function a3(i, bS, g, bQ, b, bP, bU, bO) {
        if (bH(i, g) < ah(b, bU) || ah(i, g) > bH(b, bU) || bH(bS, bQ) < ah(bP, bO) || ah(bS, bQ) > bH(bP, bO)) {
            return
        }
        var bN = (i * bQ - bS * g) * (b - bU) - (i - g) * (b * bO - bP * bU), S = (i * bQ - bS * g) * (bP - bO) - (bS - bQ) * (b * bO - bP * bU), E = (i - g) * (bP - bO) - (bS - bQ) * (b - bU);
        if (!E) {
            return
        }
        var bT = bN / E, bR = S / E, R = +bT.toFixed(2), d = +bR.toFixed(2);
        if (R < +ah(i, g).toFixed(2) || R > +bH(i, g).toFixed(2) || R < +ah(b, bU).toFixed(2) || R > +bH(b, bU).toFixed(2) || d < +ah(bS, bQ).toFixed(2) || d > +bH(bS, bQ).toFixed(2) || d < +ah(bP, bO).toFixed(2) || d > +bH(bP, bO).toFixed(2)) {
            return
        }
        return {x: bT, y: bR}
    }

    function aU(d, b) {
        return aO(d, b)
    }

    function aK(d, b) {
        return aO(d, b, 1)
    }

    function aO(b4, b3, b2) {
        var E = bh.bezierBBox(b4), d = bh.bezierBBox(b3);
        if (!bh.isBBoxIntersect(E, d)) {
            return b2 ? 0 : []
        }
        var bX = ba.apply(0, b4), bW = ba.apply(0, b3), bO = ~~(bX / 5), bN = ~~(bW / 5), bU = [], bT = [], g = {}, b5 = b2 ? 0 : [];
        for (var bZ = 0; bZ < bO + 1; bZ++) {
            var bV = bh.findDotsAtSegment.apply(bh, b4.concat(bZ / bO));
            bU.push({x: bV.x, y: bV.y, t: bZ / bO})
        }
        for (bZ = 0; bZ < bN + 1; bZ++) {
            bV = bh.findDotsAtSegment.apply(bh, b3.concat(bZ / bN));
            bT.push({x: bV.x, y: bV.y, t: bZ / bN})
        }
        for (bZ = 0; bZ < bO; bZ++) {
            for (var bY = 0; bY < bN; bY++) {
                var b1 = bU[bZ], b = bU[bZ + 1], b0 = bT[bY], S = bT[bY + 1], bS = aj(b.x - b1.x) < 0.001 ? "y" : "x", bR = aj(S.x - b0.x) < 0.001 ? "y" : "x", R = a3(b1.x, b1.y, b.x, b.y, b0.x, b0.y, S.x, S.y);
                if (R) {
                    if (g[R.x.toFixed(4)] == R.y.toFixed(4)) {
                        continue
                    }
                    g[R.x.toFixed(4)] = R.y.toFixed(4);
                    var bQ = b1.t + aj((R[bS] - b1[bS]) / (b[bS] - b1[bS])) * (b.t - b1.t), bP = b0.t + aj((R[bR] - b0[bR]) / (S[bR] - b0[bR])) * (S.t - b0.t);
                    if (bQ >= 0 && bQ <= 1 && bP >= 0 && bP <= 1) {
                        if (b2) {
                            b5++
                        } else {
                            b5.push({x: R.x, y: R.y, t1: bQ, t2: bP})
                        }
                    }
                }
            }
        }
        return b5
    }

    bh.pathIntersection = function (d, b) {
        return bD(d, b)
    };
    bh.pathIntersectionNumber = function (d, b) {
        return bD(d, b, 1)
    };
    function bD(g, b, bY) {
        g = bh._path2curve(g);
        b = bh._path2curve(b);
        var bW, S, bV, E, bT, bN, d, bQ, b2, b1, b3 = bY ? 0 : [];
        for (var bU = 0, bO = g.length; bU < bO; bU++) {
            var b0 = g[bU];
            if (b0[0] == "M") {
                bW = bT = b0[1];
                S = bN = b0[2]
            } else {
                if (b0[0] == "C") {
                    b2 = [bW, S].concat(b0.slice(1));
                    bW = b2[6];
                    S = b2[7]
                } else {
                    b2 = [bW, S, bW, S, bT, bN, bT, bN];
                    bW = bT;
                    S = bN
                }
                for (var bS = 0, bX = b.length; bS < bX; bS++) {
                    var bZ = b[bS];
                    if (bZ[0] == "M") {
                        bV = d = bZ[1];
                        E = bQ = bZ[2]
                    } else {
                        if (bZ[0] == "C") {
                            b1 = [bV, E].concat(bZ.slice(1));
                            bV = b1[6];
                            E = b1[7]
                        } else {
                            b1 = [bV, E, bV, E, d, bQ, d, bQ];
                            bV = d;
                            E = bQ
                        }
                        var bP = aO(b2, b1, bY);
                        if (bY) {
                            b3 += bP
                        } else {
                            for (var bR = 0, R = bP.length; bR < R; bR++) {
                                bP[bR].segment1 = bU;
                                bP[bR].segment2 = bS;
                                bP[bR].bez1 = b2;
                                bP[bR].bez2 = b1
                            }
                            b3 = b3.concat(bP)
                        }
                    }
                }
            }
        }
        return b3
    }

    bh.isPointInsidePath = function (d, b, i) {
        var g = bh.pathBBox(d);
        return bh.isPointInsideBBox(g, b, i) && bD(d, [["M", b, i], ["H", g.x2 + 10]], 1) % 2 == 1
    };
    bh._removedFactory = function (b) {
        return function () {
            bb("raphael.log", null, "Rapha\xebl: you are calling to method \u201c" + b + "\u201d of removed object", b)
        }
    };
    var I = bh.pathBBox = function (bX) {
        var bQ = aQ(bX);
        if (bQ.bbox) {
            return bk(bQ.bbox)
        }
        if (!bX) {
            return {x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0}
        }
        bX = bj(bX);
        var bT = 0, bS = 0, S = [], g = [], E;
        for (var bO = 0, bW = bX.length; bO < bW; bO++) {
            E = bX[bO];
            if (E[0] == "M") {
                bT = E[1];
                bS = E[2];
                S.push(bT);
                g.push(bS)
            } else {
                var bP = aW(bT, bS, E[1], E[2], E[3], E[4], E[5], E[6]);
                S = S[au](bP.min.x, bP.max.x);
                g = g[au](bP.min.y, bP.max.y);
                bT = E[5];
                bS = E[6]
            }
        }
        var b = ah[br](0, S), bU = ah[br](0, g), bN = bH[br](0, S), R = bH[br](0, g), d = bN - b, bV = R - bU, bR = {
            x: b,
            y: bU,
            x2: bN,
            y2: R,
            width: d,
            height: bV,
            cx: b + d / 2,
            cy: bU + bV / 2
        };
        bQ.bbox = bk(bR);
        return bR
    }, aX = function (d) {
        var b = bk(d);
        b.toString = bh._path2string;
        return b
    }, j = bh._pathToRelative = function (E) {
        var bO = aQ(E);
        if (bO.rel) {
            return aX(bO.rel)
        }
        if (!bh.is(E, u) || !bh.is(E && E[0], u)) {
            E = bh.parsePathString(E)
        }
        var bR = [], bT = 0, bS = 0, bW = 0, bV = 0, g = 0;
        if (E[0][0] == "M") {
            bT = E[0][1];
            bS = E[0][2];
            bW = bT;
            bV = bS;
            g++;
            bR.push(["M", bT, bS])
        }
        for (var bN = g, bX = E.length; bN < bX; bN++) {
            var b = bR[bN] = [], bU = E[bN];
            if (bU[0] != ai.call(bU[0])) {
                b[0] = ai.call(bU[0]);
                switch (b[0]) {
                    case"a":
                        b[1] = bU[1];
                        b[2] = bU[2];
                        b[3] = bU[3];
                        b[4] = bU[4];
                        b[5] = bU[5];
                        b[6] = +(bU[6] - bT).toFixed(3);
                        b[7] = +(bU[7] - bS).toFixed(3);
                        break;
                    case"v":
                        b[1] = +(bU[1] - bS).toFixed(3);
                        break;
                    case"m":
                        bW = bU[1];
                        bV = bU[2];
                    default:
                        for (var S = 1, bP = bU.length; S < bP; S++) {
                            b[S] = +(bU[S] - ((S % 2) ? bT : bS)).toFixed(3)
                        }
                }
            } else {
                b = bR[bN] = [];
                if (bU[0] == "m") {
                    bW = bU[1] + bT;
                    bV = bU[2] + bS
                }
                for (var R = 0, d = bU.length; R < d; R++) {
                    bR[bN][R] = bU[R]
                }
            }
            var bQ = bR[bN].length;
            switch (bR[bN][0]) {
                case"z":
                    bT = bW;
                    bS = bV;
                    break;
                case"h":
                    bT += +bR[bN][bQ - 1];
                    break;
                case"v":
                    bS += +bR[bN][bQ - 1];
                    break;
                default:
                    bT += +bR[bN][bQ - 2];
                    bS += +bR[bN][bQ - 1]
            }
        }
        bR.toString = bh._path2string;
        bO.rel = aX(bR);
        return bR
    }, p = bh._pathToAbsolute = function (bS) {
        var g = aQ(bS);
        if (g.abs) {
            return aX(g.abs)
        }
        if (!bh.is(bS, u) || !bh.is(bS && bS[0], u)) {
            bS = bh.parsePathString(bS)
        }
        if (!bS || !bS.length) {
            return [["M", 0, 0]]
        }
        var bY = [], bN = 0, S = 0, bQ = 0, bP = 0, E = 0;
        if (bS[0][0] == "M") {
            bN = +bS[0][1];
            S = +bS[0][2];
            bQ = bN;
            bP = S;
            E++;
            bY[0] = ["M", bN, S]
        }
        var bX = bS.length == 3 && bS[0][0] == "M" && bS[1][0].toUpperCase() == "R" && bS[2][0].toUpperCase() == "Z";
        for (var bR, b, bV = E, bO = bS.length; bV < bO; bV++) {
            bY.push(bR = []);
            b = bS[bV];
            if (b[0] != aT.call(b[0])) {
                bR[0] = aT.call(b[0]);
                switch (bR[0]) {
                    case"A":
                        bR[1] = b[1];
                        bR[2] = b[2];
                        bR[3] = b[3];
                        bR[4] = b[4];
                        bR[5] = b[5];
                        bR[6] = +(b[6] + bN);
                        bR[7] = +(b[7] + S);
                        break;
                    case"V":
                        bR[1] = +b[1] + S;
                        break;
                    case"H":
                        bR[1] = +b[1] + bN;
                        break;
                    case"R":
                        var R = [bN, S][au](b.slice(1));
                        for (var bU = 2, bW = R.length; bU < bW; bU++) {
                            R[bU] = +R[bU] + bN;
                            R[++bU] = +R[bU] + S
                        }
                        bY.pop();
                        bY = bY[au](al(R, bX));
                        break;
                    case"M":
                        bQ = +b[1] + bN;
                        bP = +b[2] + S;
                    default:
                        for (bU = 1, bW = b.length; bU < bW; bU++) {
                            bR[bU] = +b[bU] + ((bU % 2) ? bN : S)
                        }
                }
            } else {
                if (b[0] == "R") {
                    R = [bN, S][au](b.slice(1));
                    bY.pop();
                    bY = bY[au](al(R, bX));
                    bR = ["R"][au](b.slice(-2))
                } else {
                    for (var bT = 0, d = b.length; bT < d; bT++) {
                        bR[bT] = b[bT]
                    }
                }
            }
            switch (bR[0]) {
                case"Z":
                    bN = bQ;
                    S = bP;
                    break;
                case"H":
                    bN = bR[1];
                    break;
                case"V":
                    S = bR[1];
                    break;
                case"M":
                    bQ = bR[bR.length - 2];
                    bP = bR[bR.length - 1];
                default:
                    bN = bR[bR.length - 2];
                    S = bR[bR.length - 1]
            }
        }
        bY.toString = bh._path2string;
        g.abs = aX(bY);
        return bY
    }, aV = function (d, i, b, g) {
        return [d, i, b, g, b, g]
    }, z = function (d, i, S, E, b, g) {
        var R = 1 / 3, bN = 2 / 3;
        return [R * d + bN * S, R * i + bN * E, R * b + bN * S, R * g + bN * E, b, g]
    }, ab = function (bU, cp, b3, b1, bV, bP, E, bT, co, bW) {
        var b0 = af * 120 / 180, b = af / 180 * (+bV || 0), b7 = [], b4, cl = H(function (cq, ct, i) {
            var cs = cq * aH.cos(i) - ct * aH.sin(i), cr = cq * aH.sin(i) + ct * aH.cos(i);
            return {x: cs, y: cr}
        });
        if (!bW) {
            b4 = cl(bU, cp, -b);
            bU = b4.x;
            cp = b4.y;
            b4 = cl(bT, co, -b);
            bT = b4.x;
            co = b4.y;
            var d = aH.cos(af / 180 * bV), bR = aH.sin(af / 180 * bV), b9 = (bU - bT) / 2, b8 = (cp - co) / 2;
            var cj = (b9 * b9) / (b3 * b3) + (b8 * b8) / (b1 * b1);
            if (cj > 1) {
                cj = aH.sqrt(cj);
                b3 = cj * b3;
                b1 = cj * b1
            }
            var g = b3 * b3, cc = b1 * b1, ce = (bP == E ? -1 : 1) * aH.sqrt(aj((g * cc - g * b8 * b8 - cc * b9 * b9) / (g * b8 * b8 + cc * b9 * b9))), bY = ce * b3 * b8 / b1 + (bU + bT) / 2, bX = ce * -b1 * b9 / b3 + (cp + co) / 2, bO = aH.asin(((cp - bX) / b1).toFixed(9)), bN = aH.asin(((co - bX) / b1).toFixed(9));
            bO = bU < bY ? af - bO : bO;
            bN = bT < bY ? af - bN : bN;
            bO < 0 && (bO = af * 2 + bO);
            bN < 0 && (bN = af * 2 + bN);
            if (E && bO > bN) {
                bO = bO - af * 2
            }
            if (!E && bN > bO) {
                bN = bN - af * 2
            }
        } else {
            bO = bW[0];
            bN = bW[1];
            bY = bW[2];
            bX = bW[3]
        }
        var bS = bN - bO;
        if (aj(bS) > b0) {
            var bZ = bN, b2 = bT, bQ = co;
            bN = bO + b0 * (E && bN > bO ? 1 : -1);
            bT = bY + b3 * aH.cos(bN);
            co = bX + b1 * aH.sin(bN);
            b7 = ab(bT, co, b3, b1, bV, 0, E, b2, bQ, [bN, bZ, bY, bX])
        }
        bS = bN - bO;
        var S = aH.cos(bO), cn = aH.sin(bO), R = aH.cos(bN), cm = aH.sin(bN), ca = aH.tan(bS / 4), cd = 4 / 3 * b3 * ca, cb = 4 / 3 * b1 * ca, ck = [bU, cp], ci = [bU + cd * cn, cp - cb * S], ch = [bT + cd * cm, co - cb * R], cf = [bT, co];
        ci[0] = 2 * ck[0] - ci[0];
        ci[1] = 2 * ck[1] - ci[1];
        if (bW) {
            return [ci, ch, cf][au](b7)
        } else {
            b7 = [ci, ch, cf][au](b7).join()[l](",");
            var b5 = [];
            for (var cg = 0, b6 = b7.length; cg < b6; cg++) {
                b5[cg] = cg % 2 ? cl(b7[cg - 1], b7[cg], b).y : cl(b7[cg], b7[cg + 1], b).x
            }
            return b5
        }
    }, bK = function (d, b, i, g, bO, bN, S, R, bP) {
        var E = 1 - bP;
        return {
            x: aR(E, 3) * d + aR(E, 2) * 3 * bP * i + E * 3 * bP * bP * bO + aR(bP, 3) * S,
            y: aR(E, 3) * b + aR(E, 2) * 3 * bP * g + E * 3 * bP * bP * bN + aR(bP, 3) * R
        }
    }, aW = H(function (i, d, R, E, bW, bV, bS, bP) {
        var bU = (bW - 2 * R + i) - (bS - 2 * bW + R), bR = 2 * (R - i) - 2 * (bW - R), bO = i - R, bN = (-bR + aH.sqrt(bR * bR - 4 * bU * bO)) / 2 / bU, S = (-bR - aH.sqrt(bR * bR - 4 * bU * bO)) / 2 / bU, bQ = [d, bP], bT = [i, bS], g;
        aj(bN) > "1e12" && (bN = 0.5);
        aj(S) > "1e12" && (S = 0.5);
        if (bN > 0 && bN < 1) {
            g = bK(i, d, R, E, bW, bV, bS, bP, bN);
            bT.push(g.x);
            bQ.push(g.y)
        }
        if (S > 0 && S < 1) {
            g = bK(i, d, R, E, bW, bV, bS, bP, S);
            bT.push(g.x);
            bQ.push(g.y)
        }
        bU = (bV - 2 * E + d) - (bP - 2 * bV + E);
        bR = 2 * (E - d) - 2 * (bV - E);
        bO = d - E;
        bN = (-bR + aH.sqrt(bR * bR - 4 * bU * bO)) / 2 / bU;
        S = (-bR - aH.sqrt(bR * bR - 4 * bU * bO)) / 2 / bU;
        aj(bN) > "1e12" && (bN = 0.5);
        aj(S) > "1e12" && (S = 0.5);
        if (bN > 0 && bN < 1) {
            g = bK(i, d, R, E, bW, bV, bS, bP, bN);
            bT.push(g.x);
            bQ.push(g.y)
        }
        if (S > 0 && S < 1) {
            g = bK(i, d, R, E, bW, bV, bS, bP, S);
            bT.push(g.x);
            bQ.push(g.y)
        }
        return {min: {x: ah[br](0, bT), y: ah[br](0, bQ)}, max: {x: bH[br](0, bT), y: bH[br](0, bQ)}}
    }), bj = bh._path2curve = H(function (bW, bR) {
        var bP = !bR && aQ(bW);
        if (!bR && bP.curve) {
            return aX(bP.curve)
        }
        var E = p(bW), bS = bR && p(bR), bT = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null}, d = {
            x: 0,
            y: 0,
            bx: 0,
            by: 0,
            X: 0,
            Y: 0,
            qx: null,
            qy: null
        }, S = function (bX, bY) {
            var i, bZ;
            if (!bX) {
                return ["C", bY.x, bY.y, bY.x, bY.y, bY.x, bY.y]
            }
            !(bX[0] in {T: 1, Q: 1}) && (bY.qx = bY.qy = null);
            switch (bX[0]) {
                case"M":
                    bY.X = bX[1];
                    bY.Y = bX[2];
                    break;
                case"A":
                    bX = ["C"][au](ab[br](0, [bY.x, bY.y][au](bX.slice(1))));
                    break;
                case"S":
                    i = bY.x + (bY.x - (bY.bx || bY.x));
                    bZ = bY.y + (bY.y - (bY.by || bY.y));
                    bX = ["C", i, bZ][au](bX.slice(1));
                    break;
                case"T":
                    bY.qx = bY.x + (bY.x - (bY.qx || bY.x));
                    bY.qy = bY.y + (bY.y - (bY.qy || bY.y));
                    bX = ["C"][au](z(bY.x, bY.y, bY.qx, bY.qy, bX[1], bX[2]));
                    break;
                case"Q":
                    bY.qx = bX[1];
                    bY.qy = bX[2];
                    bX = ["C"][au](z(bY.x, bY.y, bX[1], bX[2], bX[3], bX[4]));
                    break;
                case"L":
                    bX = ["C"][au](aV(bY.x, bY.y, bX[1], bX[2]));
                    break;
                case"H":
                    bX = ["C"][au](aV(bY.x, bY.y, bX[1], bY.y));
                    break;
                case"V":
                    bX = ["C"][au](aV(bY.x, bY.y, bY.x, bX[1]));
                    break;
                case"Z":
                    bX = ["C"][au](aV(bY.x, bY.y, bY.X, bY.Y));
                    break
            }
            return bX
        }, b = function (bX, bY) {
            if (bX[bY].length > 7) {
                bX[bY].shift();
                var bZ = bX[bY];
                while (bZ.length) {
                    bX.splice(bY++, 0, ["C"][au](bZ.splice(0, 6)))
                }
                bX.splice(bY, 1);
                bU = bH(E.length, bS && bS.length || 0)
            }
        }, g = function (b1, b0, bY, bX, bZ) {
            if (b1 && b0 && b1[bZ][0] == "M" && b0[bZ][0] != "M") {
                b0.splice(bZ, 0, ["M", bX.x, bX.y]);
                bY.bx = 0;
                bY.by = 0;
                bY.x = b1[bZ][1];
                bY.y = b1[bZ][2];
                bU = bH(E.length, bS && bS.length || 0)
            }
        };
        for (var bO = 0, bU = bH(E.length, bS && bS.length || 0); bO < bU; bO++) {
            E[bO] = S(E[bO], bT);
            b(E, bO);
            bS && (bS[bO] = S(bS[bO], d));
            bS && b(bS, bO);
            g(E, bS, bT, d, bO);
            g(bS, E, d, bT, bO);
            var bN = E[bO], bV = bS && bS[bO], R = bN.length, bQ = bS && bV.length;
            bT.x = bN[R - 2];
            bT.y = bN[R - 1];
            bT.bx = bL(bN[R - 4]) || bT.x;
            bT.by = bL(bN[R - 3]) || bT.y;
            d.bx = bS && (bL(bV[bQ - 4]) || d.x);
            d.by = bS && (bL(bV[bQ - 3]) || d.y);
            d.x = bS && bV[bQ - 2];
            d.y = bS && bV[bQ - 1]
        }
        if (!bS) {
            bP.curve = aX(E)
        }
        return bS ? [E, bS] : E
    }, null, aX), a9 = bh._parseDots = H(function (bQ) {
        var bP = [];
        for (var S = 0, bR = bQ.length; S < bR; S++) {
            var b = {}, bO = bQ[S].match(/^([^:]*):?([\d\.]*)/);
            b.color = bh.getRGB(bO[1]);
            if (b.color.error) {
                return null
            }
            b.color = b.color.hex;
            bO[2] && (b.offset = bO[2] + "%");
            bP.push(b)
        }
        for (S = 1, bR = bP.length - 1; S < bR; S++) {
            if (!bP[S].offset) {
                var g = bL(bP[S - 1].offset || 0), E = 0;
                for (var R = S + 1; R < bR; R++) {
                    if (bP[R].offset) {
                        E = bP[R].offset;
                        break
                    }
                }
                if (!E) {
                    E = 100;
                    R = bR
                }
                E = bL(E);
                var bN = (E - g) / (R - S + 1);
                for (; S < R; S++) {
                    g += bN;
                    bP[S].offset = g + "%"
                }
            }
        }
        return bP
    }), aG = bh._tear = function (b, d) {
        b == d.top && (d.top = b.prev);
        b == d.bottom && (d.bottom = b.next);
        b.next && (b.next.prev = b.prev);
        b.prev && (b.prev.next = b.next)
    }, L = bh._tofront = function (b, d) {
        if (d.top === b) {
            return
        }
        aG(b, d);
        b.next = null;
        b.prev = d.top;
        d.top.next = b;
        d.top = b
    }, y = bh._toback = function (b, d) {
        if (d.bottom === b) {
            return
        }
        aG(b, d);
        b.next = d.bottom;
        b.prev = null;
        d.bottom.prev = b;
        d.bottom = b
    }, aq = bh._insertafter = function (d, b, g) {
        aG(d, g);
        b == g.top && (g.top = d);
        b.next && (b.next.prev = d);
        d.next = b.next;
        d.prev = b;
        b.next = d
    }, m = bh._insertbefore = function (d, b, g) {
        aG(d, g);
        b == g.bottom && (g.bottom = d);
        b.prev && (b.prev.next = d);
        d.prev = b.prev;
        b.prev = d;
        d.next = b
    }, t = bh.toMatrix = function (g, b) {
        var i = I(g), d = {
            _: {transform: bm}, getBBox: function () {
                return i
            }
        };
        X(d, b);
        return d.matrix
    }, ax = bh.transformPath = function (d, b) {
        return Q(d, t(d, b))
    }, X = bh._extractTransform = function (d, b1) {
        if (b1 == null) {
            return d._.transform
        }
        b1 = k(b1).replace(/\.{3}|\u2026/g, d._.transform || bm);
        var bT = bh.parseTransformString(b1), bR = 0, bP = 0, bO = 0, bV = 1, bU = 1, b2 = d._, bW = new a8;
        b2.transform = bT || [];
        if (bT) {
            for (var bX = 0, bQ = bT.length; bX < bQ; bX++) {
                var bS = bT[bX], b = bS.length, R = k(bS[0]).toLowerCase(), b0 = bS[0] != R, bN = b0 ? bW.invert() : 0, bZ, E, bY, g, S;
                if (R == "t" && b == 3) {
                    if (b0) {
                        bZ = bN.x(0, 0);
                        E = bN.y(0, 0);
                        bY = bN.x(bS[1], bS[2]);
                        g = bN.y(bS[1], bS[2]);
                        bW.translate(bY - bZ, g - E)
                    } else {
                        bW.translate(bS[1], bS[2])
                    }
                } else {
                    if (R == "r") {
                        if (b == 2) {
                            S = S || d.getBBox(1);
                            bW.rotate(bS[1], S.x + S.width / 2, S.y + S.height / 2);
                            bR += bS[1]
                        } else {
                            if (b == 4) {
                                if (b0) {
                                    bY = bN.x(bS[2], bS[3]);
                                    g = bN.y(bS[2], bS[3]);
                                    bW.rotate(bS[1], bY, g)
                                } else {
                                    bW.rotate(bS[1], bS[2], bS[3])
                                }
                                bR += bS[1]
                            }
                        }
                    } else {
                        if (R == "s") {
                            if (b == 2 || b == 3) {
                                S = S || d.getBBox(1);
                                bW.scale(bS[1], bS[b - 1], S.x + S.width / 2, S.y + S.height / 2);
                                bV *= bS[1];
                                bU *= bS[b - 1]
                            } else {
                                if (b == 5) {
                                    if (b0) {
                                        bY = bN.x(bS[3], bS[4]);
                                        g = bN.y(bS[3], bS[4]);
                                        bW.scale(bS[1], bS[2], bY, g)
                                    } else {
                                        bW.scale(bS[1], bS[2], bS[3], bS[4])
                                    }
                                    bV *= bS[1];
                                    bU *= bS[2]
                                }
                            }
                        } else {
                            if (R == "m" && b == 7) {
                                bW.add(bS[1], bS[2], bS[3], bS[4], bS[5], bS[6])
                            }
                        }
                    }
                }
                b2.dirtyT = 1;
                d.matrix = bW
            }
        }
        d.matrix = bW;
        b2.sx = bV;
        b2.sy = bU;
        b2.deg = bR;
        b2.dx = bP = bW.e;
        b2.dy = bO = bW.f;
        if (bV == 1 && bU == 1 && !bR && b2.bbox) {
            b2.bbox.x += +bP;
            b2.bbox.y += +bO
        } else {
            b2.dirtyT = 1
        }
    }, o = function (d) {
        var b = d[0];
        switch (b.toLowerCase()) {
            case"t":
                return [b, 0, 0];
            case"m":
                return [b, 1, 0, 0, 1, 0, 0];
            case"r":
                if (d.length == 4) {
                    return [b, 0, d[2], d[3]]
                } else {
                    return [b, 0]
                }
            case"s":
                if (d.length == 5) {
                    return [b, 1, 1, d[3], d[4]]
                } else {
                    if (d.length == 3) {
                        return [b, 1, 1]
                    } else {
                        return [b, 1]
                    }
                }
        }
    }, bc = bh._equaliseTransform = function (R, E) {
        E = k(E).replace(/\.{3}|\u2026/g, R);
        R = bh.parseTransformString(R) || [];
        E = bh.parseTransformString(E) || [];
        var b = bH(R.length, E.length), bP = [], bQ = [], g = 0, d, S, bO, bN;
        for (; g < b; g++) {
            bO = R[g] || o(E[g]);
            bN = E[g] || o(bO);
            if ((bO[0] != bN[0]) || (bO[0].toLowerCase() == "r" && (bO[2] != bN[2] || bO[3] != bN[3])) || (bO[0].toLowerCase() == "s" && (bO[3] != bN[3] || bO[4] != bN[4]))) {
                return
            }
            bP[g] = [];
            bQ[g] = [];
            for (d = 0, S = bH(bO.length, bN.length); d < S; d++) {
                d in bO && (bP[g][d] = bO[d]);
                d in bN && (bQ[g][d] = bN[d])
            }
        }
        return {from: bP, to: bQ}
    };
    bh._getContainer = function (b, E, g, i) {
        var d;
        d = i == null && !bh.is(b, "object") ? a4.doc.getElementById(b) : b;
        if (d == null) {
            return
        }
        if (d.tagName) {
            if (E == null) {
                return {
                    container: d,
                    width: d.style.pixelWidth || d.offsetWidth,
                    height: d.style.pixelHeight || d.offsetHeight
                }
            } else {
                return {container: d, width: E, height: g}
            }
        }
        return {container: 1, x: b, y: E, width: g, height: i}
    };
    bh.pathToRelative = j;
    bh._engine = {};
    bh.path2curve = bj;
    bh.matrix = function (i, g, bN, S, R, E) {
        return new a8(i, g, bN, S, R, E)
    };
    function a8(i, g, bN, S, R, E) {
        if (i != null) {
            this.a = +i;
            this.b = +g;
            this.c = +bN;
            this.d = +S;
            this.e = +R;
            this.f = +E
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0
        }
    }

    (function (g) {
        g.add = function (bV, bS, bQ, bO, S, R) {
            var E = [[], [], []], i = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]], bU = [[bV, bQ, S], [bS, bO, R], [0, 0, 1]], bT, bR, bP, bN;
            if (bV && bV instanceof a8) {
                bU = [[bV.a, bV.c, bV.e], [bV.b, bV.d, bV.f], [0, 0, 1]]
            }
            for (bT = 0; bT < 3; bT++) {
                for (bR = 0; bR < 3; bR++) {
                    bN = 0;
                    for (bP = 0; bP < 3; bP++) {
                        bN += i[bT][bP] * bU[bP][bR]
                    }
                    E[bT][bR] = bN
                }
            }
            this.a = E[0][0];
            this.b = E[1][0];
            this.c = E[0][1];
            this.d = E[1][1];
            this.e = E[0][2];
            this.f = E[1][2]
        };
        g.invert = function () {
            var E = this, i = E.a * E.d - E.b * E.c;
            return new a8(E.d / i, -E.b / i, -E.c / i, E.a / i, (E.c * E.f - E.d * E.e) / i, (E.b * E.e - E.a * E.f) / i)
        };
        g.clone = function () {
            return new a8(this.a, this.b, this.c, this.d, this.e, this.f)
        };
        g.translate = function (i, E) {
            this.add(1, 0, 0, 1, i, E)
        };
        g.scale = function (E, S, i, R) {
            S == null && (S = E);
            (i || R) && this.add(1, 0, 0, 1, i, R);
            this.add(E, 0, 0, S, 0, 0);
            (i || R) && this.add(1, 0, 0, 1, -i, -R)
        };
        g.rotate = function (E, i, bN) {
            E = bh.rad(E);
            i = i || 0;
            bN = bN || 0;
            var S = +aH.cos(E).toFixed(9), R = +aH.sin(E).toFixed(9);
            this.add(S, R, -R, S, i, bN);
            this.add(1, 0, 0, 1, -i, -bN)
        };
        g.x = function (i, E) {
            return i * this.a + E * this.c + this.e
        };
        g.y = function (i, E) {
            return i * this.b + E * this.d + this.f
        };
        g.get = function (E) {
            return +this[k.fromCharCode(97 + E)].toFixed(4)
        };
        g.toString = function () {
            return bh.svg ? "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" : [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join()
        };
        g.toFilter = function () {
            return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')"
        };
        g.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)]
        };
        function d(i) {
            return i[0] * i[0] + i[1] * i[1]
        }

        function b(i) {
            var E = aH.sqrt(d(i));
            i[0] && (i[0] /= E);
            i[1] && (i[1] /= E)
        }

        g.split = function () {
            var E = {};
            E.dx = this.e;
            E.dy = this.f;
            var S = [[this.a, this.c], [this.b, this.d]];
            E.scalex = aH.sqrt(d(S[0]));
            b(S[0]);
            E.shear = S[0][0] * S[1][0] + S[0][1] * S[1][1];
            S[1] = [S[1][0] - S[0][0] * E.shear, S[1][1] - S[0][1] * E.shear];
            E.scaley = aH.sqrt(d(S[1]));
            b(S[1]);
            E.shear /= E.scaley;
            var i = -S[0][1], R = S[1][1];
            if (R < 0) {
                E.rotate = bh.deg(aH.acos(R));
                if (i < 0) {
                    E.rotate = 360 - E.rotate
                }
            } else {
                E.rotate = bh.deg(aH.asin(i))
            }
            E.isSimple = !+E.shear.toFixed(9) && (E.scalex.toFixed(9) == E.scaley.toFixed(9) || !E.rotate);
            E.isSuperSimple = !+E.shear.toFixed(9) && E.scalex.toFixed(9) == E.scaley.toFixed(9) && !E.rotate;
            E.noRotation = !+E.shear.toFixed(9) && !E.rotate;
            return E
        };
        g.toTransformString = function (i) {
            var E = i || this[l]();
            if (E.isSimple) {
                E.scalex = +E.scalex.toFixed(4);
                E.scaley = +E.scaley.toFixed(4);
                E.rotate = +E.rotate.toFixed(4);
                return (E.dx || E.dy ? "t" + [E.dx, E.dy] : bm) + (E.scalex != 1 || E.scaley != 1 ? "s" + [E.scalex, E.scaley, 0, 0] : bm) + (E.rotate ? "r" + [E.rotate, 0, 0] : bm)
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)]
            }
        }
    })(a8.prototype);
    var ak = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
    if ((navigator.vendor == "Apple Computer, Inc.") && (ak && ak[1] < 4 || navigator.platform.slice(0, 2) == "iP") || (navigator.vendor == "Google Inc." && ak && ak[1] < 8)) {
        an.safari = function () {
            var b = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
            setTimeout(function () {
                b.remove()
            })
        }
    } else {
        an.safari = ad
    }
    var bC = function () {
        this.returnValue = false
    }, n = function () {
        return this.originalEvent.preventDefault()
    }, aI = function () {
        this.cancelBubble = true
    }, V = function () {
        return this.originalEvent.stopPropagation()
    }, F = (function () {
        if (a4.doc.addEventListener) {
            return function (R, i, g, d) {
                var b = O && bo[i] ? bo[i] : i, E = function (bR) {
                    var bQ = a4.doc.documentElement.scrollTop || a4.doc.body.scrollTop, bS = a4.doc.documentElement.scrollLeft || a4.doc.body.scrollLeft, S = bR.clientX + bS, bT = bR.clientY + bQ;
                    if (O && bo[bv](i)) {
                        for (var bO = 0, bP = bR.targetTouches && bR.targetTouches.length; bO < bP; bO++) {
                            if (bR.targetTouches[bO].target == R) {
                                var bN = bR;
                                bR = bR.targetTouches[bO];
                                bR.originalEvent = bN;
                                bR.preventDefault = n;
                                bR.stopPropagation = V;
                                break
                            }
                        }
                    }
                    return g.call(d, bR, S, bT)
                };
                R.addEventListener(b, E, false);
                return function () {
                    R.removeEventListener(b, E, false);
                    return true
                }
            }
        } else {
            if (a4.doc.attachEvent) {
                return function (R, i, g, d) {
                    var E = function (bO) {
                        bO = bO || a4.win.event;
                        var bN = a4.doc.documentElement.scrollTop || a4.doc.body.scrollTop, bP = a4.doc.documentElement.scrollLeft || a4.doc.body.scrollLeft, S = bO.clientX + bP, bQ = bO.clientY + bN;
                        bO.preventDefault = bO.preventDefault || bC;
                        bO.stopPropagation = bO.stopPropagation || aI;
                        return g.call(d, bO, S, bQ)
                    };
                    R.attachEvent("on" + i, E);
                    var b = function () {
                        R.detachEvent("on" + i, E);
                        return true
                    };
                    return b
                }
            }
        }
    })(), az = [], bq = function (bO) {
        var bR = bO.clientX, bQ = bO.clientY, bT = a4.doc.documentElement.scrollTop || a4.doc.body.scrollTop, bU = a4.doc.documentElement.scrollLeft || a4.doc.body.scrollLeft, g, E = az.length;
        while (E--) {
            g = az[E];
            if (O) {
                var S = bO.touches.length, R;
                while (S--) {
                    R = bO.touches[S];
                    if (R.identifier == g.el._drag.id) {
                        bR = R.clientX;
                        bQ = R.clientY;
                        (bO.originalEvent ? bO.originalEvent : bO).preventDefault();
                        break
                    }
                }
            } else {
                bO.preventDefault()
            }
            var d = g.el.node, b, bN = d.nextSibling, bS = d.parentNode, bP = d.style.display;
            a4.win.opera && bS.removeChild(d);
            d.style.display = "none";
            b = g.el.paper.getElementByPoint(bR, bQ);
            d.style.display = bP;
            a4.win.opera && (bN ? bS.insertBefore(d, bN) : bS.appendChild(d));
            b && bb("raphael.drag.over." + g.el.id, g.el, b);
            bR += bU;
            bQ += bT;
            bb("raphael.drag.move." + g.el.id, g.move_scope || g.el, bR - g.el._drag.x, bQ - g.el._drag.y, bR, bQ, bO)
        }
    }, e = function (g) {
        bh.unmousemove(bq).unmouseup(e);
        var d = az.length, b;
        while (d--) {
            b = az[d];
            b.el._drag = {};
            bb("raphael.drag.end." + b.el.id, b.end_scope || b.start_scope || b.move_scope || b.el, g)
        }
        az = []
    }, ap = bh.el = {};
    for (var a2 = bA.length; a2--;) {
        (function (b) {
            bh[b] = ap[b] = function (g, d) {
                if (bh.is(g, "function")) {
                    this.events = this.events || [];
                    this.events.push({name: b, f: g, unbind: F(this.shape || this.node || a4.doc, b, g, d || this)})
                }
                return this
            };
            bh["un" + b] = ap["un" + b] = function (i) {
                var g = this.events || [], d = g.length;
                while (d--) {
                    if (g[d].name == b && (bh.is(i, "undefined") || g[d].f == i)) {
                        g[d].unbind();
                        g.splice(d, 1);
                        !g.length && delete this.events
                    }
                }
                return this
            }
        })(bA[a2])
    }
    ap.data = function (d, E) {
        var g = M[this.id] = M[this.id] || {};
        if (arguments.length == 0) {
            return g
        }
        if (arguments.length == 1) {
            if (bh.is(d, "object")) {
                for (var b in d) {
                    if (d[bv](b)) {
                        this.data(b, d[b])
                    }
                }
                return this
            }
            bb("raphael.data.get." + this.id, this, g[d], d);
            return g[d]
        }
        g[d] = E;
        bb("raphael.data.set." + this.id, this, E, d);
        return this
    };
    ap.removeData = function (b) {
        if (b == null) {
            M[this.id] = {}
        } else {
            M[this.id] && delete M[this.id][b]
        }
        return this
    };
    ap.getData = function () {
        return bk(M[this.id] || {})
    };
    ap.hover = function (i, b, g, d) {
        return this.mouseover(i, g).mouseout(b, d || g)
    };
    ap.unhover = function (d, b) {
        return this.unmouseover(d).unmouseout(b)
    };
    var ag = [];
    ap.drag = function (d, R, E, b, g, i) {
        function S(bO) {
            (bO.originalEvent || bO).preventDefault();
            var bN = a4.doc.documentElement.scrollTop || a4.doc.body.scrollTop, bP = a4.doc.documentElement.scrollLeft || a4.doc.body.scrollLeft;
            this._drag.x = bO.clientX + bP;
            this._drag.y = bO.clientY + bN;
            this._drag.id = bO.identifier;
            !az.length && bh.mousemove(bq).mouseup(e);
            az.push({el: this, move_scope: b, start_scope: g, end_scope: i});
            R && bb.on("raphael.drag.start." + this.id, R);
            d && bb.on("raphael.drag.move." + this.id, d);
            E && bb.on("raphael.drag.end." + this.id, E);
            bb("raphael.drag.start." + this.id, g || b || this, bO.clientX + bP, bO.clientY + bN, bO)
        }

        this._drag = {};
        ag.push({el: this, start: S});
        this.mousedown(S);
        return this
    };
    ap.onDragOver = function (b) {
        b ? bb.on("raphael.drag.over." + this.id, b) : bb.unbind("raphael.drag.over." + this.id)
    };
    ap.undrag = function () {
        var b = ag.length;
        while (b--) {
            if (ag[b].el == this) {
                this.unmousedown(ag[b].start);
                ag.splice(b, 1);
                bb.unbind("raphael.drag.*." + this.id)
            }
        }
        !ag.length && bh.unmousemove(bq).unmouseup(e);
        az = []
    };
    an.circle = function (b, i, g) {
        var d = bh._engine.circle(this, b || 0, i || 0, g || 0);
        this.__set__ && this.__set__.push(d);
        return d
    };
    an.rect = function (b, R, d, i, E) {
        var g = bh._engine.rect(this, b || 0, R || 0, d || 0, i || 0, E || 0);
        this.__set__ && this.__set__.push(g);
        return g
    };
    an.ellipse = function (b, E, i, g) {
        var d = bh._engine.ellipse(this, b || 0, E || 0, i || 0, g || 0);
        this.__set__ && this.__set__.push(d);
        return d
    };
    an.path = function (b) {
        b && !bh.is(b, a) && !bh.is(b[0], u) && (b += bm);
        var d = bh._engine.path(bh.format[br](bh, arguments), this);
        this.__set__ && this.__set__.push(d);
        return d
    };
    an.image = function (E, b, R, d, i) {
        var g = bh._engine.image(this, E || "about:blank", b || 0, R || 0, d || 0, i || 0);
        this.__set__ && this.__set__.push(g);
        return g
    };
    an.text = function (b, i, g) {
        var d = bh._engine.text(this, b || 0, i || 0, k(g));
        this.__set__ && this.__set__.push(d);
        return d
    };
    an.set = function (d) {
        !bh.is(d, "array") && (d = Array.prototype.splice.call(arguments, 0, arguments.length));
        var b = new Y(d);
        this.__set__ && this.__set__.push(b);
        b.paper = this;
        b.type = "set";
        return b
    };
    an.setStart = function (b) {
        this.__set__ = b || this.set()
    };
    an.setFinish = function (d) {
        var b = this.__set__;
        delete this.__set__;
        return b
    };
    an.setSize = function (d, b) {
        return bh._engine.setSize.call(this, d, b)
    };
    an.setViewBox = function (b, E, d, i, g) {
        return bh._engine.setViewBox.call(this, b, E, d, i, g)
    };
    an.top = an.bottom = null;
    an.raphael = bh;
    var bM = function (g) {
        var E = g.getBoundingClientRect(), bO = g.ownerDocument, R = bO.body, b = bO.documentElement, i = b.clientTop || R.clientTop || 0, S = b.clientLeft || R.clientLeft || 0, bN = E.top + (a4.win.pageYOffset || b.scrollTop || R.scrollTop) - i, d = E.left + (a4.win.pageXOffset || b.scrollLeft || R.scrollLeft) - S;
        return {y: bN, x: d}
    };
    an.getElementByPoint = function (d, bN) {
        var S = this, g = S.canvas, R = a4.doc.elementFromPoint(d, bN);
        if (a4.win.opera && R.tagName == "svg") {
            var E = bM(g), i = g.createSVGRect();
            i.x = d - E.x;
            i.y = bN - E.y;
            i.width = i.height = 1;
            var b = g.getIntersectionList(i, null);
            if (b.length) {
                R = b[b.length - 1]
            }
        }
        if (!R) {
            return null
        }
        while (R.parentNode && R != g.parentNode && !R.raphael) {
            R = R.parentNode
        }
        R == S.canvas.parentNode && (R = g);
        R = R && R.raphael ? S.getById(R.raphaelid) : null;
        return R
    };
    an.getElementsByBBox = function (b) {
        var d = this.set();
        this.forEach(function (g) {
            if (bh.isBBoxIntersect(g.getBBox(), b)) {
                d.push(g)
            }
        });
        return d
    };
    an.getById = function (d) {
        var b = this.bottom;
        while (b) {
            if (b.id == d) {
                return b
            }
            b = b.next
        }
        return null
    };
    an.forEach = function (g, b) {
        var d = this.bottom;
        while (d) {
            if (g.call(b, d) === false) {
                return this
            }
            d = d.next
        }
        return this
    };
    an.getElementsByPoint = function (b, g) {
        var d = this.set();
        this.forEach(function (i) {
            if (i.isPointInside(b, g)) {
                d.push(i)
            }
        });
        return d
    };
    function bw() {
        return this.x + bg + this.y
    }

    function a5() {
        return this.x + bg + this.y + bg + this.width + " \xd7 " + this.height
    }

    ap.isPointInside = function (b, g) {
        var d = this.realPath = this.realPath || ae[this.type](this);
        return bh.isPointInsidePath(d, b, g)
    };
    ap.getBBox = function (d) {
        if (this.removed) {
            return {}
        }
        var b = this._;
        if (d) {
            if (b.dirty || !b.bboxwt) {
                this.realPath = ae[this.type](this);
                b.bboxwt = I(this.realPath);
                b.bboxwt.toString = a5;
                b.dirty = 0
            }
            return b.bboxwt
        }
        if (b.dirty || b.dirtyT || !b.bbox) {
            if (b.dirty || !this.realPath) {
                b.bboxwt = 0;
                this.realPath = ae[this.type](this)
            }
            b.bbox = I(Q(this.realPath, this.matrix));
            b.bbox.toString = a5;
            b.dirty = b.dirtyT = 0
        }
        return b.bbox
    };
    ap.clone = function () {
        if (this.removed) {
            return null
        }
        var b = this.paper[this.type]().attr(this.attr());
        this.__set__ && this.__set__.push(b);
        return b
    };
    ap.glow = function (bN) {
        if (this.type == "text") {
            return null
        }
        bN = bN || {};
        var g = {
            width: (bN.width || 10) + (+this.attr("stroke-width") || 1),
            fill: bN.fill || false,
            opacity: bN.opacity || 0.5,
            offsetx: bN.offsetx || 0,
            offsety: bN.offsety || 0,
            color: bN.color || "#000"
        }, S = g.width / 2, E = this.paper, b = E.set(), R = this.realPath || ae[this.type](this);
        R = this.matrix ? Q(R, this.matrix) : R;
        for (var d = 1; d < S + 1; d++) {
            b.push(E.path(R).attr({
                stroke: g.color,
                fill: g.fill ? g.color : "none",
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-width": +(g.width / S * d).toFixed(3),
                opacity: +(g.opacity / S).toFixed(3)
            }))
        }
        return b.insertBefore(this).translate(g.offsetx, g.offsety)
    };
    var aY = {}, aN = function (d, b, E, i, bO, bN, S, R, g) {
        if (g == null) {
            return ba(d, b, E, i, bO, bN, S, R)
        } else {
            return bh.findDotsAtSegment(d, b, E, i, bO, bN, S, R, aJ(d, b, E, i, bO, bN, S, R, g))
        }
    }, aC = function (b, d) {
        return function (bV, R, S) {
            bV = bj(bV);
            var bR, bQ, g, bN, E = "", bU = {}, bS, bP = 0;
            for (var bO = 0, bT = bV.length; bO < bT; bO++) {
                g = bV[bO];
                if (g[0] == "M") {
                    bR = +g[1];
                    bQ = +g[2]
                } else {
                    bN = aN(bR, bQ, g[1], g[2], g[3], g[4], g[5], g[6]);
                    if (bP + bN > R) {
                        if (d && !bU.start) {
                            bS = aN(bR, bQ, g[1], g[2], g[3], g[4], g[5], g[6], R - bP);
                            E += ["C" + bS.start.x, bS.start.y, bS.m.x, bS.m.y, bS.x, bS.y];
                            if (S) {
                                return E
                            }
                            bU.start = E;
                            E = ["M" + bS.x, bS.y + "C" + bS.n.x, bS.n.y, bS.end.x, bS.end.y, g[5], g[6]].join();
                            bP += bN;
                            bR = +g[5];
                            bQ = +g[6];
                            continue
                        }
                        if (!b && !d) {
                            bS = aN(bR, bQ, g[1], g[2], g[3], g[4], g[5], g[6], R - bP);
                            return {x: bS.x, y: bS.y, alpha: bS.alpha}
                        }
                    }
                    bP += bN;
                    bR = +g[5];
                    bQ = +g[6]
                }
                E += g.shift() + g
            }
            bU.end = E;
            bS = b ? bP : d ? bU : bh.findDotsAtSegment(bR, bQ, g[0], g[1], g[2], g[3], g[4], g[5], 1);
            bS.alpha && (bS = {x: bS.x, y: bS.y, alpha: bS.alpha});
            return bS
        }
    };
    var bF = aC(1), bx = aC(), aA = aC(0, 1);
    bh.getTotalLength = bF;
    bh.getPointAtLength = bx;
    bh.getSubpath = function (d, i, g) {
        if (this.getTotalLength(d) - g < 0.000001) {
            return aA(d, i).end
        }
        var b = aA(d, g, 1);
        return i ? aA(b, i).end : b
    };
    ap.getTotalLength = function () {
        if (this.type != "path") {
            return
        }
        if (this.node.getTotalLength) {
            return this.node.getTotalLength()
        }
        return bF(this.attrs.path)
    };
    ap.getPointAtLength = function (b) {
        if (this.type != "path") {
            return
        }
        return bx(this.attrs.path, b)
    };
    ap.getSubpath = function (d, b) {
        if (this.type != "path") {
            return
        }
        return bh.getSubpath(this.attrs.path, d, b)
    };
    var aF = bh.easing_formulas = {
        linear: function (b) {
            return b
        }, "<": function (b) {
            return aR(b, 1.7)
        }, ">": function (b) {
            return aR(b, 0.48)
        }, "<>": function (bN) {
            var i = 0.48 - bN / 1.04, g = aH.sqrt(0.1734 + i * i), b = g - i, S = aR(aj(b), 1 / 3) * (b < 0 ? -1 : 1), R = -g - i, E = aR(aj(R), 1 / 3) * (R < 0 ? -1 : 1), d = S + E + 0.5;
            return (1 - d) * 3 * d * d + d * d * d
        }, backIn: function (d) {
            var b = 1.70158;
            return d * d * ((b + 1) * d - b)
        }, backOut: function (d) {
            d = d - 1;
            var b = 1.70158;
            return d * d * ((b + 1) * d + b) + 1
        }, elastic: function (b) {
            if (b == !!b) {
                return b
            }
            return aR(2, -10 * b) * aH.sin((b - 0.075) * (2 * af) / 0.3) + 1
        }, bounce: function (i) {
            var d = 7.5625, g = 2.75, b;
            if (i < (1 / g)) {
                b = d * i * i
            } else {
                if (i < (2 / g)) {
                    i -= (1.5 / g);
                    b = d * i * i + 0.75
                } else {
                    if (i < (2.5 / g)) {
                        i -= (2.25 / g);
                        b = d * i * i + 0.9375
                    } else {
                        i -= (2.625 / g);
                        b = d * i * i + 0.984375
                    }
                }
            }
            return b
        }
    };
    aF.easeIn = aF["ease-in"] = aF["<"];
    aF.easeOut = aF["ease-out"] = aF[">"];
    aF.easeInOut = aF["ease-in-out"] = aF["<>"];
    aF["back-in"] = aF.backIn;
    aF["back-out"] = aF.backOut;
    var bE = [], bG = aS.requestAnimationFrame || aS.webkitRequestAnimationFrame || aS.mozRequestAnimationFrame || aS.oRequestAnimationFrame || aS.msRequestAnimationFrame || function (b) {
            setTimeout(b, 16)
        }, ar = function () {
        var bN = +new Date, bV = 0;
        for (; bV < bE.length; bV++) {
            var b1 = bE[bV];
            if (b1.el.removed || b1.paused) {
                continue
            }
            var E = bN - b1.start, bT = b1.ms, bS = b1.easing, bW = b1.from, bQ = b1.diff, d = b1.to, bP = b1.t, S = b1.el, bR = {}, b, bZ = {}, b3;
            if (b1.initstatus) {
                E = (b1.initstatus * b1.anim.top - b1.prev) / (b1.percent - b1.prev) * bT;
                b1.status = b1.initstatus;
                delete b1.initstatus;
                b1.stop && bE.splice(bV--, 1)
            } else {
                b1.status = (b1.prev + (b1.percent - b1.prev) * (E / bT)) / b1.anim.top
            }
            if (E < 0) {
                continue
            }
            if (E < bT) {
                var g = bS(E / bT);
                for (var bU in bW) {
                    if (bW[bv](bU)) {
                        switch (bn[bU]) {
                            case bi:
                                b = +bW[bU] + g * bT * bQ[bU];
                                break;
                            case"colour":
                                b = "rgb(" + [a0(C(bW[bU].r + g * bT * bQ[bU].r)), a0(C(bW[bU].g + g * bT * bQ[bU].g)), a0(C(bW[bU].b + g * bT * bQ[bU].b))].join(",") + ")";
                                break;
                            case"path":
                                b = [];
                                for (var bY = 0, bO = bW[bU].length; bY < bO; bY++) {
                                    b[bY] = [bW[bU][bY][0]];
                                    for (var bX = 1, b0 = bW[bU][bY].length; bX < b0; bX++) {
                                        b[bY][bX] = +bW[bU][bY][bX] + g * bT * bQ[bU][bY][bX]
                                    }
                                    b[bY] = b[bY].join(bg)
                                }
                                b = b.join(bg);
                                break;
                            case"transform":
                                if (bQ[bU].real) {
                                    b = [];
                                    for (bY = 0, bO = bW[bU].length; bY < bO; bY++) {
                                        b[bY] = [bW[bU][bY][0]];
                                        for (bX = 1, b0 = bW[bU][bY].length; bX < b0; bX++) {
                                            b[bY][bX] = bW[bU][bY][bX] + g * bT * bQ[bU][bY][bX]
                                        }
                                    }
                                } else {
                                    var b2 = function (b4) {
                                        return +bW[bU][b4] + g * bT * bQ[bU][b4]
                                    };
                                    b = [["m", b2(0), b2(1), b2(2), b2(3), b2(4), b2(5)]]
                                }
                                break;
                            case"csv":
                                if (bU == "clip-rect") {
                                    b = [];
                                    bY = 4;
                                    while (bY--) {
                                        b[bY] = +bW[bU][bY] + g * bT * bQ[bU][bY]
                                    }
                                }
                                break;
                            default:
                                var R = [][au](bW[bU]);
                                b = [];
                                bY = S.paper.customAttributes[bU].length;
                                while (bY--) {
                                    b[bY] = +R[bY] + g * bT * bQ[bU][bY]
                                }
                                break
                        }
                        bR[bU] = b
                    }
                }
                S.attr(bR);
                (function (b5, i, b4) {
                    setTimeout(function () {
                        bb("raphael.anim.frame." + b5, i, b4)
                    })
                })(S.id, S, b1.anim)
            } else {
                (function (b5, b4, i) {
                    setTimeout(function () {
                        bb("raphael.anim.frame." + b4.id, b4, i);
                        bb("raphael.anim.finish." + b4.id, b4, i);
                        bh.is(b5, "function") && b5.call(b4)
                    })
                })(b1.callback, S, b1.anim);
                S.attr(d);
                bE.splice(bV--, 1);
                if (b1.repeat > 1 && !b1.next) {
                    for (b3 in d) {
                        if (d[bv](b3)) {
                            bZ[b3] = b1.totalOrigin[b3]
                        }
                    }
                    b1.el.attr(bZ);
                    T(b1.anim, b1.el, b1.anim.percents[0], null, b1.totalOrigin, b1.repeat - 1)
                }
                if (b1.next && !b1.stop) {
                    T(b1.anim, b1.el, b1.next, null, b1.totalOrigin, b1.repeat)
                }
            }
        }
        bh.svg && S && S.paper && S.paper.safari();
        bE.length && bG(ar)
    }, a0 = function (b) {
        return b > 255 ? 255 : b < 0 ? 0 : b
    };
    ap.animateWith = function (d, E, g, b, bN, bS) {
        var S = this;
        if (S.removed) {
            bS && bS.call(S);
            return S
        }
        var bQ = g instanceof f ? g : bh.animation(g, b, bN, bS), bP, bO;
        T(bQ, S, bQ.percents[0], null, S.attr());
        for (var R = 0, bR = bE.length; R < bR; R++) {
            if (bE[R].anim == E && bE[R].el == d) {
                bE[bR - 1].start = bE[R].start;
                break
            }
        }
        return S
    };
    function aZ(bT, i, d, bS, bR, bN) {
        var bO = 3 * i, bQ = 3 * (bS - i) - bO, b = 1 - bO - bQ, S = 3 * d, bP = 3 * (bR - d) - S, bU = 1 - S - bP;

        function R(bV) {
            return ((b * bV + bQ) * bV + bO) * bV
        }

        function g(bV, bX) {
            var bW = E(bV, bX);
            return ((bU * bW + bP) * bW + S) * bW
        }

        function E(bV, b2) {
            var b1, b0, bY, bW, bZ, bX;
            for (bY = bV, bX = 0; bX < 8; bX++) {
                bW = R(bY) - bV;
                if (aj(bW) < b2) {
                    return bY
                }
                bZ = (3 * b * bY + 2 * bQ) * bY + bO;
                if (aj(bZ) < 0.000001) {
                    break
                }
                bY = bY - bW / bZ
            }
            b1 = 0;
            b0 = 1;
            bY = bV;
            if (bY < b1) {
                return b1
            }
            if (bY > b0) {
                return b0
            }
            while (b1 < b0) {
                bW = R(bY);
                if (aj(bW - bV) < b2) {
                    return bY
                }
                if (bV > bW) {
                    b1 = bY
                } else {
                    b0 = bY
                }
                bY = (b0 - b1) / 2 + b1
            }
            return bY
        }

        return g(bT, 1 / (200 * bN))
    }

    ap.onAnimation = function (b) {
        b ? bb.on("raphael.anim.frame." + this.id, b) : bb.unbind("raphael.anim.frame." + this.id);
        return this
    };
    function f(E, g) {
        var d = [], i = {};
        this.ms = g;
        this.times = 1;
        if (E) {
            for (var b in E) {
                if (E[bv](b)) {
                    i[bL(b)] = E[b];
                    d.push(bL(b))
                }
            }
            d.sort(bt)
        }
        this.anim = i;
        this.top = d[d.length - 1];
        this.percents = d
    }

    f.prototype.delay = function (d) {
        var b = new f(this.anim, this.ms);
        b.times = this.times;
        b.del = +d || 0;
        return b
    };
    f.prototype.repeat = function (d) {
        var b = new f(this.anim, this.ms);
        b.del = this.del;
        b.times = aH.floor(bH(d, 0)) || 1;
        return b
    };
    function T(b5, g, b, b3, bN, bR) {
        b = bL(b);
        var cc, S, bQ, cd = [], bX, bW, R, bZ = b5.ms, b4 = {}, E = {}, bT = {};
        if (b3) {
            for (b8 = 0, bS = bE.length; b8 < bS; b8++) {
                var ca = bE[b8];
                if (ca.el.id == g.id && ca.anim == b5) {
                    if (ca.percent != b) {
                        bE.splice(b8, 1);
                        bQ = 1
                    } else {
                        S = ca
                    }
                    g.attr(ca.totalOrigin);
                    break
                }
            }
        } else {
            b3 = +E
        }
        for (var b8 = 0, bS = b5.percents.length; b8 < bS; b8++) {
            if (b5.percents[b8] == b || b5.percents[b8] > b3 * b5.top) {
                b = b5.percents[b8];
                bW = b5.percents[b8 - 1] || 0;
                bZ = bZ / b5.top * (b - bW);
                bX = b5.percents[b8 + 1];
                cc = b5.anim[b];
                break
            } else {
                if (b3) {
                    g.attr(b5.anim[b5.percents[b8]])
                }
            }
        }
        if (!cc) {
            return
        }
        if (!S) {
            for (var b1 in cc) {
                if (cc[bv](b1)) {
                    if (bn[bv](b1) || g.paper.customAttributes[bv](b1)) {
                        b4[b1] = g.attr(b1);
                        (b4[b1] == null) && (b4[b1] = bp[b1]);
                        E[b1] = cc[b1];
                        switch (bn[b1]) {
                            case bi:
                                bT[b1] = (E[b1] - b4[b1]) / bZ;
                                break;
                            case"colour":
                                b4[b1] = bh.getRGB(b4[b1]);
                                var b2 = bh.getRGB(E[b1]);
                                bT[b1] = {
                                    r: (b2.r - b4[b1].r) / bZ,
                                    g: (b2.g - b4[b1].g) / bZ,
                                    b: (b2.b - b4[b1].b) / bZ
                                };
                                break;
                            case"path":
                                var bO = bj(b4[b1], E[b1]), bV = bO[1];
                                b4[b1] = bO[0];
                                bT[b1] = [];
                                for (b8 = 0, bS = b4[b1].length; b8 < bS; b8++) {
                                    bT[b1][b8] = [0];
                                    for (var b7 = 1, b9 = b4[b1][b8].length; b7 < b9; b7++) {
                                        bT[b1][b8][b7] = (bV[b8][b7] - b4[b1][b8][b7]) / bZ
                                    }
                                }
                                break;
                            case"transform":
                                var cf = g._, ce = bc(cf[b1], E[b1]);
                                if (ce) {
                                    b4[b1] = ce.from;
                                    E[b1] = ce.to;
                                    bT[b1] = [];
                                    bT[b1].real = true;
                                    for (b8 = 0, bS = b4[b1].length; b8 < bS; b8++) {
                                        bT[b1][b8] = [b4[b1][b8][0]];
                                        for (b7 = 1, b9 = b4[b1][b8].length; b7 < b9; b7++) {
                                            bT[b1][b8][b7] = (E[b1][b8][b7] - b4[b1][b8][b7]) / bZ
                                        }
                                    }
                                } else {
                                    var b0 = (g.matrix || new a8), cb = {
                                        _: {transform: cf.transform},
                                        getBBox: function () {
                                            return g.getBBox(1)
                                        }
                                    };
                                    b4[b1] = [b0.a, b0.b, b0.c, b0.d, b0.e, b0.f];
                                    X(cb, E[b1]);
                                    E[b1] = cb._.transform;
                                    bT[b1] = [(cb.matrix.a - b0.a) / bZ, (cb.matrix.b - b0.b) / bZ, (cb.matrix.c - b0.c) / bZ, (cb.matrix.d - b0.d) / bZ, (cb.matrix.e - b0.e) / bZ, (cb.matrix.f - b0.f) / bZ]
                                }
                                break;
                            case"csv":
                                var d = k(cc[b1])[l](bu), bP = k(b4[b1])[l](bu);
                                if (b1 == "clip-rect") {
                                    b4[b1] = bP;
                                    bT[b1] = [];
                                    b8 = bP.length;
                                    while (b8--) {
                                        bT[b1][b8] = (d[b8] - b4[b1][b8]) / bZ
                                    }
                                }
                                E[b1] = d;
                                break;
                            default:
                                d = [][au](cc[b1]);
                                bP = [][au](b4[b1]);
                                bT[b1] = [];
                                b8 = g.paper.customAttributes[b1].length;
                                while (b8--) {
                                    bT[b1][b8] = ((d[b8] || 0) - (bP[b8] || 0)) / bZ
                                }
                                break
                        }
                    }
                }
            }
            var bY = cc.easing, b6 = bh.easing_formulas[bY];
            if (!b6) {
                b6 = k(bY).match(am);
                if (b6 && b6.length == 5) {
                    var bU = b6;
                    b6 = function (i) {
                        return aZ(i, +bU[1], +bU[2], +bU[3], +bU[4], bZ)
                    }
                } else {
                    b6 = av
                }
            }
            R = cc.start || b5.start || +new Date;
            ca = {
                anim: b5,
                percent: b,
                timestamp: R,
                start: R + (b5.del || 0),
                status: 0,
                initstatus: b3 || 0,
                stop: false,
                ms: bZ,
                easing: b6,
                from: b4,
                diff: bT,
                to: E,
                el: g,
                callback: cc.callback,
                prev: bW,
                next: bX,
                repeat: bR || b5.times,
                origin: g.attr(),
                totalOrigin: bN
            };
            bE.push(ca);
            if (b3 && !S && !bQ) {
                ca.stop = true;
                ca.start = new Date - bZ * b3;
                if (bE.length == 1) {
                    return ar()
                }
            }
            if (bQ) {
                ca.start = new Date - ca.ms * b3
            }
            bE.length == 1 && bG(ar)
        } else {
            S.initstatus = b3;
            S.start = new Date - S.ms * b3
        }
        bb("raphael.anim.start." + g.id, g, b5)
    }

    bh.animation = function (E, d, S, R) {
        if (E instanceof f) {
            return E
        }
        if (bh.is(S, "function") || !S) {
            R = R || S || null;
            S = null
        }
        E = Object(E);
        d = +d || 0;
        var i = {}, g, b;
        for (b in E) {
            if (E[bv](b) && bL(b) != b && bL(b) + "%" != b) {
                g = true;
                i[b] = E[b]
            }
        }
        if (!g) {
            return new f(E, d)
        } else {
            S && (i.easing = S);
            R && (i.callback = R);
            return new f({100: i}, d)
        }
    };
    ap.animate = function (i, b, R, E) {
        var d = this;
        if (d.removed) {
            E && E.call(d);
            return d
        }
        var g = i instanceof f ? i : bh.animation(i, b, R, E);
        T(g, d, g.percents[0], null, d.attr());
        return d
    };
    ap.setTime = function (d, b) {
        if (d && b != null) {
            this.status(d, ah(b, d.ms) / d.ms)
        }
        return this
    };
    ap.status = function (R, E) {
        var d = [], g = 0, b, S;
        if (E != null) {
            T(R, this, -1, ah(E, 1));
            return this
        } else {
            b = bE.length;
            for (; g < b; g++) {
                S = bE[g];
                if (S.el.id == this.id && (!R || S.anim == R)) {
                    if (R) {
                        return S.status
                    }
                    d.push({anim: S.anim, status: S.status})
                }
            }
            if (R) {
                return 0
            }
            return d
        }
    };
    ap.pause = function (d) {
        for (var b = 0; b < bE.length; b++) {
            if (bE[b].el.id == this.id && (!d || bE[b].anim == d)) {
                if (bb("raphael.anim.pause." + this.id, this, bE[b].anim) !== false) {
                    bE[b].paused = true
                }
            }
        }
        return this
    };
    ap.resume = function (d) {
        for (var b = 0; b < bE.length; b++) {
            if (bE[b].el.id == this.id && (!d || bE[b].anim == d)) {
                var g = bE[b];
                if (bb("raphael.anim.resume." + this.id, this, g.anim) !== false) {
                    delete g.paused;
                    this.status(g.anim, g.status)
                }
            }
        }
        return this
    };
    ap.stop = function (d) {
        for (var b = 0; b < bE.length; b++) {
            if (bE[b].el.id == this.id && (!d || bE[b].anim == d)) {
                if (bb("raphael.anim.stop." + this.id, this, bE[b].anim) !== false) {
                    bE.splice(b--, 1)
                }
            }
        }
        return this
    };
    function bd(d) {
        for (var b = 0; b < bE.length; b++) {
            if (bE[b].el.paper == d) {
                bE.splice(b--, 1)
            }
        }
    }

    bb.on("raphael.remove", bd);
    bb.on("raphael.clear", bd);
    ap.toString = function () {
        return "Rapha\xebl\u2019s object"
    };
    var Y = function (b) {
        this.items = [];
        this.length = 0;
        this.type = "set";
        if (b) {
            for (var d = 0, g = b.length; d < g; d++) {
                if (b[d] && (b[d].constructor == ap.constructor || b[d].constructor == Y)) {
                    this[this.items.length] = this.items[this.items.length] = b[d];
                    this.length++
                }
            }
        }
    }, v = Y.prototype;
    v.push = function () {
        var E, b;
        for (var d = 0, g = arguments.length; d < g; d++) {
            E = arguments[d];
            if (E && (E.constructor == ap.constructor || E.constructor == Y)) {
                b = this.items.length;
                this[b] = this.items[b] = E;
                this.length++
            }
        }
        return this
    };
    v.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop()
    };
    v.forEach = function (E, b) {
        for (var d = 0, g = this.items.length; d < g; d++) {
            if (E.call(b, this.items[d], d) === false) {
                return this
            }
        }
        return this
    };
    for (var aE in ap) {
        if (ap[bv](aE)) {
            v[aE] = (function (b) {
                return function () {
                    var d = arguments;
                    return this.forEach(function (g) {
                        g[b][br](g, d)
                    })
                }
            })(aE)
        }
    }
    v.attr = function (d, S) {
        if (d && bh.is(d, u) && bh.is(d[0], "object")) {
            for (var b = 0, R = d.length; b < R; b++) {
                this.items[b].attr(d[b])
            }
        } else {
            for (var g = 0, E = this.items.length; g < E; g++) {
                this.items[g].attr(d, S)
            }
        }
        return this
    };
    v.clear = function () {
        while (this.length) {
            this.pop()
        }
    };
    v.splice = function (E, bN, bO) {
        E = E < 0 ? bH(this.length + E, 0) : E;
        bN = bH(0, ah(this.length - E, bN));
        var g = [], b = [], d = [], R;
        for (R = 2; R < arguments.length; R++) {
            d.push(arguments[R])
        }
        for (R = 0; R < bN; R++) {
            b.push(this[E + R])
        }
        for (; R < this.length - E; R++) {
            g.push(this[E + R])
        }
        var S = d.length;
        for (R = 0; R < S + g.length; R++) {
            this.items[E + R] = this[E + R] = R < S ? d[R] : g[R - S]
        }
        R = this.items.length = this.length -= bN - S;
        while (this[R]) {
            delete this[R++]
        }
        return new Y(b)
    };
    v.exclude = function (g) {
        for (var b = 0, d = this.length; b < d; b++) {
            if (this[b] == g) {
                this.splice(b, 1);
                return true
            }
        }
    };
    v.animate = function (g, b, bN, bP) {
        (bh.is(bN, "function") || !bN) && (bP = bN || null);
        var S = this.items.length, E = S, bQ, bO = this, R;
        if (!S) {
            return this
        }
        bP && (R = function () {
            !--S && bP.call(bO)
        });
        bN = bh.is(bN, a) ? bN : R;
        var d = bh.animation(g, b, bN, R);
        bQ = this.items[--E].animate(d);
        while (E--) {
            this.items[E] && !this.items[E].removed && this.items[E].animateWith(bQ, d, d);
            (this.items[E] && !this.items[E].removed) || S--
        }
        return this
    };
    v.insertAfter = function (d) {
        var b = this.items.length;
        while (b--) {
            this.items[b].insertAfter(d)
        }
        return this
    };
    v.getBBox = function () {
        var b = [], S = [], d = [], E = [];
        for (var g = this.items.length; g--;) {
            if (!this.items[g].removed) {
                var R = this.items[g].getBBox();
                b.push(R.x);
                S.push(R.y);
                d.push(R.x + R.width);
                E.push(R.y + R.height)
            }
        }
        b = ah[br](0, b);
        S = ah[br](0, S);
        d = bH[br](0, d);
        E = bH[br](0, E);
        return {x: b, y: S, x2: d, y2: E, width: d - b, height: E - S}
    };
    v.clone = function (g) {
        g = this.paper.set();
        for (var b = 0, d = this.items.length; b < d; b++) {
            g.push(this.items[b].clone())
        }
        return g
    };
    v.toString = function () {
        return "Rapha\xebl\u2018s set"
    };
    v.glow = function (d) {
        var b = this.paper.set();
        this.forEach(function (i, E) {
            var R = i.glow(d);
            if (R != null) {
                R.forEach(function (g, S) {
                    b.push(g)
                })
            }
        });
        return b
    };
    v.isPointInside = function (b, g) {
        var d = false;
        this.forEach(function (i) {
            if (i.isPointInside(b, g)) {
                console.log("runned");
                d = true;
                return false
            }
        });
        return d
    };
    bh.registerFont = function (d) {
        if (!d.face) {
            return d
        }
        this.fonts = this.fonts || {};
        var i = {w: d.w, face: {}, glyphs: {}}, g = d.face["font-family"];
        for (var S in d.face) {
            if (d.face[bv](S)) {
                i.face[S] = d.face[S]
            }
        }
        if (this.fonts[g]) {
            this.fonts[g].push(i)
        } else {
            this.fonts[g] = [i]
        }
        if (!d.svg) {
            i.face["units-per-em"] = bJ(d.face["units-per-em"], 10);
            for (var E in d.glyphs) {
                if (d.glyphs[bv](E)) {
                    var R = d.glyphs[E];
                    i.glyphs[E] = {
                        w: R.w, k: {}, d: R.d && "M" + R.d.replace(/[mlcxtrv]/g, function (bN) {
                            return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[bN] || "M"
                        }) + "z"
                    };
                    if (R.k) {
                        for (var b in R.k) {
                            if (R[bv](b)) {
                                i.glyphs[E].k[b] = R.k[b]
                            }
                        }
                    }
                }
            }
        }
        return d
    };
    an.getFont = function (bO, bP, d, E) {
        E = E || "normal";
        d = d || "normal";
        bP = +bP || {normal: 400, bold: 700, lighter: 300, bolder: 800}[bP] || 400;
        if (!bh.fonts) {
            return
        }
        var R = bh.fonts[bO];
        if (!R) {
            var g = new RegExp("(^|\\s)" + bO.replace(/[^\w\d\s+!~.:_-]/g, bm) + "(\\s|$)", "i");
            for (var b in bh.fonts) {
                if (bh.fonts[bv](b)) {
                    if (g.test(b)) {
                        R = bh.fonts[b];
                        break
                    }
                }
            }
        }
        var S;
        if (R) {
            for (var bN = 0, bQ = R.length; bN < bQ; bN++) {
                S = R[bN];
                if (S.face["font-weight"] == bP && (S.face["font-style"] == d || !S.face["font-style"]) && S.face["font-stretch"] == E) {
                    break
                }
            }
        }
        return S
    };
    an.print = function (bO, bN, b, bR, bT, b1, g, d) {
        b1 = b1 || "middle";
        g = bH(ah(g || 0, 1), -1);
        d = bH(ah(d || 1, 3), 1);
        var b0 = k(b)[l](bm), bX = 0, bZ = 0, bV = bm, b2;
        bh.is(bR, "string") && (bR = this.getFont(bR));
        if (bR) {
            b2 = (bT || 16) / bR.face["units-per-em"];
            var R = bR.face.bbox[l](bu), bQ = +R[0], E = R[3] - R[1], S = 0, bS = +R[1] + (b1 == "baseline" ? E + (+bR.face.descent) : E / 2);
            for (var bW = 0, bP = b0.length; bW < bP; bW++) {
                if (b0[bW] == "\n") {
                    bX = 0;
                    bY = 0;
                    bZ = 0;
                    S += E * d
                } else {
                    var bU = bZ && bR.glyphs[b0[bW - 1]] || {}, bY = bR.glyphs[b0[bW]];
                    bX += bZ ? (bU.w || bR.w) + (bU.k && bU.k[b0[bW]] || 0) + (bR.w * g) : 0;
                    bZ = 1
                }
                if (bY && bY.d) {
                    bV += bh.transformPath(bY.d, ["t", bX * b2, S * b2, "s", b2, b2, bQ, bS, "t", (bO - bQ) / b2, (bN - bS) / b2])
                }
            }
        }
        return this.path(bV).attr({fill: "#000", stroke: "none"})
    };
    an.add = function (E) {
        if (bh.is(E, "array")) {
            var g = this.set(), d = 0, R = E.length, b;
            for (; d < R; d++) {
                b = E[d] || {};
                at[bv](b.type) && g.push(this[b.type]().attr(b))
            }
        }
        return g
    };
    bh.format = function (d, g) {
        var b = bh.is(g, u) ? [0][au](g) : arguments;
        d && bh.is(d, a) && b.length - 1 && (d = d.replace(W, function (R, E) {
            return b[++E] == null ? bm : b[E]
        }));
        return d || bm
    };
    bh.fullfill = (function () {
        var g = /\{([^\}]+)\}/g, b = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, d = function (R, E, S) {
            var i = S;
            E.replace(b, function (bP, bO, bN, bR, bQ) {
                bO = bO || bR;
                if (i) {
                    if (bO in i) {
                        i = i[bO]
                    }
                    typeof i == "function" && bQ && (i = i())
                }
            });
            i = (i == null || i == S ? R : i) + "";
            return i
        };
        return function (E, i) {
            return String(E).replace(g, function (S, R) {
                return d(S, R, i)
            })
        }
    })();
    bh.ninja = function () {
        aD.was ? (a4.win.Raphael = aD.is) : delete Raphael;
        return bh
    };
    bh.st = v;
    (function (i, d, g) {
        if (i.readyState == null && i.addEventListener) {
            i.addEventListener(d, g = function () {
                i.removeEventListener(d, g, false);
                i.readyState = "complete"
            }, false);
            i.readyState = "loading"
        }
        function b() {
            (/in/).test(i.readyState) ? setTimeout(b, 9) : bh.eve("raphael.DOMload")
        }

        b()
    })(document, "DOMContentLoaded");
    bb.on("raphael.DOMload", function () {
        K = true
    });
    (function () {
        if (!bh.svg) {
            return
        }
        var i = "hasOwnProperty", b9 = String, bU = parseFloat, bX = parseInt, bN = Math, ca = bN.max, bZ = bN.abs, bP = bN.pow, bO = /[, ]+/, b7 = bh.eve, bY = "", bR = " ";
        var bV = "http://www.w3.org/1999/xlink", b5 = {
            block: "M5,0 0,2.5 5,5z",
            classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
            diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
            open: "M6,1 1,3.5 6,6",
            oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
        }, b1 = {};
        bh.toString = function () {
            return "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version
        };
        var b6 = aS.navigator.appName;
        var bQ = function (cb, E) {
            if (E) {
                if (typeof cb == "string") {
                    cb = bQ(cb)
                }
                for (var S in E) {
                    if (E[i](S)) {
                        if (S.substring(0, 6) == "xlink:") {
                            cb.setAttributeNS(bV, S.substring(6), b9(E[S]))
                        } else {
                            cb.setAttribute(S, b9(E[S]))
                        }
                    }
                }
            } else {
                cb = bh._g.doc.createElementNS("http://www.w3.org/2000/svg", cb);
                cb.style && (cb.style.webkitTapHighlightColor = "rgba(0,0,0,0)")
            }
            return cb
        }, b = function (ci, cm) {
            var ck = "linear", S = ci.id + cm, cg = 0.5, ce = 0.5, cc = ci.node, E = ci.paper, co = cc.style, cb = bh._g.doc.getElementById(S);
            if (!cb) {
                cm = b9(cm).replace(bh._radial_gradient, function (cr, cp, cs) {
                    ck = "radial";
                    if (cp && cs) {
                        cg = bU(cp);
                        ce = bU(cs);
                        var cq = ((ce > 0.5) * 2 - 1);
                        bP(cg - 0.5, 2) + bP(ce - 0.5, 2) > 0.25 && (ce = bN.sqrt(0.25 - bP(cg - 0.5, 2)) * cq + 0.5) && ce != 0.5 && (ce = ce.toFixed(5) - 0.00001 * cq)
                    }
                    return bY
                });
                cm = cm.split(/\s*\-\s*/);
                if (ck == "linear") {
                    var cf = cm.shift();
                    cf = -bU(cf);
                    if (isNaN(cf)) {
                        return null
                    }
                    var cd = [0, 0, bN.cos(bh.rad(cf)), bN.sin(bh.rad(cf))], cl = 1 / (ca(bZ(cd[2]), bZ(cd[3])) || 1);
                    cd[2] *= cl;
                    cd[3] *= cl;
                    if (cd[2] < 0) {
                        cd[0] = -cd[2];
                        cd[2] = 0
                    }
                    if (cd[3] < 0) {
                        cd[1] = -cd[3];
                        cd[3] = 0
                    }
                }
                var cj = bh._parseDots(cm);
                if (!cj) {
                    return null
                }
                S = S.replace(/[\(\)\s,\xb0#]/g, "_");
                if (ci.gradient && S != ci.gradient.id) {
                    E.defs.removeChild(ci.gradient);
                    delete ci.gradient
                }
                if (!ci.gradient) {
                    cb = bQ(ck + "Gradient", {id: S});
                    ci.gradient = cb;
                    bQ(cb, ck == "radial" ? {fx: cg, fy: ce} : {
                        x1: cd[0],
                        y1: cd[1],
                        x2: cd[2],
                        y2: cd[3],
                        gradientTransform: ci.matrix.invert()
                    });
                    E.defs.appendChild(cb);
                    for (var ch = 0, cn = cj.length; ch < cn; ch++) {
                        cb.appendChild(bQ("stop", {
                            offset: cj[ch].offset ? cj[ch].offset : ch ? "100%" : "0%",
                            "stop-color": cj[ch].color || "#fff"
                        }))
                    }
                }
            }
            bQ(cc, {fill: "url(#" + S + ")", opacity: 1, "fill-opacity": 1});
            co.fill = bY;
            co.opacity = 1;
            co.fillOpacity = 1;
            return 1
        }, d = function (S) {
            var E = S.getBBox(1);
            if (b6 != null && b6 !== "Microsoft Internet Explorer") {
                bQ(S.pattern, {patternTransform: S.matrix.invert() + " translate(" + E.x + "," + E.y + ")"})
            }
        }, g = function (ck, cm, cf) {
            if (ck.type == "path") {
                var E = b9(cm).toLowerCase().split("-"), cj = ck.paper, cx = cf ? "end" : "start", co = ck.node, cl = ck.attrs, ce = cl["stroke-width"], cs = E.length, cc = "classic", cr, cb, ch, cp, cn, cg = 3, ct = 3, ci = 5;
                while (cs--) {
                    switch (E[cs]) {
                        case"block":
                        case"classic":
                        case"oval":
                        case"diamond":
                        case"open":
                        case"none":
                            cc = E[cs];
                            break;
                        case"wide":
                            ct = 5;
                            break;
                        case"narrow":
                            ct = 2;
                            break;
                        case"long":
                            cg = 5;
                            break;
                        case"short":
                            cg = 2;
                            break
                    }
                }
                if (cc == "open") {
                    cg += 2;
                    ct += 2;
                    ci += 2;
                    ch = 1;
                    cp = cf ? 4 : 1;
                    cn = {fill: "none", stroke: cl.stroke}
                } else {
                    cp = ch = cg / 2;
                    cn = {fill: cl.stroke, stroke: "none"}
                }
                if (ck._.arrows) {
                    if (cf) {
                        ck._.arrows.endPath && b1[ck._.arrows.endPath]--;
                        ck._.arrows.endMarker && b1[ck._.arrows.endMarker]--
                    } else {
                        ck._.arrows.startPath && b1[ck._.arrows.startPath]--;
                        ck._.arrows.startMarker && b1[ck._.arrows.startMarker]--
                    }
                } else {
                    ck._.arrows = {}
                }
                if (cc != "none") {
                    var S = "raphael-marker-" + cc, cw = "raphael-marker-" + cx + cc + cg + ct;
                    if (!bh._g.doc.getElementById(S)) {
                        cj.defs.appendChild(bQ(bQ("path"), {"stroke-linecap": "round", d: b5[cc], id: S}));
                        b1[S] = 1
                    } else {
                        b1[S]++
                    }
                    var cd = bh._g.doc.getElementById(cw), cq;
                    if (!cd) {
                        cd = bQ(bQ("marker"), {
                            id: cw,
                            markerHeight: ct,
                            markerWidth: cg,
                            orient: "auto",
                            refX: cp,
                            refY: ct / 2
                        });
                        cq = bQ(bQ("use"), {
                            "xlink:href": "#" + S,
                            transform: (cf ? "rotate(180 " + cg / 2 + " " + ct / 2 + ") " : bY) + "scale(" + cg / ci + "," + ct / ci + ")",
                            "stroke-width": (1 / ((cg / ci + ct / ci) / 2)).toFixed(4)
                        });
                        cd.appendChild(cq);
                        cj.defs.appendChild(cd);
                        b1[cw] = 1
                    } else {
                        b1[cw]++;
                        cq = cd.getElementsByTagName("use")[0]
                    }
                    bQ(cq, cn);
                    var cv = ch * (cc != "diamond" && cc != "oval");
                    if (cf) {
                        cr = ck._.arrows.startdx * ce || 0;
                        cb = bh.getTotalLength(cl.path) - cv * ce
                    } else {
                        cr = cv * ce;
                        cb = bh.getTotalLength(cl.path) - (ck._.arrows.enddx * ce || 0)
                    }
                    cn = {};
                    cn["marker-" + cx] = "url(#" + cw + ")";
                    if (cb || cr) {
                        cn.d = bh.getSubpath(cl.path, cr, cb)
                    }
                    bQ(co, cn);
                    ck._.arrows[cx + "Path"] = S;
                    ck._.arrows[cx + "Marker"] = cw;
                    ck._.arrows[cx + "dx"] = cv;
                    ck._.arrows[cx + "Type"] = cc;
                    ck._.arrows[cx + "String"] = cm
                } else {
                    if (cf) {
                        cr = ck._.arrows.startdx * ce || 0;
                        cb = bh.getTotalLength(cl.path) - cr
                    } else {
                        cr = 0;
                        cb = bh.getTotalLength(cl.path) - (ck._.arrows.enddx * ce || 0)
                    }
                    ck._.arrows[cx + "Path"] && bQ(co, {d: bh.getSubpath(cl.path, cr, cb)});
                    delete ck._.arrows[cx + "Path"];
                    delete ck._.arrows[cx + "Marker"];
                    delete ck._.arrows[cx + "dx"];
                    delete ck._.arrows[cx + "Type"];
                    delete ck._.arrows[cx + "String"]
                }
                for (cn in b1) {
                    if (b1[i](cn) && !b1[cn]) {
                        var cu = bh._g.doc.getElementById(cn);
                        cu && cu.parentNode.removeChild(cu)
                    }
                }
            }
        }, b2 = {
            "": [0],
            none: [0],
            "-": [3, 1],
            ".": [1, 1],
            "-.": [3, 1, 1, 1],
            "-..": [3, 1, 1, 1, 1, 1],
            ". ": [1, 3],
            "- ": [4, 3],
            "--": [8, 3],
            "- .": [4, 3, 1, 3],
            "--.": [8, 3, 1, 3],
            "--..": [8, 3, 1, 3, 1, 3]
        }, bS = function (cf, cd, ce) {
            cd = b2[b9(cd).toLowerCase()];
            if (cd) {
                var cb = cf.attrs["stroke-width"] || "1", E = {
                        round: cb,
                        square: cb,
                        butt: 0
                    }[cf.attrs["stroke-linecap"] || ce["stroke-linecap"]] || 0, cc = [], S = cd.length;
                while (S--) {
                    cc[S] = cd[S] * cb + ((S % 2) ? 1 : -1) * E
                }
                bQ(cf.node, {"stroke-dasharray": cc.join(",")})
            }
        }, b3 = function (ck, cs) {
            var co = ck.node, cl = ck.attrs, ci = co.style.visibility;
            co.style.visibility = "hidden";
            for (var cn in cs) {
                if (cs[i](cn)) {
                    if (!bh._availableAttrs[i](cn)) {
                        continue
                    }
                    var cm = cs[cn];
                    cl[cn] = cm;
                    switch (cn) {
                        case"blur":
                            ck.blur(cm);
                            break;
                        case"href":
                        case"title":
                        case"target":
                            var cq = co.parentNode;
                            if (cq.tagName.toLowerCase() != "a") {
                                var cd = bQ("a");
                                cq.insertBefore(cd, co);
                                cd.appendChild(co);
                                cq = cd
                            }
                            if (cn == "target") {
                                cq.setAttributeNS(bV, "show", cm == "blank" ? "new" : cm)
                            } else {
                                cq.setAttributeNS(bV, cn, cm)
                            }
                            break;
                        case"cursor":
                            co.style.cursor = cm;
                            break;
                        case"transform":
                            ck.transform(cm);
                            break;
                        case"arrow-start":
                            g(ck, cm);
                            break;
                        case"arrow-end":
                            g(ck, cm, 1);
                            break;
                        case"clip-rect":
                            var S = b9(cm).split(bO);
                            if (S.length == 4) {
                                ck.clip && ck.clip.parentNode.parentNode.removeChild(ck.clip.parentNode);
                                var cb = bQ("clipPath"), cp = bQ("rect");
                                cb.id = bh.createUUID();
                                bQ(cp, {x: S[0], y: S[1], width: S[2], height: S[3]});
                                cb.appendChild(cp);
                                ck.paper.defs.appendChild(cb);
                                bQ(co, {"clip-path": "url(#" + cb.id + ")"});
                                ck.clip = cp
                            }
                            if (!cm) {
                                var cj = co.getAttribute("clip-path");
                                if (cj) {
                                    var cr = bh._g.doc.getElementById(cj.replace(/(^url\(#|\)$)/g, bY));
                                    cr && cr.parentNode.removeChild(cr);
                                    bQ(co, {"clip-path": bY});
                                    delete ck.clip
                                }
                            }
                            break;
                        case"path":
                            if (ck.type == "path") {
                                bQ(co, {d: cm ? cl.path = bh._pathToAbsolute(cm) : "M0,0"});
                                ck._.dirty = 1;
                                if (ck._.arrows) {
                                    "startString" in ck._.arrows && g(ck, ck._.arrows.startString);
                                    "endString" in ck._.arrows && g(ck, ck._.arrows.endString, 1)
                                }
                            }
                            break;
                        case"width":
                            co.setAttribute(cn, cm);
                            ck._.dirty = 1;
                            if (cl.fx) {
                                cn = "x";
                                cm = cl.x
                            } else {
                                break
                            }
                        case"x":
                            if (cl.fx) {
                                cm = -cl.x - (cl.width || 0)
                            }
                        case"rx":
                            if (cn == "rx" && ck.type == "rect") {
                                break
                            }
                        case"cx":
                            co.setAttribute(cn, cm);
                            ck.pattern && d(ck);
                            ck._.dirty = 1;
                            break;
                        case"height":
                            co.setAttribute(cn, cm);
                            ck._.dirty = 1;
                            if (cl.fy) {
                                cn = "y";
                                cm = cl.y
                            } else {
                                break
                            }
                        case"y":
                            if (cl.fy) {
                                cm = -cl.y - (cl.height || 0)
                            }
                        case"ry":
                            if (cn == "ry" && ck.type == "rect") {
                                break
                            }
                        case"cy":
                            co.setAttribute(cn, cm);
                            ck.pattern && d(ck);
                            ck._.dirty = 1;
                            break;
                        case"r":
                            if (ck.type == "rect") {
                                bQ(co, {rx: cm, ry: cm})
                            } else {
                                co.setAttribute(cn, cm)
                            }
                            ck._.dirty = 1;
                            break;
                        case"src":
                            if (ck.type == "image") {
                                co.setAttributeNS(bV, "href", cm)
                            }
                            break;
                        case"stroke-width":
                            if (ck._.sx != 1 || ck._.sy != 1) {
                                cm /= ca(bZ(ck._.sx), bZ(ck._.sy)) || 1
                            }
                            if (ck.paper._vbSize) {
                                cm *= ck.paper._vbSize
                            }
                            co.setAttribute(cn, cm);
                            if (cl["stroke-dasharray"]) {
                                bS(ck, cl["stroke-dasharray"], cs)
                            }
                            if (ck._.arrows) {
                                "startString" in ck._.arrows && g(ck, ck._.arrows.startString);
                                "endString" in ck._.arrows && g(ck, ck._.arrows.endString, 1)
                            }
                            break;
                        case"stroke-dasharray":
                            bS(ck, cm, cs);
                            break;
                        case"fill":
                            var ce = b9(cm).match(bh._ISURL);
                            if (ce) {
                                cb = bQ("pattern");
                                var ch = bQ("image");
                                cb.id = bh.createUUID();
                                if (b6 != null && b6 == "Microsoft Internet Explorer") {
                                    bQ(cb, {
                                        x: 24,
                                        y: 24,
                                        height: 1,
                                        width: 1,
                                        patternContentUnits: "objectBoundingBox"
                                    });
                                    bQ(ch, {width: 1, height: 1, preserveAspectRatio: "none", "xlink:href": ce[1]})
                                } else {
                                    bQ(cb, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                                    bQ(ch, {x: 0, y: 0, "xlink:href": ce[1]});
                                    (function (ct) {
                                        bh._preload(ce[1], function () {
                                            var cu = cs.img_width, cv = cs.img_height;
                                            cu = cu != null ? cu : this.offsetWidth;
                                            cv = cv != null ? cv : this.offsetHeight;
                                            bQ(ct, {width: cu, height: cv});
                                            bQ(ch, {width: cu, height: cv});
                                            ck.paper.safari()
                                        })
                                    })(cb)
                                }
                                cb.appendChild(ch);
                                ck.paper.defs.appendChild(cb);
                                bQ(co, {fill: "url(#" + cb.id + ")"});
                                ck.pattern = cb;
                                ck.pattern && d(ck);
                                break
                            }
                            var cc = bh.getRGB(cm);
                            if (!cc.error) {
                                delete cs.gradient;
                                delete cl.gradient;
                                !bh.is(cl.opacity, "undefined") && bh.is(cs.opacity, "undefined") && bQ(co, {opacity: cl.opacity});
                                !bh.is(cl["fill-opacity"], "undefined") && bh.is(cs["fill-opacity"], "undefined") && bQ(co, {"fill-opacity": cl["fill-opacity"]});
                                bQ(co, {fill: cl.fill})
                            } else {
                                if ((ck.type == "circle" || ck.type == "ellipse" || b9(cm).charAt() != "r") && b(ck, cm)) {
                                    if ("opacity" in cl || "fill-opacity" in cl) {
                                        var E = bh._g.doc.getElementById(co.getAttribute("fill").replace(/^url\(#|\)$/g, bY));
                                        if (E) {
                                            var cf = E.getElementsByTagName("stop");
                                            bQ(cf[cf.length - 1], {"stop-opacity": ("opacity" in cl ? cl.opacity : 1) * ("fill-opacity" in cl ? cl["fill-opacity"] : 1)})
                                        }
                                    }
                                    cl.gradient = cm;
                                    cl.fill = "none";
                                    break
                                }
                            }
                            cc[i]("opacity") && bQ(co, {"fill-opacity": cc.opacity > 1 ? cc.opacity / 100 : cc.opacity});
                        case"fillfit":
                            var ce = b9(cm).match(bh._ISURL);
                            if (ce) {
                                cb = bQ("pattern");
                                var ch = bQ("image");
                                cb.id = cs.nodeId + "_icon";
                                bQ(cb, {x: 0, y: 0, height: 1, width: 1, patternContentUnits: "objectBoundingBox"});
                                bQ(ch, {
                                    x: 0,
                                    y: 0,
                                    width: 1,
                                    height: 1,
                                    preserveAspectRatio: "none",
                                    "xlink:href": ce[1]
                                });
                                cb.appendChild(ch);
                                ck.paper.defs.appendChild(cb);
                                bQ(co, {fill: "url(#" + cb.id + ")"});
                                ck.pattern = cb;
                                ck.pattern && d(ck)
                            }
                            break;
                        case"stroke":
                            cc = bh.getRGB(cm);
                            co.setAttribute(cn, cc.hex);
                            cn == "stroke" && cc[i]("opacity") && bQ(co, {"stroke-opacity": cc.opacity > 1 ? cc.opacity / 100 : cc.opacity});
                            if (cn == "stroke" && ck._.arrows) {
                                "startString" in ck._.arrows && g(ck, ck._.arrows.startString);
                                "endString" in ck._.arrows && g(ck, ck._.arrows.endString, 1)
                            }
                            break;
                        case"gradient":
                            (ck.type == "circle" || ck.type == "ellipse" || b9(cm).charAt() != "r") && b(ck, cm);
                            break;
                        case"opacity":
                            if (cl.gradient && !cl[i]("stroke-opacity")) {
                                bQ(co, {"stroke-opacity": cm > 1 ? cm / 100 : cm})
                            }
                        case"fill-opacity":
                            if (cl.gradient) {
                                E = bh._g.doc.getElementById(co.getAttribute("fill").replace(/^url\(#|\)$/g, bY));
                                if (E) {
                                    cf = E.getElementsByTagName("stop");
                                    bQ(cf[cf.length - 1], {"stop-opacity": cm})
                                }
                                break
                            }
                        default:
                            cn == "font-size" && (cm = bX(cm, 10) + "px");
                            var cg = cn.replace(/(\-.)/g, function (ct) {
                                return ct.substring(1).toUpperCase()
                            });
                            co.style[cg] = cm;
                            ck._.dirty = 1;
                            co.setAttribute(cn, cm);
                            break
                    }
                }
            }
            bW(ck, cs);
            co.style.visibility = ci
        }, b8 = 1.2, bW = function (E, cd) {
            if (E.type != "text" || !(cd[i]("text") || cd[i]("font") || cd[i]("font-size") || cd[i]("x") || cd[i]("y"))) {
                return
            }
            var ci = E.attrs, cb = E.node, ck = cb.firstChild ? bX(bh._g.doc.defaultView.getComputedStyle(cb.firstChild, bY).getPropertyValue("font-size"), 10) : 10;
            if (cd[i]("text")) {
                ci.text = cd.text;
                while (cb.firstChild) {
                    cb.removeChild(cb.firstChild)
                }
                var cc = b9(cd.text).split("\n"), S = [], cg;
                for (var ce = 0, cj = cc.length; ce < cj; ce++) {
                    cg = bQ("tspan");
                    ce && bQ(cg, {dy: ck * b8, x: ci.x});
                    cg.appendChild(bh._g.doc.createTextNode(cc[ce]));
                    cb.appendChild(cg);
                    S[ce] = cg
                }
            } else {
                S = cb.getElementsByTagName("tspan");
                for (ce = 0, cj = S.length; ce < cj; ce++) {
                    if (ce) {
                        bQ(S[ce], {dy: ck * b8, x: ci.x})
                    } else {
                        bQ(S[0], {dy: 0})
                    }
                }
            }
            bQ(cb, {x: ci.x, y: ci.y});
            E._.dirty = 1;
            var cf = E._getBBox(), ch = ci.y - (cf.y + cf.height / 2);
            ch && bh.is(ch, "finite") && bQ(S[0], {dy: ch})
        }, b0 = function (S, E) {
            var cc = 0, cb = 0;
            this[0] = this.node = S;
            S.raphael = true;
            this.id = bh._oid++;
            S.raphaelid = this.id;
            this.matrix = bh.matrix();
            this.realPath = null;
            this.paper = E;
            this.attrs = this.attrs || {};
            this._ = {transform: [], sx: 1, sy: 1, deg: 0, dx: 0, dy: 0, dirty: 1};
            !E.bottom && (E.bottom = this);
            this.prev = E.top;
            E.top && (E.top.next = this);
            E.top = this;
            this.next = null
        }, bT = bh.el;
        b0.prototype = bT;
        bT.constructor = b0;
        bh._engine.path = function (E, cc) {
            var S = bQ("path");
            cc.canvas && cc.canvas.appendChild(S);
            var cb = new b0(S, cc);
            cb.type = "path";
            b3(cb, {fill: "none", stroke: "#000", path: E});
            return cb
        };
        bT.rotate = function (S, E, cc) {
            if (this.removed) {
                return this
            }
            S = b9(S).split(bO);
            if (S.length - 1) {
                E = bU(S[1]);
                cc = bU(S[2])
            }
            S = bU(S[0]);
            (cc == null) && (E = cc);
            if (E == null || cc == null) {
                var cb = this.getBBox(1);
                E = cb.x + cb.width / 2;
                cc = cb.y + cb.height / 2
            }
            this.transform(this._.transform.concat([["r", S, E, cc]]));
            return this
        };
        bT.scale = function (cd, cb, E, cc) {
            if (this.removed) {
                return this
            }
            cd = b9(cd).split(bO);
            if (cd.length - 1) {
                cb = bU(cd[1]);
                E = bU(cd[2]);
                cc = bU(cd[3])
            }
            cd = bU(cd[0]);
            (cb == null) && (cb = cd);
            (cc == null) && (E = cc);
            if (E == null || cc == null) {
                var S = this.getBBox(1)
            }
            E = E == null ? S.x + S.width / 2 : E;
            cc = cc == null ? S.y + S.height / 2 : cc;
            this.transform(this._.transform.concat([["s", cd, cb, E, cc]]));
            return this
        };
        bT.translate = function (S, E) {
            if (this.removed) {
                return this
            }
            S = b9(S).split(bO);
            if (S.length - 1) {
                E = bU(S[1])
            }
            S = bU(S[0]) || 0;
            E = +E || 0;
            this.transform(this._.transform.concat([["t", S, E]]));
            return this
        };
        bT.transform = function (S) {
            var cb = this._;
            if (S == null) {
                return cb.transform
            }
            bh._extractTransform(this, S);
            this.clip && bQ(this.clip, {transform: this.matrix.invert()});
            this.pattern && d(this);
            this.node && bQ(this.node, {transform: this.matrix});
            if (cb.sx != 1 || cb.sy != 1) {
                var E = this.attrs[i]("stroke-width") ? this.attrs["stroke-width"] : 1;
                this.attr({"stroke-width": E})
            }
            return this
        };
        bT.hide = function () {
            !this.removed && this.paper.safari(this.node.style.display = "none");
            return this
        };
        bT.show = function () {
            !this.removed && this.paper.safari(this.node.style.display = "");
            return this
        };
        bT.remove = function () {
            if (this.removed || !this.node.parentNode) {
                return
            }
            var S = this.paper;
            S.__set__ && S.__set__.exclude(this);
            b7.unbind("raphael.*.*." + this.id);
            if (this.gradient) {
                S.defs.removeChild(this.gradient)
            }
            bh._tear(this, S);
            if (this.node.parentNode.tagName.toLowerCase() == "a") {
                this.node.parentNode.parentNode.removeChild(this.node.parentNode)
            } else {
                this.node.parentNode.removeChild(this.node)
            }
            for (var E in this) {
                this[E] = typeof this[E] == "function" ? bh._removedFactory(E) : null
            }
            this.removed = true
        };
        bT._getBBox = function () {
            if (this.node.style.display == "none") {
                this.show();
                var E = true
            }
            var cb = {};
            try {
                cb = this.node.getBBox()
            } catch (S) {
            } finally {
                cb = cb || {}
            }
            E && this.hide();
            return cb
        };
        bT.attr = function (E, ci) {
            if (this.removed) {
                return this
            }
            if (E == null) {
                var cf = {};
                for (var ch in this.attrs) {
                    if (this.attrs[i](ch)) {
                        cf[ch] = this.attrs[ch]
                    }
                }
                cf.gradient && cf.fill == "none" && (cf.fill = cf.gradient) && delete cf.gradient;
                cf.transform = this._.transform;
                return cf
            }
            if (ci == null && bh.is(E, "string")) {
                if (E == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient
                }
                if (E == "transform") {
                    return this._.transform
                }
                var cg = E.split(bO), cc = {};
                for (var cd = 0, ck = cg.length; cd < ck; cd++) {
                    E = cg[cd];
                    if (E in this.attrs) {
                        cc[E] = this.attrs[E]
                    } else {
                        if (bh.is(this.paper.customAttributes[E], "function")) {
                            cc[E] = this.paper.customAttributes[E].def
                        } else {
                            cc[E] = bh._availableAttrs[E]
                        }
                    }
                }
                return ck - 1 ? cc : cc[cg[0]]
            }
            if (ci == null && bh.is(E, "array")) {
                cc = {};
                for (cd = 0, ck = E.length; cd < ck; cd++) {
                    cc[E[cd]] = this.attr(E[cd])
                }
                return cc
            }
            if (ci != null) {
                var S = {};
                S[E] = ci
            } else {
                if (E != null && bh.is(E, "object")) {
                    S = E
                }
            }
            for (var cj in S) {
                b7("raphael.attr." + cj + "." + this.id, this, S[cj])
            }
            for (cj in this.paper.customAttributes) {
                if (this.paper.customAttributes[i](cj) && S[i](cj) && bh.is(this.paper.customAttributes[cj], "function")) {
                    var ce = this.paper.customAttributes[cj].apply(this, [].concat(S[cj]));
                    this.attrs[cj] = S[cj];
                    for (var cb in ce) {
                        if (ce[i](cb)) {
                            S[cb] = ce[cb]
                        }
                    }
                }
            }
            b3(this, S);
            return this
        };
        bT.toFront = function () {
            if (this.removed) {
                return this
            }
            if (this.node.parentNode.tagName.toLowerCase() == "a") {
                this.node.parentNode.parentNode.appendChild(this.node.parentNode)
            } else {
                this.node.parentNode.appendChild(this.node)
            }
            var E = this.paper;
            E.top != this && bh._tofront(this, E);
            return this
        };
        bT.toBack = function () {
            if (this.removed) {
                return this
            }
            var S = this.node.parentNode;
            if (S.tagName.toLowerCase() == "a") {
                S.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild)
            } else {
                if (S.firstChild != this.node) {
                    S.insertBefore(this.node, this.node.parentNode.firstChild)
                }
            }
            bh._toback(this, this.paper);
            var E = this.paper;
            return this
        };
        bT.insertAfter = function (E) {
            if (this.removed) {
                return this
            }
            var S = E.node || E[E.length - 1].node;
            if (S.nextSibling) {
                S.parentNode.insertBefore(this.node, S.nextSibling)
            } else {
                S.parentNode.appendChild(this.node)
            }
            bh._insertafter(this, E, this.paper);
            return this
        };
        bT.insertBefore = function (E) {
            if (this.removed) {
                return this
            }
            var S = E.node || E[0].node;
            S.parentNode.insertBefore(this.node, S);
            bh._insertbefore(this, E, this.paper);
            return this
        };
        bT.blur = function (S) {
            var E = this;
            if (+S !== 0) {
                var cb = bQ("filter"), cc = bQ("feGaussianBlur");
                E.attrs.blur = S;
                cb.id = bh.createUUID();
                bQ(cc, {stdDeviation: +S || 1.5});
                cb.appendChild(cc);
                E.paper.defs.appendChild(cb);
                E._blur = cb;
                bQ(E.node, {filter: "url(#" + cb.id + ")"})
            } else {
                if (E._blur) {
                    E._blur.parentNode.removeChild(E._blur);
                    delete E._blur;
                    delete E.attrs.blur
                }
                E.node.removeAttribute("filter")
            }
            return E
        };
        bh._engine.circle = function (S, E, ce, cd) {
            var cc = bQ("circle");
            S.canvas && S.canvas.appendChild(cc);
            var cb = new b0(cc, S);
            cb.attrs = {cx: E, cy: ce, r: cd, fill: "none", stroke: "#000"};
            cb.type = "circle";
            bQ(cc, cb.attrs);
            return cb
        };
        bh._engine.rect = function (cb, E, cg, S, ce, cf) {
            var cd = bQ("rect");
            cb.canvas && cb.canvas.appendChild(cd);
            var cc = new b0(cd, cb);
            cc.attrs = {
                x: E,
                y: cg,
                width: S,
                height: ce,
                r: cf || 0,
                rx: cf || 0,
                ry: cf || 0,
                fill: "none",
                stroke: "#000"
            };
            cc.type = "rect";
            bQ(cd, cc.attrs);
            return cc
        };
        bh._engine.ellipse = function (S, E, cf, ce, cd) {
            var cc = bQ("ellipse");
            S.canvas && S.canvas.appendChild(cc);
            var cb = new b0(cc, S);
            cb.attrs = {cx: E, cy: cf, rx: ce, ry: cd, fill: "none", stroke: "#000"};
            cb.type = "ellipse";
            bQ(cc, cb.attrs);
            return cb
        };
        bh._engine.image = function (cb, cf, E, cg, S, ce) {
            var cd = bQ("image");
            bQ(cd, {x: E, y: cg, width: S, height: ce, preserveAspectRatio: "none"});
            cd.setAttributeNS(bV, "href", cf);
            cb.canvas && cb.canvas.appendChild(cd);
            var cc = new b0(cd, cb);
            cc.attrs = {x: E, y: cg, width: S, height: ce, src: cf};
            cc.type = "image";
            return cc
        };
        bh._engine.text = function (S, E, ce, cd) {
            var cc = bQ("text");
            S.canvas && S.canvas.appendChild(cc);
            var cb = new b0(cc, S);
            cb.attrs = {
                x: E,
                y: ce,
                "text-anchor": "middle",
                text: cd,
                font: bh._availableAttrs.font,
                stroke: "none",
                fill: "#000"
            };
            cb.type = "text";
            b3(cb, cb.attrs);
            return cb
        };
        bh._engine.setSize = function (S, E) {
            this.width = S || this.width;
            this.height = E || this.height;
            this.canvas.setAttribute("width", this.width);
            this.canvas.setAttribute("height", this.height);
            if (this._viewBox) {
                this.setViewBox.apply(this, this._viewBox)
            }
            return this
        };
        bh._engine.create = function () {
            var cc = bh._getContainer.apply(0, arguments), S = cc && cc.container, cg = cc.x, cf = cc.y, cb = cc.width, ch = cc.height;
            if (!S) {
                throw new Error("SVG container not found.")
            }
            var E = bQ("svg"), ce = "overflow:hidden;", cd;
            cg = cg || 0;
            cf = cf || 0;
            cb = cb || 512;
            ch = ch || 342;
            bQ(E, {height: ch, version: 1.1, width: cb, xmlns: "http://www.w3.org/2000/svg"});
            if (S == 1) {
                E.style.cssText = ce + "position:absolute;left:" + cg + "px;top:" + cf + "px";
                bh._g.doc.body.appendChild(E);
                cd = 1
            } else {
                E.style.cssText = ce + "position:relative";
                if (S.firstChild) {
                    S.insertBefore(E, S.firstChild)
                } else {
                    S.appendChild(E)
                }
            }
            S = new bh._Paper;
            S.width = cb;
            S.height = ch;
            S.canvas = E;
            S.clear();
            S._left = S._top = 0;
            cd && (S.renderfix = function () {
            });
            S.renderfix();
            return S
        };
        bh._engine.setViewBox = function (ce, cc, cg, E, S) {
            b7("raphael.setViewBox", this, this._viewBox, [ce, cc, cg, E, S]);
            var ci = ca(cg / this.width, E / this.height), cd = this.top, ch = S ? "meet" : "xMinYMin", cb, cf;
            if (ce == null) {
                if (this._vbSize) {
                    ci = 1
                }
                delete this._vbSize;
                cb = "0 0 " + this.width + bR + this.height
            } else {
                this._vbSize = ci;
                cb = ce + bR + cc + bR + cg + bR + E
            }
            bQ(this.canvas, {viewBox: cb, preserveAspectRatio: ch});
            while (ci && cd) {
                cf = "stroke-width" in cd.attrs ? cd.attrs["stroke-width"] : 1;
                cd.attr({"stroke-width": cf});
                cd._.dirty = 1;
                cd._.dirtyT = 1;
                cd = cd.prev
            }
            this._viewBox = [ce, cc, cg, E, !!S];
            return this
        };
        bh.prototype.renderfix = function () {
            var ce = this.canvas, E = ce.style, cd;
            try {
                cd = ce.getScreenCTM() || ce.createSVGMatrix()
            } catch (cc) {
                cd = ce.createSVGMatrix()
            }
            var cb = -cd.e % 1, S = -cd.f % 1;
            if (cb || S) {
                if (cb) {
                    this._left = (this._left + cb) % 1;
                    E.left = this._left + "px"
                }
                if (S) {
                    this._top = (this._top + S) % 1;
                    E.top = this._top + "px"
                }
            }
        };
        bh.prototype.clear = function () {
            bh.eve("raphael.clear", this);
            var E = this.canvas;
            while (E.firstChild) {
                E.removeChild(E.firstChild)
            }
            this.bottom = this.top = null;
            E.appendChild(this.defs = bQ("defs"))
        };
        bh.prototype.remove = function () {
            b7("raphael.remove", this);
            this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
            for (var E in this) {
                this[E] = typeof this[E] == "function" ? bh._removedFactory(E) : null
            }
        };
        var b4 = bh.st;
        for (var R in bT) {
            if (bT[i](R) && !b4[i](R)) {
                b4[R] = (function (E) {
                    return function () {
                        var S = arguments;
                        return this.forEach(function (cb) {
                            cb[E].apply(cb, S)
                        })
                    }
                })(R)
            }
        }
    })();
    (function () {
        if (!bh.vml) {
            return
        }
        var R = "hasOwnProperty", cb = String, bU = parseFloat, bP = Math, b8 = bP.round, ce = bP.max, b9 = bP.min, bZ = bP.abs, b2 = "fill", bQ = /[, ]+/, b7 = bh.eve, b3 = " progid:DXImageTransform.Microsoft", bS = " ", bX = "", ca = {
            M: "m",
            L: "l",
            C: "c",
            Z: "x",
            m: "t",
            l: "r",
            c: "v",
            z: "x"
        }, bR = /([clmz]),?([^clmz]*)/gi, b0 = / progid:\S+Blur\([^\)]+\)/g, cd = /-?[^,\s-]+/g, i = "position:absolute;left:0;top:0;width:1px;height:1px", d = 21600, b6 = {
            path: 1,
            rect: 1,
            image: 1
        }, bY = {circle: 1, ellipse: 1}, bN = function (cn) {
            var ck = /[ahqstv]/ig, cf = bh._pathToAbsolute;
            cb(cn).match(ck) && (cf = bh._path2curve);
            ck = /[clmz]/g;
            if (cf == bh._pathToAbsolute && !cb(cn).match(ck)) {
                var cj = cb(cn).replace(bR, function (cr, ct, cp) {
                    var cs = [], co = ct.toLowerCase() == "m", cq = ca[ct];
                    cp.replace(cd, function (cu) {
                        if (co && cs.length == 2) {
                            cq += cs + ca[ct == "m" ? "l" : "L"];
                            cs = []
                        }
                        cs.push(b8(cu * d))
                    });
                    return cq + cs
                });
                return cj
            }
            var cl = cf(cn), S, E;
            cj = [];
            for (var ch = 0, cm = cl.length; ch < cm; ch++) {
                S = cl[ch];
                E = cl[ch][0].toLowerCase();
                E == "z" && (E = "x");
                for (var cg = 1, ci = S.length; cg < ci; cg++) {
                    E += b8(S[cg] * d) + (cg != ci - 1 ? "," : bX)
                }
                cj.push(E)
            }
            return cj.join(bS)
        }, bV = function (cg, cf, S) {
            var E = bh.matrix();
            E.rotate(-cg, 0.5, 0.5);
            return {dx: E.x(cf, S), dy: E.y(cf, S)}
        }, bW = function (cm, cl, ck, ch, cg, ci) {
            var cu = cm._, co = cm.matrix, E = cu.fillpos, cn = cm.node, cj = cn.style, cf = 1, S = "", cq, cs = d / cl, cr = d / ck;
            cj.visibility = "hidden";
            if (!cl || !ck) {
                return
            }
            cn.coordsize = bZ(cs) + bS + bZ(cr);
            cj.rotation = ci * (cl * ck < 0 ? -1 : 1);
            if (ci) {
                var ct = bV(ci, ch, cg);
                ch = ct.dx;
                cg = ct.dy
            }
            cl < 0 && (S += "x");
            ck < 0 && (S += " y") && (cf = -1);
            cj.flip = S;
            cn.coordorigin = (ch * -cs) + bS + (cg * -cr);
            if (E || cu.fillsize) {
                var cp = cn.getElementsByTagName(b2);
                cp = cp && cp[0];
                cn.removeChild(cp);
                if (E) {
                    ct = bV(ci, co.x(E[0], E[1]), co.y(E[0], E[1]));
                    cp.position = ct.dx * cf + bS + ct.dy * cf
                }
                if (cu.fillsize) {
                    cp.size = cu.fillsize[0] * bZ(cl) + bS + cu.fillsize[1] * bZ(ck)
                }
                cn.appendChild(cp)
            }
            cj.visibility = "visible"
        };
        bh.toString = function () {
            return "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version
        };
        var g = function (E, cj, S) {
            var cl = cb(cj).toLowerCase().split("-"), ch = S ? "end" : "start", cf = cl.length, ci = "classic", ck = "medium", cg = "medium";
            while (cf--) {
                switch (cl[cf]) {
                    case"block":
                    case"classic":
                    case"oval":
                    case"diamond":
                    case"open":
                    case"none":
                        ci = cl[cf];
                        break;
                    case"wide":
                    case"narrow":
                        cg = cl[cf];
                        break;
                    case"long":
                    case"short":
                        ck = cl[cf];
                        break
                }
            }
            var cm = E.node.getElementsByTagName("stroke")[0];
            cm[ch + "arrow"] = ci;
            cm[ch + "arrowlength"] = ck;
            cm[ch + "arrowwidth"] = cg
        }, b4 = function (cJ, S) {
            cJ.attrs = cJ.attrs || {};
            var cB = cJ.node, cP = cJ.attrs, cI = cB.style, cz, cC = b6[cJ.type] && (S.x != cP.x || S.y != cP.y || S.width != cP.width || S.height != cP.height || S.cx != cP.cx || S.cy != cP.cy || S.rx != cP.rx || S.ry != cP.ry || S.r != cP.r), cF = bY[cJ.type] && (cP.cx != S.cx || cP.cy != S.cy || cP.r != S.r || cP.rx != S.rx || cP.ry != S.ry), cD = cJ;
            for (var ci in S) {
                if (S[R](ci)) {
                    cP[ci] = S[ci]
                }
            }
            if (cC) {
                cP.path = bh._getPath[cJ.type](cJ);
                cJ._.dirty = 1
            }
            S.href && (cB.href = S.href);
            S.title && (cB.title = S.title);
            S.target && (cB.target = S.target);
            S.cursor && (cI.cursor = S.cursor);
            "blur" in S && cJ.blur(S.blur);
            if (S.path && cJ.type == "path" || cC) {
                cB.path = bN(~cb(cP.path).toLowerCase().indexOf("r") ? bh._pathToAbsolute(cP.path) : cP.path);
                if (cJ.type == "image") {
                    cJ._.fillpos = [cP.x, cP.y];
                    cJ._.fillsize = [cP.width, cP.height];
                    bW(cJ, 1, 1, 0, 0, 0)
                }
            }
            "transform" in S && cJ.transform(S.transform);
            if (cF) {
                var cs = +cP.cx, cq = +cP.cy, cv = +cP.rx || +cP.r || 0, cu = +cP.ry || +cP.r || 0;
                cB.path = bh.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", b8((cs - cv) * d), b8((cq - cu) * d), b8((cs + cv) * d), b8((cq + cu) * d), b8(cs * d));
                cJ._.dirty = 1
            }
            if ("clip-rect" in S) {
                var cA = cb(S["clip-rect"]).split(bQ);
                if (cA.length == 4) {
                    cA[2] = +cA[2] + (+cA[0]);
                    cA[3] = +cA[3] + (+cA[1]);
                    var cN = cB.clipRect || bh._g.doc.createElement("div"), ct = cN.style;
                    ct.clip = bh.format("rect({1}px {2}px {3}px {0}px)", cA);
                    if (!cB.clipRect) {
                        ct.position = "absolute";
                        ct.top = 0;
                        ct.left = 0;
                        ct.width = cJ.paper.width + "px";
                        ct.height = cJ.paper.height + "px";
                        cB.parentNode.insertBefore(cN, cB);
                        cN.appendChild(cB);
                        cB.clipRect = cN
                    }
                }
                if (!S["clip-rect"]) {
                    cB.clipRect && (cB.clipRect.style.clip = "auto")
                }
            }
            if (cJ.textpath) {
                var cg = cJ.textpath.style;
                S.font && (cg.font = S.font);
                S["font-family"] && (cg.fontFamily = '"' + S["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, bX) + '"');
                S["font-size"] && (cg.fontSize = S["font-size"]);
                S["font-weight"] && (cg.fontWeight = S["font-weight"]);
                S["font-style"] && (cg.fontStyle = S["font-style"])
            }
            if ("arrow-start" in S) {
                g(cD, S["arrow-start"])
            }
            if ("arrow-end" in S) {
                g(cD, S["arrow-end"], 1)
            }
            if (S.opacity != null || S["stroke-width"] != null || S.fill != null || S.src != null || S.stroke != null || S["stroke-width"] != null || S["stroke-opacity"] != null || S["fill-opacity"] != null || S["stroke-dasharray"] != null || S["stroke-miterlimit"] != null || S["stroke-linejoin"] != null || S["stroke-linecap"] != null) {
                var cm = cB.getElementsByTagName(b2), ch = false;
                cm = cm && cm[0];
                !cm && (ch = cm = cc(b2));
                if (cJ.type == "image" && S.src) {
                    cm.src = S.src
                }
                S.fill && (cm.on = true);
                if (cm.on == null || S.fill == "none" || S.fill === null) {
                    cm.on = false
                }
                if (cm.on && S.fill) {
                    var cf = cb(S.fill).match(bh._ISURL);
                    if (cf) {
                        cm.parentNode == cB && cB.removeChild(cm);
                        cm.src = cf[1];
                        cm.type = "tile";
                        var cG = S.img_width / 2, cM = S.img_height / 2;
                        cG = cG != null ? cG : this.offsetWidth;
                        cM = cM != null ? cM : this.offsetHeight;
                        cm.size = (cG * 1.5) + "pt," + (cM * 1.5) + "pt";
                        var cp = cJ.getBBox(1);
                        cJ._.fillpos = [cp.x, cp.y];
                        bh._preload(cf[1], function () {
                            cJ._.fillsize = [this.offsetWidth, this.offsetHeight]
                        })
                    } else {
                        cm.color = bh.getRGB(S.fill).hex;
                        cm.src = bX;
                        cm.type = "solid";
                        if (bh.getRGB(S.fill).error && (cD.type in {
                                circle: 1,
                                ellipse: 1
                            } || cb(S.fill).charAt() != "r") && b(cD, S.fill, cm)) {
                            cP.fill = "none";
                            cP.gradient = S.fill;
                            cm.rotate = false
                        }
                    }
                }
                if ("fill-opacity" in S || "opacity" in S) {
                    var cL = ((+cP["fill-opacity"] + 1 || 2) - 1) * ((+cP.opacity + 1 || 2) - 1) * ((+bh.getRGB(S.fill).o + 1 || 2) - 1);
                    cL = b9(ce(cL, 0), 1);
                    cm.opacity = cL;
                    if (cm.src) {
                        cm.color = "none"
                    }
                }
                cB.appendChild(cm);
                var cw = (cB.getElementsByTagName("stroke") && cB.getElementsByTagName("stroke")[0]), cE = false;
                !cw && (cE = cw = cc("stroke"));
                if ((S.stroke && S.stroke != "none") || S["stroke-width"] || S["stroke-opacity"] != null || S["stroke-dasharray"] || S["stroke-miterlimit"] || S["stroke-linejoin"] || S["stroke-linecap"]) {
                    cw.on = true
                }
                (S.stroke == "none" || S.stroke === null || cw.on == null || S.stroke == 0 || S["stroke-width"] == 0) && (cw.on = false);
                var cj = bh.getRGB(S.stroke);
                cw.on && S.stroke && (cw.color = cj.hex);
                cL = ((+cP["stroke-opacity"] + 1 || 2) - 1) * ((+cP.opacity + 1 || 2) - 1) * ((+cj.o + 1 || 2) - 1);
                var E = (bU(S["stroke-width"]) || 1) * 0.75;
                cL = b9(ce(cL, 0), 1);
                S["stroke-width"] == null && (E = cP["stroke-width"]);
                S["stroke-width"] && (cw.weight = E);
                E && E < 1 && (cL *= E) && (cw.weight = 1);
                cw.opacity = cL;
                S["stroke-linejoin"] && (cw.joinstyle = S["stroke-linejoin"] || "miter");
                cw.miterlimit = S["stroke-miterlimit"] || 8;
                S["stroke-linecap"] && (cw.endcap = S["stroke-linecap"] == "butt" ? "flat" : S["stroke-linecap"] == "square" ? "square" : "round");
                if (S["stroke-dasharray"]) {
                    var ck = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    };
                    cw.dashstyle = ck[R](S["stroke-dasharray"]) ? ck[S["stroke-dasharray"]] : bX
                }
                cE && cB.appendChild(cw)
            }
            if (cD.type == "text") {
                cD.paper.canvas.style.display = bX;
                var cr = cD.paper.span, cK = 100, cn = cP.font && cP.font.match(/\d+(?:\.\d*)?(?=px)/);
                cI = cr.style;
                cP.font && (cI.font = cP.font);
                cP["font-family"] && (cI.fontFamily = cP["font-family"]);
                cP["font-weight"] && (cI.fontWeight = cP["font-weight"]);
                cP["font-style"] && (cI.fontStyle = cP["font-style"]);
                cn = bU(cP["font-size"] || cn && cn[0]) || 10;
                cI.fontSize = cn * cK + "px";
                cD.textpath.string && (cr.innerHTML = cb(cD.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
                var cH = cr.getBoundingClientRect();
                cD.W = cP.w = (cH.right - cH.left) / cK;
                cD.H = cP.h = (cH.bottom - cH.top) / cK;
                cD.X = cP.x;
                cD.Y = cP.y + cD.H / 2;
                ("x" in S || "y" in S) && (cD.path.v = bh.format("m{0},{1}l{2},{1}", b8(cP.x * d), b8(cP.y * d), b8(cP.x * d) + 1));
                var co = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
                for (var cO = 0, cl = co.length; cO < cl; cO++) {
                    if (co[cO] in S) {
                        cD._.dirty = 1;
                        break
                    }
                }
                switch (cP["text-anchor"]) {
                    case"start":
                        cD.textpath.style["v-text-align"] = "left";
                        cD.bbx = cD.W / 2;
                        break;
                    case"end":
                        cD.textpath.style["v-text-align"] = "right";
                        cD.bbx = -cD.W / 2;
                        break;
                    default:
                        cD.textpath.style["v-text-align"] = "center";
                        cD.bbx = 0;
                        break
                }
                cD.textpath.style["v-text-kern"] = true
            }
        }, b = function (E, cm, cp) {
            E.attrs = E.attrs || {};
            var cn = E.attrs, cg = Math.pow, ch, ci, ck = "linear", cl = ".5 .5";
            E.attrs.gradient = cm;
            cm = cb(cm).replace(bh._radial_gradient, function (cs, ct, cr) {
                ck = "radial";
                if (ct && cr) {
                    ct = bU(ct);
                    cr = bU(cr);
                    cg(ct - 0.5, 2) + cg(cr - 0.5, 2) > 0.25 && (cr = bP.sqrt(0.25 - cg(ct - 0.5, 2)) * ((cr > 0.5) * 2 - 1) + 0.5);
                    cl = ct + bS + cr
                }
                return bX
            });
            cm = cm.split(/\s*\-\s*/);
            if (ck == "linear") {
                var S = cm.shift();
                S = -bU(S);
                if (isNaN(S)) {
                    return null
                }
            }
            var cj = bh._parseDots(cm);
            if (!cj) {
                return null
            }
            E = E.shape || E.node;
            if (cj.length) {
                E.removeChild(cp);
                cp.on = true;
                cp.method = "none";
                cp.color = cj[0].color;
                cp.color2 = cj[cj.length - 1].color;
                var cq = [];
                for (var cf = 0, co = cj.length; cf < co; cf++) {
                    cj[cf].offset && cq.push(cj[cf].offset + bS + cj[cf].color)
                }
                cp.colors = cq.length ? cq.join() : "0% " + cp.color;
                if (ck == "radial") {
                    cp.type = "gradientTitle";
                    cp.focus = "100%";
                    cp.focussize = "0 0";
                    cp.focusposition = cl;
                    cp.angle = 0
                } else {
                    cp.type = "gradient";
                    cp.angle = (270 - S) % 360
                }
                E.appendChild(cp)
            }
            return 1
        }, b1 = function (S, E) {
            this[0] = this.node = S;
            S.raphael = true;
            this.id = bh._oid++;
            S.raphaelid = this.id;
            this.X = 0;
            this.Y = 0;
            this.attrs = {};
            this.paper = E;
            this.matrix = bh.matrix();
            this._ = {transform: [], sx: 1, sy: 1, dx: 0, dy: 0, deg: 0, dirty: 1, dirtyT: 1};
            !E.bottom && (E.bottom = this);
            this.prev = E.top;
            E.top && (E.top.next = this);
            E.top = this;
            this.next = null
        };
        var bT = bh.el;
        b1.prototype = bT;
        bT.constructor = b1;
        bT.transform = function (ch) {
            if (ch == null) {
                return this._.transform
            }
            var cj = this.paper._viewBoxShift, ci = cj ? "s" + [cj.scale, cj.scale] + "-1-1t" + [cj.dx, cj.dy] : bX, cm;
            if (cj) {
                cm = ch = cb(ch).replace(/\.{3}|\u2026/g, this._.transform || bX)
            }
            bh._extractTransform(this, ci + ch);
            var cn = this.matrix.clone(), cp = this.skew, cf = this.node, cl, cg = ~cb(this.attrs.fill).indexOf("-"), E = !cb(this.attrs.fill).indexOf("url(");
            cn.translate(-0.5, -0.5);
            if (E || cg || this.type == "image") {
                cp.matrix = "1 0 0 1";
                cp.offset = "0 0";
                cl = cn.split();
                if ((cg && cl.noRotation) || !cl.isSimple) {
                    cf.style.filter = cn.toFilter();
                    var ck = this.getBBox(), S = this.getBBox(1), cq = ck.x - S.x, co = ck.y - S.y;
                    cf.coordorigin = (cq * -d) + bS + (co * -d);
                    bW(this, 1, 1, cq, co, 0)
                } else {
                    cf.style.filter = bX;
                    bW(this, cl.scalex, cl.scaley, cl.dx, cl.dy, cl.rotate)
                }
            } else {
                cf.style.filter = bX;
                cp.matrix = cb(cn);
                cp.offset = cn.offset()
            }
            cm && (this._.transform = cm);
            return this
        };
        bT.rotate = function (S, E, cg) {
            if (this.removed) {
                return this
            }
            if (S == null) {
                return
            }
            S = cb(S).split(bQ);
            if (S.length - 1) {
                E = bU(S[1]);
                cg = bU(S[2])
            }
            S = bU(S[0]);
            (cg == null) && (E = cg);
            if (E == null || cg == null) {
                var cf = this.getBBox(1);
                E = cf.x + cf.width / 2;
                cg = cf.y + cf.height / 2
            }
            this._.dirtyT = 1;
            this.transform(this._.transform.concat([["r", S, E, cg]]));
            return this
        };
        bT.translate = function (S, E) {
            if (this.removed) {
                return this
            }
            S = cb(S).split(bQ);
            if (S.length - 1) {
                E = bU(S[1])
            }
            S = bU(S[0]) || 0;
            E = +E || 0;
            if (this._.bbox) {
                this._.bbox.x += S;
                this._.bbox.y += E
            }
            this.transform(this._.transform.concat([["t", S, E]]));
            return this
        };
        bT.scale = function (ch, cf, E, cg) {
            if (this.removed) {
                return this
            }
            ch = cb(ch).split(bQ);
            if (ch.length - 1) {
                cf = bU(ch[1]);
                E = bU(ch[2]);
                cg = bU(ch[3]);
                isNaN(E) && (E = null);
                isNaN(cg) && (cg = null)
            }
            ch = bU(ch[0]);
            (cf == null) && (cf = ch);
            (cg == null) && (E = cg);
            if (E == null || cg == null) {
                var S = this.getBBox(1)
            }
            E = E == null ? S.x + S.width / 2 : E;
            cg = cg == null ? S.y + S.height / 2 : cg;
            this.transform(this._.transform.concat([["s", ch, cf, E, cg]]));
            this._.dirtyT = 1;
            return this
        };
        bT.hide = function () {
            !this.removed && (this.node.style.display = "none");
            return this
        };
        bT.show = function () {
            !this.removed && (this.node.style.display = bX);
            return this
        };
        bT._getBBox = function () {
            if (this.removed) {
                return {}
            }
            return {x: this.X + (this.bbx || 0) - this.W / 2, y: this.Y - this.H, width: this.W, height: this.H}
        };
        bT.remove = function () {
            if (this.removed || !this.node.parentNode) {
                return
            }
            this.paper.__set__ && this.paper.__set__.exclude(this);
            bh.eve.unbind("raphael.*.*." + this.id);
            bh._tear(this, this.paper);
            this.node.parentNode.removeChild(this.node);
            this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var E in this) {
                this[E] = typeof this[E] == "function" ? bh._removedFactory(E) : null
            }
            this.removed = true
        };
        bT.attr = function (E, cm) {
            if (this.removed) {
                return this
            }
            if (E == null) {
                var cj = {};
                for (var cl in this.attrs) {
                    if (this.attrs[R](cl)) {
                        cj[cl] = this.attrs[cl]
                    }
                }
                cj.gradient && cj.fill == "none" && (cj.fill = cj.gradient) && delete cj.gradient;
                cj.transform = this._.transform;
                return cj
            }
            if (cm == null && bh.is(E, "string")) {
                if (E == b2 && this.attrs.fill == "none" && this.attrs.gradient) {
                    return this.attrs.gradient
                }
                var ck = E.split(bQ), cg = {};
                for (var ch = 0, co = ck.length; ch < co; ch++) {
                    E = ck[ch];
                    if (E in this.attrs) {
                        cg[E] = this.attrs[E]
                    } else {
                        if (bh.is(this.paper.customAttributes[E], "function")) {
                            cg[E] = this.paper.customAttributes[E].def
                        } else {
                            cg[E] = bh._availableAttrs[E]
                        }
                    }
                }
                return co - 1 ? cg : cg[ck[0]]
            }
            if (this.attrs && cm == null && bh.is(E, "array")) {
                cg = {};
                for (ch = 0, co = E.length; ch < co; ch++) {
                    cg[E[ch]] = this.attr(E[ch])
                }
                return cg
            }
            var S;
            if (cm != null) {
                S = {};
                S[E] = cm
            }
            cm == null && bh.is(E, "object") && (S = E);
            for (var cn in S) {
                b7("raphael.attr." + cn + "." + this.id, this, S[cn])
            }
            if (S) {
                for (cn in this.paper.customAttributes) {
                    if (this.paper.customAttributes[R](cn) && S[R](cn) && bh.is(this.paper.customAttributes[cn], "function")) {
                        var ci = this.paper.customAttributes[cn].apply(this, [].concat(S[cn]));
                        this.attrs[cn] = S[cn];
                        for (var cf in ci) {
                            if (ci[R](cf)) {
                                S[cf] = ci[cf]
                            }
                        }
                    }
                }
                if (S.text && this.type == "text") {
                    this.textpath.string = S.text
                }
                b4(this, S)
            }
            return this
        };
        bT.toFront = function () {
            !this.removed && this.node.parentNode.appendChild(this.node);
            this.paper && this.paper.top != this && bh._tofront(this, this.paper);
            return this
        };
        bT.toBack = function () {
            if (this.removed) {
                return this
            }
            if (this.node.parentNode.firstChild != this.node) {
                this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
                bh._toback(this, this.paper)
            }
            return this
        };
        bT.insertAfter = function (E) {
            if (this.removed) {
                return this
            }
            if (E.constructor == bh.st.constructor) {
                E = E[E.length - 1]
            }
            if (E.node.nextSibling) {
                E.node.parentNode.insertBefore(this.node, E.node.nextSibling)
            } else {
                E.node.parentNode.appendChild(this.node)
            }
            bh._insertafter(this, E, this.paper);
            return this
        };
        bT.insertBefore = function (E) {
            if (this.removed) {
                return this
            }
            if (E.constructor == bh.st.constructor) {
                E = E[0]
            }
            E.node.parentNode.insertBefore(this.node, E.node);
            bh._insertbefore(this, E, this.paper);
            return this
        };
        bT.blur = function (E) {
            var S = this.node.runtimeStyle, cf = S.filter;
            cf = cf.replace(b0, bX);
            if (+E !== 0) {
                this.attrs.blur = E;
                S.filter = cf + bS + b3 + ".Blur(pixelradius=" + (+E || 1.5) + ")";
                S.margin = bh.format("-{0}px 0 0 -{0}px", b8(+E || 1.5))
            } else {
                S.filter = cf;
                S.margin = 0;
                delete this.attrs.blur
            }
            return this
        };
        bh._engine.path = function (cg, S) {
            var ch = cc("shape");
            ch.style.cssText = i;
            ch.coordsize = d + bS + d;
            ch.coordorigin = S.coordorigin;
            var ci = new b1(ch, S), E = {fill: "none", stroke: "#000"};
            cg && (E.path = cg);
            ci.type = "path";
            ci.path = [];
            ci.Path = bX;
            b4(ci, E);
            S.canvas.appendChild(ch);
            var cf = cc("skew");
            cf.on = true;
            ch.appendChild(cf);
            ci.skew = cf;
            ci.transform(bX);
            return ci
        };
        bh._engine.rect = function (S, cj, ch, ck, cf, E) {
            var cl = bh._rectPath(cj, ch, ck, cf, E), cg = S.path(cl), ci = cg.attrs;
            cg.X = ci.x = cj;
            cg.Y = ci.y = ch;
            cg.W = ci.width = ck;
            cg.H = ci.height = cf;
            ci.r = E;
            ci.path = cl;
            cg.type = "rect";
            return cg
        };
        bh._engine.ellipse = function (S, E, cj, ci, ch) {
            var cg = S.path(), cf = cg.attrs;
            cg.X = E - ci;
            cg.Y = cj - ch;
            cg.W = ci * 2;
            cg.H = ch * 2;
            cg.type = "ellipse";
            b4(cg, {cx: E, cy: cj, rx: ci, ry: ch});
            return cg
        };
        bh._engine.circle = function (S, E, ci, ch) {
            var cg = S.path(), cf = cg.attrs;
            cg.X = E - ch;
            cg.Y = ci - ch;
            cg.W = cg.H = ch * 2;
            cg.type = "circle";
            b4(cg, {cx: E, cy: ci, r: ch});
            return cg
        };
        bh._engine.image = function (S, E, ck, ci, cl, cg) {
            var cn = bh._rectPath(ck, ci, cl, cg), ch = S.path(cn).attr({stroke: "none"}), cj = ch.attrs, cf = ch.node, cm = cf.getElementsByTagName(b2)[0];
            cj.src = E;
            ch.X = cj.x = ck;
            ch.Y = cj.y = ci;
            ch.W = cj.width = cl;
            ch.H = cj.height = cg;
            cj.path = cn;
            ch.type = "image";
            cm.parentNode == cf && cf.removeChild(cm);
            cm.rotate = true;
            cm.src = E;
            cm.type = "tile";
            ch._.fillpos = [ck, ci];
            ch._.fillsize = [cl, cg];
            cf.appendChild(cm);
            bW(ch, 1, 1, 0, 0, 0);
            return ch
        };
        bh._engine.text = function (E, cj, ci, ck) {
            var cg = cc("shape"), cm = cc("path"), cf = cc("textpath");
            cj = cj || 0;
            ci = ci || 0;
            ck = ck || "";
            cm.v = bh.format("m{0},{1}l{2},{1}", b8(cj * d), b8(ci * d), b8(cj * d) + 1);
            cm.textpathok = true;
            cf.string = cb(ck);
            cf.on = true;
            cg.style.cssText = i;
            cg.coordsize = d + bS + d;
            cg.coordorigin = "0 0";
            var S = new b1(cg, E), ch = {fill: "#000", stroke: "none", font: bh._availableAttrs.font, text: ck};
            S.shape = cg;
            S.path = cm;
            S.textpath = cf;
            S.type = "text";
            S.attrs.text = cb(ck);
            S.attrs.x = cj;
            S.attrs.y = ci;
            S.attrs.w = 1;
            S.attrs.h = 1;
            b4(S, ch);
            cg.appendChild(cf);
            cg.appendChild(cm);
            E.canvas.appendChild(cg);
            var cl = cc("skew");
            cl.on = true;
            cg.appendChild(cl);
            S.skew = cl;
            S.transform(bX);
            return S
        };
        bh._engine.setSize = function (cf, E) {
            var S = this.canvas.style;
            this.width = cf;
            this.height = E;
            cf == +cf && (cf += "px");
            E == +E && (E += "px");
            S.width = cf;
            S.height = E;
            S.clip = "rect(0 " + cf + " " + E + " 0)";
            if (this._viewBox) {
                bh._engine.setViewBox.apply(this, this._viewBox)
            }
            return this
        };
        bh._engine.setViewBox = function (ci, ch, cj, cf, cg) {
            bh.eve("raphael.setViewBox", this, this._viewBox, [ci, ch, cj, cf, cg]);
            var E = this.width, cl = this.height, cm = 1 / ce(cj / E, cf / cl), ck, S;
            if (cg) {
                ck = cl / cf;
                S = E / cj;
                if (cj * ck < E) {
                    ci -= (E - cj * ck) / 2 / ck
                }
                if (cf * S < cl) {
                    ch -= (cl - cf * S) / 2 / S
                }
            }
            this._viewBox = [ci, ch, cj, cf, !!cg];
            this._viewBoxShift = {dx: -ci, dy: -ch, scale: cm};
            this.forEach(function (cn) {
                cn.transform("...")
            });
            return this
        };
        var cc;
        bh._engine.initWin = function (cf) {
            var S = cf.document;
            S.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
            try {
                !S.namespaces.rvml && S.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                cc = function (cg) {
                    return S.createElement("<rvml:" + cg + ' class="rvml">')
                }
            } catch (E) {
                cc = function (cg) {
                    return S.createElement("<" + cg + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')
                }
            }
        };
        bh._engine.initWin(bh._g.win);
        bh._engine.create = function () {
            var cf = bh._getContainer.apply(0, arguments), E = cf.container, cl = cf.height, cm, S = cf.width, ck = cf.x, cj = cf.y;
            if (!E) {
                throw new Error("VML container not found.")
            }
            var ch = new bh._Paper, ci = ch.canvas = bh._g.doc.createElement("div"), cg = ci.style;
            ck = ck || 0;
            cj = cj || 0;
            S = S || 512;
            cl = cl || 342;
            ch.width = S;
            ch.height = cl;
            S == +S && (S += "px");
            cl == +cl && (cl += "px");
            ch.coordsize = d * 1000 + bS + d * 1000;
            ch.coordorigin = "0 0";
            ch.span = bh._g.doc.createElement("span");
            ch.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
            ci.appendChild(ch.span);
            cg.cssText = bh.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", S, cl);
            if (E == 1) {
                bh._g.doc.body.appendChild(ci);
                cg.left = ck + "px";
                cg.top = cj + "px";
                cg.position = "absolute"
            } else {
                if (E.firstChild) {
                    E.insertBefore(ci, E.firstChild)
                } else {
                    E.appendChild(ci)
                }
            }
            ch.renderfix = function () {
            };
            return ch
        };
        bh.prototype.clear = function () {
            bh.eve("raphael.clear", this);
            this.canvas.innerHTML = bX;
            this.span = bh._g.doc.createElement("span");
            this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
            this.canvas.appendChild(this.span);
            this.bottom = this.top = null
        };
        bh.prototype.remove = function () {
            bh.eve("raphael.remove", this);
            this.canvas.parentNode.removeChild(this.canvas);
            for (var E in this) {
                this[E] = typeof this[E] == "function" ? bh._removedFactory(E) : null
            }
            return true
        };
        var b5 = bh.st;
        for (var bO in bT) {
            if (bT[R](bO) && !b5[R](bO)) {
                b5[bO] = (function (E) {
                    return function () {
                        var S = arguments;
                        return this.forEach(function (cf) {
                            cf[E].apply(cf, S)
                        })
                    }
                })(bO)
            }
        }
    })();
    aD.was ? (a4.win.Raphael = bh) : (Raphael = bh);
    return bh
}));