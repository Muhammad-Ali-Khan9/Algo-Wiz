export function AlgoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      <rect
        x="16"
        y="2"
        width="16"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="16"
        y="11"
        width="16"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M24 8v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M24 20.5 30.5 27 24 33.5 17.5 27Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M24 17v3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="16"
        y="36"
        width="16"
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M24 33.5V36"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="45" r="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M24 41.5v1.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="5.5" cy="27" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="42.5" cy="27" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 5H9.5v19.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.9 27H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 27V38.75H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 27h-2.2M13.2 27h-2.2M8.9 27H7.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M32 5h6.5v19.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40.1 27H32"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M38.5 27v7.5H32"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
