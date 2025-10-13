import { appConfig } from '@/shared/config/config'
import { type Option } from '@/utils/option'
import { APIScheme } from '../model/model-res'
import { parseApi } from './parse-api'
import { type Result } from '@/utils/result'
import type { APIView } from '../model/model-view'
import { HttpError } from '@/utils/error/http/http'
import { hasParseFetcher } from '@/service/fetcher-get'

export async function getCharacter(): Promise<
  Result<Array<APIView>, HttpError>
> {
  const url: Option<string> = appConfig.apiKey

  return await hasParseFetcher({
    url,
    scheme: APIScheme,
    parse: parseApi,
  })
}
