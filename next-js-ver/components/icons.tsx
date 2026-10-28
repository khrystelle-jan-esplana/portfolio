export const ICONS = {
  crossStar:    { light: "/svg-icons/lightMode/crossStar-light.svg",        dark: "/svg-icons/darkMode/crossStar-dark.svg" },
  lineStar:     { light: "/svg-icons/lightMode/line-star-light.svg",        dark: "/svg-icons/darkMode/line-star-dark.svg" },
  starCombo:    { light: "/svg-icons/lightMode/star-combo-6-light.svg",     dark: "/svg-icons/darkMode/star-combo-6-dark.svg" },
  filledCircle: { light: "/svg-icons/lightMode/star-filledCircle-light.svg", dark: "/svg-icons/darkMode/star-filledCircle-dark.svg" },
  rayDown:      { light: "/svg-icons/lightMode/star-raydown-light.svg",     dark: "/svg-icons/darkMode/star-raydown-dark.svg" },
  toggleLight:  { light: "/svg-icons/lightMode/toggle-light-mode-icon.svg", dark: "/svg-icons/lightMode/toggle-light-mode-icon.svg" },
  toggleDark:   { light: "/svg-icons/darkMode/toggle-darkMode-icon.svg",    dark: "/svg-icons/darkMode/toggle-darkMode-icon.svg" },
  menuStar:     { light: "/svg-icons/menuIcons/menu-star-icon-light.svg",  dark: "/svg-icons/darkMode/line-star-dark.svg" },
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className = "", style }: { name: IconName; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`icon ${className}`} style={style} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="only-light" src={ICONS[name].light} alt="" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="only-dark" src={ICONS[name].dark} alt="" draggable={false} />
    </span>
  );
}
