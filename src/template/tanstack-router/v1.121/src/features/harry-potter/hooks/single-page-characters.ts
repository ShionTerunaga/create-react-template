import { useEffect, useMemo, useState } from 'react'
import { getCharacter } from '../service/get-character'
import type { Option } from '@/utils/option'
import type { APIView } from '../model/model-view'
import type { SinglePageGetCharacters } from './characters.type'
import type { HttpError } from '@/utils/error/http'
import { OPTION_NONE, createOption } from '@/utils/option'
import { RESULT_NG } from '@/utils/result'

export function useSinglePageCharacters() {
  const [fetchCharacter, setFetchCharacter] = useState<Option<Array<APIView>>>(
    createOption.none(),
  )

  const [error, setError] = useState<Option<HttpError>>(createOption.none())

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      const result = await getCharacter()

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!isMounted) return

      if (result.kind === RESULT_NG) {
        setError(createOption.some(result.err))
        return
      }

      setFetchCharacter(createOption.some(result.value))
    })()

    return () => {
      isMounted = false
    }
  }, [])

  const isLoading: boolean = useMemo(() => {
    return fetchCharacter.kind === OPTION_NONE && error.kind === OPTION_NONE
  }, [fetchCharacter, error])

  const characters: Array<SinglePageGetCharacters> = useMemo(() => {
    if (fetchCharacter.kind === OPTION_NONE) {
      return []
    }

    const mappedCharacters: Array<SinglePageGetCharacters> =
      fetchCharacter.value.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
      }))

    return mappedCharacters
  }, [fetchCharacter])

  return {
    isLoading,
    characters,
    error,
  }
}
