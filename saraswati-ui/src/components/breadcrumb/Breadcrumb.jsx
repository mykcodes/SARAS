import { Link, useMatches } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Renders the current route's breadcrumb trail.
 *
 * Each route defines its own `handle.crumb(match)` in the router config
 * (see App.jsx). This component only reads that metadata — it never
 * hardcodes a label for any specific page, so new nested routes (PDF
 * viewer, notes, etc.) automatically appear in the trail once they define
 * a crumb handle, with no changes needed here.
 */
function Breadcrumb() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => ({
      key: match.id,
      label: match.handle.crumb(match),
      pathname: match.pathname,
    }));

  if (crumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 border-b border-border-subtle px-8 py-3 text-[12.5px]"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={crumb.key} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={13} className="text-ink-faint" />}
            {isLast ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.pathname}
                className="text-ink-soft transition-colors hover:text-gold"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;