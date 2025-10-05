import '../../setting/setup'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { createResult } from '@/utils/result'
import { createOption, OPTION_NONE } from '@/utils/option'
import {
  type APIView,
  getCharacter,
  type SinglePageGetCharacters,
  useSinglePageCharacters,
} from '@/features/harry-potter'

vi.mock('../../../features/harry-potter/service/get-character', () => {
  return {
    getCharacter: vi.fn(), // getCharacterをモック化
  }
})

const mockGetCharacter = vi.mocked(getCharacter)

afterEach(() => {
  vi.clearAllMocks() // 各テスト後にモックの呼び出し履歴をクリア
})

describe('useGetCharacters', () => {
  it('初期状態では適切な値を返す', () => {
    mockGetCharacter.mockResolvedValue(createResult.ok([]))

    const { result } = renderHook(() => useSinglePageCharacters())

    console.log(result.current)

    expect(result.current.characters).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error.kind).toBe(OPTION_NONE)
  })

  it('getCharacterが成功した場合、charactersに値が設定される', async () => {
    const mockAPIViewData: APIView[] = [
      {
        id: '1',
        name: 'Harry Potter',
        alternateNames: ['The Boy Who Lived'],
        species: 'human',
        gender: 'male',
        house: 'Gryffindor',
        dateOfBirth: createOption.some('1980-07-31'),
        yearOfBirth: createOption.some(1980),
        wizard: true,
        ancestry: 'half-blood',
        eyeColour: 'green',
        hairColour: 'black',
        wand: {
          wood: 'holly',
          core: 'phoenix feather',
          length: createOption.some(11),
        },
        patronus: 'stag',
        hogwartsStudent: true,
        hogwartsStaff: false,
        actor: 'Daniel Radcliffe',
        alternateActors: [],
        alive: true,
        image: 'https://example.com/harry.jpg',
      },
      {
        id: '2',
        name: 'Hermione Granger',
        alternateNames: [],
        species: 'human',
        gender: 'female',
        house: 'Gryffindor',
        dateOfBirth: createOption.some('1979-09-19'),
        yearOfBirth: createOption.some(1979),
        wizard: true,
        ancestry: 'muggle-born',
        eyeColour: 'brown',
        hairColour: 'brown',
        wand: {
          wood: 'vine',
          core: 'dragon heartstring',
          length: createOption.some(10.75),
        },
        patronus: 'otter',
        hogwartsStudent: true,
        hogwartsStaff: false,
        actor: 'Emma Watson',
        alternateActors: [],
        alive: true,
        image: 'https://example.com/hermione.jpg',
      },
    ]
    const mockResult = createResult.ok(mockAPIViewData)

    const mockSinglePageGetCharacters: Array<SinglePageGetCharacters> =
      mockAPIViewData.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
      }))

    mockGetCharacter.mockResolvedValue(mockResult)

    console.log(mockGetCharacter.mock.calls)

    const { result } = renderHook(() => useSinglePageCharacters())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)

      const resultValue = result.current.characters

      expect(resultValue).toEqual(mockSinglePageGetCharacters)
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.error.kind).toBe(OPTION_NONE)
    })
  })
})
