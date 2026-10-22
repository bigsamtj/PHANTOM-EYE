import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import { useApp } from '../services/store';

interface TimelinePageProps {
  navigate: (route: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = () => {
  const { timeline } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = timeline.filter((tl) => {
    const matchesSearch =
      tl.summary.toLowerCase().includes(search.toLowerCase()) ||
      tl.actor.toLowerCase().includes(search.toLowerCase()) ||
      tl.target.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || tl.eventType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12 relative text-[#172033]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172033] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E32936]" />
            Timeline & Audited Activity Stream
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Chronological log of assessment phases, authorization decisions, observations, and report generation events.
          </p>
        </div>

        <span className="text-xs font-mono bg-[#F8FAFC] text-[#64748B] px-3 py-1 rounded-lg border border-[#CBD5E1]">
          {timeline.length} Events Logged
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search timeline event, actor, target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#172033] placeholder-[#94A3B8] focus:border-[#E32936] focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 text-[#64748B]">
          <Filter className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Event Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#172033] outline-hidden font-medium"
          >
            <option value="All">All Events</option>
            <option value="Assessment Created">Assessment Created</option>
            <option value="Authorization Confirmed">Authorization Confirmed</option>
            <option value="Scope Validated">Scope Validated</option>
            <option value="Module Started">Module Started</option>
            <option value="Asset Discovered">Asset Discovered</option>
            <option value="Finding Created">Finding Created</option>
            <option value="Report Generated">Report Generated</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs p-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            <Clock className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <div className="font-bold text-[#0F172A]">No Timeline Events Recorded</div>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Timeline events are captured in real time as assessments run.</p>
          </div>
        ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
          {filtered.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  ev.eventType.includes('Finding')
                    ? 'bg-[#E32936]'
                    : ev.eventType.includes('Authorization')
                    ? 'bg-[#059669]'
                    : ev.eventType.includes('Report')
                    ? 'bg-[#2563EB]'
                    : 'bg-[#94A3B8]'
                }`}
              />

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-2 hover:border-[#E32936] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#172033]">{ev.eventType}</span>
                    <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded text-[#64748B] border border-[#CBD5E1]">
                      {ev.sourceModule}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {new Date(ev.timestamp).toUTCString()}
                  </span>
                </div>

                <p className="text-[#64748B] leading-relaxed">{ev.summary}</p>

                <div className="pt-2 border-t border-[#E2E8F0] flex flex-wrap items-center gap-4 text-[11px] text-[#94A3B8]">
                  <span>
                    Actor: <strong className="text-[#172033]">{ev.actor}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Target: <strong className="font-mono text-[#172033]">{ev.target}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Assessment: <strong className="font-mono text-[#E32936]">{ev.assessmentId}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
