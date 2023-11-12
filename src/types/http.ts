export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT'
  | 'HEAD'
  | 'get'
  | 'post'
  | 'patch'
  | 'delete'
  | 'put'
  | 'head'

export type RequestHeaders = Record<string, any>

export type RequestParams = Record<string, any>

export type RequestBody = Record<string, any> | string | number | null | undefined
