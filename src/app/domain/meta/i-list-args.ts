interface ICommonArgs {
  offset: number
  limit: number
  sortColumn: string
  ascending: boolean
  name: string
}

type TPagination = {
  offset: number
  limit: number
}

interface IPerformanceReviewFilterArgs extends ICommonArgs {
  toYear: number
  fromYear: number
}

export type { ICommonArgs, TPagination, IPerformanceReviewFilterArgs }
