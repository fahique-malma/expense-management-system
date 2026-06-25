import { useEffect, useRef, useState } from "react";
import { fmt, fmtK } from "../utils/format";


export default function ForecastChart({ transactions, year, month }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const dataRef = useRef({});
  const [tooltip, setTooltip] = useState(null);
  const [strip, setStrip] = useState({ income: 0, expense: 0, balance: 0, balancePositive: true });

  function redrawChart(ctx, d, hoverIdx) {
    const { W, H, PAD, cW, cH, daysInMonth, todayDate, plotDays, xP, yP, maxV, cumI, cumE, isCurrentMonth } = d;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "#e4e8f050";
    ctx.lineWidth = 1;
    for (let g = 0; g <= 4; g++) {
      const y = PAD.top + (g / 4) * cH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + cW, y);
      ctx.stroke();
      ctx.fillStyle = "#9ca3b0";
      ctx.font = `${W < 360 ? 10 : 11}px Outfit`;
      ctx.textAlign = "right";
      ctx.fillText(fmtK(maxV - (g / 4) * maxV), PAD.left - 6, y + 4);
    }

    ctx.fillStyle = "#9ca3b0";
    ctx.textAlign = "center";

    const minLabelGap = W < 360 ? 34 : 30;
    const maxLabels = Math.max(2, Math.floor(cW / minLabelGap) + 1);
    const dayStep = Math.max(1, Math.ceil((daysInMonth - 1) / (maxLabels - 1)));
    let lastLabeledIdx = 0;
    for (let i = 0; i < daysInMonth; i += dayStep) {
      ctx.fillText(i + 1, xP(i), H - PAD.bottom + 14);
      lastLabeledIdx = i;
    }
    if (daysInMonth - 1 - lastLabeledIdx >= dayStep / 2) {
      ctx.fillText(daysInMonth, xP(daysInMonth - 1), H - PAD.bottom + 14);
    }

    if (isCurrentMonth && plotDays < daysInMonth) {
      ctx.fillStyle = "rgba(230,232,240,0.2)";
      ctx.fillRect(xP(plotDays - 1), PAD.top, xP(daysInMonth - 1) - xP(plotDays - 1), cH);
    }

    function drawArea(data, color) {
      const pts = data.slice(0, plotDays);
      if (!pts.length) return;
      ctx.beginPath();
      ctx.moveTo(xP(0), yP(0));
      pts.forEach((v, i) => ctx.lineTo(xP(i), yP(v)));
      ctx.lineTo(xP(plotDays - 1), H - PAD.bottom);
      ctx.lineTo(xP(0), H - PAD.bottom);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, PAD.top, 0, H - PAD.bottom);
      grad.addColorStop(0, color + "50");
      grad.addColorStop(1, color + "00");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      pts.forEach((v, i) => {
        if (i === 0) ctx.moveTo(xP(i), yP(v));
        else {
          const cx = (xP(i - 1) + xP(i)) / 2;
          ctx.bezierCurveTo(cx, yP(pts[i - 1]), cx, yP(v), xP(i), yP(v));
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.stroke();

      const lv = pts[plotDays - 1];
      ctx.beginPath();
      ctx.arc(xP(plotDays - 1), yP(lv), 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = `700 ${W < 360 ? 10 : 11}px Outfit`;
      const atRight = xP(plotDays - 1) > W - 80;
      ctx.textAlign = atRight ? "right" : "left";
      ctx.fillText(fmtK(lv), xP(plotDays - 1) + (atRight ? -10 : 10), yP(lv) - 8);
    }

    drawArea(cumI, "#00c48c");
    drawArea(cumE, "#f24e4e");

    if (isCurrentMonth) {
      ctx.strokeStyle = "#5c3bfe55";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(xP(todayDate - 1), PAD.top);
      ctx.lineTo(xP(todayDate - 1), H - PAD.bottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#5c3bfe99";
      ctx.font = "600 10px Outfit";
      ctx.textAlign = "center";
      ctx.fillText("Today", xP(todayDate - 1), H - PAD.bottom + 28);
    }

    if (hoverIdx >= 0 && hoverIdx < plotDays) {
      const hx = xP(hoverIdx);
      const hI = cumI[hoverIdx],
        hE = cumE[hoverIdx];

      ctx.strokeStyle = "rgba(92,59,254,0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(hx, PAD.top);
      ctx.lineTo(hx, H - PAD.bottom);
      ctx.stroke();

      function hDash(yVal, color) {
        ctx.strokeStyle = color + "55";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(PAD.left, yP(yVal));
        ctx.lineTo(hx, yP(yVal));
        ctx.stroke();
        ctx.setLineDash([]);
      }
      hDash(hI, "#00c48c");
      hDash(hE, "#f24e4e");

      [
        [hI, "#00c48c"],
        [hE, "#f24e4e"],
      ].forEach(([v, c]) => {
        ctx.beginPath();
        ctx.arc(hx, yP(v), 6, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });
    }
  }

  function draw() {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight || 240;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const now = new Date();
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayDate = isCurrentMonth ? now.getDate() : daysInMonth;

    const incD = new Array(daysInMonth).fill(0);
    const expD = new Array(daysInMonth).fill(0);
    transactions.forEach((t) => {
      const d = new Date(t.date + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        const idx = d.getDate() - 1;
        if (t.type === "income") incD[idx] += t.amount;
        else expD[idx] += t.amount;
      }
    });

    const cumI = [],
      cumE = [];
    let si = 0,
      se = 0;
    for (let i = 0; i < daysInMonth; i++) {
      si += incD[i];
      se += expD[i];
      cumI.push(si);
      cumE.push(se);
    }

    const totalI = cumI[todayDate - 1] || 0;
    const totalE = cumE[todayDate - 1] || 0;
    const bal = totalI - totalE;
    setStrip({ income: totalI, expense: totalE, balance: Math.abs(bal), balancePositive: bal >= 0 });

    const maxV = Math.max(...cumI.slice(0, todayDate), ...cumE.slice(0, todayDate), 500);
    const PAD = { top: 20, right: 20, bottom: 42, left: W < 360 ? 44 : 56 };
    const cW = W - PAD.left - PAD.right;
    const cH = H - PAD.top - PAD.bottom;
    const plotDays = todayDate;
    const xP = (i) => PAD.left + (i / (daysInMonth - 1)) * cW;
    const yP = (v) => PAD.top + cH - (v / maxV) * cH;

    const d = {
      W,
      H,
      PAD,
      cW,
      cH,
      daysInMonth,
      todayDate,
      plotDays,
      xP,
      yP,
      maxV,
      cumI,
      cumE,
      isCurrentMonth,
      year,
      month,
    };
    dataRef.current = d;
    setTooltip(null);
    redrawChart(ctx, d, -1);
  }

  useEffect(() => {
    draw();
    let rTimer;
    const onResize = () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(draw, 80);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(rTimer);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, year, month]);

  function handleMove(e) {
    const d = dataRef.current;
    if (!d.xP || !d.plotDays) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;

    if (mx < d.PAD.left || mx > d.PAD.left + d.cW) {
      handleLeave();
      return;
    }
    const raw = ((mx - d.PAD.left) / d.cW) * (d.daysInMonth - 1);
    const idx = Math.max(0, Math.min(Math.round(raw), d.plotDays - 1));

    const dayNum = idx + 1;
    const dateStr = new Date(d.year, d.month, dayNum).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const inc = d.cumI[idx],
      exp = d.cumE[idx];
    const bal = inc - exp;

    const tw = 168;
    const th = 110;
    const wrap = wrapRef.current;
    const wW = wrap.clientWidth;
    let tx = mx + 14;
    if (tx + tw > wW - 4) tx = mx - tw - 14;
    if (tx < 4) tx = 4;
    if (tx + tw > wW - 4) tx = Math.max(4, wW - tw - 4);
    let ty = my - th / 2;
    if (ty < 4) ty = 4;
    if (ty + th > d.H - 4) ty = d.H - th - 4;

    setTooltip({
      left: tx,
      top: ty,
      date: dateStr,
      income: inc,
      expense: exp,
      balance: bal,
    });

    const ctx = canvasRef.current.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawChart(ctx, d, idx);
  }

  function handleLeave() {
    setTooltip(null);
    const d = dataRef.current;
    if (!d.xP) return;
    const ctx = canvasRef.current.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redrawChart(ctx, d, -1);
  }

  return (
    <>
      <div className="chart-balance-strip">
        <div className="cbs-item">
          <span className="cbs-label">Balance</span>
          <span className={"cbs-val " + (strip.balancePositive ? "balance" : "expense")}>{fmt(strip.balance)}</span>
        </div>
        <div className="cbs-divider"></div>
        <div className="cbs-item">
          <span className="cbs-dot" style={{ background: "var(--green)" }}></span>
          <span className="cbs-label">Income</span>
          <span className="cbs-val income">{fmt(strip.income)}</span>
        </div>
        <div className="cbs-divider"></div>
        <div className="cbs-item">
          <span className="cbs-dot" style={{ background: "var(--red)" }}></span>
          <span className="cbs-label">Expenses</span>
          <span className="cbs-val expense">{fmt(strip.expense)}</span>
        </div>
      </div>

      <div className="chart-canvas-wrap" ref={wrapRef} style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseLeave={handleLeave}
          onTouchEnd={handleLeave}
        />
        {tooltip && (
          <div className="chart-tooltip" style={{ display: "block", left: tooltip.left, top: tooltip.top }}>
            <div className="ct-date">{tooltip.date}</div>
            <div className="ct-row">
              <span className="ct-dot" style={{ background: "var(--green)" }}></span>
              <span className="ct-key">Income</span>
              <span className="ct-val income">{fmt(tooltip.income)}</span>
            </div>
            <div className="ct-row">
              <span className="ct-dot" style={{ background: "var(--red)" }}></span>
              <span className="ct-key">Expenses</span>
              <span className="ct-val expense">{fmt(tooltip.expense)}</span>
            </div>
            <div className="ct-divider"></div>
            <div className="ct-row">
              <span className="ct-key" style={{ fontWeight: 700 }}>
                Balance
              </span>
              <span
                className="ct-val"
                style={{ fontWeight: 800, color: tooltip.balance >= 0 ? "#00c48c" : "#ff6b6b" }}
              >
                {(tooltip.balance >= 0 ? "+" : "-") + fmt(Math.abs(tooltip.balance))}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
