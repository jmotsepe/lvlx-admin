import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ProfilesScalarFieldEnumSchema = z.enum(['id','created_at','first_name','last_name','email','province','cell_number','role','gender','status','sponsor']);

export const ResumeScalarFieldEnumSchema = z.enum(['id','user_id','name','description','created_at','available','url','type']);

export const PointsScalarFieldEnumSchema = z.enum(['id','company_id','balance']);

export const TransactionsScalarFieldEnumSchema = z.enum(['id','company_id','created_at','user_id','amount','token']);

export const Personal_detailsScalarFieldEnumSchema = z.enum(['id','user','first_name','last_name','gender','home_language','country','address','resume_id']);

export const Education_detailsScalarFieldEnumSchema = z.enum(['id','user','title','details','status','year_started','year_completed','resume_id']);

export const Work_experienceScalarFieldEnumSchema = z.enum(['id','user','company','date','date_ended','current_job','position','reason_for_leaving','resume_id']);

export const Contact_infoScalarFieldEnumSchema = z.enum(['id','user','email','cell_number','tel_number','next_of_kin_name','next_of_kin_cell','next_of_kin_relationship','resume_id']);

export const Career_objectivesScalarFieldEnumSchema = z.enum(['id','user','objectives','resume_id']);

export const ReferencesScalarFieldEnumSchema = z.enum(['id','user','name','cell_number','email','institution','resume_id']);

export const Cover_letterScalarFieldEnumSchema = z.enum(['id','user','letter','resume_id']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','user_id','name','status','address','description','reg_no','department','employees','type','created_at','regCertificate']);

export const VacancyScalarFieldEnumSchema = z.enum(['id','user_id','company_id','status','title','description','slots','location','monthly_salary','close_date','created_at','type','remote','views']);

export const Vacancy_applicationsScalarFieldEnumSchema = z.enum(['id','user_id','vacancy_id','resume_id','status','created_at']);

export const Company_managerScalarFieldEnumSchema = z.enum(['id','company_id','user_id','created_at']);

export const InterviewScalarFieldEnumSchema = z.enum(['id','vacancy_id','application_id','date','time','type','location','meeting_link','description']);

export const Point_tiersScalarFieldEnumSchema = z.enum(['id','cost','points','created_at']);

export const Payment_settingsScalarFieldEnumSchema = z.enum(['id','vacancy_cost','candidate_cost','interview_cost','search_cost','invite_cost']);

export const InviteScalarFieldEnumSchema = z.enum(['id','user_id','name','email','code','message','company_id','created_at']);

export const TokenScalarFieldEnumSchema = z.enum(['id','token','user_id','company_id','created_at','used','point_tiersId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const GenderSchema = z.enum(['Male','Female','NonBinary','Other']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

export const InterviewTypeSchema = z.enum(['Online','Physical']);

export type InterviewTypeType = `${z.infer<typeof InterviewTypeSchema>}`

export const RoleSchema = z.enum(['Admin','Youth','Sponsor','Employer']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const EducationStatusSchema = z.enum(['Completed','Active','NotCompleted']);

export type EducationStatusType = `${z.infer<typeof EducationStatusSchema>}`

export const ResumeTypeSchema = z.enum(['File','Custom']);

export type ResumeTypeType = `${z.infer<typeof ResumeTypeSchema>}`

export const CompanyTypeSchema = z.enum(['Private','Public','Organisation']);

export type CompanyTypeType = `${z.infer<typeof CompanyTypeSchema>}`

export const JobTypeSchema = z.enum(['Contract','Permanent','Temporary']);

export type JobTypeType = `${z.infer<typeof JobTypeSchema>}`

export const ApplicationStatusSchema = z.enum(['Pending','Rejected','ShortListed','Interview','Hired']);

export type ApplicationStatusType = `${z.infer<typeof ApplicationStatusSchema>}`

export const StatusSchema = z.enum(['Approved','Pending','Rejected']);

export type StatusType = `${z.infer<typeof StatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PROFILES SCHEMA
/////////////////////////////////////////

/**
 * This model or at least one of its fields has comments in the database, and requires an additional setup for migrations: Read more: https://pris.ly/d/database-comments
 * This model contains row level security and requires additional setup for migrations. Visit https://pris.ly/d/row-level-security for more info.
 */
export const profilesSchema = z.object({
  role: RoleSchema,
  gender: GenderSchema,
  status: StatusSchema,
  id: z.string(),
  created_at: z.coerce.date(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  province: z.string().nullish(),
  cell_number: z.string().nullish(),
  sponsor: z.string().nullish(),
})

export type profiles = z.infer<typeof profilesSchema>

// PROFILES OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const profilesOptionalDefaultsSchema = profilesSchema.merge(z.object({
  role: RoleSchema.optional(),
  status: StatusSchema.optional(),
  id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type profilesOptionalDefaults = z.infer<typeof profilesOptionalDefaultsSchema>

/////////////////////////////////////////
// RESUME SCHEMA
/////////////////////////////////////////

export const resumeSchema = z.object({
  type: ResumeTypeSchema,
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.coerce.date(),
  available: z.boolean(),
  url: z.string().nullish(),
})

export type resume = z.infer<typeof resumeSchema>

// RESUME OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const resumeOptionalDefaultsSchema = resumeSchema.merge(z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.coerce.date().optional(),
  available: z.boolean().optional(),
}))

export type resumeOptionalDefaults = z.infer<typeof resumeOptionalDefaultsSchema>

/////////////////////////////////////////
// POINTS SCHEMA
/////////////////////////////////////////

export const pointsSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  balance: z.number().int(),
})

export type points = z.infer<typeof pointsSchema>

// POINTS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const pointsOptionalDefaultsSchema = pointsSchema.merge(z.object({
  id: z.string().optional(),
  balance: z.number().int().optional(),
}))

export type pointsOptionalDefaults = z.infer<typeof pointsOptionalDefaultsSchema>

/////////////////////////////////////////
// TRANSACTIONS SCHEMA
/////////////////////////////////////////

export const transactionsSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  created_at: z.coerce.date(),
  user_id: z.string(),
  amount: z.number().int(),
  token: z.string().nullish(),
})

export type transactions = z.infer<typeof transactionsSchema>

// TRANSACTIONS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const transactionsOptionalDefaultsSchema = transactionsSchema.merge(z.object({
  id: z.string().optional(),
  created_at: z.coerce.date().optional(),
  user_id: z.string().optional(),
}))

export type transactionsOptionalDefaults = z.infer<typeof transactionsOptionalDefaultsSchema>

/////////////////////////////////////////
// PERSONAL DETAILS SCHEMA
/////////////////////////////////////////

export const personal_detailsSchema = z.object({
  gender: GenderSchema,
  id: z.string(),
  user: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  home_language: z.string(),
  country: z.string(),
  address: z.string().nullish(),
  resume_id: z.string().nullish(),
})

export type personal_details = z.infer<typeof personal_detailsSchema>

// PERSONAL DETAILS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const personal_detailsOptionalDefaultsSchema = personal_detailsSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type personal_detailsOptionalDefaults = z.infer<typeof personal_detailsOptionalDefaultsSchema>

/////////////////////////////////////////
// EDUCATION DETAILS SCHEMA
/////////////////////////////////////////

export const education_detailsSchema = z.object({
  status: EducationStatusSchema,
  id: z.string(),
  user: z.string(),
  title: z.string(),
  details: z.string(),
  year_started: z.string().nullish(),
  year_completed: z.string().nullish(),
  resume_id: z.string().nullish(),
})

export type education_details = z.infer<typeof education_detailsSchema>

// EDUCATION DETAILS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const education_detailsOptionalDefaultsSchema = education_detailsSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type education_detailsOptionalDefaults = z.infer<typeof education_detailsOptionalDefaultsSchema>

/////////////////////////////////////////
// WORK EXPERIENCE SCHEMA
/////////////////////////////////////////

export const work_experienceSchema = z.object({
  id: z.string(),
  user: z.string(),
  company: z.string(),
  date: z.string(),
  date_ended: z.string().nullish(),
  current_job: z.boolean().nullish(),
  position: z.string(),
  reason_for_leaving: z.string().nullish(),
  resume_id: z.string().nullish(),
})

export type work_experience = z.infer<typeof work_experienceSchema>

// WORK EXPERIENCE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const work_experienceOptionalDefaultsSchema = work_experienceSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type work_experienceOptionalDefaults = z.infer<typeof work_experienceOptionalDefaultsSchema>

/////////////////////////////////////////
// CONTACT INFO SCHEMA
/////////////////////////////////////////

export const contact_infoSchema = z.object({
  id: z.string(),
  user: z.string(),
  email: z.string(),
  cell_number: z.string(),
  tel_number: z.string().nullish(),
  next_of_kin_name: z.string().nullish(),
  next_of_kin_cell: z.string().nullish(),
  next_of_kin_relationship: z.string().nullish(),
  resume_id: z.string().nullish(),
})

export type contact_info = z.infer<typeof contact_infoSchema>

// CONTACT INFO OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const contact_infoOptionalDefaultsSchema = contact_infoSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type contact_infoOptionalDefaults = z.infer<typeof contact_infoOptionalDefaultsSchema>

/////////////////////////////////////////
// CAREER OBJECTIVES SCHEMA
/////////////////////////////////////////

export const career_objectivesSchema = z.object({
  id: z.string(),
  user: z.string(),
  objectives: z.string(),
  resume_id: z.string().nullish(),
})

export type career_objectives = z.infer<typeof career_objectivesSchema>

// CAREER OBJECTIVES OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const career_objectivesOptionalDefaultsSchema = career_objectivesSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type career_objectivesOptionalDefaults = z.infer<typeof career_objectivesOptionalDefaultsSchema>

/////////////////////////////////////////
// REFERENCES SCHEMA
/////////////////////////////////////////

export const referencesSchema = z.object({
  id: z.string(),
  user: z.string(),
  name: z.string(),
  cell_number: z.string().nullish(),
  email: z.string().nullish(),
  institution: z.string(),
  resume_id: z.string().nullish(),
})

export type references = z.infer<typeof referencesSchema>

// REFERENCES OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const referencesOptionalDefaultsSchema = referencesSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type referencesOptionalDefaults = z.infer<typeof referencesOptionalDefaultsSchema>

/////////////////////////////////////////
// COVER LETTER SCHEMA
/////////////////////////////////////////

export const cover_letterSchema = z.object({
  id: z.string(),
  user: z.string(),
  letter: z.string(),
  resume_id: z.string().nullish(),
})

export type cover_letter = z.infer<typeof cover_letterSchema>

// COVER LETTER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const cover_letterOptionalDefaultsSchema = cover_letterSchema.merge(z.object({
  id: z.string().optional(),
  user: z.string().optional(),
}))

export type cover_letterOptionalDefaults = z.infer<typeof cover_letterOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const companySchema = z.object({
  status: StatusSchema,
  type: CompanyTypeSchema,
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  address: z.string(),
  description: z.string(),
  reg_no: z.string(),
  department: z.string(),
  employees: z.string(),
  created_at: z.coerce.date(),
  regCertificate: z.string().nullish(),
})

export type company = z.infer<typeof companySchema>

// COMPANY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const companyOptionalDefaultsSchema = companySchema.merge(z.object({
  status: StatusSchema.optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type companyOptionalDefaults = z.infer<typeof companyOptionalDefaultsSchema>

/////////////////////////////////////////
// VACANCY SCHEMA
/////////////////////////////////////////

export const vacancySchema = z.object({
  status: StatusSchema,
  type: JobTypeSchema,
  id: z.string(),
  user_id: z.string(),
  company_id: z.string(),
  title: z.string(),
  description: z.string(),
  slots: z.string().nullish(),
  location: z.string(),
  monthly_salary: z.string().nullish(),
  close_date: z.coerce.date(),
  created_at: z.coerce.date(),
  remote: z.boolean(),
  views: z.number().int(),
})

export type vacancy = z.infer<typeof vacancySchema>

// VACANCY OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const vacancyOptionalDefaultsSchema = vacancySchema.merge(z.object({
  status: StatusSchema.optional(),
  type: JobTypeSchema.optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.coerce.date().optional(),
  views: z.number().int().optional(),
}))

export type vacancyOptionalDefaults = z.infer<typeof vacancyOptionalDefaultsSchema>

/////////////////////////////////////////
// VACANCY APPLICATIONS SCHEMA
/////////////////////////////////////////

export const vacancy_applicationsSchema = z.object({
  status: ApplicationStatusSchema,
  id: z.string(),
  user_id: z.string(),
  vacancy_id: z.string(),
  resume_id: z.string(),
  created_at: z.coerce.date(),
})

export type vacancy_applications = z.infer<typeof vacancy_applicationsSchema>

// VACANCY APPLICATIONS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const vacancy_applicationsOptionalDefaultsSchema = vacancy_applicationsSchema.merge(z.object({
  status: ApplicationStatusSchema.optional(),
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type vacancy_applicationsOptionalDefaults = z.infer<typeof vacancy_applicationsOptionalDefaultsSchema>

/////////////////////////////////////////
// COMPANY MANAGER SCHEMA
/////////////////////////////////////////

export const company_managerSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  user_id: z.string(),
  created_at: z.coerce.date(),
})

export type company_manager = z.infer<typeof company_managerSchema>

// COMPANY MANAGER OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const company_managerOptionalDefaultsSchema = company_managerSchema.merge(z.object({
  id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type company_managerOptionalDefaults = z.infer<typeof company_managerOptionalDefaultsSchema>

/////////////////////////////////////////
// INTERVIEW SCHEMA
/////////////////////////////////////////

export const interviewSchema = z.object({
  type: InterviewTypeSchema,
  id: z.string(),
  vacancy_id: z.string(),
  application_id: z.string(),
  date: z.coerce.date(),
  time: z.string().nullish(),
  location: z.string().nullish(),
  meeting_link: z.string().nullish(),
  description: z.string().nullish(),
})

export type interview = z.infer<typeof interviewSchema>

// INTERVIEW OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const interviewOptionalDefaultsSchema = interviewSchema.merge(z.object({
  type: InterviewTypeSchema.optional(),
  id: z.string().optional(),
}))

export type interviewOptionalDefaults = z.infer<typeof interviewOptionalDefaultsSchema>

/////////////////////////////////////////
// POINT TIERS SCHEMA
/////////////////////////////////////////

export const point_tiersSchema = z.object({
  id: z.string(),
  cost: z.string(),
  points: z.string(),
  created_at: z.coerce.date(),
})

export type point_tiers = z.infer<typeof point_tiersSchema>

// POINT TIERS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const point_tiersOptionalDefaultsSchema = point_tiersSchema.merge(z.object({
  id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type point_tiersOptionalDefaults = z.infer<typeof point_tiersOptionalDefaultsSchema>

/////////////////////////////////////////
// PAYMENT SETTINGS SCHEMA
/////////////////////////////////////////

export const payment_settingsSchema = z.object({
  id: z.string(),
  vacancy_cost: z.string(),
  candidate_cost: z.string(),
  interview_cost: z.string(),
  search_cost: z.string(),
  invite_cost: z.string(),
})

export type payment_settings = z.infer<typeof payment_settingsSchema>

// PAYMENT SETTINGS OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const payment_settingsOptionalDefaultsSchema = payment_settingsSchema.merge(z.object({
  id: z.string().optional(),
  vacancy_cost: z.string().optional(),
  candidate_cost: z.string().optional(),
  interview_cost: z.string().optional(),
  search_cost: z.string().optional(),
  invite_cost: z.string().optional(),
}))

export type payment_settingsOptionalDefaults = z.infer<typeof payment_settingsOptionalDefaultsSchema>

/////////////////////////////////////////
// INVITE SCHEMA
/////////////////////////////////////////

export const inviteSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  email: z.string(),
  code: z.string(),
  message: z.string().nullish(),
  company_id: z.string(),
  created_at: z.coerce.date(),
})

export type invite = z.infer<typeof inviteSchema>

// INVITE OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const inviteOptionalDefaultsSchema = inviteSchema.merge(z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.coerce.date().optional(),
}))

export type inviteOptionalDefaults = z.infer<typeof inviteOptionalDefaultsSchema>

/////////////////////////////////////////
// TOKEN SCHEMA
/////////////////////////////////////////

export const tokenSchema = z.object({
  id: z.string().cuid(),
  token: z.string(),
  user_id: z.string(),
  company_id: z.string(),
  created_at: z.coerce.date(),
  used: z.boolean(),
  point_tiersId: z.string().nullish(),
})

export type token = z.infer<typeof tokenSchema>

// TOKEN OPTIONAL DEFAULTS SCHEMA
//------------------------------------------------------

export const tokenOptionalDefaultsSchema = tokenSchema.merge(z.object({
  id: z.string().cuid().optional(),
  created_at: z.coerce.date().optional(),
  used: z.boolean().optional(),
}))

export type tokenOptionalDefaults = z.infer<typeof tokenOptionalDefaultsSchema>
