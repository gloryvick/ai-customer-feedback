import { useCallback, useEffect, useState } from 'react';
import { supabase, Feedback, Alert, Task, Customer, Visit, VehicleModel, Dealership, Location, feedbackWithRelations } from '@/lib/supabase';

export interface DashboardData {
  feedback: Feedback[];
  alerts: Alert[];
  tasks: Task[];
  customers: Customer[];
  visits: Visit[];
  vehicleModels: VehicleModel[];
  dealerships: Dealership[];
  locations: Location[];
}

type LoadState = 'loading' | 'error' | 'ready';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    feedback: [],
    alerts: [],
    tasks: [],
    customers: [],
    visits: [],
    vehicleModels: [],
    dealerships: [],
    locations: [],
  });
  const [state, setState] = useState<LoadState>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const load = useCallback(async () => {
    setState('loading');
    setErrorMsg('');

    try {
      const [feedbackRes, alertsRes, tasksRes, customersRes, visitsRes, modelsRes, dealershipsRes, locationsRes] = await Promise.all([
        supabase.from('feedback').select(`*, ${feedbackWithRelations}`).order('created_at', { ascending: false }),
        supabase.from('alerts').select('*, feedback!alerts_feedback_id_fkey(id,title,severity,sentiment,rating,is_escalated,status,created_at,vehicle_models(name,year),dealerships(name,city))').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*, feedback!tasks_feedback_id_fkey(id,title,severity,status)').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('visits').select('*, customers(id,name,email,phone), locations(id,name,address,city,region), vehicle_models(id,name,year,category)').order('visit_date', { ascending: false }),
        supabase.from('vehicle_models').select('*').order('name'),
        supabase.from('dealerships').select('*').order('name'),
        supabase.from('locations').select('*').order('name'),
      ]);

      const errors = [feedbackRes.error, alertsRes.error, tasksRes.error, customersRes.error, visitsRes.error, modelsRes.error, dealershipsRes.error, locationsRes.error].filter(Boolean);
      if (errors.length > 0) {
        throw new Error(errors[0]?.message ?? 'Failed to load dashboard data');
      }

      setData({
        feedback: (feedbackRes.data as Feedback[]) ?? [],
        alerts: (alertsRes.data as Alert[]) ?? [],
        tasks: (tasksRes.data as Task[]) ?? [],
        customers: (customersRes.data as Customer[]) ?? [],
        visits: (visitsRes.data as Visit[]) ?? [],
        vehicleModels: (modelsRes.data as VehicleModel[]) ?? [],
        dealerships: (dealershipsRes.data as Dealership[]) ?? [],
        locations: (locationsRes.data as Location[]) ?? [],
      });
      setState('ready');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error occurred');
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, state, errorMsg, reload: load };
}
