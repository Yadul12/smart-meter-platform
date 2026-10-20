export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string;
  roles: string[];
}

export interface Meter {
  id: number;
  meter_id: string;
  serial_number: string;
  status: string;
  phase: string;
  topology: string;
  accuracy_class: string;
  voltage?: number;
  current?: number;
  active_power?: number;
  power_factor?: number;
  import_energy?: number;
  latitude?: number;
  longitude?: number;
  consumer_name?: string;
  consumer_id?: number;
}

export interface DCU {
  id: number;
  dcu_id: string;
  name: string;
  status: string;
  wan_protocol?: string;
  nan_protocol?: string;
  total_connected_meters: number;
  online_meters: number;
  offline_meters: number;
  stored_messages: number;
  buffer_size: number;
  latitude?: number;
  longitude?: number;
  last_heartbeat?: string;
}
