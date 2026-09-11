import React from 'react';

/**
 * PixelCollaborationVisual - Large, cohesive retro-futuristic pixel-art collaboration scene.
 * Features 2-3 clearly visible pixel characters collaborating across multi-tiered isometric
 * platforms with connected glowing data bus lines, project cards, and idea/share nodes.
 */
export default function PixelCollaborationVisual({ variant = 'login' }) {
  return (
    <div className="pixel-hero-visual-root">
      {/* Environmental Pixel Stars / Crosses */}
      <div className="pixel-star pstar-1">+</div>
      <div className="pixel-star pstar-2">+</div>
      <div className="pixel-star pstar-3">+</div>
      <div className="pixel-star pstar-4">+</div>
      <div className="pixel-star pstar-5">+</div>
      <div className="pixel-star pstar-6">+</div>
      <div className="pixel-star pstar-7">+</div>

      {/* Environmental Pixel Stars / Crosses */}

      {/* ─── VARIANT 1: LOGIN (Main Collaboration Studio) ─── */}
      {variant === 'login' && (
        <div className="pixel-scene-wrapper">
          <svg
            className="pixel-hero-svg"
            viewBox="0 0 760 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial glow for nodes */}
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2E7AF9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#1475E4" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#F5FCFC" />
              </linearGradient>
            </defs>

            {/* ── GROUND ISOMETRIC PERSPECTIVE GRID ── */}
            <g opacity="0.22" stroke="#1475E4" strokeWidth="1">
              <line x1="120" y1="460" x2="680" y2="460" strokeDasharray="6 6" />
              <line x1="80" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
              <line x1="280" y1="500" x2="580" y2="350" strokeDasharray="4 4" />
              <line x1="480" y1="500" x2="180" y2="350" strokeDasharray="4 4" />
              <line x1="680" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
            </g>

            {/* ── CONNECTED GLOWING RED DATA BUS WIRES ── */}
            {/* Wire 1: From Char 2 Idea Bulb -> Central Fizz Connect */}
            <path
              d="M 520 185 L 430 185 L 430 220"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />
            {/* Wire 2: From Central Fizz Connect -> Char 1 Laptop Terminal */}
            <path
              d="M 285 240 L 225 240 L 225 295"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />
            {/* Wire 3: From Laptop -> Share Node cluster */}
            <path
              d="M 225 320 L 225 385 L 340 385"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />
            {/* Wire 4: From Central Fizz Connect -> Char 3 Task Terminal */}
            <path
              d="M 430 330 L 430 385 L 530 385"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />

            {/* ── MULTI-LEVEL ISOMETRIC PLATFORM HUB ── */}
            {/* Tier 1: Left Main Deck (Character 1 Workstation) */}
            <g transform="translate(100, 260)">
              {/* Base shadow */}
              <polygon points="0,110 90,65 180,110 90,155" fill="#021048" opacity="0.8" />
              {/* Left Face */}
              <polygon points="0,90 90,135 90,210 0,165" fill="#022061" stroke="#1475E4" strokeWidth="1.8" />
              {/* Right Face */}
              <polygon points="90,135 180,90 180,165 90,210" fill="#011A52" stroke="#1475E4" strokeWidth="1.8" />
              {/* Top Face (Deck) */}
              <polygon points="0,90 90,45 180,90 90,135" fill="#102A43" stroke="#1475E4" strokeWidth="2" />

              {/* Pixel Workstation Desk */}
              <polygon points="65,75 105,55 145,75 105,95" fill="#102A43" stroke="#2E7AF9" strokeWidth="1.5" />
              <polygon points="65,75 105,95 105,120 65,100" fill="#022061" stroke="#1475E4" strokeWidth="1.2" />
              <polygon points="105,95 145,75 145,100 105,120" fill="#011A52" stroke="#1475E4" strokeWidth="1.2" />

              {/* ── CHARACTER 1: The Builder / Engineer (Sitting at Laptop) ── */}
              <g transform="translate(35, 10)">
                <g className="anim-hero-bob">
                  {/* Stool / Seat */}
                  <rect x="24" y="68" width="16" height="12" fill="#102A43" stroke="#1475E4" strokeWidth="1" />
                  <line x1="26" y1="80" x2="24" y2="92" stroke="#1475E4" strokeWidth="2" />
                  <line x1="38" y1="80" x2="40" y2="92" stroke="#1475E4" strokeWidth="2" />

                  {/* Legs */}
                  <rect x="28" y="62" width="10" height="18" fill="#1A1A24" />
                  <rect x="36" y="74" width="14" height="8" fill="#1A1A24" />
                  <rect x="46" y="80" width="8" height="6" fill="#1475E4" />

                  {/* Body / Red Hoodie */}
                  <rect x="22" y="38" width="26" height="26" fill="#1475E4" rx="2" />
                  <rect x="26" y="42" width="8" height="18" fill="#1475E4" />
                  <rect x="32" y="38" width="8" height="8" fill="#102A43" />

                  {/* Head / Hair */}
                  <rect x="22" y="14" width="24" height="22" fill="#7A3D12" rx="2" />
                  <rect x="20" y="20" width="6" height="12" fill="#5E2C09" />
                  <rect x="24" y="12" width="22" height="6" fill="#5E2C09" />
                  <rect x="26" y="22" width="20" height="14" fill="#FBD598" />
                  {/* Face Features: Eyes & Smile */}
                  <rect x="38" y="25" width="3" height="4" fill="#111" />
                  <rect x="43" y="25" width="2" height="4" fill="#111" />
                  <rect x="39" y="32" width="5" height="2" fill="#111" />

                  {/* Arms typing */}
                  <rect x="36" y="46" width="18" height="7" fill="#1475E4" />
                  <rect x="50" y="48" width="8" height="5" fill="#FBD598" />

                  {/* Open Laptop */}
                  <polygon points="52,54 74,48 76,56 54,62" fill="#D1D5DB" stroke="#111" strokeWidth="1.2" />
                  <polygon points="62,34 76,30 76,48 62,52" fill="#111827" stroke="#1475E4" strokeWidth="1.5" />
                  {/* Glowing Screen Code lines */}
                  <line x1="65" y1="38" x2="73" y2="36" stroke="#2E7AF9" strokeWidth="2" />
                  <line x1="65" y1="43" x2="71" y2="41" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="65" y1="47" x2="74" y2="45" stroke="#1475E4" strokeWidth="1.5" />
                </g>
              </g>
            </g>

            {/* Tier 2: Right Upper Tier (Character 2 Innovation Tower) */}
            <g transform="translate(480, 180)">
              {/* Base shadow */}
              <polygon points="0,110 80,70 160,110 80,150" fill="#021048" opacity="0.8" />
              {/* Left Face */}
              <polygon points="0,90 80,130 80,240 0,200" fill="#022061" stroke="#1475E4" strokeWidth="1.8" />
              {/* Right Face */}
              <polygon points="80,130 160,90 160,200 80,240" fill="#011A52" stroke="#1475E4" strokeWidth="1.8" />
              {/* Top Face */}
              <polygon points="0,90 80,50 160,90 80,130" fill="#102A43" stroke="#1475E4" strokeWidth="2" />

              {/* ── CHARACTER 2: The Idea Creator / Architect (Standing) ── */}
              <g transform="translate(42, -25)">
                <g className="anim-hero-bob-alt">
                  {/* Boots */}
                  <rect x="18" y="78" width="10" height="8" fill="#111" />
                  <rect x="34" y="78" width="10" height="8" fill="#111" />

                  {/* Pants */}
                  <rect x="20" y="58" width="8" height="22" fill="#1F2937" />
                  <rect x="34" y="58" width="8" height="22" fill="#1F2937" />

                  {/* Torso / Crimson Jacket */}
                  <rect x="14" y="30" width="34" height="30" fill="#1475E4" rx="2" stroke="#1475E4" strokeWidth="1.2" />
                  <rect x="26" y="30" width="10" height="30" fill="#102A43" />
                  <rect x="28" y="34" width="6" height="8" fill="#1475E4" />

                  {/* Head & Stylish Hair */}
                  <rect x="16" y="6" width="28" height="24" fill="#3B1E08" rx="3" />
                  <rect x="14" y="12" width="6" height="14" fill="#241204" />
                  <rect x="18" y="4" width="26" height="6" fill="#5A2F0D" />
                  <rect x="20" y="14" width="22" height="16" fill="#FBD598" />

                  {/* Face & Glasses */}
                  <rect x="22" y="16" width="8" height="5" fill="none" stroke="#111" strokeWidth="1.5" />
                  <rect x="32" y="16" width="8" height="5" fill="none" stroke="#111" strokeWidth="1.5" />
                  <line x1="30" y1="18" x2="32" y2="18" stroke="#111" strokeWidth="1.5" />
                  <rect x="25" y="18" width="2" height="2" fill="#1475E4" />
                  <rect x="35" y="18" width="2" height="2" fill="#1475E4" />
                  <rect x="27" y="24" width="6" height="2" fill="#1475E4" />

                  {/* Left Arm Raised Presenting Idea Bulb */}
                  <path d="M 16 34 L -6 20 L -4 14" stroke="#1475E4" strokeWidth="6" strokeLinecap="round" />
                  <rect x="-8" y="10" width="7" height="7" fill="#FBD598" rx="1" />

                  {/* Right Arm */}
                  <rect x="44" y="34" width="7" height="20" fill="#1475E4" />
                  <rect x="44" y="52" width="7" height="6" fill="#FBD598" />
                </g>
              </g>

              {/* Glowing Pixel Idea Bulb hovering near Character 2 */}
              <g transform="translate(18, -48)">
                <g className="anim-float-bulb">
                  <circle cx="16" cy="16" r="22" fill="url(#nodeGlow)" />
                  <rect x="4" y="4" width="24" height="24" rx="5" fill="#102A43" stroke="#2E7AF9" strokeWidth="2" />
                  <text x="16" y="14" textAnchor="middle" fill="#102A43" fontSize="6.5" fontFamily="Silkscreen" letterSpacing="0.5">IDEA</text>
                  {/* Lightbulb Icon */}
                  <circle cx="16" cy="20" r="4" fill="#1475E4" />
                  <rect x="14" y="24" width="4" height="2.5" fill="#FFD700" />
                </g>
              </g>
            </g>

            {/* Tier 3: Lower Front Tier (Character 3 & Tasks) */}
            <g transform="translate(420, 340)">
              {/* Platform */}
              <polygon points="0,60 70,30 140,60 70,90" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="0,60 70,90 70,140 0,110" fill="#022061" stroke="#1475E4" strokeWidth="1.5" />
              <polygon points="70,90 140,60 140,110 70,140" fill="#011A52" stroke="#1475E4" strokeWidth="1.5" />

              {/* ── CHARACTER 3: Collaborator / Reviewer (Standing Front) ── */}
              <g transform="translate(55, -28)">
                <g className="anim-hero-bob-delayed">
                  {/* Legs */}
                  <rect x="8" y="54" width="7" height="18" fill="#111" />
                  <rect x="19" y="54" width="7" height="18" fill="#111" />
                  {/* Torso */}
                  <rect x="4" y="28" width="26" height="26" fill="#1475E4" rx="2" />
                  <rect x="12" y="28" width="10" height="26" fill="#374151" />
                  {/* Head */}
                  <rect x="6" y="8" width="22" height="20" fill="#1F2937" rx="2" />
                  <rect x="8" y="14" width="18" height="14" fill="#FBD598" />
                  <rect x="11" y="17" width="3" height="3" fill="#111" />
                  <rect x="19" y="17" width="3" height="3" fill="#111" />

                  {/* Holding Tablet with Checklist */}
                  <rect x="-4" y="32" width="18" height="22" rx="2" fill="#0F172A" stroke="#1475E4" strokeWidth="1.5" />
                  <line x1="-1" y1="38" x2="10" y2="38" stroke="#2E7AF9" strokeWidth="1.5" />
                  <line x1="-1" y1="43" x2="8" y2="43" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="-1" y1="48" x2="11" y2="48" stroke="#22C55E" strokeWidth="1.5" />
                </g>
              </g>
            </g>

            {/* ── PROMINENT CENTRAL COLLABORATION BOARD CARD ── */}
            <g transform="translate(255, 140)">
              <g className="anim-float-card">
                {/* Ambient Glow */}
                <rect x="-10" y="-10" width="210" height="145" rx="16" fill="url(#nodeGlow)" opacity="0.6" />
                {/* Card Container */}
                <rect
                  x="0"
                  y="0"
                  width="190"
                  height="125"
                  rx="12"
                  fill="url(#boardGrad)"
                  stroke="#1475E4"
                  strokeWidth="2"
                  filter="drop-shadow(0 8px 24px rgba(0,0,0,0.85))"
                />

                {/* Title Bar */}
                <rect x="0" y="0" width="190" height="24" rx="12" fill="#021048" />
                <rect x="0" y="14" width="190" height="10" fill="#021048" />
                <line x1="0" y1="24" x2="190" y2="24" stroke="#1475E4" strokeWidth="1" />
                {/* Window Dots */}
                <circle cx="14" cy="12" r="3" fill="#1475E4" />
                <circle cx="24" cy="12" r="3" fill="#F59E0B" />
                <circle cx="34" cy="12" r="3" fill="#10B981" />
                <text x="50" y="15" fill="#60758A" fontSize="7" fontFamily="Silkscreen" letterSpacing="0.5">COLLAB.OS // V1.0</text>

                {/* Card Main Headline */}
                <text x="14" y="46" fill="#102A43" fontSize="11" fontFamily="Silkscreen" fontWeight="700">PROJECT DASHBOARD</text>
                <text x="14" y="66" fill="#2E7AF9" fontSize="9" fontFamily="Silkscreen">SYSTEM ONLINE</text>


                {/* Sprint Progress Bar */}
                <g transform="translate(14, 82)">
                  <rect x="0" y="0" width="162" height="14" rx="3" fill="#021048" stroke="rgba(22, 198, 210,0.35)" strokeWidth="1" />
                  <rect x="2" y="2" width="118" height="10" rx="2" fill="linear-gradient(90deg, #1475E4, #1475E4)" />
                  <text x="6" y="9.5" fill="#102A43" fontSize="6.5" fontFamily="Silkscreen">SPRINT 04: 75%</text>
                  <text x="125" y="9.5" fill="#2E7AF9" fontSize="6" fontFamily="Silkscreen">ACTIVE</text>
                </g>

                {/* Bottom Mini Tags */}
                <g transform="translate(14, 104)">
                  <rect x="0" y="0" width="46" height="12" rx="2" fill="#F5FCFC" stroke="#1475E4" strokeWidth="0.8" />
                  <text x="23" y="8" textAnchor="middle" fill="#2E7AF9" fontSize="5.5" fontFamily="Silkscreen">IDEAS</text>

                  <rect x="52" y="0" width="48" height="12" rx="2" fill="#F5FCFC" stroke="#1475E4" strokeWidth="0.8" />
                  <text x="76" y="8" textAnchor="middle" fill="#102A43" fontSize="5.5" fontFamily="Silkscreen">BUILD</text>

                  <rect x="106" y="0" width="56" height="12" rx="2" fill="#F5FCFC" stroke="#1475E4" strokeWidth="0.8" />
                  <text x="134" y="8" textAnchor="middle" fill="#10B981" fontSize="5.5" fontFamily="Silkscreen">SYNC ⚡</text>
                </g>
              </g>
            </g>

            {/* ── FLOATING COLLABORATION NODES ── */}
            {/* Node: [BUILD] Document Node */}
            <g transform="translate(200, 375)">
              <g className="anim-float-node-1">
                <rect x="0" y="0" width="70" height="54" rx="8" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
                <text x="35" y="16" textAnchor="middle" fill="#2E7AF9" fontSize="7.5" fontFamily="Silkscreen" letterSpacing="0.8">BUILD</text>
                {/* Project icon */}
                <rect x="26" y="24" width="18" height="20" rx="2" fill="none" stroke="#2E7AF9" strokeWidth="1.5" />
                <line x1="30" y1="29" x2="39" y2="29" stroke="#1475E4" strokeWidth="1.5" />
                <line x1="30" y1="34" x2="39" y2="34" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>
            </g>

            {/* Node: [SHARE] Connected Network Node */}
            <g transform="translate(300, 370)">
              <g className="anim-float-node-2">
                <rect x="0" y="0" width="80" height="56" rx="8" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
                <text x="40" y="16" textAnchor="middle" fill="#2E7AF9" fontSize="7.5" fontFamily="Silkscreen" letterSpacing="0.8">SHARE</text>
                {/* Connected circles */}
                <circle cx="28" cy="34" r="4" fill="#1475E4" />
                <circle cx="52" cy="27" r="4" fill="#2E7AF9" />
                <circle cx="52" cy="41" r="4" fill="#102A43" />
                <line x1="28" y1="34" x2="52" y2="27" stroke="#1475E4" strokeWidth="1.8" />
                <line x1="28" y1="34" x2="52" y2="41" stroke="#1475E4" strokeWidth="1.8" />
              </g>
            </g>

            {/* Stepped Isometric Pixel Staircase connecting the platforms */}
            <g transform="translate(290, 310)">
              <polygon points="0,10 20,0 40,10 20,20" fill="#102A43" stroke="#1475E4" strokeWidth="1" />
              <polygon points="0,10 20,20 20,30 0,20" fill="#022061" stroke="#1475E4" strokeWidth="1" />
              <polygon points="20,20 40,10 40,20 20,30" fill="#011A52" stroke="#1475E4" strokeWidth="1" />

              <polygon points="25,25 45,15 65,25 45,35" fill="#102A43" stroke="#1475E4" strokeWidth="1" />
              <polygon points="25,25 45,35 45,45 25,35" fill="#022061" stroke="#1475E4" strokeWidth="1" />
              <polygon points="45,35 65,25 65,35 45,45" fill="#011A52" stroke="#1475E4" strokeWidth="1" />
            </g>
          </svg>
        </div>
      )}

      {/* ─── VARIANT 2: CREATE ACCOUNT (Community of Builders) ─── */}
      {variant === 'create-account' && (
        <div className="pixel-scene-wrapper">
          <svg
            className="pixel-hero-svg"
            viewBox="0 0 760 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="caGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2E7AF9" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#1475E4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ground Grid */}
            <g opacity="0.22" stroke="#1475E4" strokeWidth="1">
              <line x1="120" y1="460" x2="680" y2="460" strokeDasharray="6 6" />
              <line x1="80" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
              <line x1="680" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
            </g>

            {/* Connecting Bus Line */}
            <path
              d="M 230 260 L 350 260 L 350 190 L 460 190"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />
            <path
              d="M 350 260 L 350 360 L 460 360"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />

            {/* Stepped Mountain of Creation Cubes */}
            <g transform="translate(130, 210)">
              {/* High Center Pillar */}
              <polygon points="70,40 130,10 190,40 130,70" fill="#102A43" stroke="#1475E4" strokeWidth="2" />
              <polygon points="70,40 130,70 130,200 70,170" fill="#022061" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="130,70 190,40 190,170 130,200" fill="#011A52" stroke="#1475E4" strokeWidth="1.8" />

              {/* Left Step Deck */}
              <polygon points="0,100 60,70 120,100 60,130" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="0,100 60,130 60,220 0,190" fill="#022061" stroke="#1475E4" strokeWidth="1.5" />
              <polygon points="60,130 120,100 120,190 60,220" fill="#011A52" stroke="#1475E4" strokeWidth="1.5" />

              {/* Right Step Deck */}
              <polygon points="140,110 200,80 260,110 200,140" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="140,110 200,140 200,230 140,200" fill="#022061" stroke="#1475E4" strokeWidth="1.5" />
              <polygon points="200,140 260,110 260,200 200,230" fill="#011A52" stroke="#1475E4" strokeWidth="1.5" />

              {/* ── CREATOR 1: Leader Standing on Top Peak ── */}
              <g transform="translate(105, -45)">
                <g className="anim-hero-bob">
                  <rect x="18" y="70" width="8" height="12" fill="#111" />
                  <rect x="30" y="70" width="8" height="12" fill="#111" />
                  <rect x="18" y="50" width="8" height="22" fill="#1E293B" />
                  <rect x="30" y="50" width="8" height="22" fill="#1E293B" />
                  <rect x="14" y="24" width="28" height="28" fill="#1475E4" rx="2" stroke="#2E7AF9" strokeWidth="1" />
                  <rect x="22" y="24" width="12" height="28" fill="#102A43" />
                  <rect x="16" y="2" width="24" height="22" fill="#3B1E08" rx="3" />
                  <rect x="18" y="10" width="20" height="14" fill="#FBD598" />
                  <rect x="21" y="14" width="3" height="3" fill="#111" />
                  <rect x="29" y="14" width="3" height="3" fill="#111" />
                  {/* Crown Node over creator */}
                  <polygon points="20,-8 25,0 30,-8 35,0 40,-8 40,4 20,4" fill="#FFD700" stroke="#B45309" strokeWidth="1" />
                </g>
              </g>

              {/* ── CREATOR 2: Innovator on Left Step Planting Idea Sprout ── */}
              <g transform="translate(35, 25)">
                <g className="anim-hero-bob-delayed">
                  <rect x="14" y="44" width="6" height="12" fill="#111" />
                  <rect x="24" y="44" width="6" height="12" fill="#111" />
                  <rect x="12" y="22" width="20" height="24" fill="#1475E4" rx="2" />
                  <rect x="14" y="4" width="16" height="18" fill="#1F2937" rx="2" />
                  <rect x="16" y="9" width="12" height="12" fill="#FBD598" />
                  {/* Sprout emerging from block */}
                  <line x1="-12" y1="42" x2="-12" y2="18" stroke="#10B981" strokeWidth="3" />
                  <rect x="-20" y="14" width="8" height="6" rx="2" fill="#22C55E" />
                  <rect x="-12" y="10" width="8" height="6" rx="2" fill="#22C55E" />
                </g>
              </g>

              {/* ── CREATOR 3: Designer on Right Step holding Blueprint ── */}
              <g transform="translate(180, 30)">
                <g className="anim-hero-bob-alt">
                  <rect x="12" y="44" width="6" height="14" fill="#111" />
                  <rect x="22" y="44" width="6" height="14" fill="#111" />
                  <rect x="10" y="22" width="20" height="24" fill="#2E7AF9" rx="2" />
                  <rect x="12" y="4" width="16" height="18" fill="#92400E" rx="2" />
                  <rect x="14" y="9" width="12" height="12" fill="#FBD598" />
                  {/* Blueprint Card */}
                  <rect x="28" y="20" width="18" height="24" rx="2" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="1.2" />
                  <line x1="31" y1="26" x2="43" y2="26" stroke="#93C5FD" strokeWidth="1.2" />
                  <line x1="31" y1="31" x2="40" y2="31" stroke="#93C5FD" strokeWidth="1.2" />
                </g>
              </g>
            </g>

            {/* Card 1: "PLAN · COLLABORATE · BUILD" */}
            <g transform="translate(460, 150)">
              <g className="anim-float-card">
                <rect x="0" y="0" width="180" height="85" rx="10" fill="#102A43" stroke="#1475E4" strokeWidth="2" />
                <rect x="0" y="0" width="180" height="18" rx="10" fill="#021048" />
                <text x="14" y="13" fill="#102A43" fontSize="6.5" fontFamily="Silkscreen">COLLAB PLATFORM</text>
                <text x="16" y="38" fill="#102A43" fontSize="10" fontFamily="Silkscreen">PLAN</text>
                <text x="16" y="52" fill="#2E7AF9" fontSize="10" fontFamily="Silkscreen">COLLABORATE</text>
                <text x="16" y="68" fill="#102A43" fontSize="10" fontFamily="Silkscreen">BUILD</text>
              </g>
            </g>

            {/* Card 2: "WORKSPACE ONLINE" */}
            <g transform="translate(460, 310)">
              <g className="anim-float-card">
                <rect x="0" y="0" width="180" height="65" rx="10" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
                <text x="16" y="28" fill="#60758A" fontSize="8.5" fontFamily="Silkscreen">WORKSPACE</text>
                <text x="16" y="46" fill="#1475E4" fontSize="10.5" fontFamily="Silkscreen" fontWeight="700">ONLINE</text>
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* ─── VARIANT 3: FORGOT PASSWORD ─── */}
      {variant === 'forgot-password' && (
        <div className="pixel-scene-wrapper">
          <svg
            className="pixel-hero-svg"
            viewBox="0 0 760 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground grid */}
            <g opacity="0.22" stroke="#1475E4" strokeWidth="1">
              <line x1="120" y1="460" x2="680" y2="460" strokeDasharray="6 6" />
              <line x1="80" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
            </g>

            {/* Platform & Character inspecting lock node */}
            <g transform="translate(140, 240)">
              <polygon points="0,80 80,40 160,80 80,120" fill="#102A43" stroke="#1475E4" strokeWidth="2" />
              <polygon points="0,80 80,120 80,200 0,160" fill="#022061" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="80,120 160,80 160,160 80,200" fill="#011A52" stroke="#1475E4" strokeWidth="1.8" />

              {/* Peeking Pixel Character */}
              <g transform="translate(35, -5)">
                <g className="anim-hero-bob">
                  <rect x="18" y="58" width="8" height="20" fill="#111" />
                  <rect x="30" y="58" width="8" height="20" fill="#111" />
                  <rect x="14" y="28" width="28" height="32" fill="#1475E4" rx="2" />
                  <rect x="16" y="6" width="24" height="22" fill="#3B1E08" rx="2" />
                  <rect x="18" y="12" width="20" height="14" fill="#FBD598" />
                  <rect x="22" y="16" width="3" height="4" fill="#111" />
                  <rect x="30" y="16" width="3" height="4" fill="#111" />
                </g>
              </g>
            </g>

            {/* Connecting Wire to Big Security Lock Card */}
            <path
              d="M 300 320 L 420 320 L 420 220"
              stroke="#1475E4"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="anim-data-wire" opacity="0.6"
            />

            {/* Large Card: "ACCOUNT RECOVERY SYSTEM" */}
            <g transform="translate(350, 160)">
              <g className="anim-float-card">
                <rect x="0" y="0" width="260" height="100" rx="12" fill="#102A43" stroke="#1475E4" strokeWidth="2" />
                <rect x="0" y="0" width="260" height="24" rx="12" fill="#021048" />
                <circle cx="16" cy="12" r="3" fill="#1475E4" />
                <text x="30" y="15" fill="#60758A" fontSize="7" fontFamily="Silkscreen">ACCOUNT SECURITY RECOVERY</text>
                <text x="20" y="54" fill="#2E7AF9" fontSize="11" fontFamily="Silkscreen">RECOVERY MODE</text>
                <text x="20" y="76" fill="#60758A" fontSize="9" fontFamily="Silkscreen">RESET LINK SERVICE</text>
              </g>
            </g>

            {/* Giant Glowing Pixel Lock Node */}
            <g transform="translate(420, 310)">
              <g className="anim-float-node-1">
                <rect x="0" y="0" width="80" height="80" rx="12" fill="#102A43" stroke="#1475E4" strokeWidth="2.5" />
                <rect x="22" y="38" width="36" height="28" rx="4" fill="#1475E4" />
                <path d="M 28 38 L 28 26 C 28 16 52 16 52 26 L 52 38" stroke="#1475E4" strokeWidth="4" fill="none" />
                <circle cx="40" cy="50" r="3" fill="#011A52" />
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* ─── VARIANT 4: RESET PASSWORD ─── */}
      {variant === 'reset-password' && (
        <div className="pixel-scene-wrapper">
          <svg
            className="pixel-hero-svg"
            viewBox="0 0 760 520"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground grid */}
            <g opacity="0.22" stroke="#1475E4" strokeWidth="1">
              <line x1="120" y1="460" x2="680" y2="460" strokeDasharray="6 6" />
              <line x1="80" y1="420" x2="380" y2="270" strokeDasharray="4 4" />
            </g>

            {/* Platforms & Security Matrix */}
            <g transform="translate(160, 250)">
              <polygon points="0,80 80,40 160,80 80,120" fill="#102A43" stroke="#1475E4" strokeWidth="2" />
              <polygon points="0,80 80,120 80,200 0,160" fill="#022061" stroke="#1475E4" strokeWidth="1.8" />
              <polygon points="80,120 160,80 160,200 80,240" fill="#011A52" stroke="#1475E4" strokeWidth="1.8" />

              {/* Character setting new key */}
              <g transform="translate(35, -5)">
                <g className="anim-hero-bob">
                  <rect x="18" y="58" width="8" height="20" fill="#111" />
                  <rect x="30" y="58" width="8" height="20" fill="#111" />
                  <rect x="14" y="28" width="28" height="32" fill="#1475E4" rx="2" />
                  <rect x="16" y="6" width="24" height="22" fill="#1F2937" rx="2" />
                  <rect x="18" y="12" width="20" height="14" fill="#FBD598" />
                  <rect x="22" y="16" width="3" height="4" fill="#111" />
                  <rect x="30" y="16" width="3" height="4" fill="#111" />
                </g>
              </g>
            </g>

            {/* Giant Shield & Key Node */}
            <g transform="translate(380, 200)">
              <g className="anim-float-card">
                <rect x="0" y="0" width="100" height="100" rx="16" fill="#102A43" stroke="#1475E4" strokeWidth="2.5" />
                <rect x="30" y="48" width="40" height="34" rx="4" fill="#1475E4" />
                <path d="M 38 48 L 38 32 C 38 20 62 20 62 32 L 62 48" stroke="#1475E4" strokeWidth="4.5" fill="none" />
                <circle cx="50" cy="62" r="4" fill="#011A52" />
              </g>
            </g>

            <g transform="translate(360, 330)">
              <g className="anim-float-node-1">
                <rect x="0" y="0" width="180" height="60" rx="8" fill="#102A43" stroke="#1475E4" strokeWidth="1.8" />
                <text x="20" y="26" fill="#102A43" fontSize="8" fontFamily="Silkscreen">SECURITY PROTOCOL</text>
                <text x="20" y="44" fill="#2E7AF9" fontSize="10" fontFamily="Silkscreen">ENCRYPTED 256-BIT</text>
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* ─── VARIANT 5: RESET SUCCESS ─── */}
      {variant === 'reset-success' && (
        <div className="pixel-scene-wrapper">
          <div className="success-ambient-particles">
            <span className="pdot pdot-1" />
            <span className="pdot pdot-2" />
            <span className="pdot pdot-3" />
            <span className="pdot pdot-4" />
          </div>
        </div>
      )}

      {/* ─── EMBEDDED STYLES FOR THE HERO SCENE ─── */}
      <style>{`
        .pixel-hero-visual-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .pixel-scene-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pixel-hero-svg {
          width: 100%;
          height: 100%;
          max-width: 760px;
          max-height: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 25px rgba(22, 198, 210, 0.22));
          transition: transform 0.3s ease;
        }

        /* Twinkling Pixel Stars */
        .pixel-star {
          position: absolute;
          color: var(--red-primary);
          font-family: var(--font-pixel);
          line-height: 1;
          pointer-events: none;
          text-shadow: 0 0 10px var(--red-glow);
          animation: pixelCrossBlink 4s ease-in-out infinite;
        }
        .pstar-1 { top: 6%; left: 8%; font-size: 22px; animation-delay: 0s; }
        .pstar-2 { top: 28%; left: 2%; font-size: 16px; animation-delay: 1.4s; }
        .pstar-3 { top: 4%; right: 24%; font-size: 18px; animation-delay: 0.9s; }
        .pstar-4 { bottom: 22%; left: 25%; font-size: 24px; animation-delay: 2.1s; }
        .pstar-5 { top: 42%; right: 4%; font-size: 16px; animation-delay: 1.6s; }
        .pstar-6 { bottom: 6%; right: 15%; font-size: 20px; animation-delay: 2.7s; }
        .pstar-7 { top: 58%; left: 14%; font-size: 18px; animation-delay: 3.2s; }

        

        /* Dynamic Animations */
        .anim-hero-bob {
          animation: pixelBob 3.8s ease-in-out infinite;
        }
        .anim-hero-bob-alt {
          animation: pixelBob 4.4s ease-in-out infinite 0.6s;
        }
        .anim-hero-bob-delayed {
          animation: pixelBob 4.1s ease-in-out infinite 1.2s;
        }
        .anim-float-card {
          animation: pixelBob 4.8s ease-in-out infinite 0.3s;
        }
        .anim-float-bulb {
          animation: pixelBob 3.2s ease-in-out infinite;
        }
        .anim-float-node-1 {
          animation: pixelBob 4.5s ease-in-out infinite 0.8s;
        }
        .anim-float-node-2 {
          animation: pixelBob 5.1s ease-in-out infinite 1.4s;
        }
        .anim-data-wire {
          animation: pulseRedGlow 3s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .pixel-hero-svg {
            max-width: 620px;
          }
          
        }

        @media (max-width: 900px) {
          .pixel-hero-visual-root {
            min-height: unset;
          }
          .pixel-hero-svg {
            max-width: 520px;
          }
          
        }

        @media (max-width: 600px) {
          .pixel-hero-svg {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
