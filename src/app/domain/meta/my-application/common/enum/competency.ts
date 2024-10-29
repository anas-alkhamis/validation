export enum PageMode {
  EDIT = 'edit',
  VIEW = 'view',
  CREATE = 'create'
}

export type PageModeT = keyof typeof PageMode

export enum CompetencyModify {
  EDIT = 'edit',
  CREATE = 'create'
}
export type CompetencyModifyT = keyof typeof CompetencyModify
