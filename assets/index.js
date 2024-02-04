function x() {
    return x = Object.assign ? Object.assign.bind() : function(o) {
        for (var t = 1; t < arguments.length; t++) {
            var e = arguments[t];
            for (var i in e)
                Object.prototype.hasOwnProperty.call(e, i) && (o[i] = e[i])
        }
        return o
    }
    ,
    x.apply(this, arguments)
}
function M(o, t, e) {
    return Math.max(o, Math.min(t, e))
}
class V {
    advance(t) {
        var e;
        if (!this.isRunning)
            return;
        let i = !1;
        if (this.lerp)
            this.value = (s = this.value,
            n = this.to,
            (1 - (r = 1 - Math.exp(-60 * this.lerp * t))) * s + r * n),
            Math.round(this.value) === this.to && (this.value = this.to,
            i = !0);
        else {
            this.currentTime += t;
            const a = M(0, this.currentTime / this.duration, 1);
            i = a >= 1;
            const l = i ? 1 : this.easing(a);
            this.value = this.from + (this.to - this.from) * l
        }
        var s, n, r;
        (e = this.onUpdate) == null || e.call(this, this.value, {
            completed: i
        }),
        i && this.stop()
    }
    stop() {
        this.isRunning = !1
    }
    fromTo(t, e, {lerp: i=.1, duration: s=1, easing: n=a=>a, onUpdate: r}) {
        this.from = this.value = t,
        this.to = e,
        this.lerp = i,
        this.duration = s,
        this.easing = n,
        this.currentTime = 0,
        this.isRunning = !0,
        this.onUpdate = r
    }
}
class F {
    constructor({wrapper: t, content: e, autoResize: i=!0}={}) {
        if (this.resize = ()=>{
            this.onWrapperResize(),
            this.onContentResize()
        }
        ,
        this.onWrapperResize = ()=>{
            this.wrapper === window ? (this.width = window.innerWidth,
            this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth,
            this.height = this.wrapper.clientHeight)
        }
        ,
        this.onContentResize = ()=>{
            this.scrollHeight = this.content.scrollHeight,
            this.scrollWidth = this.content.scrollWidth
        }
        ,
        this.wrapper = t,
        this.content = e,
        i) {
            const s = function(n, r) {
                let a;
                return function() {
                    let l = arguments
                      , h = this;
                    clearTimeout(a),
                    a = setTimeout(function() {
                        n.apply(h, l)
                    }, 250)
                }
            }(this.resize);
            this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(s),
            this.wrapperResizeObserver.observe(this.wrapper)),
            this.contentResizeObserver = new ResizeObserver(s),
            this.contentResizeObserver.observe(this.content)
        }
        this.resize()
    }
    destroy() {
        var t, e;
        (t = this.wrapperResizeObserver) == null || t.disconnect(),
        (e = this.contentResizeObserver) == null || e.disconnect()
    }
    get limit() {
        return {
            x: this.scrollWidth - this.width,
            y: this.scrollHeight - this.height
        }
    }
}
class B {
    constructor() {
        this.events = {}
    }
    emit(t, ...e) {
        let i = this.events[t] || [];
        for (let s = 0, n = i.length; s < n; s++)
            i[s](...e)
    }
    on(t, e) {
        var i;
        return (i = this.events[t]) != null && i.push(e) || (this.events[t] = [e]),
        ()=>{
            var s;
            this.events[t] = (s = this.events[t]) == null ? void 0 : s.filter(n=>e !== n)
        }
    }
    off(t, e) {
        var i;
        this.events[t] = (i = this.events[t]) == null ? void 0 : i.filter(s=>e !== s)
    }
    destroy() {
        this.events = {}
    }
}
class k {
    constructor(t, {wheelMultiplier: e=1, touchMultiplier: i=2, normalizeWheel: s=!1}) {
        this.onTouchStart = n=>{
            const {clientX: r, clientY: a} = n.targetTouches ? n.targetTouches[0] : n;
            this.touchStart.x = r,
            this.touchStart.y = a,
            this.lastDelta = {
                x: 0,
                y: 0
            }
        }
        ,
        this.onTouchMove = n=>{
            const {clientX: r, clientY: a} = n.targetTouches ? n.targetTouches[0] : n
              , l = -(r - this.touchStart.x) * this.touchMultiplier
              , h = -(a - this.touchStart.y) * this.touchMultiplier;
            this.touchStart.x = r,
            this.touchStart.y = a,
            this.lastDelta = {
                x: l,
                y: h
            },
            this.emitter.emit("scroll", {
                deltaX: l,
                deltaY: h,
                event: n
            })
        }
        ,
        this.onTouchEnd = n=>{
            this.emitter.emit("scroll", {
                deltaX: this.lastDelta.x,
                deltaY: this.lastDelta.y,
                event: n
            })
        }
        ,
        this.onWheel = n=>{
            let {deltaX: r, deltaY: a} = n;
            this.normalizeWheel && (r = M(-100, r, 100),
            a = M(-100, a, 100)),
            r *= this.wheelMultiplier,
            a *= this.wheelMultiplier,
            this.emitter.emit("scroll", {
                deltaX: r,
                deltaY: a,
                event: n
            })
        }
        ,
        this.element = t,
        this.wheelMultiplier = e,
        this.touchMultiplier = i,
        this.normalizeWheel = s,
        this.touchStart = {
            x: null,
            y: null
        },
        this.emitter = new B,
        this.element.addEventListener("wheel", this.onWheel, {
            passive: !1
        }),
        this.element.addEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }),
        this.element.addEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }),
        this.element.addEventListener("touchend", this.onTouchEnd, {
            passive: !1
        })
    }
    on(t, e) {
        return this.emitter.on(t, e)
    }
    destroy() {
        this.emitter.destroy(),
        this.element.removeEventListener("wheel", this.onWheel, {
            passive: !1
        }),
        this.element.removeEventListener("touchstart", this.onTouchStart, {
            passive: !1
        }),
        this.element.removeEventListener("touchmove", this.onTouchMove, {
            passive: !1
        }),
        this.element.removeEventListener("touchend", this.onTouchEnd, {
            passive: !1
        })
    }
}
class G {
    constructor({wrapper: t=window, content: e=document.documentElement, wheelEventsTarget: i=t, smoothWheel: s=!0, smoothTouch: n=!1, syncTouch: r=!1, syncTouchLerp: a=.1, __iosNoInertiaSyncTouchLerp: l=.4, touchInertiaMultiplier: h=35, duration: v, easing: b=d=>Math.min(1, 1.001 - Math.pow(2, -10 * d)), lerp: c=v && .1, infinite: _=!1, orientation: L="vertical", gestureOrientation: j="vertical", touchMultiplier: q=1, wheelMultiplier: C=1, normalizeWheel: H=!1, autoResize: A=!0}={}) {
        this.onVirtualScroll = ({deltaX: d, deltaY: y, event: m})=>{
            if (m.ctrlKey)
                return;
            const w = m.type.includes("touch")
              , Y = m.type.includes("wheel");
            if (this.options.gestureOrientation === "vertical" && y === 0 || this.options.gestureOrientation === "horizontal" && d === 0 || w && this.options.gestureOrientation === "vertical" && this.scroll === 0 && !this.options.infinite && y <= 0)
                return;
            let z = m.composedPath();
            if (z = z.slice(0, z.indexOf(this.rootElement)),
            z.find(p=>{
                var X;
                return (p.hasAttribute == null ? void 0 : p.hasAttribute("data-lenis-prevent")) || w && (p.hasAttribute == null ? void 0 : p.hasAttribute("data-lenis-prevent-touch")) || Y && (p.hasAttribute == null ? void 0 : p.hasAttribute("data-lenis-prevent-wheel")) || ((X = p.classList) == null ? void 0 : X.contains("lenis"))
            }
            ))
                return;
            if (this.isStopped || this.isLocked)
                return void m.preventDefault();
            if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && w || this.options.smoothWheel && Y,
            !this.isSmooth)
                return this.isScrolling = !1,
                void this.animate.stop();
            m.preventDefault();
            let E = y;
            this.options.gestureOrientation === "both" ? E = Math.abs(y) > Math.abs(d) ? y : d : this.options.gestureOrientation === "horizontal" && (E = d);
            const D = w && this.options.syncTouch
              , $ = w && m.type === "touchend" && Math.abs(E) > 1;
            $ && (E = this.velocity * this.options.touchInertiaMultiplier),
            this.scrollTo(this.targetScroll + E, x({
                programmatic: !1
            }, D && {
                lerp: $ ? this.syncTouchLerp : this.options.__iosNoInertiaSyncTouchLerp
            }))
        }
        ,
        this.onScroll = ()=>{
            if (!this.isScrolling) {
                const d = this.animatedScroll;
                this.animatedScroll = this.targetScroll = this.actualScroll,
                this.velocity = 0,
                this.direction = Math.sign(this.animatedScroll - d),
                this.emit()
            }
        }
        ,
        window.lenisVersion = "1.0.23",
        t !== document.documentElement && t !== document.body || (t = window),
        this.options = {
            wrapper: t,
            content: e,
            wheelEventsTarget: i,
            smoothWheel: s,
            smoothTouch: n,
            syncTouch: r,
            syncTouchLerp: a,
            __iosNoInertiaSyncTouchLerp: l,
            touchInertiaMultiplier: h,
            duration: v,
            easing: b,
            lerp: c,
            infinite: _,
            gestureOrientation: j,
            orientation: L,
            touchMultiplier: q,
            wheelMultiplier: C,
            normalizeWheel: H,
            autoResize: A
        },
        this.dimensions = new F({
            wrapper: t,
            content: e,
            autoResize: A
        }),
        this.rootElement.classList.add("lenis"),
        this.velocity = 0,
        this.isStopped = !1,
        this.isSmooth = s || n,
        this.isScrolling = !1,
        this.targetScroll = this.animatedScroll = this.actualScroll,
        this.animate = new V,
        this.emitter = new B,
        this.options.wrapper.addEventListener("scroll", this.onScroll, {
            passive: !1
        }),
        this.virtualScroll = new k(i,{
            touchMultiplier: q,
            wheelMultiplier: C,
            normalizeWheel: H
        }),
        this.virtualScroll.on("scroll", this.onVirtualScroll)
    }
    destroy() {
        this.emitter.destroy(),
        this.options.wrapper.removeEventListener("scroll", this.onScroll, {
            passive: !1
        }),
        this.virtualScroll.destroy(),
        this.dimensions.destroy(),
        this.rootElement.classList.remove("lenis"),
        this.rootElement.classList.remove("lenis-smooth"),
        this.rootElement.classList.remove("lenis-scrolling"),
        this.rootElement.classList.remove("lenis-stopped")
    }
    on(t, e) {
        return this.emitter.on(t, e)
    }
    off(t, e) {
        return this.emitter.off(t, e)
    }
    setScroll(t) {
        this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t
    }
    resize() {
        this.dimensions.resize()
    }
    emit() {
        this.emitter.emit("scroll", this)
    }
    reset() {
        this.isLocked = !1,
        this.isScrolling = !1,
        this.velocity = 0,
        this.animate.stop()
    }
    start() {
        this.isStopped = !1,
        this.reset()
    }
    stop() {
        this.isStopped = !0,
        this.animate.stop(),
        this.reset()
    }
    raf(t) {
        const e = t - (this.time || t);
        this.time = t,
        this.animate.advance(.001 * e)
    }
    scrollTo(t, {offset: e=0, immediate: i=!1, lock: s=!1, duration: n=this.options.duration, easing: r=this.options.easing, lerp: a=!n && this.options.lerp, onComplete: l=null, force: h=!1, programmatic: v=!0}={}) {
        if (!this.isStopped || h) {
            if (["top", "left", "start"].includes(t))
                t = 0;
            else if (["bottom", "right", "end"].includes(t))
                t = this.limit;
            else {
                var b;
                let c;
                if (typeof t == "string" ? c = document.querySelector(t) : (b = t) != null && b.nodeType && (c = t),
                c) {
                    if (this.options.wrapper !== window) {
                        const L = this.options.wrapper.getBoundingClientRect();
                        e -= this.isHorizontal ? L.left : L.top
                    }
                    const _ = c.getBoundingClientRect();
                    t = (this.isHorizontal ? _.left : _.top) + this.animatedScroll
                }
            }
            if (typeof t == "number") {
                if (t += e,
                t = Math.round(t),
                this.options.infinite ? v && (this.targetScroll = this.animatedScroll = this.scroll) : t = M(0, t, this.limit),
                i)
                    return this.animatedScroll = this.targetScroll = t,
                    this.setScroll(this.scroll),
                    this.reset(),
                    this.emit(),
                    void (l == null || l());
                if (!v) {
                    if (t === this.targetScroll)
                        return;
                    this.targetScroll = t
                }
                this.animate.fromTo(this.animatedScroll, t, {
                    duration: n,
                    easing: r,
                    lerp: a,
                    onUpdate: (c,{completed: _})=>{
                        s && (this.isLocked = !0),
                        this.isScrolling = !0,
                        this.velocity = c - this.animatedScroll,
                        this.direction = Math.sign(this.velocity),
                        this.animatedScroll = c,
                        this.setScroll(this.scroll),
                        v && (this.targetScroll = c),
                        _ && (s && (this.isLocked = !1),
                        requestAnimationFrame(()=>{
                            this.isScrolling = !1
                        }
                        ),
                        this.velocity = 0,
                        l?.()),
                        this.emit()
                    }
                })
            }
        }
    }
    get rootElement() {
        return this.options.wrapper === window ? this.options.content : this.options.wrapper
    }
    get limit() {
        return this.dimensions.limit[this.isHorizontal ? "x" : "y"]
    }
    get isHorizontal() {
        return this.options.orientation === "horizontal"
    }
    get actualScroll() {
        return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop
    }
    get scroll() {
        return this.options.infinite ? (this.animatedScroll % (t = this.limit) + t) % t : this.animatedScroll;
        var t
    }
    get progress() {
        return this.limit === 0 ? 1 : this.scroll / this.limit
    }
    get isSmooth() {
        return this.__isSmooth
    }
    set isSmooth(t) {
        this.__isSmooth !== t && (this.rootElement.classList.toggle("lenis-smooth", t),
        this.__isSmooth = t)
    }
    get isScrolling() {
        return this.__isScrolling
    }
    set isScrolling(t) {
        this.__isScrolling !== t && (this.rootElement.classList.toggle("lenis-scrolling", t),
        this.__isScrolling = t)
    }
    get isStopped() {
        return this.__isStopped
    }
    set isStopped(t) {
        this.__isStopped !== t && (this.rootElement.classList.toggle("lenis-stopped", t),
        this.__isStopped = t)
    }
    get className() {
        let t = "lenis";
        return this.isStopped && (t += " lenis-stopped"),
        this.isScrolling && (t += " lenis-scrolling"),
        this.isSmooth && (t += " lenis-smooth"),
        t
    }
}
const N = new G;
function I(o) {
    N.raf(o),
    requestAnimationFrame(I)
}
requestAnimationFrame(I);
document.querySelectorAll('a[href^="#"]').forEach(o=>{
    o.addEventListener("click", function(t) {
        t.preventDefault(),
        N.scrollTo(o.getAttribute("href"))
    })
}
);
function S(o, t=document) {
    return t.getElementsByClassName(o)
}
function U(o, t=document) {
    return t.querySelector(o)
}
function J(o, t=document) {
    return t.querySelectorAll(o)
}
function P(o, t, e) {
    for (let i = 0, s = o.length; i < s; i++)
        t.call(e, o[i], i)
}
function K(o, ...t) {
    o.length === void 0 ? e(o, ...t) : P(o, i=>{
        e(i, ...t)
    }
    );
    function e(i, ...s) {
        s.forEach(n=>{
            i.classList.add(n)
        }
        )
    }
}
function g(o, t, e, i) {
    o.addEventListener(t, e, i)
}
function f(o, t, e, i) {
    o.removeEventListener(t, e, i)
}
function Q(o, t) {
    return o.getAttribute(t)
}
function W(o, t, e) {
    o.setAttribute(t, e)
}
function Z(o, t) {
    o.removeAttribute(t)
}
const T = {
    css3easing: "linear",
    delayBeforeStart: 1e3,
    direction: "left",
    duplicated: !1,
    duration: 5e3,
    gap: 20,
    pauseOnHover: !1,
    recalcResize: !1,
    speed: 0,
    startVisible: !1
};
let R = 0;
class tt {
    constructor(t, e) {
        if (typeof t > "u")
            throw new Error("el cannot be undefined");
        if (typeof t == "string")
            throw new Error("el cannot be just a selector");
        if (t === null)
            throw new Error("el cannot be null");
        e = {
            ...T,
            ...e
        },
        this.el = t,
        this._loopCount = 3;
        for (const l in T) {
            let h = Q(t, `data-${T[l]}`);
            h !== null && h !== "" && ((h === "true" || h === "false") && (h = !!h),
            e[l] = h)
        }
        e.speed && (e.duration = parseInt(t.clientWidth) / e.speed * 1e3),
        e.gap = e.duplicated ? parseInt(e.gap) : 0,
        t.innerHTML = `<div class="js-marquee">${t.innerHTML}</div>`;
        const i = S("js-marquee", t)[0];
        i.style.marginRight = `${e.gap}px`,
        i.style.willChange = "transform",
        i.style.float = "left",
        e.duplicated && t.appendChild(i.cloneNode(!0)),
        t.innerHTML = `<div style="width:100000px" class="js-marquee-wrapper">${t.innerHTML}</div>`;
        const s = S("js-marquee-wrapper", t)[0]
          , n = e.direction === "up" || e.direction === "down";
        this._marqWrap = s,
        this._vertical = n,
        this._duration = e.duration,
        this._opts = e,
        this._calcSizes();
        const r = `marqueeAnimation-${Math.floor(Math.random() * 1e7)}`
          , a = this._animationStr(r, e.duration / 1e3, e.delayBeforeStart / 1e3, "infinite");
        this._animName = r,
        this._animStr = a,
        e.duplicated ? (n ? e.startVisible ? this._marqWrap.style.transform = "translateY(0px)" : this._marqWrap.style.transform = `translateY(${e.direction === "up" ? this._contHeight : -1 * (this._elHeight * 2 - e.gap)}px)` : e.startVisible ? this._marqWrap.style.transform = "translateX(0px)" : this._marqWrap.style.transform = `translateX(${e.direction === "left" ? this._contWidth : -1 * (this._elWidth * 2 - e.gap)}px)`,
        e.startVisible || (this._loopCount = 1)) : e.startVisible ? this._loopCount = 2 : n ? this._repositionVert() : this._repositionHor(),
        g(this.el, "pause", this.pause.bind(this)),
        g(this.el, "resume", this.resume.bind(this)),
        e.pauseOnHover && (g(this.el, "mouseover", this.pause.bind(this)),
        g(this.el, "mouseout", this.resume.bind(this))),
        this._animEnd = ()=>{
            this._animate(n),
            this.el.dispatchEvent(new CustomEvent("finished"))
        }
        ,
        this._instance = R,
        R++,
        this._animate(n),
        e.recalcResize && g(window, "resize", this._recalcResize.bind(this))
    }
    _animationStr(t="", e=0, i=0, s="") {
        return `${t} ${e}s ${i}s ${s} ${this._opts.css3easing}`
    }
    _animate(t=!1) {
        const e = this._opts;
        if (e.duplicated) {
            if (this._loopCount === 1) {
                let r = e.duration;
                t ? r = e.direction === "up" ? r + this._contHeight / (this._elHeight / r) : r * 2 : r = e.direction === "left" ? r + this._contWidth / (this._elWidth / r) : r * 2,
                this._animStr = this._animationStr(this._animName, r / 1e3, e.delayBeforeStart / 1e3)
            } else
                this._loopCount === 2 && (this._animName = `${this._animName}0`,
                this._animStr = this._animationStr(this._animName, e.duration / 1e3, 0, "infinite"));
            this._loopCount++
        }
        let i = "";
        t ? e.duplicated ? (this._loopCount > 2 && (this._marqWrap.style.transform = `translateY(${e.direction === "up" ? 0 : -1 * this._elHeight}px)`),
        i = `translateY(${e.direction === "up" ? -1 * this._elHeight : 0}px)`) : e.startVisible ? this._loopCount === 2 ? (this._animStr = this._animationStr(this._animName, e.duration / 1e3, e.delayBeforeStart / 1e3),
        i = `translateY(${e.direction === "up" ? -1 * this._elHeight : this._contHeight}px)`,
        this._loopCount++) : this._loopCount === 3 && (this._animName = `${this._animName}0`,
        this._animStr = this._animationStr(this._animName, this._completeDuration / 1e3, 0, "infinite"),
        this._repositionVert()) : (this._repositionVert(),
        i = `translateY(${e.direction === "up" ? -1 * this._marqWrap.clientHeight : this._contHeight}px)`) : e.duplicated ? (this._loopCount > 2 && (this._marqWrap.style.transform = `translateX(${e.direction === "left" ? 0 : -1 * this._elWidth}px)`),
        i = `translateX(${e.direction === "left" ? -1 * this._elWidth : 0}px)`) : e.startVisible ? this._loopCount === 2 ? (this._animStr = this._animationStr(this._animName, e.duration / 1e3, e.delayBeforeStart / 1e3),
        i = `translateX(${e.direction === "left" ? -1 * this._elWidth : this._contWidth}px)`,
        this._loopCount++) : this._loopCount === 3 && (this._animName = `${this._animName}0`,
        this._animStr = this._animationStr(this._animName, e.duration / 1e3, 0, "infinite"),
        this._repositionHor()) : (this._repositionHor(),
        i = `translateX(${e.direction === "left" ? -1 * this._elWidth : this._contWidth}px)`),
        this.el.dispatchEvent(new CustomEvent("beforeStarting")),
        this._marqWrap.style.animation = this._animStr;
        const s = `@keyframes ${this._animName} {
        100% {
          transform: ${i};
        }
      }`
          , n = J("style", this._marqWrap);
        if (n.length)
            n[n.length - 1].innerHTML = s;
        else if (S(`marq-wrap-style-${this._instance}`).length)
            S(`marq-wrap-style-${this._instance}`)[0].innerHTML = s;
        else {
            const r = document.createElement("style");
            K(r, `marq-wrap-style-${this._instance}`),
            r.innerHTML = s,
            U("head").appendChild(r)
        }
        g(this._marqWrap, "animationiteration", this._animIter.bind(this), {
            once: !0
        }),
        g(this._marqWrap, "animationend", this._animEnd.bind(this), {
            once: !0
        }),
        this._status = "running",
        W(this.el, "data-runningStatus", "resumed")
    }
    _animIter() {
        this.el.dispatchEvent(new CustomEvent("finished"))
    }
    _repositionVert() {
        this._marqWrap.style.transform = `translateY(${this._opts.direction === "up" ? this._contHeight : this._elHeight * -1}px)`
    }
    _repositionHor() {
        this._marqWrap.style.transform = `translateX(${this._opts.direction === "left" ? this._contWidth : this._elWidth * -1}px)`
    }
    _calcSizes() {
        const t = this.el
          , e = this._opts;
        if (this._vertical) {
            const i = t.clientHeight;
            this._contHeight = i,
            Z(this._marqWrap, "style"),
            t.style.clientHeight = `${i}px`;
            const s = S("js-marquee", t)
              , n = s.length - 1;
            P(s, (a,l)=>{
                a.style.float = "none",
                a.style.marginRight = "0px",
                e.duplicated && l === n ? a.style.marginBottom = "0px" : a.style.marginBottom = `${e.gap}px`
            }
            );
            const r = parseInt(s[0].clientHeight + e.gap);
            this._elHeight = r,
            e.startVisible && !e.duplicated ? (this._completeDuration = (r + i) / parseInt(i) * this._duration,
            e.duration = r / parseInt(i) * this._duration) : e.duration = r / parseInt(i) / parseInt(i) * this._duration
        } else {
            const i = parseInt(S("js-marquee", t)[0].clientWidth + e.gap)
              , s = t.clientWidth;
            this._contWidth = s,
            this._elWidth = i,
            e.startVisible && !e.duplicated ? (this._completeDuration = (i + s) / parseInt(s) * this._duration,
            e.duration = i / parseInt(s) * this._duration) : e.duration = (i + parseInt(s)) / parseInt(s) * this._duration
        }
        e.duplicated && (e.duration = e.duration / 2)
    }
    _recalcResize() {
        this._calcSizes(),
        this._loopCount = 2,
        this._animEnd()
    }
    pause() {
        this._marqWrap.style.animationPlayState = "paused",
        this._status = "paused",
        W(this.el, "data-runningStatus", "paused"),
        this.el.dispatchEvent(new CustomEvent("paused"))
    }
    resume() {
        this._marqWrap.style.animationPlayState = "running",
        this._status = "running",
        W(this.el, "data-runningStatus", "resumed"),
        this.el.dispatchEvent(new CustomEvent("resumed"))
    }
    toggle() {
        this._status === "paused" ? this.resume() : this._status === "running" && this.pause()
    }
    destroy() {
        f(this.el, "pause", this.pause.bind(this)),
        f(this.el, "resume", this.resume.bind(this)),
        this._opts.pauseOnHover && (f(this.el, "mouseover", this.pause.bind(this)),
        f(this.el, "mouseout", this.resume.bind(this))),
        f(this._marqWrap, "animationiteration", this._animIter.bind(this), {
            once: !0
        }),
        f(this._marqWrap, "animationend", this._animEnd.bind(this), {
            once: !0
        }),
        this._opts.recalcResize && f(window, "resize", this._recalcResize.bind(this))
    }
    refresh() {
        this._recalcResize()
    }
}
new tt(document.querySelector(".marquee"),{
    speed: 40,
    duplicated: !0,
    gap: 36
});
const O = document.querySelectorAll(".date-button")
  , et = document.querySelectorAll(".schedule");
O.forEach(o=>{
    o.addEventListener("click", ()=>{
        O.forEach(t=>{
            t.classList.remove("active")
        }
        ),
        et.forEach(t=>{
            t.classList.remove("active")
        }
        ),
        document.querySelectorAll(`[data-date="${o.getAttribute("data-date")}"]`).forEach(t=>t.classList.add("active"))
    }
    )
}
);
class u {
    constructor(t, e={}) {
        if (!(t instanceof Node))
            throw "Can't initialize VanillaTilt because " + t + " is not a Node.";
        this.width = null,
        this.height = null,
        this.clientWidth = null,
        this.clientHeight = null,
        this.left = null,
        this.top = null,
        this.gammazero = null,
        this.betazero = null,
        this.lastgammazero = null,
        this.lastbetazero = null,
        this.transitionTimeout = null,
        this.updateCall = null,
        this.event = null,
        this.updateBind = this.update.bind(this),
        this.resetBind = this.reset.bind(this),
        this.element = t,
        this.settings = this.extendSettings(e),
        this.reverse = this.settings.reverse ? -1 : 1,
        this.resetToStart = u.isSettingTrue(this.settings["reset-to-start"]),
        this.glare = u.isSettingTrue(this.settings.glare),
        this.glarePrerender = u.isSettingTrue(this.settings["glare-prerender"]),
        this.fullPageListening = u.isSettingTrue(this.settings["full-page-listening"]),
        this.gyroscope = u.isSettingTrue(this.settings.gyroscope),
        this.gyroscopeSamples = this.settings.gyroscopeSamples,
        this.elementListener = this.getElementListener(),
        this.glare && this.prepareGlare(),
        this.fullPageListening && this.updateClientSize(),
        this.addEventListeners(),
        this.reset(),
        this.resetToStart === !1 && (this.settings.startX = 0,
        this.settings.startY = 0)
    }
    static isSettingTrue(t) {
        return t === "" || t === !0 || t === 1
    }
    getElementListener() {
        if (this.fullPageListening)
            return window.document;
        if (typeof this.settings["mouse-event-element"] == "string") {
            const t = document.querySelector(this.settings["mouse-event-element"]);
            if (t)
                return t
        }
        return this.settings["mouse-event-element"]instanceof Node ? this.settings["mouse-event-element"] : this.element
    }
    addEventListeners() {
        this.onMouseEnterBind = this.onMouseEnter.bind(this),
        this.onMouseMoveBind = this.onMouseMove.bind(this),
        this.onMouseLeaveBind = this.onMouseLeave.bind(this),
        this.onWindowResizeBind = this.onWindowResize.bind(this),
        this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this),
        this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind),
        this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind),
        this.elementListener.addEventListener("mousemove", this.onMouseMoveBind),
        (this.glare || this.fullPageListening) && window.addEventListener("resize", this.onWindowResizeBind),
        this.gyroscope && window.addEventListener("deviceorientation", this.onDeviceOrientationBind)
    }
    removeEventListeners() {
        this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind),
        this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind),
        this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind),
        this.gyroscope && window.removeEventListener("deviceorientation", this.onDeviceOrientationBind),
        (this.glare || this.fullPageListening) && window.removeEventListener("resize", this.onWindowResizeBind)
    }
    destroy() {
        clearTimeout(this.transitionTimeout),
        this.updateCall !== null && cancelAnimationFrame(this.updateCall),
        this.element.style.willChange = "",
        this.element.style.transition = "",
        this.element.style.transform = "",
        this.resetGlare(),
        this.removeEventListeners(),
        this.element.vanillaTilt = null,
        delete this.element.vanillaTilt,
        this.element = null
    }
    onDeviceOrientation(t) {
        if (t.gamma === null || t.beta === null)
            return;
        this.updateElementPosition(),
        this.gyroscopeSamples > 0 && (this.lastgammazero = this.gammazero,
        this.lastbetazero = this.betazero,
        this.gammazero === null ? (this.gammazero = t.gamma,
        this.betazero = t.beta) : (this.gammazero = (t.gamma + this.lastgammazero) / 2,
        this.betazero = (t.beta + this.lastbetazero) / 2),
        this.gyroscopeSamples -= 1);
        const e = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX
          , i = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY
          , s = e / this.width
          , n = i / this.height
          , r = t.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero)
          , a = t.beta - (this.settings.gyroscopeMinAngleY + this.betazero)
          , l = r / s
          , h = a / n;
        this.updateCall !== null && cancelAnimationFrame(this.updateCall),
        this.event = {
            clientX: l + this.left,
            clientY: h + this.top
        },
        this.updateCall = requestAnimationFrame(this.updateBind)
    }
    onMouseEnter() {
        this.updateElementPosition(),
        this.element.style.willChange = "transform",
        this.setTransition()
    }
    onMouseMove(t) {
        this.updateCall !== null && cancelAnimationFrame(this.updateCall),
        this.event = t,
        this.updateCall = requestAnimationFrame(this.updateBind)
    }
    onMouseLeave() {
        this.setTransition(),
        this.settings.reset && requestAnimationFrame(this.resetBind)
    }
    reset() {
        this.onMouseEnter(),
        this.fullPageListening ? this.event = {
            clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
            clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
        } : this.event = {
            clientX: this.left + (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width,
            clientY: this.top + (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height
        };
        let t = this.settings.scale;
        this.settings.scale = 1,
        this.update(),
        this.settings.scale = t,
        this.resetGlare()
    }
    resetGlare() {
        this.glare && (this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)",
        this.glareElement.style.opacity = "0")
    }
    getValues() {
        let t, e;
        this.fullPageListening ? (t = this.event.clientX / this.clientWidth,
        e = this.event.clientY / this.clientHeight) : (t = (this.event.clientX - this.left) / this.width,
        e = (this.event.clientY - this.top) / this.height),
        t = Math.min(Math.max(t, 0), 1),
        e = Math.min(Math.max(e, 0), 1);
        let i = (this.reverse * (this.settings.max - t * this.settings.max * 2)).toFixed(2)
          , s = (this.reverse * (e * this.settings.max * 2 - this.settings.max)).toFixed(2)
          , n = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);
        return {
            tiltX: i,
            tiltY: s,
            percentageX: t * 100,
            percentageY: e * 100,
            angle: n
        }
    }
    updateElementPosition() {
        let t = this.element.getBoundingClientRect();
        this.width = this.element.offsetWidth,
        this.height = this.element.offsetHeight,
        this.left = t.left,
        this.top = t.top
    }
    update() {
        let t = this.getValues();
        this.element.style.transform = "perspective(" + this.settings.perspective + "px) rotateX(" + (this.settings.axis === "x" ? 0 : t.tiltY) + "deg) rotateY(" + (this.settings.axis === "y" ? 0 : t.tiltX) + "deg) scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")",
        this.glare && (this.glareElement.style.transform = `rotate(${t.angle}deg) translate(-50%, -50%)`,
        this.glareElement.style.opacity = `${t.percentageY * this.settings["max-glare"] / 100}`),
        this.element.dispatchEvent(new CustomEvent("tiltChange",{
            detail: t
        })),
        this.updateCall = null
    }
    prepareGlare() {
        if (!this.glarePrerender) {
            const t = document.createElement("div");
            t.classList.add("js-tilt-glare");
            const e = document.createElement("div");
            e.classList.add("js-tilt-glare-inner"),
            t.appendChild(e),
            this.element.appendChild(t)
        }
        this.glareElementWrapper = this.element.querySelector(".js-tilt-glare"),
        this.glareElement = this.element.querySelector(".js-tilt-glare-inner"),
        !this.glarePrerender && (Object.assign(this.glareElementWrapper.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            "pointer-events": "none",
            "border-radius": "inherit"
        }),
        Object.assign(this.glareElement.style, {
            position: "absolute",
            top: "50%",
            left: "50%",
            "pointer-events": "none",
            "background-image": "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
            transform: "rotate(180deg) translate(-50%, -50%)",
            "transform-origin": "0% 0%",
            opacity: "0"
        }),
        this.updateGlareSize())
    }
    updateGlareSize() {
        if (this.glare) {
            const t = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;
            Object.assign(this.glareElement.style, {
                width: `${t}px`,
                height: `${t}px`
            })
        }
    }
    updateClientSize() {
        this.clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        this.clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
    onWindowResize() {
        this.updateGlareSize(),
        this.updateClientSize()
    }
    setTransition() {
        clearTimeout(this.transitionTimeout),
        this.element.style.transition = this.settings.speed + "ms " + this.settings.easing,
        this.glare && (this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`),
        this.transitionTimeout = setTimeout(()=>{
            this.element.style.transition = "",
            this.glare && (this.glareElement.style.transition = "")
        }
        , this.settings.speed)
    }
    extendSettings(t) {
        let e = {
            reverse: !1,
            max: 15,
            startX: 0,
            startY: 0,
            perspective: 1e3,
            easing: "cubic-bezier(.03,.98,.52,.99)",
            scale: 1,
            speed: 300,
            transition: !0,
            axis: null,
            glare: !1,
            "max-glare": 1,
            "glare-prerender": !1,
            "full-page-listening": !1,
            "mouse-event-element": null,
            reset: !0,
            "reset-to-start": !0,
            gyroscope: !0,
            gyroscopeMinAngleX: -45,
            gyroscopeMaxAngleX: 45,
            gyroscopeMinAngleY: -45,
            gyroscopeMaxAngleY: 45,
            gyroscopeSamples: 10
        }
          , i = {};
        for (var s in e)
            if (s in t)
                i[s] = t[s];
            else if (this.element.hasAttribute("data-tilt-" + s)) {
                let n = this.element.getAttribute("data-tilt-" + s);
                try {
                    i[s] = JSON.parse(n)
                } catch {
                    i[s] = n
                }
            } else
                i[s] = e[s];
        return i
    }
    static init(t, e) {
        t instanceof Node && (t = [t]),
        t instanceof NodeList && (t = [].slice.call(t)),
        t instanceof Array && t.forEach(i=>{
            "vanillaTilt"in i || (i.vanillaTilt = new u(i,e))
        }
        )
    }
}
typeof document < "u" && (window.VanillaTilt = u,
u.init(document.querySelectorAll("[data-tilt]")));
u.init(Array.from(document.querySelectorAll(".prizes-primary > img")), {
    reverse: !0
});
