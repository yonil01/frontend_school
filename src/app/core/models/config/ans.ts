export interface  Ans{
  id: string,
  name: string,
  ans_type_id: number,
  workflow_id: string,
  id_user?: string,
  created_at?: string,
  updated_at?: string,
  reminders?: Reminder[]
}

export interface Reminder {
  id: string
  ans_id: string
  name: string
  reminder_type: number
  percent_reminder: number
  notification_id: string
  queue_id?: string
  id_user?: string
}
