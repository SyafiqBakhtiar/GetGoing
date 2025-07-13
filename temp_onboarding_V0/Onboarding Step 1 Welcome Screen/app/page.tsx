"use client"

import { Button } from "@/components/ui/button"

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Modern mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-blue-600/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600/15 via-transparent to-purple-500/15"></div>

      {/* Blizzard Effect - Multiple layers of snow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Heavy snow layer */}
        <div className="snowflakes heavy-snow">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`heavy-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                opacity: 0.8,
                fontSize: `${12 + Math.random() * 8}px`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        {/* Medium snow layer */}
        <div className="snowflakes medium-snow">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`medium-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${12 + Math.random() * 6}s`,
                opacity: 0.6,
                fontSize: `${8 + Math.random() * 6}px`,
              }}
            >
              ❅
            </div>
          ))}
        </div>

        {/* Light snow layer */}
        <div className="snowflakes light-snow">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`light-${i}`}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${18 + Math.random() * 8}s`,
                opacity: 0.4,
                fontSize: `${6 + Math.random() * 4}px`,
              }}
            >
              ❆
            </div>
          ))}
        </div>

        {/* Wind effect particles */}
        <div className="wind-particles">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`wind-${i}`}
              className="wind-particle"
              style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Large decorative circles */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-500/5 to-transparent rounded-full"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-xs mx-auto">
        {/* Animated Penguin in Blizzard */}
        <div className="relative">
          <div className="penguin-walking">
            <svg
              width="160"
              height="155"
              viewBox="0 0 272 261"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              {/* Body background */}
              <ellipse cx="131.5" cy="158.5" rx="61.5" ry="56.5" fill="url(#paint0_linear_51_2)" />
              <path
                d="M131.5 102.5C165.23 102.5 192.5 127.611 192.5 158.5C192.5 189.389 165.23 214.5 131.5 214.5C97.7699 214.5 70.5 189.389 70.5 158.5C70.5 127.611 97.7699 102.5 131.5 102.5Z"
                stroke="white"
                strokeOpacity="0.1"
              />

              {/* White penguin body */}
              <circle cx="131.5" cy="158.5" r="49.5" fill="white" />

              {/* Left wing */}
              <ellipse
                cx="209.5"
                cy="168.023"
                rx="28.6216"
                ry="11.6835"
                transform="rotate(-135 209.5 168.023)"
                fill="#3730A3"
                className="wing-left"
              />

              {/* Right wing */}
              <ellipse
                cx="53.5"
                cy="168.5"
                rx="28.6216"
                ry="11.6835"
                transform="rotate(135 53.5 168.5)"
                fill="#3730A3"
                className="wing-right"
              />

              {/* Head background */}
              <ellipse cx="132.5" cy="101.5" rx="84.5" ry="85.5" fill="url(#paint1_linear_51_2)" />
              <path
                d="M132.5 16.5C178.886 16.5 216.5 54.5502 216.5 101.5C216.5 148.45 178.886 186.5 132.5 186.5C86.1136 186.5 48.5 148.45 48.5 101.5C48.5 54.5502 86.1136 16.5 132.5 16.5Z"
                stroke="white"
                strokeOpacity="0.1"
              />

              {/* Beak */}
              <path
                d="M150 125C150 127.101 149.573 129.182 148.744 131.123C147.915 133.064 146.699 134.828 145.167 136.314C143.635 137.799 141.816 138.978 139.814 139.782C137.812 140.586 135.667 141 133.5 141C131.333 141 129.188 140.586 127.186 139.782C125.184 138.978 123.365 137.799 121.833 136.314C120.301 134.828 119.085 133.064 118.256 131.123C117.427 129.182 117 127.101 117 125L133.5 125H150Z"
                fill="url(#paint2_linear_51_2)"
              />

              {/* Feet */}
              <ellipse cx="107.5" cy="221.5" rx="17.5" ry="7.5" fill="#FB923C" className="foot-left" />
              <ellipse cx="157.5" cy="221.5" rx="17.5" ry="7.5" fill="#FB923C" className="foot-right" />

              {/* Eyes */}
              <ellipse cx="95" cy="90" rx="30" ry="35" fill="white" />
              <ellipse cx="100.5" cy="90.5" rx="22.5" ry="27.5" fill="black" />
              <ellipse cx="170" cy="90" rx="30" ry="35" fill="white" />
              <ellipse cx="166.5" cy="89.5" rx="22.5" ry="27.5" fill="black" />
              <circle cx="158.5" cy="77.5" r="7.5" fill="white" />
              <circle cx="91.5" cy="77.5" r="7.5" fill="white" />

              {/* Beak highlight */}
              <path
                d="M150.734 128.048C150.011 124.062 147.847 120.457 144.631 117.882C141.416 115.308 137.361 113.932 133.195 114.003C129.028 114.073 125.025 115.586 121.904 118.268C118.783 120.95 116.75 124.626 116.17 128.634L133.5 131L150.734 128.048Z"
                fill="url(#paint3_radial_51_2)"
              />

              <defs>
                <linearGradient
                  id="paint0_linear_51_2"
                  x1="131.5"
                  y1="102"
                  x2="131.5"
                  y2="215"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.6" stopColor="#312E81" />
                  <stop offset="1" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_51_2"
                  x1="132.5"
                  y1="16"
                  x2="132.5"
                  y2="187"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.6" stopColor="#312E81" />
                  <stop offset="1" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_51_2"
                  x1="133.5"
                  y1="109"
                  x2="133.5"
                  y2="141"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.6" stopColor="#FB923C" />
                  <stop offset="1" stopColor="#EA580C" />
                </linearGradient>
                <radialGradient
                  id="paint3_radial_51_2"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(133.5 131) rotate(90) scale(17 17.5)"
                >
                  <stop stopColor="#FFFAA0" />
                  <stop offset="1" stopColor="#FCB276" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Ice Floor with Sparkles */}
          <div className="ice-floor">
            {/* Sparkle effects */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="ice-sparkle"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                ●
              </div>
            ))}
          </div>
        </div>

        {/* App name & tagline with proper spacing */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-2">
            GetGoing
          </h1>
          <p className="text-lg font-light text-purple-100 leading-relaxed">
            Build habits. Crush goals.
            <br />
            Stay motivated.
          </p>
        </div>

        {/* Get Started Button */}
        <div className="pt-8">
          {/* <Link href="/"> */}
          <Button
            size="lg"
            className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-12 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started
          </Button>
          {/* </Link>  */}
        </div>

        {/* Simple trial note */}
        <p className="text-purple-200/80 text-sm font-light">Free trial • No signup needed</p>
      </div>

      <style jsx>{`
        .penguin-walking {
          filter: brightness(0.9) contrast(1.1);
          transform: translateY(25px);
          animation: penguinWaddle 1.5s ease-in-out infinite;
        }

        @keyframes penguinWaddle {
          0% {
            transform: translateY(25px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(25px) translateX(-2px) rotate(-1deg);
          }
          50% {
            transform: translateY(25px) translateX(0px) rotate(0deg);
          }
          75% {
            transform: translateY(25px) translateX(2px) rotate(1deg);
          }
          100% {
            transform: translateY(25px) translateX(0px) rotate(0deg);
          }
        }

        /* Main walking animation - moves penguin across screen */
        /* Wing flapping animation */
        .wing-left {
          animation: wingFlapLeft 1.5s ease-in-out infinite;
          transform-origin: 209.5px 168px;
        }

        .wing-right {
          animation: wingFlapRight 1.5s ease-in-out infinite;
          transform-origin: 53.5px 168.5px;
        }

        @keyframes wingFlapLeft {
          0%, 100% {
            transform: rotate(-135deg) scaleY(1);
          }
          50% {
            transform: rotate(-145deg) scaleY(0.8);
          }
        }

        @keyframes wingFlapRight {
          0%, 100% {
            transform: rotate(135deg) scaleY(1);
          }
          50% {
            transform: rotate(145deg) scaleY(0.8);
          }
        }

        /* Foot stepping animation */
        .foot-left {
          animation: footStepLeft 1.5s ease-in-out infinite;
          transform-origin: 107.5px 221.5px;
        }

        .foot-right {
          animation: footStepRight 1.5s ease-in-out infinite;
          transform-origin: 157.5px 221.5px;
        }

        @keyframes footStepLeft {
          0%, 50%, 100% {
            transform: translateY(0px) scaleX(1);
          }
          25% {
            transform: translateY(-3px) scaleX(1.2);
          }
        }

        @keyframes footStepRight {
          0%, 50%, 100% {
            transform: translateY(0px) scaleX(1);
          }
          75% {
            transform: translateY(-3px) scaleX(1.2);
          }
        }

        /* Body bobbing while walking */
        .penguin-walking svg {
          animation: bodyBob 1.5s ease-in-out infinite;
        }

        @keyframes bodyBob {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .snowflakes {
          position: absolute;
          top: -10px;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .snowflake {
          position: absolute;
          top: -10px;
          color: rgba(255, 255, 255, 0.8);
          user-select: none;
          pointer-events: none;
          animation-name: snowfall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes snowfall {
          0% {
            transform: translateY(-100px) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(10px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-5px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(15px) rotate(270deg);
          }
          100% {
            transform: translateY(100vh) translateX(-10px) rotate(360deg);
          }
        }

        .wind-particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .wind-particle {
          position: absolute;
          left: -10px;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation-name: windBlow;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          animation-duration: 4s;
        }

        @keyframes windBlow {
          0% {
            transform: translateX(0px) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-20px);
            opacity: 0;
          }
        }

        .heavy-snow .snowflake {
          animation-duration: 8s;
        }

        .medium-snow .snowflake {
          animation-duration: 12s;
        }

        .light-snow .snowflake {
          animation-duration: 18s;
        }

        /* Enhanced Arctic Ice Surface */
        .ice-floor {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 45px;
          background: radial-gradient(ellipse, 
            rgba(240, 249, 255, 0.95) 0%,
            rgba(219, 234, 254, 0.85) 20%,
            rgba(147, 197, 253, 0.75) 40%,
            rgba(59, 130, 246, 0.6) 60%,
            rgba(29, 78, 216, 0.4) 75%,
            rgba(30, 58, 138, 0.2) 90%,
            transparent 100%
          );
          border-radius: 50%;
          z-index: -1;
          animation: iceFloorFloat 4s ease-in-out infinite;
          box-shadow: 
            0 0 30px rgba(147, 197, 253, 0.3),
            inset 0 3px 12px rgba(255, 255, 255, 0.4),
            inset 0 -2px 8px rgba(59, 130, 246, 0.2);
        }

        /* Enhanced Arctic texture overlay */
        .ice-floor::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse at 30% 40%, rgba(255, 255, 255, 0.6) 0%, transparent 25%),
            radial-gradient(ellipse at 70% 60%, rgba(219, 234, 254, 0.5) 0%, transparent 30%),
            radial-gradient(ellipse at 50% 30%, rgba(147, 197, 253, 0.3) 0%, transparent 35%),
            radial-gradient(ellipse, 
              transparent 0%,
              rgba(240, 249, 255, 0.4) 30%,
              rgba(147, 197, 253, 0.3) 60%,
              transparent 100%
            );
          border-radius: 50%;
          opacity: 0.9;
          animation: iceShimmer 5s ease-in-out infinite;
        }

        /* Add frost texture overlay */
        .ice-floor::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 5%;
          width: 90%;
          height: 80%;
          background: 
            radial-gradient(circle at 25% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 15%),
            radial-gradient(circle at 75% 40%, rgba(255, 255, 255, 0.2) 0%, transparent 12%),
            radial-gradient(circle at 50% 70%, rgba(219, 234, 254, 0.25) 0%, transparent 18%);
          border-radius: 50%;
          opacity: 0.8;
          animation: frostPattern 6s ease-in-out infinite reverse;
        }

        @keyframes frostPattern {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes iceFloorFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-1px);
          }
        }

        /* Ice sparkle effects */
        .ice-sparkle {
          position: absolute;
          color: rgba(255, 255, 255, 0.6);
          font-size: 8px;
          pointer-events: none;
          animation-name: sparkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          text-shadow: 0 0 3px rgba(147, 197, 253, 0.4);
          border-radius: 50%;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes iceShimmer {
          0%, 100% {
            opacity: 0.9;
            transform: scaleX(1);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.05);
          }
        }
      `}</style>
    </div>
  )
}
