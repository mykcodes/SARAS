import InsightsPanel from "../insights/InsightsPanel";

/**
 * Two-column layout for the Subject Workspace.
 *
 * Main content (document library or empty state) fills the left column.
 * The InsightsPanel (right column) is collapsible and controlled via context.
 * Future panels (AI chat, notes) can be added as additional children
 * without the page itself needing to change shape.
 */
function SubjectWorkspaceLayout({ subjectId, children }) {
  return (
    <div className="flex flex-1 gap-4 overflow-hidden">
      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto">
        {children}
      </div>

      {/* Insights panel (collapsible) */}
      <InsightsPanel subjectId={subjectId} />
    </div>
  );
}

export default SubjectWorkspaceLayout;