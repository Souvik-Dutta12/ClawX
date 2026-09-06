import type { IconKey } from '../data/content';

interface IconProps {
  icon: IconKey;
  className?: string;
}

const paths: Record<IconKey, React.ReactNode> = {
  chat: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c.001.236.038.475.117.71.222.683.79 1.201 1.463 1.32.672.118 1.276.582 1.562 1.182.285.6.82 1.052 1.493 1.118a1.99 1.99 0 0 0 1.82-.582l.673-.673m-4.5-9.5c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H15a2.25 2.25 0 0 0-1.594.659L12 16.5l-1.406-1.406A2.25 2.25 0 0 0 9 14.25H5.625A1.125 1.125 0 0 1 4.5 13.125v-6.75Z"
    />
  ),
  bolt: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M3.75 13.5 10.5 4.5v6h6l-7.5 9v-6h-5.25Z"
    />
  ),
  shield: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12.75 11.25 15 15 9.75M12 3l8.25 3v5.25c0 4.965-3.465 8.865-8.25 9.75C7.215 17.115 3.75 13.215 3.75 8.25V6L12 3Z"
    />
  ),
  code: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="m6.75 7.5-3 4.5 3 4.5m10.5-9 3 4.5-3 4.5m-4.5-9.75L11.25 16.5"
    />
  ),
  eye: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  ),
  brain: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.063-.75.12M9.75 3.104a5.012 5.012 0 0 0-.75.12m0 0a5.25 5.25 0 0 0-3.46 2.918M4.5 14.5h.75a2.25 2.25 0 0 1 2.25 2.25v1.5a2.25 2.25 0 0 1-2.25 2.25H4.5M4.5 14.5a2.25 2.25 0 0 0-2.25 2.25v1.5M9.75 8.818a5.25 5.25 0 0 0-3.46 2.918M21 14.5h-.75a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25H21m0 0a2.25 2.25 0 0 0-2.25-2.25v-1.5M21 14.5a2.25 2.25 0 0 1-2.25 2.25H18m0 0v-1.5a2.25 2.25 0 0 1 2.25-2.25H21M15 3.104a5.012 5.012 0 0 0-.75-.12M15 3.104c.251.023.501.063.75.12m0 0a5.25 5.25 0 0 1 3.46 2.918m-3.46-2.918v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 8.818a5.25 5.25 0 0 1 3.46 2.918M18 19.5v-1.5a2.25 2.25 0 0 1 2.25-2.25H21"
    />
  ),
};

export default function Icon({ icon, className = 'w-6 h-6' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      {paths[icon]}
    </svg>
  );
}
