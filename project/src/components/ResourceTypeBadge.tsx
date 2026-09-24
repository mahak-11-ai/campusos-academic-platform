import type { ResourceType } from '@/services/resourceService';
import { FileText, FileQuestion, ClipboardList, BookMarked } from 'lucide-react';

export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const config: Record<ResourceType, { label: string; icon: typeof FileText; color: string }> = {
    notes: { label: 'Notes', icon: FileText, color: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
    'previous-paper': { label: 'Previous Paper', icon: FileQuestion, color: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
    assignment: { label: 'Assignment', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
    reference: { label: 'Reference', icon: BookMarked, color: 'bg-violet-50 text-violet-700 ring-violet-600/20' },
  };

  const { label, icon: Icon, color } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
