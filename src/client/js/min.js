(function(c) {
    function b(d) {
        return (d || "").toLowerCase()
    }
    var a = "20130725";
    c.fn.cycle = function(d) {
        var e;
        return 0 !== this.length || c.isReady ? this.each(function() {
            var m, h, j, k, i = c(this),
                g = c.fn.cycle.log;
            if (!i.data("cycle.opts")) {
                (i.data("cycle-log") === !1 || d && d.log === !1 || h && h.log === !1) && (g = c.noop), g("--c2 init--"), m = i.data();
                for (var f in m) {
                    m.hasOwnProperty(f) && /^cycle[A-Z]+/.test(f) && (k = m[f], j = f.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, b), g(j + ":", k, "(" + typeof k + ")"), m[j] = k)
                }
                h = c.extend({}, c.fn.cycle.defaults, m, d || {}), h.timeoutId = 0, h.paused = h.paused || !1, h.container = i, h._maxZ = h.maxZ, h.API = c.extend({
                    _container: i
                }, c.fn.cycle.API), h.API.log = g, h.API.trigger = function(n, l) {
                    return h.container.trigger(n, l), h.API
                }, i.data("cycle.opts", h), i.data("cycle.API", h.API), h.API.trigger("cycle-bootstrap", [h, h.API]), h.API.addInitialSlides(), h.API.preInitSlideshow(), h.slides.length && h.API.initSlideshow()
            }
        }) : (e = {
            s: this.selector,
            c: this.context
        }, c.fn.cycle.log("requeuing slideshow (dom not ready)"), c(function() {
            c(e.s, e.c).cycle(d)
        }), this)
    }, c.fn.cycle.API = {
        opts: function() {
            return this._container.data("cycle.opts")
        },
        addInitialSlides: function() {
            var e = this.opts(),
                d = e.slides;
            e.slideCount = 0, e.slides = c(), d = d.jquery ? d : e.container.find(d), e.random && d.sort(function() {
                return Math.random() - 0.5
            }), e.API.add(d)
        },
        preInitSlideshow: function() {
            var e = this.opts();
            e.API.trigger("cycle-pre-initialize", [e]);
            var d = c.fn.cycle.transitions[e.fx];
            d && c.isFunction(d.preInit) && d.preInit(e), e._preInitialized = !0
        },
        postInitSlideshow: function() {
            var e = this.opts();
            e.API.trigger("cycle-post-initialize", [e]);
            var d = c.fn.cycle.transitions[e.fx];
            d && c.isFunction(d.postInit) && d.postInit(e)
        },
        initSlideshow: function() {
            var e, d = this.opts(),
                f = d.container;
            d.API.calcFirstSlide(), "static" == d.container.css("position") && d.container.css("position", "relative"), c(d.slides[d.currSlide]).css("opacity", 1).show(), d.API.stackSlides(d.slides[d.currSlide], d.slides[d.nextSlide], !d.reverse), d.pauseOnHover && (d.pauseOnHover !== !0 && (f = c(d.pauseOnHover)), f.hover(function() {
                d.API.pause(!0)
            }, function() {
                d.API.resume(!0)
            })), d.timeout && (e = d.API.getSlideOpts(d.nextSlide), d.API.queueTransition(e, e.timeout + d.delay)), d._initialized = !0, d.API.updateView(!0), d.API.trigger("cycle-initialized", [d]), d.API.postInitSlideshow()
        },
        pause: function(e) {
            var d = this.opts(),
                g = d.API.getSlideOpts(),
                f = d.hoverPaused || d.paused;
            e ? d.hoverPaused = !0 : d.paused = !0, f || (d.container.addClass("cycle-paused"), d.API.trigger("cycle-paused", [d]).log("cycle-paused"), g.timeout && (clearTimeout(d.timeoutId), d.timeoutId = 0, d._remainingTimeout -= c.now() - d._lastQueue, (0 > d._remainingTimeout || isNaN(d._remainingTimeout)) && (d._remainingTimeout = void 0)))
        },
        resume: function(g) {
            var f = this.opts(),
                d = !f.hoverPaused && !f.paused;
            g ? f.hoverPaused = !1 : f.paused = !1, d || (f.container.removeClass("cycle-paused"), 0 === f.slides.filter(":animated").length && f.API.queueTransition(f.API.getSlideOpts(), f._remainingTimeout), f.API.trigger("cycle-resumed", [f, f._remainingTimeout]).log("cycle-resumed"))
        },
        add: function(e, d) {
            var j, f = this.opts(),
                g = f.slideCount,
                h = !1;
            "string" == c.type(e) && (e = c.trim(e)), c(e).each(function() {
                var i, k = c(this);
                d ? f.container.prepend(k) : f.container.append(k), f.slideCount++, i = f.API.buildSlideOpts(k), f.slides = d ? c(k).add(f.slides) : f.slides.add(k), f.API.initSlide(i, k, --f._maxZ), k.data("cycle.opts", i), f.API.trigger("cycle-slide-added", [f, i, k])
            }), f.API.updateView(!0), h = f._preInitialized && 2 > g && f.slideCount >= 1, h && (f._initialized ? f.timeout && (j = f.slides.length, f.nextSlide = f.reverse ? j - 1 : 1, f.timeoutId || f.API.queueTransition(f)) : f.API.initSlideshow())
        },
        calcFirstSlide: function() {
            var f, d = this.opts();
            f = parseInt(d.startingSlide || 0, 10), (f >= d.slides.length || 0 > f) && (f = 0), d.currSlide = f, d.reverse ? (d.nextSlide = f - 1, 0 > d.nextSlide && (d.nextSlide = d.slides.length - 1)) : (d.nextSlide = f + 1, d.nextSlide == d.slides.length && (d.nextSlide = 0))
        },
        calcNextSlide: function() {
            var f, d = this.opts();
            d.reverse ? (f = 0 > d.nextSlide - 1, d.nextSlide = f ? d.slideCount - 1 : d.nextSlide - 1, d.currSlide = f ? 0 : d.nextSlide + 1) : (f = d.nextSlide + 1 == d.slides.length, d.nextSlide = f ? 0 : d.nextSlide + 1, d.currSlide = f ? d.slides.length - 1 : d.nextSlide - 1)
        },
        calcTx: function(e, d) {
            var g, f = e;
            return d && f.manualFx && (g = c.fn.cycle.transitions[f.manualFx]), g || (g = c.fn.cycle.transitions[f.fx]), g || (g = c.fn.cycle.transitions.fade, f.API.log('Transition "' + f.fx + '" not found.  Using fade.')), g
        },
        prepareTx: function(j, f) {
            var d, m, g, k, l, h = this.opts();
            return 2 > h.slideCount ? (h.timeoutId = 0, void 0) : (!j || h.busy && !h.manualTrump || (h.API.stopTransition(), h.busy = !1, clearTimeout(h.timeoutId), h.timeoutId = 0), h.busy || (0 !== h.timeoutId || j) && (m = h.slides[h.currSlide], g = h.slides[h.nextSlide], k = h.API.getSlideOpts(h.nextSlide), l = h.API.calcTx(k, j), h._tx = l, j && void 0 !== k.manualSpeed && (k.speed = k.manualSpeed), h.nextSlide != h.currSlide && (j || !h.paused && !h.hoverPaused && h.timeout) ? (h.API.trigger("cycle-before", [k, m, g, f]), l.before && l.before(k, m, g, f), d = function() {
                h.busy = !1, h.container.data("cycle.opts") && (l.after && l.after(k, m, g, f), h.API.trigger("cycle-after", [k, m, g, f]), h.API.queueTransition(k), h.API.updateView(!0))
            }, h.busy = !0, l.transition ? l.transition(k, m, g, f, d) : h.API.doTransition(k, m, g, f, d), h.API.calcNextSlide(), h.API.updateView()) : h.API.queueTransition(k)), void 0)
        },
        doTransition: function(m, h, f, p, e) {
            var j = m,
                d = c(h),
                g = c(f),
                k = function() {
                    g.animate(j.animIn || {
                        opacity: 1
                    }, j.speed, j.easeIn || j.easing, e)
                };
            g.css(j.cssBefore || {}), d.animate(j.animOut || {}, j.speed, j.easeOut || j.easing, function() {
                d.css(j.cssAfter || {}), j.sync || k()
            }), j.sync && k()
        },
        queueTransition: function(e, d) {
            var g = this.opts(),
                f = void 0 !== d ? d : e.timeout;
            return 0 === g.nextSlide && 0 === --g.loop ? (g.API.log("terminating; loop=0"), g.timeout = 0, f ? setTimeout(function() {
                g.API.trigger("cycle-finished", [g])
            }, f) : g.API.trigger("cycle-finished", [g]), g.nextSlide = g.currSlide, void 0) : (f && (g._lastQueue = c.now(), void 0 === d && (g._remainingTimeout = e.timeout), g.paused || g.hoverPaused || (g.timeoutId = setTimeout(function() {
                g.API.prepareTx(!1, !g.reverse)
            }, f))), void 0)
        },
        stopTransition: function() {
            var d = this.opts();
            d.slides.filter(":animated").length && (d.slides.stop(!1, !0), d.API.trigger("cycle-transition-stopped", [d])), d._tx && d._tx.stopTransition && d._tx.stopTransition(d)
        },
        advanceSlide: function(f) {
            var d = this.opts();
            return clearTimeout(d.timeoutId), d.timeoutId = 0, d.nextSlide = d.currSlide + f, 0 > d.nextSlide ? d.nextSlide = d.slides.length - 1 : d.nextSlide >= d.slides.length && (d.nextSlide = 0), d.API.prepareTx(!0, f >= 0), !1
        },
        buildSlideOpts: function(e) {
            var k, f, h = this.opts(),
                j = e.data() || {};
            for (var g in j) {
                j.hasOwnProperty(g) && /^cycle[A-Z]+/.test(g) && (k = j[g], f = g.match(/^cycle(.*)/)[1].replace(/^[A-Z]/, b), h.API.log("[" + (h.slideCount - 1) + "]", f + ":", k, "(" + typeof k + ")"), j[f] = k)
            }
            j = c.extend({}, c.fn.cycle.defaults, h, j), j.slideNum = h.slideCount;
            try {
                delete j.API, delete j.slideCount, delete j.currSlide, delete j.nextSlide, delete j.slides
            } catch (d) {}
            return j
        },
        getSlideOpts: function(e) {
            var d = this.opts();
            void 0 === e && (e = d.currSlide);
            var g = d.slides[e],
                f = c(g).data("cycle.opts");
            return c.extend({}, d, f)
        },
        initSlide: function(e, d, g) {
            var f = this.opts();
            d.css(e.slideCss || {}), g > 0 && d.css("zIndex", g), isNaN(e.speed) && (e.speed = c.fx.speeds[e.speed] || c.fx.speeds._default), e.sync || (e.speed = e.speed / 2), d.addClass(f.slideClass)
        },
        updateView: function(h, f) {
            var d = this.opts();
            if (d._initialized) {
                var j = d.API.getSlideOpts(),
                    g = d.slides[d.currSlide];
                !h && f !== !0 && (d.API.trigger("cycle-update-view-before", [d, j, g]), 0 > d.updateView) || (d.slideActiveClass && d.slides.removeClass(d.slideActiveClass).eq(d.currSlide).addClass(d.slideActiveClass), h && d.hideNonActive && d.slides.filter(":not(." + d.slideActiveClass + ")").hide(), d.API.trigger("cycle-update-view", [d, j, g, h]), h && d.API.trigger("cycle-update-view-after", [d, j, g]))
            }
        },
        getComponent: function(e) {
            var d = this.opts(),
                f = d[e];
            return "string" == typeof f ? /^\s*[\>|\+|~]/.test(f) ? d.container.find(f) : c(f) : f.jquery ? f : c(f)
        },
        stackSlides: function(e, d, k) {
            var f = this.opts();
            e || (e = f.slides[f.currSlide], d = f.slides[f.nextSlide], k = !f.reverse), c(e).css("zIndex", f.maxZ);
            var h, j = f.maxZ - 2,
                g = f.slideCount;
            if (k) {
                for (h = f.currSlide + 1; g > h; h++) {
                    c(f.slides[h]).css("zIndex", j--)
                }
                for (h = 0; f.currSlide > h; h++) {
                    c(f.slides[h]).css("zIndex", j--)
                }
            } else {
                for (h = f.currSlide - 1; h >= 0; h--) {
                    c(f.slides[h]).css("zIndex", j--)
                }
                for (h = g - 1; h > f.currSlide; h--) {
                    c(f.slides[h]).css("zIndex", j--)
                }
            }
            c(d).css("zIndex", f.maxZ - 1)
        },
        getSlideIndex: function(d) {
            return this.opts().slides.index(d)
        }
    }, c.fn.cycle.log = function() {
        window.console && console.log && console.log("[cycle2] " + Array.prototype.join.call(arguments, " "))
    }, c.fn.cycle.version = function() {
        return "Cycle2: " + a
    }, c.fn.cycle.transitions = {
        custom: {},
        none: {
            before: function(g, f, d, h) {
                g.API.stackSlides(d, f, h), g.cssBefore = {
                    opacity: 1,
                    display: "block"
                }
            }
        },
        fade: {
            before: function(e, d, h, f) {
                var g = e.API.getSlideOpts(e.nextSlide).slideCss || {};
                e.API.stackSlides(d, h, f), e.cssBefore = c.extend(g, {
                    opacity: 0,
                    display: "block"
                }), e.animIn = {
                    opacity: 1
                }, e.animOut = {
                    opacity: 0
                }
            }
        },
        fadeout: {
            before: function(e, d, h, f) {
                var g = e.API.getSlideOpts(e.nextSlide).slideCss || {};
                e.API.stackSlides(d, h, f), e.cssBefore = c.extend(g, {
                    opacity: 1,
                    display: "block"
                }), e.animOut = {
                    opacity: 0
                }
            }
        },
        scrollHorz: {
            before: function(h, f, d, j) {
                h.API.stackSlides(f, d, j);
                var g = h.container.css("overflow", "hidden").width();
                h.cssBefore = {
                    left: j ? g : -g,
                    top: 0,
                    opacity: 1,
                    display: "block"
                }, h.cssAfter = {
                    zIndex: h._maxZ - 2,
                    left: 0
                }, h.animIn = {
                    left: 0
                }, h.animOut = {
                    left: j ? -g : g
                }
            }
        }
    }, c.fn.cycle.defaults = {
        allowWrap: !0,
        autoSelector: ".cycle-slideshow[data-cycle-auto-init!=false]",
        delay: 0,
        easing: null,
        fx: "fade",
        hideNonActive: !0,
        loop: 0,
        manualFx: void 0,
        manualSpeed: void 0,
        manualTrump: !0,
        maxZ: 100,
        pauseOnHover: !1,
        reverse: !1,
        slideActiveClass: "cycle-slide-active",
        slideClass: "cycle-slide",
        slideCss: {
            position: "absolute",
            top: 0,
            left: 0
        },
        slides: "> img",
        speed: 500,
        startingSlide: 0,
        sync: !0,
        timeout: 4000,
        updateView: -1
    }, c(document).ready(function() {
        c(c.fn.cycle.defaults.autoSelector).cycle()
    })
})(jQuery),
function(d) {
    function b(e, k) {
        var g, i, j, h = k.autoHeight;
        if ("container" == h) {
            i = d(k.slides[k.currSlide]).outerHeight(), k.container.height(i)
        } else {
            if (k._autoHeightRatio) {
                k.container.height(k.container.width() / k._autoHeightRatio)
            } else {
                if ("calc" === h || "number" == d.type(h) && h >= 0) {
                    if (j = "calc" === h ? a(e, k) : h >= k.slides.length ? 0 : h, j == k._sentinelIndex) {
                        return
                    }
                    k._sentinelIndex = j, k._sentinel && k._sentinel.remove(), g = d(k.slides[j].cloneNode(!0)), g.removeAttr("id name rel").find("[id],[name],[rel]").removeAttr("id name rel"), g.css({
                        position: "static",
                        visibility: "hidden",
                        display: "block"
                    }).prependTo(k.container).addClass("cycle-sentinel cycle-slide").removeClass("cycle-slide-active"), g.find("*").css("visibility", "hidden"), k._sentinel = g
                }
            }
        }
    }

    function a(g, e) {
        var j = 0,
            h = -1;
        return e.slides.each(function(l) {
            var k = d(this).height();
            k > h && (h = k, j = l)
        }), j
    }

    function f(g, e, l, h) {
        var j = d(h).outerHeight(),
            k = e.sync ? e.speed / 2 : e.speed;
        e.container.animate({
            height: j
        }, k)
    }

    function c(e, g) {
        g._autoHeightOnResize && (d(window).off("resize orientationchange", g._autoHeightOnResize), g._autoHeightOnResize = null), g.container.off("cycle-slide-added cycle-slide-removed", b), g.container.off("cycle-destroyed", c), g.container.off("cycle-before", f), g._sentinel && (g._sentinel.remove(), g._sentinel = null)
    }
    d.extend(d.fn.cycle.defaults, {
        autoHeight: 0
    }), d(document).on("cycle-initialized", function(h, m) {
        function n() {
            b(h, m)
        }
        var j, g = m.autoHeight,
            e = d.type(g),
            k = null;
        ("string" === e || "number" === e) && (m.container.on("cycle-slide-added cycle-slide-removed", b), m.container.on("cycle-destroyed", c), "container" == g ? m.container.on("cycle-before", f) : "string" === e && /\d+\:\d+/.test(g) && (j = g.match(/(\d+)\:(\d+)/), j = j[1] / j[2], m._autoHeightRatio = j), "number" !== e && (m._autoHeightOnResize = function() {
                clearTimeout(k), k = setTimeout(n, 50)
            }, d(window).on("resize orientationchange", m._autoHeightOnResize)), setTimeout(n, 30))
    })
}(jQuery),
function(a) {
    a.extend(a.fn.cycle.defaults, {
        caption: "> .cycle-caption",
        captionTemplate: "{{slideNum}} / {{slideCount}}",
        overlay: "> .cycle-overlay",
        overlayTemplate: "<div>{{title}}</div><div>{{desc}}</div>",
        captionModule: "caption"
    }), a(document).on("cycle-update-view", function(c, b, e, d) {
        "caption" === b.captionModule && a.each(["caption", "overlay"], function() {
            var g = this,
                f = e[g + "Template"],
                h = b.API.getComponent(g);
            h.length && f ? (h.html(b.API.tmpl(f, e, b, d)), h.show()) : h.hide()
        })
    }), a(document).on("cycle-destroyed", function(c, b) {
        var d;
        a.each(["caption", "overlay"], function() {
            var g = this,
                f = b[g + "Template"];
            b[g] && f && (d = b.API.getComponent("caption"), d.empty())
        })
    })
}(jQuery),
function(b) {
    var a = b.fn.cycle;
    b.fn.cycle = function(d) {
        var h, e, f, g = b.makeArray(arguments);
        return "number" == b.type(d) ? this.cycle("goto", d) : "string" == b.type(d) ? this.each(function() {
            var c;
            return h = d, f = b(this).data("cycle.opts"), void 0 === f ? (a.log('slideshow must be initialized before sending commands; "' + h + '" ignored'), void 0) : (h = "goto" == h ? "jump" : h, e = f.API[h], b.isFunction(e) ? (c = b.makeArray(g), c.shift(), e.apply(f.API, c)) : (a.log("unknown command: ", h), void 0))
        }) : a.apply(this, arguments)
    }, b.extend(b.fn.cycle, a), b.extend(a.API, {
        next: function() {
            var d = this.opts();
            if (!d.busy || d.manualTrump) {
                var c = d.reverse ? -1 : 1;
                d.allowWrap === !1 && d.currSlide + c >= d.slideCount || (d.API.advanceSlide(c), d.API.trigger("cycle-next", [d]).log("cycle-next"))
            }
        },
        prev: function() {
            var d = this.opts();
            if (!d.busy || d.manualTrump) {
                var c = d.reverse ? 1 : -1;
                d.allowWrap === !1 && 0 > d.currSlide + c || (d.API.advanceSlide(c), d.API.trigger("cycle-prev", [d]).log("cycle-prev"))
            }
        },
        destroy: function() {
            this.stop();
            var d = this.opts(),
                c = b.isFunction(b._data) ? b._data : b.noop;
            clearTimeout(d.timeoutId), d.timeoutId = 0, d.API.stop(), d.API.trigger("cycle-destroyed", [d]).log("cycle-destroyed"), d.container.removeData(), c(d.container[0], "parsedAttrs", !1), d.retainStylesOnDestroy || (d.container.removeAttr("style"), d.slides.removeAttr("style"), d.slides.removeClass(d.slideActiveClass)), d.slides.each(function() {
                b(this).removeData(), c(this, "parsedAttrs", !1)
            })
        },
        jump: function(f) {
            var d, c = this.opts();
            if (!c.busy || c.manualTrump) {
                var g = parseInt(f, 10);
                if (isNaN(g) || 0 > g || g >= c.slides.length) {
                    return c.API.log("goto: invalid slide index: " + g), void 0
                }
                if (g == c.currSlide) {
                    return c.API.log("goto: skipping, already on slide", g), void 0
                }
                c.nextSlide = g, clearTimeout(c.timeoutId), c.timeoutId = 0, c.API.log("goto: ", g, " (zero-index)"), d = c.currSlide < c.nextSlide, c.API.prepareTx(!0, d)
            }
        },
        stop: function() {
            var d = this.opts(),
                c = d.container;
            clearTimeout(d.timeoutId), d.timeoutId = 0, d.API.stopTransition(), d.pauseOnHover && (d.pauseOnHover !== !0 && (c = b(d.pauseOnHover)), c.off("mouseenter mouseleave")), d.API.trigger("cycle-stopped", [d]).log("cycle-stopped")
        },
        reinit: function() {
            var c = this.opts();
            c.API.destroy(), c.container.cycle()
        },
        remove: function(e) {
            for (var d, k, f = this.opts(), h = [], j = 1, g = 0; f.slides.length > g; g++) {
                d = f.slides[g], g == e ? k = d : (h.push(d), b(d).data("cycle.opts").slideNum = j, j++)
            }
            k && (f.slides = b(h), f.slideCount--, b(k).remove(), e == f.currSlide ? f.API.advanceSlide(1) : f.currSlide > e ? f.currSlide-- : f.currSlide++, f.API.trigger("cycle-slide-removed", [f, e, k]).log("cycle-slide-removed"), f.API.updateView())
        }
    }), b(document).on("click.cycle", "[data-cycle-cmd]", function(d) {
        d.preventDefault();
        var c = b(this),
            f = c.data("cycle-cmd"),
            e = c.data("cycle-context") || ".cycle-slideshow";
        b(e).cycle(f, c.data("cycle-arg"))
    })
}(jQuery),
function(b) {
    function a(d, c) {
        var e;
        return d._hashFence ? (d._hashFence = !1, void 0) : (e = window.location.hash.substring(1), d.slides.each(function(f) {
            if (b(this).data("cycle-hash") == e) {
                if (c === !0) {
                    d.startingSlide = f
                } else {
                    var g = f > d.currSlide;
                    d.nextSlide = f, d.API.prepareTx(!0, g)
                }
                return !1
            }
        }), void 0)
    }
    b(document).on("cycle-pre-initialize", function(c, d) {
        a(d, !0), d._onHashChange = function() {
            a(d, !1)
        }, b(window).on("hashchange", d._onHashChange)
    }), b(document).on("cycle-update-view", function(f, d, c) {
        c.hash && "#" + c.hash != window.location.hash && (d._hashFence = !0, window.location.hash = c.hash)
    }), b(document).on("cycle-destroyed", function(d, c) {
        c._onHashChange && b(window).off("hashchange", c._onHashChange)
    })
}(jQuery),
function(a) {
    a.extend(a.fn.cycle.defaults, {
        loader: !1
    }), a(document).on("cycle-bootstrap", function(c, b) {
        function e(h, m) {
            function j(l) {
                var n;
                "wait" == b.loader ? (i.push(l), 0 === f && (i.sort(k), d.apply(b.API, [i, m]), b.container.removeClass("cycle-loading"))) : (n = a(b.slides[b.currSlide]), d.apply(b.API, [l, m]), n.show(), b.container.removeClass("cycle-loading"))
            }

            function k(n, l) {
                return n.data("index") - l.data("index")
            }
            var i = [];
            if ("string" == a.type(h)) {
                h = a.trim(h)
            } else {
                if ("array" === a.type(h)) {
                    for (var g = 0; h.length > g; g++) {
                        h[g] = a(h[g])[0]
                    }
                }
            }
            h = a(h);
            var f = h.length;
            f && (h.hide().appendTo("body").each(function(p) {
                function r() {
                    0 === --n && (--f, j(q))
                }
                var n = 0,
                    q = a(this),
                    o = q.is("img") ? q : q.find("img");
                return q.data("index", p), o = o.filter(":not(.cycle-loader-ignore)").filter(':not([src=""])'), o.length ? (n = o.length, o.each(function() {
                    this.complete ? r() : a(this).load(function() {
                        r()
                    }).error(function() {
                        0 === --n && (b.API.log("slide skipped; img not loaded:", this.src), 0 === --f && "wait" == b.loader && d.apply(b.API, [i, m]))
                    })
                }), void 0) : (--f, i.push(q), void 0)
            }), f && b.container.addClass("cycle-loading"))
        }
        var d;
        b.loader && (d = b.API.add, b.API.add = e)
    })
}(jQuery),
function(c) {
    function b(e, d, h) {
        var f, g = e.API.getComponent("pager");
        g.each(function() {
            var i = c(this);
            if (d.pagerTemplate) {
                var j = e.API.tmpl(d.pagerTemplate, d, e, h[0]);
                f = c(j).appendTo(i)
            } else {
                f = i.children().eq(e.slideCount - 1)
            }
            f.on(e.pagerEvent, function(k) {
                k.preventDefault(), e.API.page(i, k.currentTarget)
            })
        })
    }

    function a(h, f) {
        var d = this.opts();
        if (!d.busy || d.manualTrump) {
            var k = h.children().index(f),
                g = k,
                j = g > d.currSlide;
            d.currSlide != g && (d.nextSlide = g, d.API.prepareTx(!0, j), d.API.trigger("cycle-pager-activated", [d, h, f]))
        }
    }
    c.extend(c.fn.cycle.defaults, {
        pager: "> .cycle-pager",
        pagerActiveClass: "cycle-pager-active",
        pagerEvent: "click.cycle",
        pagerTemplate: "<span>&bull;</span>"
    }), c(document).on("cycle-bootstrap", function(f, d, g) {
        g.buildPagerLink = b
    }), c(document).on("cycle-slide-added", function(g, d, h, f) {
        d.pager && (d.API.buildPagerLink(d, h, f), d.API.page = a)
    }), c(document).on("cycle-slide-removed", function(e, d, g) {
        if (d.pager) {
            var f = d.API.getComponent("pager");
            f.each(function() {
                var h = c(this);
                c(h.children()[g]).remove()
            })
        }
    }), c(document).on("cycle-update-view", function(e, d) {
        var f;
        d.pager && (f = d.API.getComponent("pager"), f.each(function() {
            c(this).children().removeClass(d.pagerActiveClass).eq(d.currSlide).addClass(d.pagerActiveClass)
        }))
    }), c(document).on("cycle-destroyed", function(g, f) {
        var d = f.API.getComponent("pager");
        d && (d.children().off(f.pagerEvent), f.pagerTemplate && d.empty())
    })
}(jQuery),
function(a) {
    a.extend(a.fn.cycle.defaults, {
        next: "> .cycle-next",
        nextEvent: "click.cycle",
        disabledClass: "disabled",
        prev: "> .cycle-prev",
        prevEvent: "click.cycle",
        swipe: !1
    }), a(document).on("cycle-initialized", function(d, c) {
        if (c.API.getComponent("next").on(c.nextEvent, function(g) {
            g.preventDefault(), c.API.next()
        }), c.API.getComponent("prev").on(c.prevEvent, function(g) {
            g.preventDefault(), c.API.prev()
        }), c.swipe) {
            var b = c.swipeVert ? "swipeUp.cycle" : "swipeLeft.cycle swipeleft.cycle",
                f = c.swipeVert ? "swipeDown.cycle" : "swipeRight.cycle swiperight.cycle";
            c.container.on(b, function() {
                c.API.next()
            }), c.container.on(f, function() {
                c.API.prev()
            })
        }
    }), a(document).on("cycle-update-view", function(g, d) {
        if (!d.allowWrap) {
            var b = d.disabledClass,
                k = d.API.getComponent("next"),
                f = d.API.getComponent("prev"),
                h = d._prevBoundry || 0,
                j = void 0 !== d._nextBoundry ? d._nextBoundry : d.slideCount - 1;
            d.currSlide == j ? k.addClass(b).prop("disabled", !0) : k.removeClass(b).prop("disabled", !1), d.currSlide === h ? f.addClass(b).prop("disabled", !0) : f.removeClass(b).prop("disabled", !1)
        }
    }), a(document).on("cycle-destroyed", function(c, b) {
        b.API.getComponent("prev").off(b.nextEvent), b.API.getComponent("next").off(b.prevEvent), b.container.off("swipeleft.cycle swiperight.cycle swipeLeft.cycle swipeRight.cycle swipeUp.cycle swipeDown.cycle")
    })
}(jQuery),
function(a) {
    a.extend(a.fn.cycle.defaults, {
        progressive: !1
    }), a(document).on("cycle-pre-initialize", function(p, h) {
        if (h.progressive) {
            var f, q, e = h.API,
                k = e.next,
                b = e.prev,
                g = e.prepareTx,
                m = a.type(h.progressive);
            if ("array" == m) {
                f = h.progressive
            } else {
                if (a.isFunction(h.progressive)) {
                    f = h.progressive(h)
                } else {
                    if ("string" == m) {
                        if (q = a(h.progressive), f = a.trim(q.html()), !f) {
                            return
                        }
                        if (/^(\[)/.test(f)) {
                            try {
                                f = a.parseJSON(f)
                            } catch (j) {
                                return e.log("error parsing progressive slides", j), void 0
                            }
                        } else {
                            f = f.split(RegExp(q.data("cycle-split") || "\n")), f[f.length - 1] || f.pop()
                        }
                    }
                }
            }
            g && (e.prepareTx = function(i, c) {
                var d, l;
                return i || 0 === f.length ? (g.apply(h.API, [i, c]), void 0) : (c && h.currSlide == h.slideCount - 1 ? (l = f[0], f = f.slice(1), h.container.one("cycle-slide-added", function(o, n) {
                    setTimeout(function() {
                        n.API.advanceSlide(1)
                    }, 50)
                }), h.API.add(l)) : c || 0 !== h.currSlide ? g.apply(h.API, [i, c]) : (d = f.length - 1, l = f[d], f = f.slice(0, d), h.container.one("cycle-slide-added", function(o, n) {
                    setTimeout(function() {
                        n.currSlide = 1, n.API.advanceSlide(-1)
                    }, 50)
                }), h.API.add(l, !0)), void 0)
            }), k && (e.next = function() {
                var d = this.opts();
                if (f.length && d.currSlide == d.slideCount - 1) {
                    var c = f[0];
                    f = f.slice(1), d.container.one("cycle-slide-added", function(l, i) {
                        k.apply(i.API), i.container.removeClass("cycle-loading")
                    }), d.container.addClass("cycle-loading"), d.API.add(c)
                } else {
                    k.apply(d.API)
                }
            }), b && (e.prev = function() {
                var l = this.opts();
                if (f.length && 0 === l.currSlide) {
                    var d = f.length - 1,
                        c = f[d];
                    f = f.slice(0, d), l.container.one("cycle-slide-added", function(n, i) {
                        i.currSlide = 1, i.API.advanceSlide(-1), i.container.removeClass("cycle-loading")
                    }), l.container.addClass("cycle-loading"), l.API.add(c, !0)
                } else {
                    b.apply(l.API)
                }
            })
        }
    })
}(jQuery),
function(a) {
    a.extend(a.fn.cycle.defaults, {
        tmplRegex: "{{((.)?.*?)}}"
    }), a.extend(a.fn.cycle.API, {
        tmpl: function(c, b) {
            var e = RegExp(b.tmplRegex || a.fn.cycle.defaults.tmplRegex, "g"),
                d = a.makeArray(arguments);
            return d.shift(), c.replace(e, function(h, g) {
                var p, k, m, j, f = g.split(".");
                for (p = 0; d.length > p; p++) {
                    if (m = d[p]) {
                        if (f.length > 1) {
                            for (j = m, k = 0; f.length > k; k++) {
                                m = j, j = j[f[k]] || g
                            }
                        } else {
                            j = m[g]
                        } if (a.isFunction(j)) {
                            return j.apply(m, d)
                        }
                        if (void 0 !== j && null !== j && j != g) {
                            return j
                        }
                    }
                }
                return g
            })
        }
    })
}(jQuery);
(function(a) {
    a(document).on("cycle-bootstrap", function(d, c, b) {
        "carousel" === c.fx && (b.getSlideIndex = function(h) {
            var g = this.opts()._carouselWrap.children(),
                f = g.index(h);
            return f % g.length
        }, b.next = function() {
            var f = c.reverse ? -1 : 1;
            c.allowWrap === !1 && c.currSlide + f > c.slideCount - c.carouselVisible || (c.API.advanceSlide(f), c.API.trigger("cycle-next", [c]).log("cycle-next"))
        })
    }), a.fn.cycle.transitions.carousel = {
        preInit: function(c) {
            c.hideNonActive = !1, c.container.on("cycle-destroyed", a.proxy(this.onDestroy, c.API)), c.API.stopTransition = this.stopTransition;
            for (var b = 0; c.startingSlide > b; b++) {
                c.container.append(c.slides[0])
            }
        },
        postInit: function(e) {
            var d, k, f, h, b = e.carouselVertical;
            e.carouselVisible && e.carouselVisible > e.slideCount && (e.carouselVisible = e.slideCount - 1);
            var g = e.carouselVisible || e.slides.length,
                j = {
                    display: b ? "block" : "inline-block",
                    position: "static"
                };
            if (e.container.css({
                position: "relative",
                overflow: "hidden"
            }), e.slides.css(j), e._currSlide = e.currSlide, h = a('<div class="cycle-carousel-wrap"></div>').prependTo(e.container).css({
                margin: 0,
                padding: 0,
                top: 0,
                left: 0,
                position: "absolute"
            }).append(e.slides), e._carouselWrap = h, b || h.css("white-space", "nowrap"), e.allowWrap !== !1) {
                for (k = 0;
                    (void 0 === e.carouselVisible ? 2 : 1) > k; k++) {
                    for (d = 0; e.slideCount > d; d++) {
                        h.append(e.slides[d].cloneNode(!0))
                    }
                    for (d = e.slideCount; d--;) {
                        h.prepend(e.slides[d].cloneNode(!0))
                    }
                }
                h.find(".cycle-slide-active").removeClass("cycle-slide-active"), e.slides.eq(e.startingSlide).addClass("cycle-slide-active")
            }
            e.pager && e.allowWrap === !1 && (f = e.slideCount - g, a(e.pager).children().filter(":gt(" + f + ")").hide()), e._nextBoundry = e.slideCount - e.carouselVisible, this.prepareDimensions(e)
        },
        prepareDimensions: function(d) {
            var c, h, e, g = d.carouselVertical,
                b = d.carouselVisible || d.slides.length;
            if (d.carouselFluid && d.carouselVisible ? d._carouselResizeThrottle || this.fluidSlides(d) : d.carouselVisible && d.carouselSlideDimension ? (c = b * d.carouselSlideDimension, d.container[g ? "height" : "width"](c)) : d.carouselVisible && (c = b * a(d.slides[0])[g ? "outerHeight" : "outerWidth"](!0), d.container[g ? "height" : "width"](c)), h = d.carouselOffset || 0, d.allowWrap !== !1) {
                if (d.carouselSlideDimension) {
                    h -= (d.slideCount + d.currSlide) * d.carouselSlideDimension
                } else {
                    e = d._carouselWrap.children();
                    for (var f = 0; d.slideCount + d.currSlide > f; f++) {
                        h -= a(e[f])[g ? "outerHeight" : "outerWidth"](!0)
                    }
                }
            }
            d._carouselWrap.css(g ? "top" : "left", h)
        },
        fluidSlides: function(d) {
            function c() {
                clearTimeout(e), e = setTimeout(h, 20)
            }

            function h() {
                d._carouselWrap.stop(!1, !0);
                var i = d.container.width() / d.carouselVisible;
                i = Math.ceil(i - b), d._carouselWrap.children().width(i), d._sentinel && d._sentinel.width(i), f(d)
            }
            var e, g = d.slides.eq(0),
                b = g.outerWidth() - g.width(),
                f = this.prepareDimensions;
            a(window).on("resize", c), d._carouselResizeThrottle = c, h()
        },
        transition: function(j, w, g, x, f) {
            var h, b = {}, m = j.nextSlide - j.currSlide,
                q = j.carouselVertical,
                k = j.speed;
            if (j.allowWrap === !1) {
                x = m > 0;
                var v = j._currSlide,
                    e = j.slideCount - j.carouselVisible;
                m > 0 && j.nextSlide > e && v == e ? m = 0 : m > 0 && j.nextSlide > e ? m = j.nextSlide - v - (j.nextSlide - e) : 0 > m && j.currSlide > e && j.nextSlide > e ? m = 0 : 0 > m && j.currSlide > e ? m += j.currSlide - e : v = j.currSlide, h = this.getScroll(j, q, v, m), j.API.opts()._currSlide = j.nextSlide > e ? e : j.nextSlide
            } else {
                x && 0 === j.nextSlide ? (h = this.getDim(j, j.currSlide, q), f = this.genCallback(j, x, q, f)) : x || j.nextSlide != j.slideCount - 1 ? h = this.getScroll(j, q, j.currSlide, m) : (h = this.getDim(j, j.currSlide, q), f = this.genCallback(j, x, q, f))
            }
            b[q ? "top" : "left"] = x ? "-=" + h : "+=" + h, j.throttleSpeed && (k = h / a(j.slides[0])[q ? "height" : "width"]() * j.speed), j._carouselWrap.animate(b, k, j.easing, f)
        },
        getDim: function(c, b, e) {
            var d = a(c.slides[b]);
            return d[e ? "outerHeight" : "outerWidth"](!0)
        },
        getScroll: function(f, c, b, h) {
            var d, g = 0;
            if (h > 0) {
                for (d = b; b + h > d; d++) {
                    g += this.getDim(f, d, c)
                }
            } else {
                for (d = b; d > b + h; d--) {
                    g += this.getDim(f, d, c)
                }
            }
            return g
        },
        genCallback: function(c, b, e, d) {
            return function() {
                var f = a(c.slides[c.nextSlide]).position(),
                    g = 0 - f[e ? "top" : "left"] + (c.carouselOffset || 0);
                c._carouselWrap.css(c.carouselVertical ? "top" : "left", g), d()
            }
        },
        stopTransition: function() {
            var b = this.opts();
            b.slides.stop(!1, !0), b._carouselWrap.stop(!1, !0)
        },
        onDestroy: function() {
            var b = this.opts();
            b._carouselResizeThrottle && a(window).off("resize", b._carouselResizeThrottle), b.slides.prependTo(b.container), b._carouselWrap.remove()
        }
    }
})(jQuery);
(function(f) {
    var c = f(window);
    var d = f("body");
    var e = false;
    var j = (typeof matchMedia !== "undefined");
    if (j) {
        k();
        c.on("resize", function() {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(k, 200)
        })
    } else {
        e = true;
        d.addClass("wide")
    }

    function k() {
        if (window.matchMedia("screen and (min-width: 761px)").matches) {
            e = true;
            d.addClass("wide")
        } else {
            e = false;
            d.removeClass("wide")
        }
        f(".panel, .panel-content, .panel-title").removeAttr("style");
        f(".panel-content a").blur()
    }
    var g = {
        expandHorz: function(l) {
            f(".panel-title").stop(true, true).fadeOut(200);
            l.stop().removeClass("compressed").addClass("expanded").animate({
                width: "64%"
            }, 700);
            f(".panel-content", l).stop(true, true).delay(400).fadeIn(400);
            l.siblings(".panel").stop().removeClass("expanded").addClass("compressed").animate({
                width: "12%"
            }, 700);
            l.siblings(".panel").find(".panel-content").stop(true, true).fadeOut(400, function() {
                f(this).delay(500).removeAttr("style")
            });
            i("open", (f(".panel").index(l) + 1), l.attr("id"))
        },
        contractHorz: function() {
            f(".panel").stop().animate({
                width: "25%"
            }, 700, function() {
                f(".panel-title").fadeIn(250)
            }).removeClass("expanded compressed");
            f(".panel-content").stop(true, true).delay(200).fadeOut(500)
        },
        expandVert: function(l) {
            f(".panel-title").stop(true, true).fadeOut(200);
            l.stop().removeClass("compressed").addClass("expanded").animate({
                height: "22em"
            }, 700);
            l.siblings(".panel").stop().removeClass("expanded").addClass("compressed").animate({
                height: "3em"
            }, 700);
            f(".panel-content", l).stop(true, true).delay(400).fadeIn(400);
            l.siblings(".panel").find(".panel-content").stop(true, true).fadeOut(400, function() {
                f(this).delay(500).removeAttr("style")
            });
            i("open", (f(".panel").index(l) + 1), l.attr("id"))
        },
        contractVert: function() {
            f(".panel").stop().animate({
                height: "4.5em"
            }, 700, function() {
                f(".panel-title").fadeIn(250)
            }).removeClass("expanded compressed");
            f(".panel-content").stop(true, true).fadeOut(500)
        },
    };
    var h = 200;
    var a;
    f(".accordion").on("mouseleave", function() {
        clearTimeout(a);
        h = 200
    });
    f(".panel").hover(function() {
        var l = f(this);
        clearTimeout(a);
        a = setTimeout(function() {
            if (e) {
                g.expandHorz(l)
            } else {
                g.expandVert(l)
            }
            h = 0
        }, h)
    }, function() {
        if (e) {
            g.contractHorz(f(this))
        } else {
            g.contractVert()
        }
    });
    f(".panel").on("click focus", function(l) {
        if (!f(this).hasClass("expanded")) {
            if (e) {
                g.expandHorz(f(this))
            } else {
                g.expandVert(f(this))
            }
        }
    });
    f(".panel > a").on("blur", function() {
        if (e) {
            g.contractHorz()
        } else {
            g.contractVert()
        }
    });

    function b() {
        var l = f('<button type="button" class="btn-next">' + window.trans("news-next") + "</button>");
        var m = f('<button type="button" class="btn-prev">' + window.trans("news-prev") + "</button>");
        var n = f('<span class="news-buttons"></span>');
        l.prependTo(n);
        m.prependTo(n);
        n.prependTo(".extra-news > .control");
        f(".news-buttons .btn-next").bind("click", function() {
            gaTrack(["_trackEvent", "Mozilla in the News Interactions", "Next", "News Navigation Arrows"])
        });
        f(".news-buttons .btn-prev").bind("click", function() {
            gaTrack(["_trackEvent", "Mozilla in the News Interactions", "Previous", "News Navigation Arrows"])
        })
    }
    b();
    var i = function(l, m) {
        gaTrack(["_trackEvent", "Homepage Interactions", "open", l + ":" + m])
    };
    f(".panel-content a").on("click", function(n) {
        n.preventDefault();
        var l = f(this).parents(".panel");
        var m = this.href;
        var o = function() {
            f(this).blur();
            window.open(m, '_blank')
        };
        gaTrack(["_trackEvent", "Homepage Interactions", "click", (l.index() + 1) + ":" + l.attr("id")], o)
    });
    f("#home-promo-donate-form").submit(function(n) {
        n.preventDefault();
        var m = f(this);
        m.unbind("submit");
        var l = f(this).parents(".panel");
        gaTrack(["_trackEvent", "Homepage Interactions", "submit", (l.index() + 1) + ":donate"], function() {
            m.submit()
        })
    });
    f(".extra-news a").on("click", function(m) {
        m.preventDefault();
        var l = this.href;
        var n = function() {
            window.location = l
        };
        gaTrack(["_trackEvent", "Mozilla in the News Interactions", "click", l], n)
    });
    f(".extra-contribute a, .engage a").on("click", function(m) {
        m.preventDefault();
        var l = this.href;
        var n = function() {
            window.location = l
        };
        gaTrack(["_trackEvent", "Get Involved Interactions", "clicks", "Get Involved Button"], n)
    });
    f(".download-link").on("click", function(n) {
        n.preventDefault();
        var m = this.href;
        var o = function() {
            window.location = m
        };
        var l;
        if (f(this).parents("li").hasClass("os_android")) {
            l = "Firefox for Android"
        } else {
            l = "Firefox Desktop"
        }
        gaTrack(["_trackEvent", "Firefox Downloads", "download click", l], o)
    })
})(window.jQuery);
