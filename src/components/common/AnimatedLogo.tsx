import Image from "next/image";

interface AnimatedLogoProps {
  /** true = displayed on dark backgrounds */
  light?: boolean;
  className?: string;
  /** Header logo: the brand intro (IntroSplash) flies into its HUM row */
  introTarget?: boolean;
}

const PROPERTIES_LETTERS = ["P", "R", "O", "P", "E", "R", "T", "I", "E", "S"];

const HUM_LETTERS = [
  { src: "/hum-letter-h.png", alt: "H", aspect: "aspect-[245/230]", sizes: "80px" },
  { src: "/hum-letter-u.png", alt: "U", aspect: "aspect-[240/230]", sizes: "80px" },
  { src: "/hum-letter-m.png", alt: "M", aspect: "aspect-[270/230]", sizes: "90px" },
];

/**
 * HUM Properties logo. Static: the only motion is the brand intro on first
 * load, which lands on the header copy of this logo.
 */
export default function AnimatedLogo({
  light = false,
  className = "",
  introTarget = false,
}: AnimatedLogoProps) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Top Row: H U M */}
      <div
        id={introTarget ? "hum-header-mark" : undefined}
        className="flex items-center justify-center gap-1 sm:gap-1.5 h-10 sm:h-12 md:h-14"
      >
        {HUM_LETTERS.map((l) => (
          <div key={l.src} className={`relative h-full ${l.aspect}`}>
            <Image src={l.src} alt={l.alt} fill priority sizes={l.sizes} className="object-contain" />
          </div>
        ))}
      </div>

      {/* Bottom Row: - P R O P E R T I E S - */}
      <div
        className={`flex items-center justify-center w-full mt-0.5 sm:mt-1 space-x-1 sm:space-x-1.5 ${introTarget ? "hum-intro-item" : ""}`}
      >
        <span className="h-[1px] w-4 sm:w-7 bg-gradient-to-r from-transparent to-[#d4af37]" />
        <div
          className={`flex items-center space-x-[2px] sm:space-x-[3px] font-sans tracking-[0.25em] sm:tracking-[0.3em] text-[9px] sm:text-[11px] md:text-[12px] uppercase transition-colors duration-500 ${
            light ? "text-[#d4af37]" : "text-[#a37d24]"
          }`}
        >
          {PROPERTIES_LETTERS.map((char, index) => (
            <span key={index} className="inline-block">
              {char}
            </span>
          ))}
        </div>
        <span className="h-[1px] w-4 sm:w-7 bg-gradient-to-l from-transparent to-[#d4af37]" />
      </div>

      <span className="sr-only">HUM Properties</span>
    </div>
  );
}
