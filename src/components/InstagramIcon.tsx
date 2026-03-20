interface InstagramIconProps {
  className?: string;
}

export function InstagramIcon({ className = 'h-5 w-5' }: InstagramIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect
        x="2" y="2" width="20" height="20" rx="5"
        stroke="url(#ig-gradient)" strokeWidth="2"
      />
      <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)" />
    </svg>
  );
}
