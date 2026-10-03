import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t-2 border-civic-black bg-civic-black text-civic-white mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 label-editorial">DELHI CIVIC</h3>
            <p className="text-sm text-civic-white/80 leading-relaxed">
              A public civic platform for Delhi residents to report problems and track their resolution.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">REPORT</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/report" className="hover:text-civic-accent transition-colors">New Complaint</Link></li>
              <li><Link href="/complaints" className="hover:text-civic-accent transition-colors">Track Complaint</Link></li>
              <li><Link href="/map" className="hover:text-civic-accent transition-colors">Map View</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">EXPLORE</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/area" className="hover:text-civic-accent transition-colors">Your Area</Link></li>
              <li><Link href="/complaints?status=RESOLVED" className="hover:text-civic-accent transition-colors">Resolved Issues</Link></li>
              <li><Link href="/complaints?status=IN_PROGRESS" className="hover:text-civic-accent transition-colors">Active Cases</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-sm mb-4 label-editorial">PROTOTYPE</h4>
            <p className="text-xs text-civic-white/60 leading-relaxed mb-3">
              This is a demonstration portal. Not officially connected to Delhi Government departments.
            </p>
            <Link href="/admin" className="text-xs font-bold text-civic-accent hover:underline">
              ADMIN LOGIN →
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-civic-white/20">
          <p className="text-xs text-civic-white/60 text-center font-mono">
            DELHI CIVIC © 2026 // PROTOTYPE DEMONSTRATION // NOT AN OFFICIAL GOVERNMENT PORTAL
          </p>
        </div>
      </div>
    </footer>
  );
}
