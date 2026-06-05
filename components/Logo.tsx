// Enracine mark — the brand logo, also the favicon (app/icon.png) and the
// in-app wordmark icon. A lens onto a landscape, rooted, beside a color arc.
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Enracine"
      width={size}
      height={size}
      className="block select-none"
      draggable={false}
    />
  );
}
