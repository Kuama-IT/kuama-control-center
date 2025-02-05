/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Attachment {
  /** @example 1 */
  id?: number;
  /** @example "service-agreement.odt" */
  filename?: string;
  /** @example "451564" */
  filesize?: number;
  /** @example "application/vnd.oasis.opendocument.text" */
  content_type?: string;
  /** @format uri */
  content_url?: string;
  description?: string;
  /** @format uri */
  href_url?: string;
  /**
   * if attachment is a thumbnailable? (its image?)
   * @format uri
   */
  thumbnail_url?: string;
  /** User */
  author?: {
    id?: number;
    name?: any;
  };
  /** @format date-time */
  created_on?: string;
}

export interface AttachmentApiResponse {
  /** @example 1 */
  id?: number;
}

export interface UploadResponse {
  id?: number;
  token?: string;
}

export interface AttachRequest {
  /** @example "Issue" */
  entity_type: string;
  entity_id: number;
  /** Array of attachment tokens */
  attachments?: {
    token?: string;
  }[];
}

export interface CustomFieldApiRequest {
  /**
   * Name of custom field
   * @example "auta"
   */
  name: string;
  /**
   * Format
   * @example "list"
   */
  field_format?:
    | "string"
    | "text"
    | "link"
    | "int"
    | "float"
    | "date"
    | "list"
    | "bool"
    | "enumeration"
    | "user"
    | "version"
    | "attachment"
    | "easy_lookup"
    | "dependent_list"
    | "easy_computed_from_query"
    | "easy_percent"
    | "value_tree"
    | "easy_google_map_address"
    | "email"
    | "autoincrement"
    | "country_select"
    | "datetime"
    | "amount"
    | "easy_rating"
    | "easy_computed_token"
    | "flag";
  /** Regular expression */
  regexp?: string;
  /** Minimum length */
  min_length?: number;
  /** Maximum length */
  max_length?: number;
  /** Required */
  is_required?: boolean;
  /** For all projects */
  is_for_all?: boolean;
  /** Used as a filter */
  is_filter?: boolean;
  /**
   * Position of custom field in list
   * @example 2
   */
  position?: number;
  /** is searchable ? */
  searchable?: boolean;
  /** Default value */
  default_value?: string;
  /** Editable */
  editable?: boolean;
  /** Visible */
  visible?: boolean;
  /** Multiple values */
  multiple?: boolean;
  /** Description */
  description?: string;
  /** Primary */
  is_primary?: boolean;
  /** Show with empty fields */
  show_empty?: boolean;
  /** Show in list */
  show_on_list?: boolean;
  /** Its Hash object */
  settings?: string;
  internal_name?: string;
  /**
   * Show as additional attribute
   * @example "true"
   */
  show_on_more_form?: boolean;
  easy_external_id?: string;
  /** @format float */
  easy_min_value?: number;
  /** @format float */
  easy_max_value?: number;
  /**
   * Email notifications
   * @example "true"
   */
  mail_notification?: boolean;
  easy_group_id?: number;
  /** Clear when anonymize */
  clear_when_anonymize?: boolean;
  possible_values?: string[];
}

export interface CustomFieldApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Name of custom field
   * @example "auta"
   */
  name?: string;
  /**
   * Format
   * @example "list"
   */
  field_format?:
    | "string"
    | "text"
    | "link"
    | "int"
    | "float"
    | "date"
    | "list"
    | "bool"
    | "enumeration"
    | "user"
    | "version"
    | "attachment"
    | "easy_lookup"
    | "dependent_list"
    | "easy_computed_from_query"
    | "easy_percent"
    | "value_tree"
    | "easy_google_map_address"
    | "email"
    | "autoincrement"
    | "country_select"
    | "datetime"
    | "amount"
    | "easy_rating"
    | "easy_computed_token"
    | "flag";
  /** Regular expression */
  regexp?: string;
  /** Minimum length */
  min_length?: number;
  /** Maximum length */
  max_length?: number;
  /** Required */
  is_required?: boolean;
  /** For all projects */
  is_for_all?: boolean;
  /** Used as a filter */
  is_filter?: boolean;
  /**
   * Position of custom field in list
   * @example 2
   */
  position?: number;
  /** is searchable ? */
  searchable?: boolean;
  /** Default value */
  default_value?: string;
  /** Editable */
  editable?: boolean;
  /** Visible */
  visible?: boolean;
  /** Multiple values */
  multiple?: boolean;
  /** Description */
  description?: string;
  /** Primary */
  is_primary?: boolean;
  /** Show with empty fields */
  show_empty?: boolean;
  /** Show in list */
  show_on_list?: boolean;
  /** Its Hash object */
  settings?: string;
  internal_name?: string;
  /**
   * Show as additional attribute
   * @example "true"
   */
  show_on_more_form?: boolean;
  easy_external_id?: string;
  /** @format float */
  easy_min_value?: number;
  /** @format float */
  easy_max_value?: number;
  /**
   * Email notifications
   * @example "true"
   */
  mail_notification?: boolean;
  easy_group_id?: number;
  /** Clear when anonymize */
  clear_when_anonymize?: boolean;
  /**
   * Type
   * @example "IssueCustomField"
   */
  type?: string;
  possible_values?: {
    value?: string;
    label?: string;
  }[];
  /** @example "{"url_pattern"=>"", "edit_tag_style"=>""}" */
  format_store?: string;
  /** @example "" */
  easy_computed_token?: string;
  /** @example "false" */
  non_deletable?: boolean;
  /** @example "false" */
  non_editable?: boolean;
  /** @example "false" */
  disabled?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface CustomFieldValueApiRequest {
  /** @example 1 */
  id: number;
  /**
   * value is based on field_format - can be Array, Boolean, Date
   * @example "Iron Man"
   */
  value: string;
}

export interface CustomFieldValueApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "Hero list" */
  name?: string;
  /** @example "easy_hero_list" */
  internal_name?: string;
  field_format?:
    | "string"
    | "text"
    | "link"
    | "int"
    | "float"
    | "date"
    | "list"
    | "bool"
    | "enumeration"
    | "user"
    | "version"
    | "attachment"
    | "easy_lookup"
    | "dependent_list"
    | "easy_computed_from_query"
    | "easy_percent"
    | "value_tree"
    | "easy_google_map_address"
    | "email"
    | "autoincrement"
    | "country_select"
    | "datetime"
    | "amount"
    | "easy_rating"
    | "easy_computed_token"
    | "flag";
  /** value is based on field_format - can be Array, Boolean, Date */
  value?: string;
}

export interface DocumentApiRequest {
  /** @example "" */
  title: string;
  /** @example "" */
  description?: string;
  project_id: number;
  category_id: number;
  custom_fields?: CustomFieldValueApiRequest[];
}

export interface DocumentApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "" */
  title?: string;
  /** @example "" */
  description?: string;
  project?: {
    id?: number;
    name?: string;
  };
  category?: {
    id?: number;
    name?: string;
  };
  custom_fields?: CustomFieldValueApiResponse[];
  /** if you specify `include=attachments` */
  attachments?: Attachment[];
  /** @format date-time */
  created_on?: string;
}

/** DocumentsGroup */
export interface DocumentsGroupApiResponse {
  /** @example 1 */
  id?: number;
  name?: string;
  documents?: DocumentApiResponse[];
}

export interface EasyAttendanceApiRequest {
  user_id: number;
  /**
   * @format datetime
   * @example "2020-12-03T00:00:00Z"
   */
  arrival: string;
  /**
   * @format datetime
   * @example "2020-12-03T23:30:00Z"
   */
  departure?: string;
  edited_by_id?: number;
  /** @format datetime */
  edited_when?: string;
  locked?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /**
   * @format ipv4
   * @example "79.98.112.115"
   */
  arrival_user_ip?: string;
  time_entry_id?: number;
  /**
   * @format ipv4
   * @example "79.98.112.115"
   */
  departure_user_ip?: string;
  range?: "3" | "1" | "2";
  description?: string;
  approval_status?: "1" | "2" | "3" | "4" | "5" | "6";
  approved_by_id?: number;
  /** @format datetime */
  approved_at?: string;
  previous_approval_status?: boolean;
  /**
   * @format float
   * @example "50.04"
   */
  arrival_latitude?: number;
  /**
   * @format float
   * @example "14.98"
   */
  arrival_longitude?: number;
  /**
   * @format float
   * @example "50.04"
   */
  departure_latitude?: number;
  /**
   * @format float
   * @example "14.98"
   */
  departure_longitude?: number;
  time_zone?: string;
  /**
   * @format uuid
   * @example "1919385b-5040-46e7-93e5-addbab6b39fa"
   */
  easy_external_id?: string;
  need_approve?: boolean;
  limit_exceeded?: boolean;
  /**
   * @format float
   * @example "23.5"
   */
  hours?: number;
  easy_attendance_activity_id?: number;
}

export interface EasyAttendanceApiResponse {
  /** @example 1 */
  id?: number;
  user?: {
    id?: number;
    name?: string;
  };
  /**
   * @format datetime
   * @example "2020-12-03T00:00:00Z"
   */
  arrival?: string;
  /**
   * @format datetime
   * @example "2020-12-03T23:30:00Z"
   */
  departure?: string;
  edited_by?: {
    id?: number;
    name?: string;
  };
  /** @format datetime */
  edited_when?: string;
  locked?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /**
   * @format ipv4
   * @example "79.98.112.115"
   */
  arrival_user_ip?: string;
  time_entry?: {
    id?: number;
    name?: string;
  };
  /**
   * @format ipv4
   * @example "79.98.112.115"
   */
  departure_user_ip?: string;
  range?: "3" | "1" | "2";
  description?: string;
  approval_status?: "1" | "2" | "3" | "4" | "5" | "6";
  approved_by?: {
    id?: number;
    name?: string;
  };
  /** @format datetime */
  approved_at?: string;
  previous_approval_status?: boolean;
  /**
   * @format float
   * @example "50.04"
   */
  arrival_latitude?: number;
  /**
   * @format float
   * @example "14.98"
   */
  arrival_longitude?: number;
  /**
   * @format float
   * @example "50.04"
   */
  departure_latitude?: number;
  /**
   * @format float
   * @example "14.98"
   */
  departure_longitude?: number;
  time_zone?: string;
  /**
   * @format uuid
   * @example "1919385b-5040-46e7-93e5-addbab6b39fa"
   */
  easy_external_id?: string;
  need_approve?: boolean;
  limit_exceeded?: boolean;
  /**
   * @format float
   * @example "23.5"
   */
  hours?: number;
  easy_attendance_activity?: EasyAttendanceActivityApiResponse;
}

export interface EasyAttendanceActivityApiResponse {
  /** @example 1 */
  id?: number;
  name?: string;
  position?: number;
  at_work?: boolean;
  is_default?: boolean;
  internal_name?: string;
  non_deletable?: boolean;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  project_mapping?: boolean;
  mapped_project?: {
    id?: number;
    name?: string;
  };
  mapped_time_entry_activity?: {
    id?: number;
    name?: string;
  };
  /** @format datetime */
  mail?: string;
  color_schema?:
    | "scheme-0"
    | "scheme-1"
    | "scheme-2"
    | "scheme-3"
    | "scheme-4"
    | "scheme-5"
    | "scheme-6"
    | "scheme-7";
  approval_required?: boolean;
  use_specify_time?: boolean;
  system_activity?: boolean;
}

export interface EasyEntityActivityApiRequest {
  category_id: number;
  author_id?: number;
  is_finished?: boolean;
  all_day?: boolean;
  /** @format datetime */
  start_time?: string;
  /** @format datetime */
  end_time?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  description?: string;
  editable?: boolean;
  entity_id?: number;
  entity_type: string;
}

export interface EasyEntityActivityApiResponse {
  /** @example 1 */
  id?: number;
  category?: {
    id?: number;
    name?: string;
  };
  author?: {
    id?: number;
    name?: string;
  };
  is_finished?: boolean;
  all_day?: boolean;
  /** @format datetime */
  start_time?: string;
  /** @format datetime */
  end_time?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  description?: string;
  editable?: boolean;
  entity?: {
    id?: number;
    type?: string;
    name?: string;
  };
  users_attendees?: {
    id?: number;
    name?: string;
  }[];
}

/**
 * EasyGanttResourcesAdvanceHoursLimit
 * @format float
 */
export interface EasyGanttResourcesAdvanceHoursLimit {
  /** @example 1 */
  id?: number;
}

export interface EasyHelpdeskProjectApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Related project
   * @example 172
   */
  project_id?: number;
  /**
   * Related time tracker
   * @example 15
   */
  tracker_id?: number;
  /**
   * User whom project is assigned to
   * @example 382
   */
  assigned_to_id?: number;
  /**
   * Monthly hours
   * @format float
   * @example 6.2
   */
  monthly_hours?: number;
  /** Flag to enable due date monitoring */
  monitor_due_date?: boolean;
  /** Flag to enable spent time monitoring */
  monitor_spent_time?: boolean;
  /**
   * Related mailbox
   * @example 2
   */
  default_for_mailbox_id?: number;
  /**
   * Ids of users who are members of the project
   * @example ["5","12","37"]
   */
  watchers_ids?: string[];
  /**
   * Email header
   * @example "Dear Mr./Mrs."
   */
  email_header?: string;
  /**
   * Email footer
   * @example "Kind Regards"
   */
  email_footer?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** Flag to enable aggregated hours */
  aggregated_hours?: boolean;
  /**
   * Remaining aggregated hours calculation
   * @format float
   * @example 1.2
   */
  aggregated_hours_remaining?: number;
  /**
   * Aggregated hours period
   * @example "quarterly"
   */
  aggregated_hours_period?: string;
  /**
   * Date aggregated hours to be calculated from
   * @format date
   * @example "2014-01-01"
   */
  aggregated_hours_start_date?: string;
  /**
   * Date aggregated hours were last reset at
   * @format date
   * @example "2014-07-01"
   */
  aggregated_hours_last_reset?: string;
  /**
   * Date aggregated hours were last updated at
   * @format date
   * @example "2014-07-06"
   */
  aggregated_hours_last_update?: string;
  /**
   * Keyword in project
   * @example "urgent"
   */
  keyword?: string;
  /**
   * Ids of user groups who are members of the project
   * @example ["35","41"]
   */
  watcher_groups_ids?: string[];
  /** Flag to enable automatic issue close rules */
  automatically_issue_closer_enable?: boolean;
  /**
   * List of automatic issue close rules for the project
   * @example [1,6,"7.3",5,6,"2.0"]
   */
  issue_closers?: any[];
}

export interface EasyMeetingApiRequest {
  /**
   * Name
   * @example "weekly status update"
   */
  name?: string;
  description?: string;
  /** All day */
  all_day?: boolean;
  /**
   * Start
   * @format date-time
   * @example "2020-10-27 09:00:00 UTC"
   */
  start_time?: string;
  /**
   * End
   * @format date-time
   * @example "2020-10-27 11:00:00 UTC"
   */
  end_time?: string;
  /** E-mail addresses */
  mails?: any[];
  project_id?: number;
  easy_room_id?: number;
  /** Repeating */
  easy_is_repeating?: boolean;
  /**
   * Next repetition
   * @format date
   */
  easy_next_start?: string;
  /** Place */
  place_name?: string;
  /**
   * @format uuid
   * @example "1919385b-5040-46e7-93e5-addbab6b39fa"
   */
  uid?: string;
  /**
   * Priority
   * @example "normal"
   */
  priority?: "high" | "normal" | "low";
  /**
   * Privacy
   * @example "xpublic"
   */
  privacy?: "xpublic" | "xprivate" | "confidential";
  /** Big recurring */
  big_recurring?: boolean;
  easy_resource_dont_allocate?: boolean;
  /** @example "right_now" */
  email_notifications?: number;
  /** Repeating options */
  easy_repeat_settings?: {
    simple_period?: any;
    /** @format date */
    end_date?: any;
    endtype_count_x?: number;
    /** @format date */
    start_timepoint?: any;
    /** How many times it was repeated */
    repeated?: number;
    week_days?: string[];
    period?: "daily" | "weekly" | "monthly" | "yearly";
    /** Is `none` or number */
    create_now?: any;
    endtype?: "date" | "count" | "endless" | "project_end";
    daily_option?: "each" | "work";
    daily_each_x?: number;
    monthly_option?: "xth";
    monthly_day?: number;
    monthly_custom_order?: number;
    monthly_custom_day?: number;
    monthly_period?: number;
    yearly_option?: "date";
    yearly_month?: number;
    yearly_day?: number;
    yearly_custom_order?: number;
    yearly_custom_day?: number;
    yearly_custom_month?: number;
    yearly_period?: number;
    /**
     * Should be in format %H:%M
     * @example "04:00"
     */
    repeat_hour?: any;
    create_now_count?: number;
  };
}

export interface EasyMeetingApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Name
   * @example "weekly status update"
   */
  name?: string;
  description?: string;
  /** All day */
  all_day?: boolean;
  /**
   * Start
   * @format date-time
   * @example "2020-10-27 09:00:00 UTC"
   */
  start_time?: string;
  /**
   * End
   * @format date-time
   * @example "2020-10-27 11:00:00 UTC"
   */
  end_time?: string;
  /** E-mail addresses */
  mails?: any[];
  project?: {
    id?: number;
    name?: string;
  };
  easy_room?: {
    id?: number;
    name?: string;
  };
  /** Repeating */
  easy_is_repeating?: boolean;
  /**
   * Next repetition
   * @format date
   */
  easy_next_start?: string;
  /** Place */
  place_name?: string;
  /**
   * @format uuid
   * @example "1919385b-5040-46e7-93e5-addbab6b39fa"
   */
  uid?: string;
  /**
   * Priority
   * @example "normal"
   */
  priority?: "high" | "normal" | "low";
  /**
   * Privacy
   * @example "xpublic"
   */
  privacy?: "xpublic" | "xprivate" | "confidential";
  /** Big recurring */
  big_recurring?: boolean;
  easy_resource_dont_allocate?: boolean;
  /** @example "right_now" */
  email_notifications?: number;
  author?: {
    id?: number;
    name?: string;
  };
  user_ids?: number[];
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

/** Response only for feed, which is something like list of meetings of User.current */
export interface EasyCalendarMeeting {
  /**
   * id prefix include __model_name__
   * @example "easy_meeting-296864"
   */
  id?: string;
  /** @example "meeting_invitation" */
  eventType?: string;
  /**
   * **RELATIVE** path to this meeting
   * @example "/easy_meetings/296864"
   */
  url?: string;
  /**
   * **RELATIVE** path to parent meeting (if this is repeated)
   * @example "/easy_meetings/296719"
   */
  parentUrl?: string;
  /**
   * room name or just location of meeting
   * @example "Jednačka 2.p"
   */
  location?: string;
  /**
   * name of meeting
   * @example "DevOps"
   */
  title?: string;
  /**
   * @format date-time
   * @example "2020-04-29T09:00:00+02:00"
   */
  start?: string;
  /**
   * @format date-time
   * @example "2020-04-29T11:00:00+02:00"
   */
  end?: string;
  /** is this `all day` meeting ? */
  allDay?: boolean;
  /**
   * internal use - color of meeting in `easy_calendar`
   * @example "#daddf6"
   */
  color?: string;
  /**
   * ???
   * @example "#c3d0e5"
   */
  borderColor?: string;
  /** is meeting editable? */
  editable?: boolean;
  /** is meeting accepted? */
  accepted?: boolean;
  /** is meeting declined? */
  declined?: boolean;
  /** Meeting is recurrent - this is repeated meeting of `parent` */
  bigRecurringChildren?: boolean;
}

export interface EasySetting {
  /**
   * @format int64
   * @example 1
   */
  id: number;
  /** @example "secret_service_api_key" */
  name: string;
  /** @example "2b55fb3f0be9ff5b895f" */
  value?: string;
  project_id?: number;
}

export interface EasySlaEventApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Event name
   * @example "weekly status update"
   */
  name?: string;
  /**
   * Time of event occurrence
   * @format date-time
   * @example "2020-10-27 09:00:00 UTC"
   */
  occurence_time?: string;
  /**
   * Related issue
   * @example 14
   */
  issue_id?: number;
  /**
   * User who triggered event
   * @example 382
   */
  user_id?: number;
  /**
   * Issue response time
   * @format date-time
   * @example "2020-10-27 09:02:36 UTC"
   */
  sla_response?: string;
  /**
   * Issue estimated resolve time
   * @format date-time
   * @example "2020-10-28 15:23:06 UTC"
   */
  sla_resolve?: string;
  /**
   * Delta of issue creation time and event creation time
   * @example 6.2
   */
  first_response?: number;
  /**
   * Time it took for issue to get a response
   * @example 6.2
   */
  sla_response_fulfilment?: number;
  /**
   * Time it took for issue to be resolved
   * @example 6.2
   */
  sla_resolve_fulfilment?: number;
  /**
   * Related project
   * @example 172
   */
  project_id?: number;
  /**
   * Related issue status at time of event creation
   * @example 12
   */
  issue_status_id?: number;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface EasyToDoListApiRequest {
  /**
   * Name
   * @example "todo"
   */
  name: string;
  /** @example "1" */
  position: number;
}

export interface EasyToDoListApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Name
   * @example "todo"
   */
  name?: string;
  /** @example "1" */
  position?: number;
  easy_to_do_list_items?: EasyToDoListItemApiResponse[];
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface EasyToDoListItemApiRequest {
  /**
   * Name
   * @example "weekly status update"
   */
  name: string;
  /** @example "1" */
  position: number;
  is_done: boolean;
  easy_to_do_list_id: number;
  /** @example "1" */
  entity_id?: number;
  /** @example "Issue" */
  entity_type?: string;
}

export interface EasyToDoListItemApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Name
   * @example "weekly status update"
   */
  name?: string;
  /** @example "1" */
  position?: number;
  is_done?: boolean;
  easy_to_do_list?: {
    id?: number;
    name?: string;
  };
  /** @example "1" */
  entity_id?: number;
  /** @example "Issue" */
  entity_type?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface EasyVersionCategoryApiRequest {
  /** @example "" */
  name?: string;
}

export interface EasyVersionCategoryApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "" */
  name?: string;
}

export interface ErrorModel {
  /** @example "login" */
  attribute: string;
  messages: string[];
}

export interface GroupApiRequest {
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "support" */
  name: string;
  /** used for special operations, not human user */
  easy_system_flag?: boolean;
  custom_fields?: CustomFieldValueApiRequest[];
  /** Array of User IDs which belongs to this group */
  user_ids?: number[];
}

export interface GroupApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "support" */
  name?: string;
  /** used for special operations, not human user */
  easy_system_flag?: boolean;
  custom_fields?: CustomFieldValueApiResponse[];
  /** false if the group can be given to a user */
  builtin?: boolean;
  /** @format date-time */
  created_on?: string;
  /** if you specify `include=users` */
  users?: {
    id?: number;
    name?: string;
  }[];
  /** if you specify `include=memberships` */
  memberships?: {
    id?: number;
    project?: {
      id?: number;
      name?: string;
    };
    roles?: {
      id?: number;
      name?: string;
      /** only if inherited_from.present? */
      inherited?: boolean;
    }[];
  }[];
}

export interface IssueApiRequest {
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "Blue 2" */
  subject: string;
  /** @example "I can’t abide these Jawas. Disgusting creatures." */
  description?: string;
  estimated_hours?: string;
  /** step=10 */
  done_ratio?: number;
  project_id: number;
  tracker_id: number;
  status_id: number;
  priority_id: number;
  activity_id?: number;
  category_id?: number;
  fixed_version_id?: number;
  parent_id?: number;
  author_id: number;
  is_private?: boolean;
  is_favorited?: boolean;
  easy_email_to?: string;
  easy_email_cc?: string;
  /** @format date */
  start_date?: string;
  /** @format date */
  due_date?: string;
  custom_fields?: CustomFieldValueApiRequest[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
}

export interface IssueApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "Blue 2" */
  subject?: string;
  /** @example "I can’t abide these Jawas. Disgusting creatures." */
  description?: string;
  estimated_hours?: string;
  /** step=10 */
  done_ratio?: number;
  project?: {
    id?: number;
    name?: string;
  };
  tracker?: {
    id?: number;
    name?: string;
  };
  status?: {
    id?: number;
    name?: string;
  };
  priority?: {
    id?: number;
    name?: string;
  };
  activity?: {
    id?: number;
    name?: string;
  };
  category?: {
    id?: number;
    name?: string;
  };
  fixed_version?: {
    id?: number;
    name?: string;
  };
  parent?: {
    id?: number;
    name?: string;
  };
  author?: {
    id?: number;
    name?: string;
  };
  is_private?: boolean;
  is_favorited?: boolean;
  easy_email_to?: string;
  easy_email_cc?: string;
  /** @format date */
  start_date?: string;
  /** @format date */
  due_date?: string;
  custom_fields?: CustomFieldValueApiResponse[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /** @example "issue tracker-7 status-13 priority-18 priority-highest" */
  css_classes?: string;
  total_estimated_hours?: string;
  /** @format date-time */
  created_on?: string;
  /** @format date-time */
  updated_on?: string;
  /** @format date-time */
  closed_on?: string;
  /** if you specify `include=attachments` */
  attachments?: Attachment[];
  /** if you specify `include=relations` */
  relations?: {
    /** @example "1" */
    id?: number;
    /** @example "3" */
    issue_id?: number;
    /** @example "5" */
    issue_to_id?: number;
    /** @example "precedes" */
    relation_type?:
      | "relates"
      | "duplicates"
      | "duplicated"
      | "blocks"
      | "blocked"
      | "precedes"
      | "follows"
      | "copied_to"
      | "copied_from"
      | "start_to_start"
      | "finish_to_finish"
      | "start_to_finish";
    /**
     * value in days
     * @example "5"
     */
    delay?: number;
  }[];
  /** if you specify `include=changesets` */
  changesets?: {
    user?: {
      id?: number;
      name?: any;
    };
    comments?: string;
    /** @format date-time */
    committed_on?: string;
  }[];
  /** if you specify `include=journals` */
  journals?: JournalApiResponse[];
  /** if you specify `include=watchers` */
  watchers?: {
    user?: {
      id?: number;
      name?: any;
    };
  }[];
}

/** Journal */
export interface JournalApiResponse {
  id?: number;
  user?: {
    id?: number;
    name?: any;
  };
  notes?: string;
  /** @format date-time */
  created_on?: string;
  private_notes?: boolean;
  details?: {
    property?: string;
    name?: string;
    old_value?: string;
    new_value?: string;
  }[];
}

export interface MembershipApiRequest {
  /** IDs of several users for batch creation. Ignored in PUT requests. */
  user_ids: number[];
  /** IDs of roles */
  role_ids: number[];
}

export interface MembershipApiResponse {
  /** @example 1 */
  id?: number;
  project?: {
    id?: number;
    name?: string;
  };
  user?: {
    id?: number;
    name?: string;
  };
  group?: {
    id?: number;
    name?: string;
  };
  roles?: {
    id?: number;
    name?: string;
    inherited?: boolean;
  }[];
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface ProjectApiRequest {
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "Blue 2" */
  name: string;
  /** @example "blue-2" */
  homepage?: string;
  /** @example "I can’t abide these Jawas. Disgusting creatures." */
  description?: string;
  parent_id?: number;
  author_id: number;
  is_planned?: boolean;
  /** Is this project a template? */
  easy_is_easy_template?: boolean;
  /** @format date */
  easy_start_date?: string;
  /** @format date */
  easy_due_date?: string;
  custom_fields?: CustomFieldValueApiRequest[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /**
   * @minLength 3
   * @maxLength 3
   * @example "EUR"
   */
  easy_currency_code?: string;
  easy_priority_id?: {
    id?: number;
    name?: any;
  };
}

export interface ProjectApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "Blue 2" */
  name?: string;
  /** @example "blue-2" */
  homepage?: string;
  /** @example "I can’t abide these Jawas. Disgusting creatures." */
  description?: string;
  parent?: {
    id?: number;
    name?: string;
  };
  author?: {
    id?: number;
    name?: string;
  };
  is_planned?: boolean;
  /** Is this project a template? */
  easy_is_easy_template?: boolean;
  /** @format date */
  easy_start_date?: string;
  /** @format date */
  easy_due_date?: string;
  custom_fields?: CustomFieldValueApiResponse[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /**
   * 1 = ACTIVE
   *
   * 5 = CLOSED
   *
   * 9 = ARCHIVED
   *
   * 15 = PLANNED
   *
   * 19 = DELETED
   * @example "1"
   */
  status?: "1" | "5" | "9" | "15" | "19";
  /** @example "blue2" */
  identifier?: string;
  sum_time_entries?: number;
  sum_estimated_hours?: number;
  currency?: string;
  /** @format date-time */
  created_on?: string;
  /** @format date-time */
  updated_on?: string;
  /** @format date */
  start_date?: string;
  /** @format date */
  due_date?: string;
  /** if you specify `include=trackers` */
  trackers?: {
    /** @example "1" */
    id?: number;
    /** @example "bug" */
    name?: string;
    /** @example "easy_bug" */
    internal_name?: string;
    /** @example "easy_bug" */
    easy_external_id?: string;
  }[];
  /** if you specify `include=issue_categories` */
  issue_categories?: {
    id?: number;
    name?: string;
  }[];
  /** if you specify `include=time_entry_activities` */
  time_entry_activities?: {
    id?: number;
    name?: string;
  }[];
  /** if you specify `include=enabled_modules` */
  enabled_modules?: {
    id?: number;
    name?: string;
  }[];
  /** indicates if the project has been scheduled to be deleted */
  scheduled_for_destroy?: boolean;
  /**
   * the date when the project is expected to be deleted; is shown only if the project has been scheduled to be deleted
   * @format date-time
   */
  destroy_at?: string;
}

export interface ProjectDocumentApiRequest {
  /** @example "" */
  title: string;
  /** @example "" */
  description?: string;
  category_id: number;
  custom_fields?: CustomFieldValueApiRequest[];
}

export interface CreateProjectTemplateApiRequest {
  template: {
    assign_entity?: {
      /**
       * Entity class
       * @example "EasyContact"
       */
      type?: string;
      /**
       * Entity id
       * @example "6"
       */
      id?: string;
    };
    project?: {
      /**
       * Id of the source template
       * @example "188"
       */
      id: string;
      /**
       * Name of new project
       * @example "Help Desk"
       */
      name?: string;
      custom_fields?: CustomFieldValueApiRequest[];
    }[];
    /**
     * Parent project id
     * @example "15"
     */
    parent_id?: string;
    /**
     * Date to update target project with when "dates_settings"="update_dates"
     * @format date
     * @example "2021-02-02"
     */
    start_date?: string;
    /**
     * Project entities date settings
     * @example "update_dates"
     */
    dates_settings?:
      | "update_dates"
      | "match_starting_dates"
      | "do_not_change_any_dates";
    /**
     * Change author of all tasks to the given user id
     * @example "32"
     */
    change_issues_author?: string;
    /**
     * Inherit time entry activities
     * @example "1"
     */
    inherit_time_entry_activities?: string;
  };
  /**
   * Send e-mail notifications
   * @example "1"
   */
  notifications?: string;
}

export interface CopyProjectTemplateApiRequest {
  template: {
    /**
     * Target project id
     * @example "15"
     */
    target_root_project_id?: string;
    /**
     * Date to update target project with when "dates_settings"="update_dates"
     * @format date
     * @example "2021-02-02"
     */
    start_date?: string;
    /**
     * Project entities date settings
     * @example "update_settings"
     */
    dates_settings?: "update_dates" | "match_starting_dates";
    /**
     * Change author of all tasks to the given user id
     * @example "32"
     */
    change_issues_author?: string;
    /**
     * Inherit time entry activities
     * @example "1"
     */
    inherit_time_entry_activities?: string;
  };
}

export type RoleApiRequest = any;

export interface RoleApiResponse {
  /** @example 1 */
  id?: number;
  /**
   * Name
   * @example "Director (C-level) role"
   */
  name?: string;
  /** Tasks can be assigned to this role */
  assignable?: boolean;
  /** @example ["add_project","edit_own_projects"] */
  permissions?: string[];
  /**
   * Tasks visibility
   * @example "all"
   */
  issues_visibility?: "all" | "default" | "own";
  /**
   * Users visibility
   * @example "all"
   */
  users_visibility?: "all" | "members_of_visible_projects";
  /**
   * Spent time visibility
   * @example "all"
   */
  time_entries_visibility?: "all" | "own";
}

export interface TimeEntryApiRequest {
  project_id: number;
  issue_id?: number;
  user_id: number;
  priority_id?: number;
  activity_id?: number;
  easy_external_id?: string;
  /**
   * Amount of spent hours
   * @example "8"
   */
  hours: string;
  /**
   * Date of spent time. It can be limited by global setting
   * @format date
   * @example "2019-07-09"
   */
  spent_on: string;
  /** @example "I work very hard" */
  comments?: string;
  easy_is_billable?: boolean;
  easy_billed?: boolean;
  custom_fields?: CustomFieldValueApiRequest[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
}

export interface TimeEntryApiResponse {
  /** @example 1 */
  id?: number;
  project?: {
    id?: number;
    name?: string;
  };
  issue?: {
    id?: number;
    name?: string;
  };
  user?: {
    id?: number;
    name?: string;
  };
  priority?: {
    id?: number;
    name?: string;
  };
  activity?: {
    id?: number;
    name?: string;
  };
  easy_external_id?: string;
  /**
   * Amount of spent hours
   * @example "8"
   */
  hours?: string;
  /**
   * Date of spent time. It can be limited by global setting
   * @format date
   * @example "2019-07-09"
   */
  spent_on?: string;
  /** @example "I work very hard" */
  comments?: string;
  easy_is_billable?: boolean;
  easy_billed?: boolean;
  custom_fields?: CustomFieldValueApiResponse[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /** @format date-time */
  created_on?: string;
  /** @format date-time */
  updated_on?: string;
}

export interface UserApiRequest {
  /** @example "external-system-1" */
  easy_external_id?: string;
  /**
   * only for creation, can't be changed
   * @example "filip"
   */
  login?: string;
  /** @example "Filip" */
  firstname: string;
  /** @example "Moravek" */
  lastname: string;
  /**
   * @format email
   * @example "ceo@easy.cz"
   */
  mail: string;
  /** @example 1 */
  status?: 1 | 2 | 3;
  /** used for special operations, not human user */
  easy_system_flag?: boolean;
  /** Partial administrator */
  easy_lesser_admin?: boolean;
  language?: string;
  /** Is user Administrator? */
  admin?: boolean;
  easy_user_type_id?: number;
  supervisor_user_id?: number;
  custom_fields?: CustomFieldValueApiRequest[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /** @format password */
  password: string;
  /** @format password */
  password_confirmation: string;
  /** Assign user to given groups. Expect array of IDs */
  group_ids?: number[];
  /** ID of LDAP auth. source */
  auth_source_id?: number;
  /**
   * (available if the user is allowed to manage Easy Gantt Resource user attributes)
   * @format float
   * @example "1.0"
   */
  easy_gantt_resources_estimated_ratio?: number;
  /**
   * (available if the user is allowed to manage Easy Gantt Resource user attributes)
   * @format float
   * @example "1.0"
   */
  easy_gantt_resources_hours_limit?: number;
  /**
   * Should contain 7 values, one per each day of the week. (Available if the user is allowed to manage Easy Gantt Resource user attributes.)
   * @example [8,8,8,8,8,0,0]
   */
  easy_gantt_resources_advance_hours_limits?: EasyGanttResourcesAdvanceHoursLimit[];
}

export interface UserApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "external-system-1" */
  easy_external_id?: string;
  /** @example "admin" */
  login?: string;
  /** @example "Filip" */
  firstname?: string;
  /** @example "Moravek" */
  lastname?: string;
  /**
   * @format email
   * @example "ceo@easy.cz"
   */
  mail?: string;
  /** @example 1 */
  status?: 1 | 2 | 3;
  /** used for special operations, not human user */
  easy_system_flag?: boolean;
  /** Partial administrator */
  easy_lesser_admin?: boolean;
  language?: string;
  /** Is user Administrator? */
  admin?: boolean;
  easy_user_type?: {
    id?: number;
    name?: string;
  };
  supervisor_user?: {
    id?: number;
    name?: string;
  };
  custom_fields?: CustomFieldValueApiResponse[];
  /**
   * List of tags associated with entity
   * @example ["deployment","gantt","ldap"]
   */
  tag_list?: string[];
  /**
   * Time zone offset in seconds
   * @example 3600
   */
  utc_offset?: number;
  /** @format date-time */
  last_login_on?: string;
  /** @format uri */
  avatar_url?: string;
  working_time_calendar?: {
    id?: number;
    name?: string;
    /**
     * @format float
     * @example "8.0"
     */
    default_working_hours?: number;
    /**
     * Time when work start
     * @example "09:00"
     */
    time_from?: string;
    /**
     * Time when work end
     * @example "17:00"
     */
    time_to?: string;
  };
  /** if you specify `include=groups` */
  groups?: {
    id?: number;
    name?: string;
  }[];
  /** if you specify `include=memberships` */
  memberships?: {
    id?: number;
    project?: {
      id?: number;
      name?: string;
    };
    roles?: {
      id?: number;
      name?: string;
      /** only if inherited_from.present? */
      inherited?: boolean;
    }[];
  }[];
  /** @format date-time */
  created_on?: string;
  /** @format date-time */
  updated_on?: string;
  /**
   * (available if the user is allowed to manage Easy Gantt Resource user attributes)
   * @format float
   * @example "1.0"
   */
  easy_gantt_resources_estimated_ratio?: number;
  /**
   * (available if the user is allowed to manage Easy Gantt Resource user attributes)
   * @format float
   * @example "1.0"
   */
  easy_gantt_resources_hours_limit?: number;
  /**
   * Should contain 7 values, one per each day of the week. (Available if the user is allowed to manage Easy Gantt Resource user attributes.)
   * @example [8,8,8,8,8,0,0]
   */
  easy_gantt_resources_advance_hours_limits?: EasyGanttResourcesAdvanceHoursLimit[];
}

export interface VersionApiRequest {
  /** @example "Next step into the future" */
  name?: string;
  /** @example "" */
  description?: string;
  /** @format date */
  effective_date?: string;
  /** @format date */
  due_date?: string;
  /** @example "" */
  wiki_page_title?: string;
  /** @example "open" */
  status?: "open" | "locked" | "closed";
  /** @example "none" */
  sharing?: "none" | "descendants" | "hierarchy" | "tree" | "system";
  default_project_version?: boolean;
  /** @example "external-system-1" */
  easy_external_id?: string;
  project_id?: number;
  easy_version_category_id?: number;
  custom_fields?: CustomFieldValueApiRequest[];
}

export interface VersionApiResponse {
  /** @example 1 */
  id?: number;
  /** @example "Next step into the future" */
  name?: string;
  /** @example "" */
  description?: string;
  /** @format date */
  effective_date?: string;
  /** @format date */
  due_date?: string;
  /** @example "" */
  wiki_page_title?: string;
  /** @example "open" */
  status?: "open" | "locked" | "closed";
  /** @example "none" */
  sharing?: "none" | "descendants" | "hierarchy" | "tree" | "system";
  default_project_version?: boolean;
  /** @example "external-system-1" */
  easy_external_id?: string;
  project?: {
    id?: number;
    name?: string;
  };
  easy_version_category?: {
    id?: number;
    name?: string;
  };
  custom_fields?: CustomFieldValueApiResponse[];
  /** if you specify `include=journals` */
  journals?: JournalApiResponse[];
  /** @format date-time */
  created_on?: string;
  /** @format date-time */
  updated_on?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Easy Redmine API
 * @version 3.3.7
 * @license GPLv3
 * @contact Lukas Pokorny <support@easyredmine.com> (https://www.easyredmine.com)
 *
 * https://app.swaggerhub.com/apis/easysoftware/EasySwagger
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  attachments = {
    /**
     * No description
     *
     * @tags Attachment
     * @name GetAttachments
     * @summary Get Attachment
     * @request GET:/attachments/{id}.{format}
     * @secure
     */
    getAttachments: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          attachment?: AttachmentApiResponse;
        },
        void | ErrorModel
      >({
        path: `/attachments/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Attachment
     * @name DeleteAttachments
     * @summary Destroy Attachment
     * @request DELETE:/attachments/{id}.{format}
     * @secure
     */
    deleteAttachments: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/attachments/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  uploadsFormat = {
    /**
     * No description
     *
     * @tags Attachment
     * @name UploadsCreate
     * @summary Upload file to server
     * @request POST:/uploads.{format}
     * @secure
     */
    uploadsCreate: (
      format: "json" | "xml",
      data: File,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          upload?: UploadResponse;
        },
        void | ErrorModel
      >({
        path: `/uploads.${format}`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  attachFormat = {
    /**
     * No description
     *
     * @tags Attachment
     * @name AttachCreate
     * @summary Attach file to entity
     * @request POST:/attach.{format}
     * @secure
     */
    attachCreate: (
      format: "json" | "xml",
      data: {
        attach?: AttachRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/attach.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  customFieldsFormat = {
    /**
     * No description
     *
     * @tags Custom field
     * @name CustomFieldsCreate
     * @summary Create CustomField
     * @request POST:/custom_fields.{format}
     * @secure
     */
    customFieldsCreate: (
      format: "json" | "xml",
      data: {
        custom_field?: CustomFieldApiRequest;
      },
      query?: {
        /**
         * Name of custom field class
         * @example "IssueCustomField"
         */
        type?:
          | "ProjectCustomField"
          | "UserCustomField"
          | "GroupCustomField"
          | "IssueCustomField"
          | "TimeEntryCustomField"
          | "EasyProjectTemplateCustomField"
          | "EasyRiskCustomField"
          | "EasyDisabledCustomField";
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          custom_field?: CustomFieldApiResponse;
        },
        void | ErrorModel
      >({
        path: `/custom_fields.${format}`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Custom field
     * @name CustomFieldsDetail
     * @summary List of CustomFields
     * @request GET:/custom_fields.{format}
     * @secure
     */
    customFieldsDetail: (format: "json" | "xml", params: RequestParams = {}) =>
      this.request<
        {
          custom_fields?: CustomFieldApiResponse[];
        },
        void
      >({
        path: `/custom_fields.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  customFields = {
    /**
     * No description
     *
     * @tags Custom field
     * @name GetCustomFields
     * @summary Get CustomField
     * @request GET:/custom_fields/{id}.{format}
     * @secure
     */
    getCustomFields: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          custom_field?: CustomFieldApiResponse;
        },
        void | ErrorModel
      >({
        path: `/custom_fields/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Custom field
     * @name PutCustomFields
     * @summary Update CustomField
     * @request PUT:/custom_fields/{id}.{format}
     * @secure
     */
    putCustomFields: (
      format: "json" | "xml",
      id: number,
      data: {
        custom_field?: CustomFieldApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/custom_fields/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Custom field
     * @name DeleteCustomFields
     * @summary Destroy CustomField
     * @request DELETE:/custom_fields/{id}.{format}
     * @secure
     */
    deleteCustomFields: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/custom_fields/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  documents = {
    /**
     * No description
     *
     * @tags Document
     * @name GetDocuments
     * @summary Get Document
     * @request GET:/documents/{id}.{format}
     * @secure
     */
    getDocuments: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: DocumentApiResponse;
        },
        void | ErrorModel
      >({
        path: `/documents/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name PutDocuments
     * @summary Update Document
     * @request PUT:/documents/{id}.{format}
     * @secure
     */
    putDocuments: (
      format: "json" | "xml",
      id: number,
      data: {
        document?: DocumentApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: DocumentApiResponse;
        },
        void | ErrorModel
      >({
        path: `/documents/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document
     * @name DeleteDocuments
     * @summary Destroy Document
     * @request DELETE:/documents/{id}.{format}
     * @secure
     */
    deleteDocuments: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/documents/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  projects = {
    /**
     * No description
     *
     * @tags Document, Project documents
     * @name DocumentsDetail
     * @summary Retrieve documents of the Project with specified id
     * @request GET:/projects/{project_id}/documents.{format}
     * @secure
     */
    documentsDetail: (
      format: "json" | "xml",
      projectId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          groups?: DocumentsGroupApiResponse[];
        },
        void | ErrorModel
      >({
        path: `/projects/${projectId}/documents.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Document, Project documents
     * @name DocumentsCreate
     * @summary Create a document in the Project with specified id
     * @request POST:/projects/{project_id}/documents.{format}
     * @secure
     */
    documentsCreate: (
      format: "json" | "xml",
      projectId: number,
      data: {
        document?: ProjectDocumentApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          document?: DocumentApiResponse;
        },
        void | ErrorModel
      >({
        path: `/projects/${projectId}/documents.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project membership, Membership
     * @name MembershipsDetail
     * @summary Retrieve memberships of the Project with specified id
     * @request GET:/projects/{project_id}/memberships.{format}
     * @secure
     */
    membershipsDetail: (
      format: "json" | "xml",
      projectId: number,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          memberships?: MembershipApiResponse[];
        },
        void | ErrorModel
      >({
        path: `/projects/${projectId}/memberships.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project membership, Membership
     * @name MembershipsCreate
     * @summary Create a membership in a Project with specified id
     * @request POST:/projects/{project_id}/memberships.{format}
     * @secure
     */
    membershipsCreate: (
      format: "json" | "xml",
      projectId: number,
      data: {
        membership?: MembershipApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<MembershipApiResponse, void | ErrorModel>({
        path: `/projects/${projectId}/memberships.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name GetProjects
     * @summary Get Project
     * @request GET:/projects/{id}.{format}
     * @secure
     */
    getProjects: (
      id: number,
      format: "json" | "xml",
      query?: {
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **trackers** (List of enabled trackers on project)
         * * **issue_categories** (List of IssueCategories)
         * * **enabled_modules** (List of enabled project modules)
         */
        include?: ("trackers" | "issue_categories" | "enabled_modules")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          project?: ProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/projects/${id}.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name PutProjects
     * @summary Update Project
     * @request PUT:/projects/{id}.{format}
     * @secure
     */
    putProjects: (
      format: "json" | "xml",
      id: number,
      data: {
        project?: ProjectApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          project?: ProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/projects/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name DeleteProjects
     * @summary Destroy Project
     * @request DELETE:/projects/{id}.{format}
     * @secure
     */
    deleteProjects: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name CloseCreate
     * @summary Close Project
     * @request POST:/projects/{id}/close.{format}
     * @secure
     */
    closeCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/close.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name ReopenCreate
     * @summary Reopen Project
     * @request POST:/projects/{id}/reopen.{format}
     * @secure
     */
    reopenCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/reopen.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name ArchiveCreate
     * @summary Archive Project
     * @request POST:/projects/{id}/archive.{format}
     * @secure
     */
    archiveCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/archive.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name UnarchiveCreate
     * @summary Unarchive Project
     * @request POST:/projects/{id}/unarchive.{format}
     * @secure
     */
    unarchiveCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/unarchive.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name FavoriteCreate
     * @summary Add Project to favorites
     * @request POST:/projects/{id}/favorite.{format}
     * @secure
     */
    favoriteCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/favorite.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name UnfavoriteCreate
     * @summary Remove Project from favorites
     * @request POST:/projects/{id}/unfavorite.{format}
     * @secure
     */
    unfavoriteCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/projects/${id}/unfavorite.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Version
     * @name VersionsCreate
     * @summary Create Version
     * @request POST:/projects/{project_id}/versions.{format}
     * @secure
     */
    versionsCreate: (
      format: "json" | "xml",
      projectId: string,
      data: {
        version?: VersionApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          version?: VersionApiResponse;
        },
        void | ErrorModel
      >({
        path: `/projects/${projectId}/versions.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  easyAttendancesFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Easy attendance
     * @name EasyAttendancesDetail
     * @summary List of EasyAttendances
     * @request GET:/easy_attendances.{format}
     * @secure
     */
    easyAttendancesDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          easy_attendances?: EasyAttendanceApiResponse[];
        },
        void
      >({
        path: `/easy_attendances.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy attendance
     * @name EasyAttendancesCreate
     * @summary Create EasyAttendance
     * @request POST:/easy_attendances.{format}
     * @secure
     */
    easyAttendancesCreate: (
      format: "json" | "xml",
      data: {
        easy_attendance?: EasyAttendanceApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_attendance?: EasyAttendanceApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_attendances.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  easyAttendances = {
    /**
     * No description
     *
     * @tags Easy attendance
     * @name GetEasyAttendances
     * @summary Get EasyAttendance
     * @request GET:/easy_attendances/{id}.{format}
     * @secure
     */
    getEasyAttendances: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_attendance?: EasyAttendanceApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_attendances/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy attendance
     * @name PutEasyAttendances
     * @summary Update EasyAttendance
     * @request PUT:/easy_attendances/{id}.{format}
     * @secure
     */
    putEasyAttendances: (
      format: "json" | "xml",
      id: number,
      data: {
        easy_attendance?: EasyAttendanceApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_attendance?: EasyAttendanceApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_attendances/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy attendance
     * @name DeleteEasyAttendances
     * @summary Destroy EasyAttendance
     * @request DELETE:/easy_attendances/{id}.{format}
     * @secure
     */
    deleteEasyAttendances: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_attendances/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  documentsFormat = {
    /**
     * No description
     *
     * @tags Document
     * @name DocumentsDetail
     * @summary Retrieve documents
     * @request GET:/documents.{format}
     * @secure
     */
    documentsDetail: (format: "json" | "xml", params: RequestParams = {}) =>
      this.request<
        {
          documents?: DocumentApiResponse[];
        },
        void | ErrorModel
      >({
        path: `/documents.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  easyEntityActivitiesFormat = {
    /**
     * No description
     *
     * @tags Easy entity activity
     * @name EasyEntityActivitiesCreate
     * @summary Create EasyEntityActivity
     * @request POST:/easy_entity_activities.{format}
     * @secure
     */
    easyEntityActivitiesCreate: (
      format: "json" | "xml",
      data: {
        easy_entity_activity?: EasyEntityActivityApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_entity_activity?: EasyEntityActivityApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_entity_activities.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  easyEntityActivities = {
    /**
     * No description
     *
     * @tags Easy entity activity
     * @name GetEasyEntityActivities
     * @summary Get EasyEntityActivity
     * @request GET:/easy_entity_activities/{id}.{format}
     * @secure
     */
    getEasyEntityActivities: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_entity_activity?: EasyEntityActivityApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_entity_activities/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy entity activity
     * @name PutEasyEntityActivities
     * @summary Update EasyEntityActivity
     * @request PUT:/easy_entity_activities/{id}.{format}
     * @secure
     */
    putEasyEntityActivities: (
      format: "json" | "xml",
      id: number,
      data: {
        easy_entity_activity?: EasyEntityActivityApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_entity_activity?: EasyEntityActivityApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_entity_activities/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy entity activity
     * @name DeleteEasyEntityActivities
     * @summary Destroy EasyEntityActivity
     * @request DELETE:/easy_entity_activities/{id}.{format}
     * @secure
     */
    deleteEasyEntityActivities: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_entity_activities/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  easyHelpdeskProjects = {
    /**
     * No description
     *
     * @tags Easy helpdesk project
     * @name FindByEmailDetail
     * @summary Get the first helpdesk project by email parameters
     * @request GET:/easy_helpdesk_projects/find_by_email.{format}
     * @secure
     */
    findByEmailDetail: (
      format: "json" | "xml",
      query?: {
        /** Email subject */
        subject?: string;
        /** Email from */
        from?: string;
        /** Email to */
        to?: string;
        /** Mailbox username */
        mailbox_username?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_helpdesk_project?: EasyHelpdeskProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_helpdesk_projects/find_by_email.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  easyMeetingsFormat = {
    /**
     * No description
     *
     * @tags EasyCalendarMeeting
     * @name EasyMeetingsCreate
     * @summary Create EasyMeeting
     * @request POST:/easy_meetings.{format}
     * @secure
     */
    easyMeetingsCreate: (
      format: "json" | "xml",
      data: {
        easy_meeting?: EasyMeetingApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_meeting?: EasyMeetingApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_meetings.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  easyMeetings = {
    /**
     * No description
     *
     * @tags EasyCalendarMeeting
     * @name GetEasyMeetings
     * @summary Get EasyMeeting
     * @request GET:/easy_meetings/{id}.{format}
     * @secure
     */
    getEasyMeetings: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_meeting?: EasyMeetingApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_meetings/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags EasyCalendarMeeting
     * @name PutEasyMeetings
     * @summary Update EasyMeeting
     * @request PUT:/easy_meetings/{id}.{format}
     * @secure
     */
    putEasyMeetings: (
      format: "json" | "xml",
      id: number,
      data: {
        easy_meeting?: EasyMeetingApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_meeting?: EasyMeetingApiResponse;
        },
        void | ErrorModel
      >({
        path: `/easy_meetings/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags EasyCalendarMeeting
     * @name DeleteEasyMeetings
     * @summary Destroy EasyMeeting
     * @request DELETE:/easy_meetings/{id}.{format}
     * @secure
     */
    deleteEasyMeetings: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_meetings/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  easyCalendar = {
    /**
     * No description
     *
     * @tags EasyCalendarMeeting
     * @name FeedJsonList
     * @summary List of Easy Meetings
     * @request GET:/easy_calendar/feed.json
     * @secure
     */
    feedJsonList: (
      query: {
        /**
         * Can be string **today** or Time in %s format! Example for 2020-04-29 11:50:27 +02:00
         * @example "1588153643"
         */
        start: string;
        /**
         * Can be string **today** or Time in %s format! Example for 2020-04-29 11:50:27 +02:00
         * @example "1588153643"
         */
        end: string;
        /** list of types - Meetings, Attendance, etc.... by default its `easy_meeting_calendar` */
        enabled_calendars?: (
          | "version_calendar"
          | "easy_holiday_calendar"
          | "easy_meeting_calendar"
          | "easy_meeting_author_calendar"
          | "issue_calendar"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<EasyCalendarMeeting[], void>({
        path: `/easy_calendar/feed.json`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  admin = {
    /**
     * No description
     *
     * @tags Easy setting
     * @name EasySettingsCreate
     * @summary Create EasySetting
     * @request POST:/admin/easy_settings.{format}
     * @secure
     */
    easySettingsCreate: (
      format: "json" | "xml",
      data: {
        easy_setting?: EasySetting;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_setting?: EasySetting;
        },
        void | ErrorModel
      >({
        path: `/admin/easy_settings.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy setting
     * @name EasySettingsDetail
     * @summary Get EasySetting
     * @request GET:/admin/easy_settings/{id}.{format}
     * @secure
     */
    easySettingsDetail: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_setting?: EasySetting;
        },
        void | ErrorModel
      >({
        path: `/admin/easy_settings/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy setting
     * @name EasySettingsUpdate
     * @summary Update EasySetting
     * @request PUT:/admin/easy_settings/{id}.{format}
     * @secure
     */
    easySettingsUpdate: (
      format: "json" | "xml",
      id: number,
      data: {
        easy_setting?: EasySetting;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          easy_setting?: EasySetting;
        },
        void | ErrorModel
      >({
        path: `/admin/easy_settings/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Easy setting
     * @name EasySettingsDelete
     * @summary Destroy EasySetting
     * @request DELETE:/admin/easy_settings/{id}.{format}
     * @secure
     */
    easySettingsDelete: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/admin/easy_settings/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  easySlaEvents = {
    /**
     * No description
     *
     * @tags Easy sla event
     * @name DeleteEasySlaEvents
     * @summary Destroy EasySlaEvent
     * @request DELETE:/easy_sla_events/{id}.{format}
     * @secure
     */
    deleteEasySlaEvents: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_sla_events/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  groupsFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Group
     * @name GroupsDetail
     * @summary List of Groups
     * @request GET:/groups.{format}
     * @secure
     */
    groupsDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **users** (users which are in group)
         * * **memberships** (list of projects which is user in role)
         */
        include?: ("users" | "memberships")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          groups?: GroupApiResponse[];
        },
        void
      >({
        path: `/groups.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name GroupsCreate
     * @summary Create Group
     * @request POST:/groups.{format}
     * @secure
     */
    groupsCreate: (
      format: "json" | "xml",
      data: {
        group?: GroupApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          group?: GroupApiResponse;
        },
        void | ErrorModel
      >({
        path: `/groups.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  groups = {
    /**
     * No description
     *
     * @tags Group
     * @name GetGroups
     * @summary Get Group
     * @request GET:/groups/{id}.{format}
     * @secure
     */
    getGroups: (
      id: number,
      format: "json" | "xml",
      query?: {
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **users** (users which are in group)
         * * **memberships** (list of projects which is user in role)
         */
        include?: ("users" | "memberships")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          group?: GroupApiResponse;
        },
        void | ErrorModel
      >({
        path: `/groups/${id}.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name PutGroups
     * @summary Update Group
     * @request PUT:/groups/{id}.{format}
     * @secure
     */
    putGroups: (
      format: "json" | "xml",
      id: number,
      data: {
        group?: GroupApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          group?: GroupApiResponse;
        },
        void | ErrorModel
      >({
        path: `/groups/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name DeleteGroups
     * @summary Destroy Group
     * @request DELETE:/groups/{id}.{format}
     * @secure
     */
    deleteGroups: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/groups/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name UsersCreate
     * @summary Add User to Group
     * @request POST:/groups/{id}/users.{format}
     * @secure
     */
    usersCreate: (
      format: "json" | "xml",
      id: string,
      data: {
        user_ids?: number[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/groups/${id}/users.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Group
     * @name UsersDelete
     * @summary Remove User from Group
     * @request DELETE:/groups/{id}/users/{user_id}.{format}
     * @secure
     */
    usersDelete: (
      format: "json" | "xml",
      id: string,
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/groups/${id}/users/${userId}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  issuesFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Issue
     * @name IssuesDetail
     * @summary List of Issues
     * @request GET:/issues.{format}
     * @secure
     */
    issuesDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **attachments** ()
         * * **relations** ()
         * * **total_estimated_time** ()
         * * **spent_time** ()
         */
        include?: (
          | "attachments"
          | "relations"
          | "total_estimated_time"
          | "spent_time"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          issues?: IssueApiResponse[];
        },
        void
      >({
        path: `/issues.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Issue
     * @name IssuesCreate
     * @summary Create Issue
     * @request POST:/issues.{format}
     * @secure
     */
    issuesCreate: (
      format: "json" | "xml",
      data: {
        issue?: IssueApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          issue?: IssueApiResponse;
        },
        void | ErrorModel
      >({
        path: `/issues.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  issues = {
    /**
     * No description
     *
     * @tags Issue
     * @name GetIssues
     * @summary Get Issue
     * @request GET:/issues/{id}.{format}
     * @secure
     */
    getIssues: (
      id: number,
      format: "json" | "xml",
      query?: {
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **children** (list of issue children)
         * * **attachments** ()
         * * **relations** ()
         * * **changesets** ()
         * * **journals** ()
         * * **watchers** ()
         */
        include?: (
          | "children"
          | "attachments"
          | "relations"
          | "changesets"
          | "journals"
          | "watchers"
        )[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          issue?: IssueApiResponse;
        },
        void | ErrorModel
      >({
        path: `/issues/${id}.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Issue
     * @name PutIssues
     * @summary Update Issue
     * @request PUT:/issues/{id}.{format}
     * @secure
     */
    putIssues: (
      format: "json" | "xml",
      id: number,
      data: {
        issue?: IssueApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          issue?: IssueApiResponse;
        },
        void | ErrorModel
      >({
        path: `/issues/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Issue
     * @name DeleteIssues
     * @summary Destroy Issue
     * @request DELETE:/issues/{id}.{format}
     * @secure
     */
    deleteIssues: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/issues/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  easyIssues = {
    /**
     * No description
     *
     * @tags Issue
     * @name FavoriteCreate
     * @summary Add Issue to favorites
     * @request POST:/easy_issues/{id}/favorite.{format}
     * @secure
     */
    favoriteCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_issues/${id}/favorite.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Issue
     * @name UnfavoriteCreate
     * @summary Remove Issue from favorites
     * @request POST:/easy_issues/{id}/unfavorite.{format}
     * @secure
     */
    unfavoriteCreate: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/easy_issues/${id}/unfavorite.${format}`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  memberships = {
    /**
     * No description
     *
     * @tags Membership
     * @name GetMemberships
     * @summary Get Membership
     * @request GET:/memberships/{id}.{format}
     * @secure
     */
    getMemberships: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          membership?: MembershipApiResponse;
        },
        void | ErrorModel
      >({
        path: `/memberships/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Membership
     * @name PutMemberships
     * @summary Update Membership
     * @request PUT:/memberships/{id}.{format}
     * @secure
     */
    putMemberships: (
      format: "json" | "xml",
      id: number,
      data: {
        membership?: MembershipApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          membership?: MembershipApiResponse;
        },
        void | ErrorModel
      >({
        path: `/memberships/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Membership
     * @name DeleteMemberships
     * @summary Destroy Membership
     * @request DELETE:/memberships/{id}.{format}
     * @secure
     */
    deleteMemberships: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/memberships/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  projectsFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Project
     * @name ProjectsDetail
     * @summary List of Projects
     * @request GET:/projects.{format}
     * @secure
     */
    projectsDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **trackers** (List of enabled trackers on project)
         * * **issue_categories** (List of IssueCategories)
         * * **enabled_modules** (List of enabled project modules)
         */
        include?: ("trackers" | "issue_categories" | "enabled_modules")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          projects?: ProjectApiResponse[];
        },
        void
      >({
        path: `/projects.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project
     * @name ProjectsCreate
     * @summary Create Project
     * @request POST:/projects.{format}
     * @secure
     */
    projectsCreate: (
      format: "json" | "xml",
      data: {
        project?: ProjectApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          project?: ProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/projects.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  rolesFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Role
     * @name RolesDetail
     * @summary List of Roles
     * @request GET:/roles.{format}
     * @secure
     */
    rolesDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          roles?: RoleApiResponse[];
        },
        void
      >({
        path: `/roles.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  roles = {
    /**
     * No description
     *
     * @tags Role
     * @name GetRoles
     * @summary Get Role
     * @request GET:/roles/{id}.{format}
     * @secure
     */
    getRoles: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          role?: RoleApiResponse;
        },
        void | ErrorModel
      >({
        path: `/roles/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  templatesFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Project template
     * @name TemplatesDetail
     * @summary Get all ProjectTemplate
     * @request GET:/templates.{format}
     * @secure
     */
    templatesDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: string;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          projects?: ProjectApiResponse[];
        },
        void | ErrorModel
      >({
        path: `/templates.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  templates = {
    /**
     * No description
     *
     * @tags Project template
     * @name AddDetail
     * @summary Add ProjectTemplate
     * @request GET:/templates/{id}/add.{format}
     * @secure
     */
    addDetail: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/templates/${id}/add.${format}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project template
     * @name RestoreDetail
     * @summary Restore ProjectTemplate
     * @request GET:/templates/{id}/restore.{format}
     * @secure
     */
    restoreDetail: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/templates/${id}/restore.${format}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project template
     * @name CreateCreate
     * @summary Create project from template
     * @request POST:/templates/{id}/create.{format}
     * @secure
     */
    createCreate: (
      format: "json" | "xml",
      id: string,
      data?: CreateProjectTemplateApiRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          project?: ProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/templates/${id}/create.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project template
     * @name CopyCreate
     * @summary Copy template into existing project
     * @request POST:/templates/{id}/copy.{format}
     * @secure
     */
    copyCreate: (
      format: "json" | "xml",
      id: string,
      data: CopyProjectTemplateApiRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          project?: ProjectApiResponse;
        },
        void | ErrorModel
      >({
        path: `/templates/${id}/copy.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Project template
     * @name DestroyDelete
     * @summary Destroy ProjectTemplate
     * @request DELETE:/templates/{id}/destroy.{format}
     * @secure
     */
    destroyDelete: (
      format: "json" | "xml",
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/templates/${id}/destroy.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  timeEntriesFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Time entry
     * @name TimeEntriesDetail
     * @summary List of TimeEntries
     * @request GET:/time_entries.{format}
     * @secure
     */
    timeEntriesDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          time_entries?: TimeEntryApiResponse[];
        },
        void
      >({
        path: `/time_entries.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Time entry
     * @name TimeEntriesCreate
     * @summary Create TimeEntry
     * @request POST:/time_entries.{format}
     * @secure
     */
    timeEntriesCreate: (
      format: "json" | "xml",
      data: {
        time_entry?: TimeEntryApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          time_entry?: TimeEntryApiResponse;
        },
        void | ErrorModel
      >({
        path: `/time_entries.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  timeEntries = {
    /**
     * No description
     *
     * @tags Time entry
     * @name GetTimeEntries
     * @summary Get TimeEntry
     * @request GET:/time_entries/{id}.{format}
     * @secure
     */
    getTimeEntries: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          time_entry?: TimeEntryApiResponse;
        },
        void | ErrorModel
      >({
        path: `/time_entries/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Time entry
     * @name PutTimeEntries
     * @summary Update TimeEntry
     * @request PUT:/time_entries/{id}.{format}
     * @secure
     */
    putTimeEntries: (
      format: "json" | "xml",
      id: number,
      data: {
        time_entry?: TimeEntryApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          time_entry?: TimeEntryApiResponse;
        },
        void | ErrorModel
      >({
        path: `/time_entries/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Time entry
     * @name DeleteTimeEntries
     * @summary Destroy TimeEntry
     * @request DELETE:/time_entries/{id}.{format}
     * @secure
     */
    deleteTimeEntries: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/time_entries/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  usersFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags User
     * @name UsersDetail
     * @summary List of Users
     * @request GET:/users.{format}
     * @secure
     */
    usersDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **groups** (groups which user is in)
         * * **memberships** (list of projects which is user in role)
         */
        include?: ("groups" | "memberships")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          users?: UserApiResponse[];
        },
        void
      >({
        path: `/users.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UsersCreate
     * @summary Create User
     * @request POST:/users.{format}
     * @secure
     */
    usersCreate: (
      format: "json" | "xml",
      data: {
        user?: UserApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          user?: UserApiResponse;
        },
        void | ErrorModel
      >({
        path: `/users.${format}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags User
     * @name GetUsers
     * @summary Get User
     * @request GET:/users/{id}.{format}
     * @secure
     */
    getUsers: (
      id: number,
      format: "json" | "xml",
      query?: {
        /**
         * explicitly specify the associations you want to be included in the query result (separated by a comma)
         *
         * * **groups** (groups which user is in)
         * * **memberships** (list of projects which is user in role)
         */
        include?: ("groups" | "memberships")[];
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          user?: UserApiResponse;
        },
        void | ErrorModel
      >({
        path: `/users/${id}.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name PutUsers
     * @summary Update User
     * @request PUT:/users/{id}.{format}
     * @secure
     */
    putUsers: (
      format: "json" | "xml",
      id: number,
      data: {
        user?: UserApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          user?: UserApiResponse;
        },
        void | ErrorModel
      >({
        path: `/users/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name DeleteUsers
     * @summary Destroy User
     * @request DELETE:/users/{id}.{format}
     * @secure
     */
    deleteUsers: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/users/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  versionsFormat = {
    /**
     * @description For filtering send parameter `set_filter=1` and specify filters
     *
     * @tags Version
     * @name VersionsDetail
     * @summary List of Versions
     * @request GET:/versions.{format}
     * @secure
     */
    versionsDetail: (
      format: "json" | "xml",
      query?: {
        /** free-text filter of current entity */
        easy_query_q?: string;
        /** enable filter through Easy Query */
        set_filter?: boolean;
        /** the number of items to be present in the response (default is 25, maximum is 100) */
        limit?: number;
        /** the offset of the first object to retrieve */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example 75 */
          total_count?: number;
          /** @example 0 */
          offset?: number;
          /** @example 25 */
          limit?: number;
          versions?: VersionApiResponse[];
        },
        void
      >({
        path: `/versions.${format}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  versions = {
    /**
     * No description
     *
     * @tags Version
     * @name GetVersions
     * @summary Get Version
     * @request GET:/versions/{id}.{format}
     * @secure
     */
    getVersions: (
      id: number,
      format: "json" | "xml",
      params: RequestParams = {},
    ) =>
      this.request<
        {
          version?: VersionApiResponse;
        },
        void | ErrorModel
      >({
        path: `/versions/${id}.${format}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Version
     * @name PutVersions
     * @summary Update Version
     * @request PUT:/versions/{id}.{format}
     * @secure
     */
    putVersions: (
      format: "json" | "xml",
      id: number,
      data: {
        version?: VersionApiRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          version?: VersionApiResponse;
        },
        void | ErrorModel
      >({
        path: `/versions/${id}.${format}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Version
     * @name DeleteVersions
     * @summary Destroy Version
     * @request DELETE:/versions/{id}.{format}
     * @secure
     */
    deleteVersions: (
      format: "json" | "xml",
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void | ErrorModel>({
        path: `/versions/${id}.${format}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
}
