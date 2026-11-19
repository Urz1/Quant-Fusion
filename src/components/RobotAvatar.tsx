"use client";


interface RobotAvatarProps {
  size?: "xs" | "sm" | "md";
  className?: string;
  isStreaming?: boolean;
}

/**
 * Ultra-lightweight, zero-overhead vector avatar for headers, badges, and chat messages.
 * Contains ZERO requestAnimationFrame loops, ZERO event listeners, and ZERO state updates.
 * Renders with razor-sharp pixel clarity at 18px-32px.
 */
export function RobotAvatar({
  size = "sm",
  className = "",
  isStreaming = false,
}: RobotAvatarProps) {
  const sizeMap = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-8 h-8",
  };

  const dim = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${dim} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      >
        <defs>
          {/* Obsidian Titanium Shell Gradient */}
          <linearGradient id="avatarTitaniumGrad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2E3748" />
            <stop offset="35%" stopColor="#1E2430" />
            <stop offset="100%" stopColor="#0F131A" />
          </linearGradient>

          {/* Platinum Rim Gradient */}
          <linearGradient id="avatarRimGrad" x1="8" y1="6" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#64748B" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>

          {/* Visor Deep Smoked Glass */}
          <linearGradient id="avatarVisorGrad" x1="10" y1="10" x2="22" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#05080E" />
            <stop offset="100%" stopColor="#010306" />
          </linearGradient>
        </defs>

        {/* ================= ANTENNA ================= */}
        {/* Antenna Stem */}
        <line x1="16" y1="7" x2="16" y2="3.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
        {/* Antenna Glowing Beacon Tip */}
        <circle cx="16" cy="3" r="2.2" fill="#10B981" className={isStreaming ? "animate-pulse" : ""} />
        <circle cx="15.4" cy="2.4" r="0.8" fill="#FFFFFF" />

        {/* ================= HEAD SHELL ================= */}
        <rect
          x="6.5"
          y="7"
          width="19"
          height="14"
          rx="5.5"
          fill="url(#avatarTitaniumGrad)"
          stroke="url(#avatarRimGrad)"
          strokeWidth="1"
        />

        {/* Top Specular Glare Arc */}
        <path d="M 10 8.5 Q 16 7.5 22 8.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />

        {/* Cylindrical Ear Dials */}
        <rect x="4" y="11" width="2.5" height="6" rx="1.2" fill="#334155" stroke="#1E293B" strokeWidth="0.6" />
        <rect x="25.5" y="11" width="2.5" height="6" rx="1.2" fill="#334155" stroke="#1E293B" strokeWidth="0.6" />

        {/* Deep Visor Frame */}
        <rect x="8.5" y="9.5" width="15" height="9" rx="3.5" fill="url(#avatarVisorGrad)" stroke="#1E293B" strokeWidth="0.7" />

        {/* Convex Visor Glass Glare Arc */}
        <path d="M 10 11 Q 16 10 22 11" stroke="#FFFFFF" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />

        {/* Radiant Emerald Eyes */}
        <circle cx="12.5" cy="13.5" r="1.8" fill="#10B981" />
        <circle cx="12" cy="13" r="0.7" fill="#FFFFFF" />

        <circle cx="19.5" cy="13.5" r="1.8" fill="#10B981" />
        <circle cx="19" cy="13" r="0.7" fill="#FFFFFF" />

        {/* Friendly LED Smile */}
        <path d="M 14 16 Q 16 17.5 18 16" stroke="#34D399" strokeWidth="0.9" strokeLinecap="round" fill="none" />

        {/* ================= TORSO ================= */}
        <rect
          x="8.5"
          y="22"
          width="15"
          height="8"
          rx="3.8"
          fill="url(#avatarTitaniumGrad)"
          stroke="#334155"
          strokeWidth="0.8"
        />

        {/* Chest Status Telemetry Bar */}
        <rect x="11.5" y="24" width="9" height="1.5" rx="0.7" fill="#10B981" />
        <circle cx="13" cy="27" r="0.9" fill="#0EA5E9" />
        <circle cx="16" cy="27" r="0.9" fill="#10B981" />
        <circle cx="19" cy="27" r="0.9" fill="#F59E0B" />

        {/* Dual Thruster Nozzles */}
        <rect x="11" y="29.5" width="3" height="1.5" rx="0.6" fill="#475569" />
        <rect x="18" y="29.5" width="3" height="1.5" rx="0.6" fill="#475569" />

        {/* Glowing Thruster Plasma Flame Dots */}
        <circle cx="12.5" cy="31.2" r="1" fill="#10B981" opacity="0.8" />
        <circle cx="19.5" cy="31.2" r="1" fill="#10B981" opacity="0.8" />
      </svg>
    </div>
  );
}
