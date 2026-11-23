/** ARYPlusD mark: a play triangle sitting on a download arrow. Original artwork. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#059669" />
      <path d="M12 7.5v9.2l7.6-4.6z" fill="#fff" />
      <path d="M16 18.5v6M12.5 21.5 16 25l3.5-3.5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
