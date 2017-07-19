/*
 * Noise.js 0.0.1
 *
 * Copyright (c) 2017 Guilherme Nascimento (brcontainer@yahoo.com.br)
 *
 * Released under the MIT license
 */

(function (w, d, m, u) {
    function Noise(element, autoplay) {
        var canvas = element || d.createElement("canvas");

        var ctx = canvas.getContext("2d"),
            running = (autoplay === u || autoplay),
            started = false,
            toggle = true;

        function resize() {
            canvas.height = w.innerHeight;
            canvas.width = w.innerWidth;
        }

        resize();
        w.addEventListener("resize", resize);

        function noise() {
            var w = ctx.canvas.width,
                h = ctx.canvas.height,
                data = ctx.createImageData(w, h),
                buffer = new Uint32Array(data.data.buffer),
                j = buffer.length,
                i = 0;

            for(; i < j;) {
                buffer[i++] = ((255 * Math.random())|0) << 24;
            }

            ctx.putImageData(data, 0, 0);
        }

        var requestAnimFrame = (function () {
            return (
                w.requestAnimationFrame       ||
                w.webkitRequestAnimationFrame ||
                w.mozRequestAnimationFrame    ||
                w.oRequestAnimationFrame      ||
                w.msRequestAnimationFrame     ||
                function (callback) {
                    setTimeout(function(){
                        callback(+new Date);
                    }, 1000 / 60);
                }
            );
        })();

        //Use 30 FPS instead of 60 FPS
        function loop() {
            if (!running || !element.parentElement) {
                setTimeout(loop, 10);
                return;
            }

            toggle = !toggle;

            if (!toggle) noise();

            requestAnimFrame(loop);
        }

        function start() {
            started = true;
            loop();
        }

        if (running) start();

        var props = {
            "element": function () {
                return element;
            },
            "play": function () {
                if (!started) start();
                running = true;
                return props;
            },
            "pause": function () {
                running = false;
                return props;
            }
        };

        return props;
    }

    if (m.exports) {
        m.exports = Noise;
    } else {
        w.Noise = Noise;
    }
})(window, document, module);
