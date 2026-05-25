export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="메인 네비게이션">
      <div className="bottom-nav-item">
        <FeedIcon />
        <span>메인피드</span>
      </div>
    </nav>
  )
}

function FeedIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h16M4 12h16M4 19h10" />
    </svg>
  )
}
