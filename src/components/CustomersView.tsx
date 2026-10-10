import { Customer, Visit } from '@/lib/supabase';
import { formatDate } from '@/lib/constants';
import { Mail, Phone, User, CalendarDays, Car, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/States';

interface CustomersViewProps {
  customers: Customer[];
  visits: Visit[];
}

export default function CustomersView({ customers, visits }: CustomersViewProps) {
  if (customers.length === 0) {
    return <EmptyState title="No customers yet" message="Customers will appear here once they are added to the system." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer) => {
        const customerVisits = visits.filter((v) => v.customer_id === customer.id);
        return (
          <div key={customer.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold shrink-0">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-800 truncate">{customer.name}</h3>
                <p className="text-xs text-slate-400">Added {formatDate(customer.created_at)}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">{customerVisits.length} {customerVisits.length === 1 ? 'Visit' : 'Visits'}</p>
              {customerVisits.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {customerVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(visit.visit_date)}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-medium">{visit.service_type}</span>
                      {visit.vehicle_models && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3" /> {visit.vehicle_models.name}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No visits recorded</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
