const shapes = {
  rights: <><path d="M12 10C5 6 8 1 12 5c4-4 7 1 0 5Z" /><path d="M3 15h4l3 3h5a2 2 0 0 0 0-4h-4M3 21h4l3 1 11-7a2 2 0 0 0-3-2l-3 2M3 14v8" /></>,
  participation: <><circle cx="12" cy="7" r="3" /><circle cx="4" cy="9" r="2" /><circle cx="20" cy="9" r="2" /><path d="M6 21v-3a6 6 0 0 1 12 0v3M1 19v-2a4 4 0 0 1 4-4M23 19v-2a4 4 0 0 0-4-4" /></>,
  inclusion: <><circle cx="12" cy="4" r="2" /><path d="m3 9 9 2 9-2M12 11v5m0 0-5 6m5-6 5 6" /></>,
  water: <><path d="M12 2S6 9 6 13a6 6 0 0 0 12 0c0-4-6-11-6-11ZM2 22c2-2 4-2 6 0 2-2 4-2 6 0 2-2 4-2 8 0" /></>,
  risk: <><path d="m12 2 9 4v6c0 5-5 9-9 10-4-1-9-5-9-10V6l9-4Z" /><path d="M12 7v6m0 4h.01" /></>,
  equality: <><path d="M12 3v18M5 21h14M3 7h18M6 7l-4 8h8L6 7Zm12 0-4 8h8l-4-8Z" /></>,
  communities: <><path d="m2 7 10-5 10 5M5 22v-3a7 7 0 0 1 14 0v3" /><circle cx="12" cy="10" r="3" /><path d="M3 12a2 2 0 0 1 0 4m18-4a2 2 0 0 0 0 4M1 22v-2a3 3 0 0 1 3-3m19 5v-2a3 3 0 0 0-3-3" /></>,
  city: <><path d="M3 22V8h8v14m0-18h10v18M1 22h22M6 12h2m-2 4h2m6-8h3m-3 4h3m-3 4h3m-3 4h3" /></>,
  cooperation: <><path d="m2 8 4-3 4 2 4-2 8 4-4 10-4 2-7-5-5-8Z" /><path d="m10 7-3 4 3 2 4-3 5 4M5 17l3 3 3-2m3-3 4 4" /></>,
  environment: <><path d="M12 22v-9M12 16C4 18 1 11 3 5c6 0 10 4 9 11Zm0-4C11 5 16 2 22 3c0 6-3 10-10 9ZM6 9l6 7m0-4 6-5" /></>,
  planning: <><circle cx="12" cy="12" r="10" /><path d="m16 8-2 6-6 2 2-6 6-2ZM12 2v2m0 16v2M2 12h2m16 0h2" /></>,
  agriculture: <><path d="M12 22V4m0 5C6 9 4 6 4 3c5 0 8 2 8 6Zm0 6c-6 0-8-3-8-6 5 0 8 2 8 6Zm0-6c6 0 8-3 8-6-5 0-8 2-8 6Zm0 6c6 0 8-3 8-6-5 0-8 2-8 6Zm0 6c6 0 8-3 8-6-5 0-8 2-8 6Z" /></>,
  governance: <><path d="m2 8 10-6 10 6H2ZM4 11v7m5-7v7m6-7v7m5-7v7M2 21h20M1 23h22" /></>,
};

export default function TopicIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {shapes[name]}
    </svg>
  );
}
