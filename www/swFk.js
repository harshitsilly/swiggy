! function(e) {
    function t(r) {
        if (n[r]) return n[r].exports;
        var o = n[r] = {
            exports: {},
            id: r,
            loaded: !1
        };
        return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
    }
    var n = {};
    return t.m = e, t.c = n, t.p = "", t(0)
}([function(e, t, n) {
    "use strict";

    function r(e) {
        return e && e.__esModule ? e : {
            "default": e
        }
    }

    function o() {
        var e = new Request("http://localhost:8100/SWVERSION", {
            method: "get",
            headers: null,
            body: null,
            mode: null,
            credentials: null,
            cache: null,
            redirect: null,
            referrer: null,
            integrity: null
        });
        return v.default.openCache({
            cache: {
                name: "SWVERSION",
                maxAgeSeconds: null,
                maxEntries: null
            }
        }).then(function(t) {
            return t.match(e.clone()).then(function(n) {
                var r = new Response(w);
                return n ? n ? n.json().then(function(n) {
                    if (n !== w) return t.put(e, r), self.clients.matchAll().then(function(e) {
                        return Promise.all(e.map(function(e) {
                            return e.postMessage(JSON.stringify({
                                cacheversion: n
                            }))
                        }))
                    })
                }) : void 0 : t.put(e, r).catch(function(e) {
                    throw console.log(e), e
                })
            })
        }).catch(function(e) {
            throw e
        })
    }

    function a(e, t) {
        var n = e.url;
        return n.indexOf("start") === -1 ? m.default.networkFirst(e, t, R) : fetch(e)
    }

    function i(e, t, n) {
        var r = new Request(e.url, {
            headers: e.headers,
            mode: "cors"
        });
        return m.default.cacheFirst(r, t, n)
    }

    function c(e, t, n) {
        return v.default.openCache(n).then(function(t) {
            return t.match(e.clone()).then(function(n) {
                var r = fetch(e.clone()).then(function(r) {
                    return u(e, r, t, !!n)
                }).catch(function(e) {
                    return self.clients.matchAll().then(function(t) {
                        return Promise.all(t.map(function(t) {
                            return t.postMessage(JSON.stringify({
                                error: e,
                                hpResponse: null
                            }))
                        }))
                    })
                });
                return n || r
            })
        }).catch(function(e) {
            throw e
        })
    }

    function u(e, t, n, r) {
        if (t.ok && m.default.options.successResponses.test(t.status)) return t.clone().json().then(function(o) {
            delete o.SESSION;
            var a = new Response(JSON.stringify(o), {
                status: t.status,
                statusText: t.statusText
            });
            return n.put(e.clone(), a.clone()), r ? self.clients.matchAll().then(function(e) {
                return Promise.all(e.map(function(e) {
                    return e.postMessage(JSON.stringify({
                        hpResponse: o
                    }))
                }))
            }) : a
        }).catch(function(e) {
            throw console.error(e), e
        });
        if (!t.ok) {
            var o = function() {
                var e = {
                    statusCode: t.status,
                    message: t.statusText
                };
                return {
                    v: self.clients.matchAll().then(function(t) {
                        return Promise.all(t.map(function(t) {
                            return t.postMessage(JSON.stringify({
                                error: e,
                                hpResponse: null
                            }))
                        }))
                    })
                }
            }();
            if ("object" === (void 0 === o ? "undefined" : p(o))) return o.v
        }
    }

    function s(e) {
        return v.default.openCache(k).then(function(t) {
            return t.match(e.clone()).then(function(t) {
                var n = v.default.fetchAndCache(e, k);
                return t ? t : n
            })
        }).catch(function(e) {
            throw console.log(e), e
        })
    }

    function f(e) {
        return s(new Request(new URL(e.url).pathname, {
            headers: e.headers,
            credentials: "same-origin"
        }))
    }

    function l(e) {
        return s(new Request("/search", {
            headers: e.headers,
            credentials: "same-origin"
        }))
    }

    function h(e) {
        return s(new Request("/" + b.slug + "/p/" + b.itemId, {
            headers: e.headers,
            credentials: "same-origin"
        }))
    }
    var p = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
        },
        d = n(1),
        m = r(d),
        g = n(7),
        v = r(g),
        w = 18,
        x = ["fkart6", "reviews", "productInfo", "sellerSummary", "flyout1", "search", "fkartStatic", "mainStatic2", "mainBundles3", "offerTC", "logoStatic", "userState", "swatchServiceability", "allSellers", "discoveryContent", "userReviewOverview", "homePage"],
        y = {};
    x.forEach(function(e) {
        y[e] = e + w
    }), m.default.options.cache.name = y.fkart6, m.default.options.successResponses = /^0|200$/;
    var b = {
            splat: "splat",
            slug: "slug",
            itemId: "itemId"
        },
        E = [];
    E.push("/"), E.push("/search"), E.push("/" + b.slug + "/p/" + b.itemId), m.default.precache(E);
    var S = {
        headers: {
            "X-user-agent": self.navigator.userAgent + "FKUA/msite/0.0.1/msite/Mobile",
            "Content-Type": "application/json"
        }
    };
    self.addEventListener("install", function(e) {
        var t = new Request("/api/br/data/flyout", S);
        e.waitUntil(caches.open(y.flyout1).then(function(e) {
            return fetch(t).then(function(n) {
                return e.put(t, n.clone())
            })
        })), e.waitUntil(self.skipWaiting())
    }), self.addEventListener("activate", function(e) {
        e.waitUntil(caches.keys().then(function(e) {
            var t = Object.keys(y).map(function(e) {
                return y[e]
            });
            return Promise.all(e.map(function(e) {
                return t.indexOf(e) === -1 && e.indexOf("$$$inactive$$$") === -1 && e.indexOf("SWVERSION") === -1 ? (console.log("Deleting out of date cache:", e), caches.delete(e)) : Promise.resolve()
            }))
        })), e.waitUntil(self.clients.claim().then(function() {
            return o()
        }))
    });
    var R = {
            cache: {
                name: y.search,
                maxEntries: 5,
                maxAgeSeconds: 300
            }
        },
        k = {
            cache: {
                name: y.fkart6,
                maxAgeSeconds: null,
                maxEntries: null
            }
        };
    m.default.router.get("/api/3/discover/getSearch", a), m.default.router.get("/api/3/product/reviews", m.default.networkFirst, {
        cache: {
            name: y.reviews,
            maxEntries: 5
        }
    }), m.default.router.get("/api/3/page/product", m.default.networkFirst, {
        cache: {
            name: y.productInfo,
            maxEntries: 25,
            maxAgeSeconds: 604800
        }
    }), m.default.router.get("/api/br/data/flyout", m.default.fastest, {
        cache: {
            name: y.flyout1
        }
    }), m.default.router.get("/api/2/discover/santaOfferDetails", m.default.networkFirst, {
        cache: {
            name: y.offerTC
        }
    }), m.default.router.get("/api/3/user/state", m.default.networkFirst, {
        cache: {
            name: y.userState
        }
    }), m.default.router.get("/api/3/product/serviceability", m.default.networkFirst, {
        cache: {
            name: y.swatchServiceability
        }
    }), m.default.router.get("/api/3/page/product/sellers", m.default.networkFirst, {
        cache: {
            name: y.allSellers
        }
    }), m.default.router.get("/api/3/discover/discovery/content", m.default.networkFirst, {
        cache: {
            name: y.discoveryContent
        }
    }), m.default.router.get("/api/3/reviews/product/detail", m.default.networkFirst, {
        cache: {
            name: y.userReviewOverview
        }
    }), m.default.router.get("/api/3/resource/msite/appConfigs", m.default.networkFirst, {
        cache: {
            name: y.config,
            maxAgeSeconds: 86400
        }
    }), m.default.router.get("/api/3/layout/page/homepage", m.default.networkFirst, {
        cache: {
            name: y.homePage
        }
    }), m.default.router.get("/api/3/page/homepage", c, {
        cache: {
            name: y.homePage
        }
    }), m.default.router.get("/www/linchpin/batman-returns/images/logo_lite-cbb3574d.png", i, {
        origin: "https://img1a.flixcart.com",
        cache: {
            name: y.logoStatic,
            maxEntries: 1
        }
    }), m.default.router.get("/www/linchpin/batman-returns/images/(.*)", m.default.cacheFirst, {
        origin: "https://img1a.flixcart.com",
        cache: {
            name: y.mainStatic2,
            maxEntries: 50
        }
    }), m.default.router.get("/www/linchpin/batman-returns/(.*)", i, {
        origin: "https://img1a.flixcart.com",
        cache: {
            name: y.mainBundles3,
            maxEntries: 20
        }
    }), m.default.router.get("/(.*)", m.default.cacheFirst, {
        origin: "https://rukminim1.flixcart.com",
        cache: {
            name: y.fkartStatic,
            maxEntries: 50
        }
    }), m.default.router.get("/search", l), m.default.router.get("/(.*)/pr", l), m.default.router.get("/:slug/p/:itemId", h), m.default.router.get("/", f)
}, function(e, t, n) {
    "use strict";
    var r = n(2),
        o = n(3),
        a = n(7),
        i = n(9),
        c = n(15);
    a.debug("Service Worker Toolbox is loading"), self.addEventListener("install", c.installListener), self.addEventListener("activate", c.activateListener), self.addEventListener("fetch", c.fetchListener), e.exports = {
        networkOnly: i.networkOnly,
        networkFirst: i.networkFirst,
        cacheOnly: i.cacheOnly,
        cacheFirst: i.cacheFirst,
        fastest: i.fastest,
        router: o,
        options: r,
        cache: a.cache,
        uncache: a.uncache,
        precache: a.precache
    }
}, function(e, t) {
    "use strict";
    var n;
    n = self.registration ? self.registration.scope : self.scope || new URL("./", self.location).href, e.exports = {
        cache: {
            name: "$$$toolbox-cache$$$" + n + "$$$",
            maxAgeSeconds: null,
            maxEntries: null
        },
        debug: !1,
        networkTimeoutSeconds: null,
        preCacheItems: [],
        successResponses: /^0|([123]\d\d)|(40[14567])|410$/
    }
}, function(e, t, n) {
    "use strict";

    function r(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }
    var o = n(4),
        a = n(7),
        i = function(e, t) {
            for (var n = e.entries(), r = n.next(), o = []; !r.done;) {
                var a = RegExp(r.value[0]);
                a.test(t) && o.push(r.value[1]), r = n.next()
            }
            return o
        },
        c = function() {
            this.routes = new Map, this.routes.set(RegExp, new Map), this.default = null
        };
    ["get", "post", "put", "delete", "head", "any"].forEach(function(e) {
        c.prototype[e] = function(t, n, r) {
            return this.add(e, t, n, r)
        }
    }), c.prototype.add = function(e, t, n, i) {
        i = i || {};
        var c;
        t instanceof RegExp ? c = RegExp : (c = i.origin || self.location.origin, c = c instanceof RegExp ? c.source : r(c)), e = e.toLowerCase();
        var u = new o(e, t, n, i);
        this.routes.has(c) || this.routes.set(c, new Map);
        var s = this.routes.get(c);
        s.has(e) || s.set(e, new Map);
        var f = s.get(e),
            l = u.regexp || u.fullUrlRegExp;
        f.has(l.source) && a.debug('"' + t + '" resolves to same regex as existing route.'), f.set(l.source, u)
    }, c.prototype.matchMethod = function(e, t) {
        var n = new URL(t),
            r = n.origin,
            o = n.pathname;
        return this._match(e, i(this.routes, r), o) || this._match(e, [this.routes.get(RegExp)], t)
    }, c.prototype._match = function(e, t, n) {
        if (0 === t.length) return null;
        for (var r = 0; t.length > r; r++) {
            var o = t[r],
                a = o && o.get(e.toLowerCase());
            if (a) {
                var c = i(a, n);
                if (c.length > 0) return c[0].makeHandler(n)
            }
        }
        return null
    }, c.prototype.match = function(e) {
        return this.matchMethod(e.method, e.url) || this.matchMethod("any", e.url)
    }, e.exports = new c
}, function(e, t, n) {
    "use strict";
    var r = new URL("./", self.location),
        o = r.pathname,
        a = n(5),
        i = function(e, t, n, r) {
            t instanceof RegExp ? this.fullUrlRegExp = t : (0 !== t.indexOf("/") && (t = o + t), this.keys = [], this.regexp = a(t, this.keys)), this.method = e, this.options = r, this.handler = n
        };
    i.prototype.makeHandler = function(e) {
        var t;
        if (this.regexp) {
            var n = this.regexp.exec(e);
            t = {}, this.keys.forEach(function(e, r) {
                t[e.name] = n[r + 1]
            })
        }
        return function(e) {
            return this.handler(e, t, this.options)
        }.bind(this)
    }, e.exports = i
}, function(e, t, n) {
    function r(e, t) {
        for (var n, r = [], o = 0, a = 0, i = "", c = t && t.delimiter || "/"; null != (n = w.exec(e));) {
            var f = n[0],
                l = n[1],
                h = n.index;
            if (i += e.slice(a, h), a = h + f.length, l) i += l[1];
            else {
                var p = e[a],
                    d = n[2],
                    m = n[3],
                    g = n[4],
                    v = n[5],
                    x = n[6],
                    y = n[7];
                i && (r.push(i), i = "");
                var b = null != d && null != p && p !== d,
                    E = "+" === x || "*" === x,
                    S = "?" === x || "*" === x,
                    R = n[2] || c,
                    k = g || v;
                r.push({
                    name: m || o++,
                    prefix: d || "",
                    delimiter: R,
                    optional: S,
                    repeat: E,
                    partial: b,
                    asterisk: !!y,
                    pattern: k ? s(k) : y ? ".*" : "[^" + u(R) + "]+?"
                })
            }
        }
        return e.length > a && (i += e.substr(a)), i && r.push(i), r
    }

    function o(e, t) {
        return c(r(e, t))
    }

    function a(e) {
        return encodeURI(e).replace(/[\/?#]/g, function(e) {
            return "%" + e.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function i(e) {
        return encodeURI(e).replace(/[?#]/g, function(e) {
            return "%" + e.charCodeAt(0).toString(16).toUpperCase()
        })
    }

    function c(e) {
        for (var t = Array(e.length), n = 0; e.length > n; n++) "object" == typeof e[n] && (t[n] = RegExp("^(?:" + e[n].pattern + ")$"));
        return function(n, r) {
            for (var o = "", c = n || {}, u = r || {}, s = u.pretty ? a : encodeURIComponent, f = 0; e.length > f; f++) {
                var l = e[f];
                if ("string" != typeof l) {
                    var h, p = c[l.name];
                    if (null == p) {
                        if (l.optional) {
                            l.partial && (o += l.prefix);
                            continue
                        }
                        throw new TypeError('Expected "' + l.name + '" to be defined')
                    }
                    if (v(p)) {
                        if (!l.repeat) throw new TypeError('Expected "' + l.name + '" to not repeat, but received `' + JSON.stringify(p) + "`");
                        if (0 === p.length) {
                            if (l.optional) continue;
                            throw new TypeError('Expected "' + l.name + '" to not be empty')
                        }
                        for (var d = 0; p.length > d; d++) {
                            if (h = s(p[d]), !t[f].test(h)) throw new TypeError('Expected all "' + l.name + '" to match "' + l.pattern + '", but received `' + JSON.stringify(h) + "`");
                            o += (0 === d ? l.prefix : l.delimiter) + h
                        }
                    } else {
                        if (h = l.asterisk ? i(p) : s(p), !t[f].test(h)) throw new TypeError('Expected "' + l.name + '" to match "' + l.pattern + '", but received "' + h + '"');
                        o += l.prefix + h
                    }
                } else o += l
            }
            return o
        }
    }

    function u(e) {
        return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function s(e) {
        return e.replace(/([=!:$\/()])/g, "\\$1")
    }

    function f(e, t) {
        return e.keys = t, e
    }

    function l(e) {
        return e.sensitive ? "" : "i"
    }

    function h(e, t) {
        var n = e.source.match(/\((?!\?)/g);
        if (n)
            for (var r = 0; n.length > r; r++) t.push({
                name: r,
                prefix: null,
                delimiter: null,
                optional: !1,
                repeat: !1,
                partial: !1,
                asterisk: !1,
                pattern: null
            });
        return f(e, t)
    }

    function p(e, t, n) {
        for (var r = [], o = 0; e.length > o; o++) r.push(g(e[o], t, n).source);
        var a = RegExp("(?:" + r.join("|") + ")", l(n));
        return f(a, t)
    }

    function d(e, t, n) {
        return m(r(e, n), t, n)
    }

    function m(e, t, n) {
        v(t) || (n = t || n, t = []), n = n || {};
        for (var r = n.strict, o = n.end !== !1, a = "", i = e[e.length - 1], c = "string" == typeof i && /\/$/.test(i), s = 0; e.length > s; s++) {
            var h = e[s];
            if ("string" == typeof h) a += u(h);
            else {
                var p = u(h.prefix),
                    d = "(?:" + h.pattern + ")";
                t.push(h), h.repeat && (d += "(?:" + p + d + ")*"), d = h.optional ? h.partial ? p + "(" + d + ")?" : "(?:" + p + "(" + d + "))?" : p + "(" + d + ")", a += d
            }
        }
        return r || (a = (c ? a.slice(0, -2) : a) + "(?:\\/(?=$))?"), a += o ? "$" : r && c ? "" : "(?=\\/|$)", f(RegExp("^" + a, l(n)), t)
    }

    function g(e, t, n) {
        return v(t) || (n = t || n, t = []), n = n || {}, e instanceof RegExp ? h(e, t) : v(e) ? p(e, t, n) : d(e, t, n)
    }
    var v = n(6);
    e.exports = g, e.exports.parse = r, e.exports.compile = o, e.exports.tokensToFunction = c, e.exports.tokensToRegExp = m;
    var w = RegExp("(\\\\.)|([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))", "g")
}, function(e, t) {
    e.exports = Array.isArray || function(e) {
        return "[object Array]" == Object.prototype.toString.call(e)
    }
}, function(e, t, n) {
    "use strict";

    function r(e, t) {
        t = t || {};
        var n = t.debug || d.debug;
        n && console.log("[sw-toolbox] " + e)
    }

    function o(e) {
        var t;
        return e && e.cache && (t = e.cache.name), t = t || d.cache.name, caches.open(t)
    }

    function a(e, t) {
        t = t || {};
        var n = t.successResponses || d.successResponses;
        return fetch(e.clone()).then(function(r) {
            return "GET" === e.method && n.test(r.status) && o(t).then(function(n) {
                n.put(e, r).then(function() {
                    var r = t.cache || d.cache;
                    (r.maxEntries || r.maxAgeSeconds) && r.name && i(e, n, r)
                })
            }), r.clone()
        })
    }

    function i(e, t, n) {
        var r = c.bind(null, e, t, n);
        p = p ? p.then(r) : r()
    }

    function c(e, t, n) {
        var o = e.url,
            a = n.maxAgeSeconds,
            i = n.maxEntries,
            c = n.name,
            u = Date.now();
        return r("Updating LRU order for " + o + ". Max entries is " + i + ", max age is " + a), m.getDb(c).then(function(e) {
            return m.setTimestampForUrl(e, o, u)
        }).then(function(e) {
            return m.expireEntries(e, i, a, u)
        }).then(function(e) {
            r("Successfully updated IDB.");
            var n = e.map(function(e) {
                return t.delete(e)
            });
            return Promise.all(n).then(function() {
                r("Done with cache cleanup.")
            })
        }).catch(function(e) {
            r(e)
        })
    }

    function u(e, t, n) {
        return r("Renaming cache: [" + e + "] to [" + t + "]", n), caches.delete(t).then(function() {
            return Promise.all([caches.open(e), caches.open(t)]).then(function(t) {
                var n = t[0],
                    r = t[1];
                return n.keys().then(function(e) {
                    return Promise.all(e.map(function(e) {
                        return n.match(e).then(function(t) {
                            return r.put(e, t)
                        })
                    }))
                }).then(function() {
                    return caches.delete(e)
                })
            })
        })
    }

    function s(e, t) {
        return o(t).then(function(t) {
            return t.add(e)
        })
    }

    function f(e, t) {
        return o(t).then(function(t) {
            return t.delete(e)
        })
    }

    function l(e) {
        e instanceof Promise || h(e), d.preCacheItems = d.preCacheItems.concat(e)
    }

    function h(e) {
        var t = Array.isArray(e);
        if (t && e.forEach(function(e) {
                "string" == typeof e || e instanceof Request || (t = !1)
            }), !t) throw new TypeError("The precache method expects either an array of strings and/or Requests or a Promise that resolves to an array of strings and/or Requests.");
        return e
    }
    var p, d = n(2),
        m = n(8);
    e.exports = {
        debug: r,
        fetchAndCache: a,
        openCache: o,
        renameCache: u,
        cache: s,
        uncache: f,
        precache: l,
        validatePrecacheInput: h
    }
}, function(e, t) {
    "use strict";

    function n(e) {
        return new Promise(function(t, n) {
            var r = indexedDB.open(u + e, s);
            r.onupgradeneeded = function() {
                var e = r.result.createObjectStore(f, {
                    keyPath: l
                });
                e.createIndex(h, h, {
                    unique: !1
                })
            }, r.onsuccess = function() {
                t(r.result)
            }, r.onerror = function() {
                n(r.error)
            }
        })
    }

    function r(e) {
        return e in p || (p[e] = n(e)), p[e]
    }

    function o(e, t, n) {
        return new Promise(function(r, o) {
            var a = e.transaction(f, "readwrite"),
                i = a.objectStore(f);
            i.put({
                url: t,
                timestamp: n
            }), a.oncomplete = function() {
                r(e)
            }, a.onabort = function() {
                o(a.error)
            }
        })
    }

    function a(e, t, n) {
        return t ? new Promise(function(r, o) {
            var a = 1e3 * t,
                i = [],
                c = e.transaction(f, "readwrite"),
                u = c.objectStore(f),
                s = u.index(h);
            s.openCursor().onsuccess = function(e) {
                var t = e.target.result;
                if (t && n - a > t.value[h]) {
                    var r = t.value[l];
                    i.push(r), u.delete(r), t.continue()
                }
            }, c.oncomplete = function() {
                r(i)
            }, c.onabort = o
        }) : Promise.resolve([])
    }

    function i(e, t) {
        return t ? new Promise(function(n, r) {
            var o = [],
                a = e.transaction(f, "readwrite"),
                i = a.objectStore(f),
                c = i.index(h),
                u = c.count();
            c.count().onsuccess = function() {
                var e = u.result;
                e > t && (c.openCursor().onsuccess = function(n) {
                    var r = n.target.result;
                    if (r) {
                        var a = r.value[l];
                        o.push(a), i.delete(a), e - o.length > t && r.continue()
                    }
                })
            }, a.oncomplete = function() {
                n(o)
            }, a.onabort = r
        }) : Promise.resolve([])
    }

    function c(e, t, n, r) {
        return a(e, n, r).then(function(n) {
            return i(e, t).then(function(e) {
                return n.concat(e)
            })
        })
    }
    var u = "sw-toolbox-",
        s = 1,
        f = "store",
        l = "url",
        h = "timestamp",
        p = {};
    e.exports = {
        getDb: r,
        setTimestampForUrl: o,
        expireEntries: c
    }
}, function(e, t, n) {
    e.exports = {
        networkOnly: n(10),
        networkFirst: n(11),
        cacheOnly: n(12),
        cacheFirst: n(13),
        fastest: n(14)
    }
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: network only [" + e.url + "]", n), fetch(e)
    }
    var o = n(7);
    e.exports = r
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        n = n || {};
        var r = n.successResponses || o.successResponses,
            i = n.networkTimeoutSeconds || o.networkTimeoutSeconds;
        return a.debug("Strategy: network first [" + e.url + "]", n), a.openCache(n).then(function(t) {
            var o, c, u = [];
            if (i) {
                var s = new Promise(function(n) {
                    o = setTimeout(function() {
                        t.match(e).then(function(e) {
                            e && n(e)
                        })
                    }, 1e3 * i)
                });
                u.push(s)
            }
            var f = a.fetchAndCache(e, n).then(function(e) {
                if (o && clearTimeout(o), r.test(e.status)) return e;
                throw a.debug("Response was an HTTP error: " + e.statusText, n), c = e, Error("Bad response")
            }).catch(function(r) {
                return a.debug("Network or response error, fallback to cache [" + e.url + "]", n), t.match(e).then(function(e) {
                    if (e) return e;
                    if (c) return c;
                    throw r
                })
            });
            return u.push(f), Promise.race(u)
        })
    }
    var o = n(2),
        a = n(7);
    e.exports = r
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: cache only [" + e.url + "]", n), o.openCache(n).then(function(t) {
            return t.match(e)
        })
    }
    var o = n(7);
    e.exports = r
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: cache first [" + e.url + "]", n), o.openCache(n).then(function(t) {
            return t.match(e).then(function(t) {
                return t ? t : o.fetchAndCache(e, n)
            })
        })
    }
    var o = n(7);
    e.exports = r
}, function(e, t, n) {
    "use strict";

    function r(e, t, n) {
        return o.debug("Strategy: fastest [" + e.url + "]", n), new Promise(function(r, i) {
            var c = !1,
                u = [],
                s = function(e) {
                    u.push("" + e), c ? i(Error('Both cache and network failed: "' + u.join('", "') + '"')) : c = !0
                },
                f = function(e) {
                    e instanceof Response ? r(e) : s("No result returned")
                };
            o.fetchAndCache(e.clone(), n).then(f, s), a(e, t, n).then(f, s)
        })
    }
    var o = n(7),
        a = n(12);
    e.exports = r
}, function(e, t, n) {
    "use strict";

    function r(e) {
        var t = u.match(e.request);
        t ? e.respondWith(t(e.request)) : u.default && "GET" === e.request.method && 0 === e.request.url.indexOf("http") && e.respondWith(u.default(e.request))
    }

    function o(e) {
        c.debug("activate event fired");
        var t = s.cache.name + "$$$inactive$$$";
        e.waitUntil(c.renameCache(t, s.cache.name))
    }

    function a(e) {
        return e.reduce(function(e, t) {
            return e.concat(t)
        }, [])
    }

    function i(e) {
        var t = s.cache.name + "$$$inactive$$$";
        c.debug("install event fired"), c.debug("creating cache [" + t + "]"), e.waitUntil(c.openCache({
            cache: {
                name: t
            }
        }).then(function(e) {
            return Promise.all(s.preCacheItems).then(a).then(c.validatePrecacheInput).then(function(t) {
                return c.debug("preCache list: " + (t.join(", ") || "(none)")), e.addAll(t)
            })
        }))
    }
    n(16);
    var c = n(7),
        u = n(3),
        s = n(2);
    e.exports = {
        fetchListener: r,
        activateListener: o,
        installListener: i
    }
}, function(e, t) {
    ! function() {
        var e = Cache.prototype.addAll,
            t = navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);
        if (t) var n = t[1],
            r = parseInt(t[2]);
        e && (!t || "Firefox" === n && r >= 46 || "Chrome" === n && r >= 50) || (Cache.prototype.addAll = function(e) {
            function t(e) {
                this.name = "NetworkError", this.code = 19, this.message = e
            }
            var n = this;
            return t.prototype = Object.create(Error.prototype), Promise.resolve().then(function() {
                if (1 > arguments.length) throw new TypeError;
                return e = e.map(function(e) {
                    return e instanceof Request ? e : e + ""
                }), Promise.all(e.map(function(e) {
                    "string" == typeof e && (e = new Request(e));
                    var n = new URL(e.url).protocol;
                    if ("http:" !== n && "https:" !== n) throw new t("Invalid scheme");
                    return fetch(e.clone())
                }))
            }).then(function(r) {
                if (r.some(function(e) {
                        return !e.ok
                    })) throw new t("Incorrect response status");
                return Promise.all(r.map(function(t, r) {
                    return n.put(e[r], t)
                }))
            }).then(function() {})
        }, Cache.prototype.add = function(e) {
            return this.addAll([e])
        })
    }()
}]);