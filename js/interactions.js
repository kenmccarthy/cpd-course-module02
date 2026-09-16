/* ==========================================================================
   Teaching Online — course-specific interactions
   Each widget is a self-contained block and a no-op if its markup is absent.
   All of them emit tracking events through the Course event bus, so SCORM and
   analytics pick them up without any extra wiring.

   Generic, reusable widgets (knowledge checks, reflections, matching, tabs,
   accordion) live in js/app.js. This file holds the ones a course adds.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.Course;
  var $ = C.$, $$ = C.$$;
  var emit = C.emit, state = C.state;

  /* ==========================================================================
     Scenario chooser — a situation with several approaches, each carrying its
     own trade-off feedback. Deliberately NOT scored: learners are encouraged to
     open every option and compare, so "explored" counts options seen.

     Markup: <div class="widget scenario" data-scenario="KEY"> with
             <button class="scenario__opt" data-verdict="good|mixed|poor"
                     data-feedback="…">…</button>
     ========================================================================== */
  $$("[data-scenario]").forEach(function (wrap) {
    var key = wrap.getAttribute("data-scenario") || "scenario";
    var opts = $$(".scenario__opt", wrap);
    var fb = $(".scenario__fb", wrap);
    if (!opts.length || !fb) return;

    var saved = state.interactions[key + "-scenario"] || {};
    var seen = saved.seen || {};

    var VERDICT = {
      good:  { icon: "check-circle", label: "Strong choice" },
      mixed: { icon: "scale",        label: "Workable, with trade-offs" },
      poor:  { icon: "warning",      label: "High risk" }
    };

    function show(opt, replay) {
      var verdict = opt.getAttribute("data-verdict") || "mixed";
      var v = VERDICT[verdict] || VERDICT.mixed;
      opts.forEach(function (o) { o.classList.toggle("is-chosen", o === opt); });
      opt.classList.add("is-seen");
      fb.className = "scenario__fb show is-" + verdict;
      fb.innerHTML = '<p class="scenario__verdict">' + C.icon(v.icon) + " <strong>" + v.label + "</strong></p>" +
        "<p>" + opt.getAttribute("data-feedback") + "</p>";

      var i = opts.indexOf(opt);
      seen[i] = true;
      state.interactions[key + "-scenario"] = { seen: seen };
      C.saveSoon();

      if (!replay) {
        var n = Object.keys(seen).length;
        C.announce(v.label + ". " + opt.getAttribute("data-feedback"));
        emit("interaction.complete", {
          id: key + "-scenario", choice: String.fromCharCode(65 + i),
          verdict: verdict, seenCount: n, of: opts.length
        });
        if (n === opts.length) {
          var note = $(".scenario__all", wrap);
          if (note) note.classList.add("show");
        }
      }
    }

    opts.forEach(function (o, i) {
      if (seen[i]) o.classList.add("is-seen");
      o.addEventListener("click", function () { show(o); });
    });
  });

  /* ==========================================================================
     Checklist — tickable self-audit with a progress ring.
     Markup: <div class="widget checklist" data-checklist="KEY"
                  data-msgs="0 ticked|1 ticked|…">  (one message per score, 0..n)
     ========================================================================== */
  $$("[data-checklist]").forEach(function (wrap) {
    var key = wrap.getAttribute("data-checklist") || "checklist";
    var boxes = $$('input[type="checkbox"]', wrap);
    var ring = $("[data-ring]", wrap), scoreEl = $("[data-score]", wrap), msg = $("[data-msg]", wrap);
    if (!boxes.length || !ring) return;

    var msgs = (wrap.getAttribute("data-msgs") || "").split("|");
    var touched = false;

    var saved = (state.interactions[key + "-checklist"] || {}).checked || [];
    boxes.forEach(function (b, i) { if (saved[i]) b.checked = true; });

    function render() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      scoreEl.textContent = n + "/" + boxes.length;
      ring.style.setProperty("--pct", (n / boxes.length) * 100 + "%");
      ring.classList.toggle("full", n === boxes.length);
      if (msg && msgs[n]) msg.textContent = msgs[n];
      state.interactions[key + "-checklist"] = {
        checked: boxes.map(function (b) { return b.checked; }), score: n
      };
      C.saveSoon();
    }

    boxes.forEach(function (b) {
      b.addEventListener("change", function () {
        render();
        if (!touched) { touched = true; emit("interaction.complete", { id: key + "-checklist" }); }
      });
    });
    render();
  });
})();
