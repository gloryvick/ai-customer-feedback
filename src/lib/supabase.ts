import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Sentiment = 'positive' | 'neutral' | 'negative';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'new' | 'reviewing' | 'resolved' | 'escalated';
export type AlertType = 'Escalation' | 'Critical' | 'SLA_Breach' | 'Negative_Trend';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'open' | 'in_progress' | 'completed';
export type ServiceType = 'Purchase' | 'Maintenance' | 'Repair' | 'Test Drive' | 'Warranty';
export type DraftTone = 'Professional' | 'Empathetic' | 'Apologetic' | 'Informational';

export interface VehicleModel {
  id: string;
  name: string;
  year: number;
  category: string;
}

export interface Dealership {
  id: string;
  name: string;
  city: string;
  region: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  region: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface Visit {
  id: string;
  customer_id: string;
  location_id: string;
  vehicle_model_id: string;
  visit_date: string;
  service_type: string;
  notes: string | null;
  created_at: string;
  customers?: Customer;
  locations?: Location;
  vehicle_models?: VehicleModel;
}

export interface AIAnalysis {
  id: string;
  feedback_id: string;
  sentiment: Sentiment;
  severity: Severity;
  summary: string;
  key_issues: string[];
  suggested_actions: string[];
  confidence: number;
  created_at: string;
}

export interface RoutingEvent {
  id: string;
  feedback_id: string;
  from_status: string | null;
  to_status: string;
  assigned_to: string | null;
  reason: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ResponseDraft {
  id: string;
  feedback_id: string;
  content: string;
  tone: DraftTone;
  is_sent: boolean;
  created_at: string;
}

export interface Alert {
  id: string;
  feedback_id: string;
  type: AlertType;
  message: string;
  is_active: boolean;
  created_at: string;
  feedback?: Feedback;
}

export interface Task {
  id: string;
  feedback_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  feedback?: Feedback;
}

export interface FeedbackToken {
  id: string;
  token: string;
  visit_id: string;
  customer_id: string | null;
  location_id: string | null;
  customer_name: string;
  customer_email: string;
  location_name: string;
  visit_date: string;
  service_type: string;
  email_sent: boolean;
  email_sent_at: string | null;
  feedback_received: boolean;
  feedback_received_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Feedback {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  vehicle_model_id: string | null;
  dealership_id: string | null;
  component: string;
  service_type: string | null;
  location_id: string | null;
  rating: number;
  title: string;
  body: string;
  sentiment: Sentiment;
  severity: Severity;
  status: FeedbackStatus;
  is_escalated: boolean;
  created_at: string;
  customer_id: string | null;
  visit_id: string | null;
  feedback_token_id: string | null;
  main_concern: string | null;
  would_recommend: string | null;
  contact_requested: boolean;
  preferred_contact_method: string | null;
  location_name: string | null;
  submitted_at: string | null;
  locations?: Location;
  vehicle_models?: VehicleModel;
  dealerships?: Dealership;
  customers?: Customer;
  visits?: Visit;
  ai_analysis?: AIAnalysis[];
  routing_events?: RoutingEvent[];
  response_drafts?: ResponseDraft[];
}

export const feedbackWithRelations =
  'vehicle_models(id,name,year,category),dealerships(id,name,city,region),customers(id,name,email,phone),visits(id,visit_date,service_type,notes,customers(id,name,email,phone),locations(id,name,city,region),vehicle_models(id,name,year,category)),locations(id,name,city,region),ai_analysis(id,sentiment,severity,summary,key_issues,suggested_actions,confidence,created_at),routing_events(id,from_status,to_status,assigned_to,reason,created_at),response_drafts(id,content,tone,is_sent,created_at)';
