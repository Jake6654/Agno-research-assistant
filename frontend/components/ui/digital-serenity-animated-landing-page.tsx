"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GetStartedButton from "./get-started-button";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function DigitalSerenity() {
  const router = useRouter();

  const [mouseGradientStyle, setMouseGradientStyle] = useState({
    left: "0px",
    top: "0px",
    opacity: 0,
  });

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const floatingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const animateWords = () => {
      const wordElements =
        document.querySelectorAll<HTMLElement>(".word-animate");

      wordElements.forEach((word) => {
        const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
        setTimeout(() => {
          word.style.animation = "word-appear 0.8s ease-out forwards";
        }, delay);
      });
    };

    const timeoutId = setTimeout(animateWords, 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseGradientStyle({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        opacity: 1,
      });
    };

    const handleMouseLeave = () => {
      setMouseGradientStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 900);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".floating-element-animate"
    );
    floatingElementsRef.current = Array.from(elements);

    const handleScroll = () => {
      if (!scrolled) {
        setScrolled(true);

        floatingElementsRef.current.forEach((el, index) => {
          setTimeout(() => {
            el.style.animationPlayState = "running";
            el.style.opacity = "";
          }, parseFloat(el.style.animationDelay || "0") * 1000 + index * 100);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const pageStyles = `
    #mouse-gradient-react {
      position: fixed;
      pointer-events: none;
      border-radius: 9999px;
      background-image: radial-gradient(circle, rgba(156, 163, 175, 0.08), rgba(107, 114, 128, 0.06), transparent 70%);
      transform: translate(-50%, -50%);
      will-change: left, top, opacity;
      transition: left 70ms linear, top 70ms linear, opacity 300ms ease-out;
    }

    @keyframes word-appear {
      0% { opacity: 0; transform: translateY(24px) scale(0.96); filter: blur(8px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    @keyframes grid-draw {
      0% { stroke-dashoffset: 1000; opacity: 0; }
      100% { stroke-dashoffset: 0; opacity: 0.15; }
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 0.12; transform: scale(1); }
      50% { opacity: 0.32; transform: scale(1.08); }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
      25% { transform: translateY(-10px) translateX(5px); opacity: 0.55; }
      50% { transform: translateY(-4px) translateX(-3px); opacity: 0.35; }
      75% { transform: translateY(-12px) translateX(7px); opacity: 0.7; }
    }

    .word-animate {
      display: inline-block;
      opacity: 0;
      margin: 0 0.08em;
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .word-animate:hover {
      color: #e2e8f0;
      transform: translateY(-2px);
    }

    .grid-line {
      stroke: #94a3b8;
      stroke-width: 0.5;
      opacity: 0;
      stroke-dasharray: 5 5;
      stroke-dashoffset: 1000;
      animation: grid-draw 2s ease-out forwards;
    }

    .detail-dot {
      fill: #cbd5e1;
      opacity: 0;
      animation: pulse-glow 3s ease-in-out infinite;
    }

    .floating-element-animate {
      position: absolute;
      width: 2px;
      height: 2px;
      background: #cbd5e1;
      border-radius: 50%;
      opacity: 0;
      animation: float 4s ease-in-out infinite;
      animation-play-state: paused;
    }

    .ripple-effect {
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(203, 213, 225, 0.55);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: pulse-glow 1s ease-out forwards;
      z-index: 9999;
    }
  `;

  return (
    <>
      <style>{pageStyles}</style>

      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800 text-slate-100">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="gridReactDarkResponsive"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="rgba(100, 116, 139, 0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#gridReactDarkResponsive)"
          />
          <line
            x1="0"
            y1="20%"
            x2="100%"
            y2="20%"
            className="grid-line"
            style={{ animationDelay: "0.5s" }}
          />
          <line
            x1="0"
            y1="80%"
            x2="100%"
            y2="80%"
            className="grid-line"
            style={{ animationDelay: "1s" }}
          />
          <line
            x1="20%"
            y1="0"
            x2="20%"
            y2="100%"
            className="grid-line"
            style={{ animationDelay: "1.5s" }}
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            className="grid-line"
            style={{ animationDelay: "2s" }}
          />
          <circle
            cx="20%"
            cy="20%"
            r="2"
            className="detail-dot"
            style={{ animationDelay: "3s" }}
          />
          <circle
            cx="80%"
            cy="20%"
            r="2"
            className="detail-dot"
            style={{ animationDelay: "3.2s" }}
          />
          <circle
            cx="20%"
            cy="80%"
            r="2"
            className="detail-dot"
            style={{ animationDelay: "3.4s" }}
          />
          <circle
            cx="80%"
            cy="80%"
            r="2"
            className="detail-dot"
            style={{ animationDelay: "3.6s" }}
          />
        </svg>
        <div
          className="floating-element-animate"
          style={{ top: "25%", left: "15%", animationDelay: "0.5s" }}
        />
        <div
          className="floating-element-animate"
          style={{ top: "60%", left: "85%", animationDelay: "1s" }}
        />
        <div
          className="floating-element-animate"
          style={{ top: "40%", left: "10%", animationDelay: "1.5s" }}
        />
        <div
          className="floating-element-animate"
          style={{ top: "75%", left: "90%", animationDelay: "2s" }}
        />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10 sm:px-8 md:px-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-slate-400 sm:text-sm">
              <span className="word-animate" data-delay="0">
                Personal
              </span>
              <span className="word-animate" data-delay="120">
                web
              </span>
              <span className="word-animate" data-delay="240">
                research
              </span>
              <span className="word-animate" data-delay="360">
                assistant
              </span>
            </p>

            <h1 className="mb-6 text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
              <span className="word-animate" data-delay="600">
                Hi,
              </span>
              <span className="word-animate" data-delay="760">
                I’m
              </span>
              <span className="word-animate" data-delay="920">
                your
              </span>
              <span className="word-animate" data-delay="1080">
                personal
              </span>
              <span className="word-animate" data-delay="1240">
                web
              </span>
              <span className="word-animate" data-delay="1400">
                search
              </span>
              <span className="word-animate" data-delay="1560">
                assistant.
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              <span className="word-animate" data-delay="1800">
                How
              </span>
              <span className="word-animate" data-delay="1920">
                can
              </span>
              <span className="word-animate" data-delay="2040">
                I
              </span>
              <span className="word-animate" data-delay="2160">
                help
              </span>
              <span className="word-animate" data-delay="2280">
                you
              </span>
              <span className="word-animate" data-delay="2400">
                today?
              </span>
            </p>

            <div
              className="opacity-0"
              style={{
                animation: "word-appear 0.8s ease-out forwards",
                animationDelay: "2.6s",
              }}
            >
              <GetStartedButton />
            </div>
          </div>
        </div>

        <div
          id="mouse-gradient-react"
          className="h-60 w-60 blur-xl sm:h-80 sm:w-80 sm:blur-2xl md:h-96 md:w-96 md:blur-3xl"
          style={{
            left: mouseGradientStyle.left,
            top: mouseGradientStyle.top,
            opacity: mouseGradientStyle.opacity,
          }}
        />

        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="ripple-effect"
            style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
          />
        ))}
      </section>
    </>
  );
}
