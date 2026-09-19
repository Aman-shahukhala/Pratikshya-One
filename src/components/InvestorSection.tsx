import Reveal from './Reveal';

const useOfFunds = [
  { label: 'Clinical trials & Nepal DDA / FDA 510(k) approval', pct: 30, amount: '$9.6M' },
  { label: 'ISO 13485 cleanroom manufacturing scale-up', pct: 25, amount: '$8.0M' },
  { label: 'Neural EMG interface & sensor R&D', pct: 20, amount: '$6.4M' },
  { label: 'Clinical partner network & rehabilitation centers', pct: 15, amount: '$4.8M' },
  { label: 'Quality assurance, G&A & working capital', pct: 10, amount: '$3.2M' },
];

const revenueYears = [
  { year: 'Year 1', units: 0, revenue: 0, note: 'Clinical Trials & DDA Submission' },
  { year: 'Year 2', units: 190, revenue: 4.2, note: 'Nepal & South Asia Pilot Clinics' },
  { year: 'Year 3', units: 840, revenue: 18.5, note: 'Global Emerging Markets' },
  { year: 'Year 4', units: 1910, revenue: 42.0, note: 'CE Mark & FDA 510(k) Scale' },
  { year: 'Year 5', units: 3860, revenue: 85.0, note: 'Global Clinical Distribution' },
];

const maxRevenue = 85.0;

export default function InvestorSection() {
  return (
    <section id="investors" className="relative py-12 lg:py-16 overflow-hidden bg-slate-50/80 backdrop-blur-sm border-t border-slate-200/80 scroll-mt-20">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <Reveal>
          <div className="text-center mb-10">
            <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-slate-400 mb-3">
              06 &nbsp; SERIES A CAPITALIZATION
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-900">
              Raising <span className="font-sans font-normal">$32M</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              To complete medical device clinical validation, scale ISO 13485
              manufacturing in Nepal, and establish clinical distribution networks
              across rehabilitation centers globally.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Use of funds */}
          <Reveal variant="left">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm h-full">
              <h3 className="text-xl font-light mb-6 text-slate-900">
                Use of <span className="font-sans">Funds</span>
              </h3>
              <div className="space-y-5">
                {useOfFunds.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-700">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.amount}</p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-1000"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">{item.pct}%</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Revenue projection chart */}
          <Reveal variant="right" delay={150}>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm h-full">
              <h3 className="text-xl font-light mb-1 text-slate-900">
                5-Year <span className="font-sans">Revenue Projection</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mb-6">Pratikshya Health bionic units &amp; recurring clinical services</p>
              <div className="space-y-4">
                {revenueYears.map((yr) => {
                  const widthPct = (yr.revenue / maxRevenue) * 100;

                  return (
                    <div key={yr.year}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-700 font-mono font-medium">{yr.year}</p>
                          <span className="text-[10px] text-slate-400 font-mono">({yr.note})</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-900">
                          {yr.revenue === 0 ? 'Clinical Trials' : `$${yr.revenue.toFixed(1)}M`}
                        </p>
                      </div>
                      <div className="h-5 rounded-lg bg-slate-100 overflow-hidden flex">
                        {yr.revenue > 0 && (
                          <div
                            className="h-full bg-blue-600 rounded-lg transition-all duration-1000"
                            style={{ width: `${Math.max(widthPct, 6)}%` }}
                            title={`${yr.year}: $${yr.revenue}M (${yr.units} units)`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span className="text-xs text-slate-600 font-medium">Bionic Units &amp; Clinical Subscriptions</span>
                </div>
                <div className="ml-auto text-xs text-slate-500 font-mono font-medium">
                  Breakeven: Year 3 Q4
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Key highlights */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '$22K', label: 'Target system price', sub: 'Pratikshya One (vs. $40K–$120K alternatives)' },
              { num: '<50ms', label: 'Neural EMG latency', sub: 'Sub-second real-time gesture execution' },
              { num: '60%', label: 'Gross margin at scale', sub: 'Projected Year 4+ clinical manufacturing' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-3xl font-light text-slate-900 font-sans mb-2">{item.num}</p>
                  <p className="text-sm font-semibold text-slate-800 mb-1">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
