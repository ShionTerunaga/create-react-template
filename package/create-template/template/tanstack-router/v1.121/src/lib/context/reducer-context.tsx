/* eslint-disable @typescript-eslint/naming-convention */
'use client'

import { createContext, useContext, useReducer } from 'react'
import type { ActionDispatch, JSX } from 'react'
import type { Result } from '@/utils/result'
import type { ChildrenOnly } from '@/shared/types/react'
import { RESULT_NG, createResult } from '@/utils/result'

interface ReducerParams<S, D> {
  errorMessage: string
  reducer: (state: S, action: D) => S
  initialState: S
}

type Props = ChildrenOnly

type ReducerType<S, D> = [S, ActionDispatch<[action: D]>]

export function createReducerContext<S, D>({
  errorMessage,
  reducer,
  initialState,
}: ReducerParams<S, D>): [
  (props: Props) => JSX.Element,
  () => ReducerType<S, D>,
] {
  const Context = createContext<Result<ReducerType<S, D>, Error>>(
    createResult.ng(new Error(errorMessage)),
  )

  const Provider = ({ children }: ChildrenOnly): JSX.Element => {
    const reducerResult = useReducer<S, [action: D]>(reducer, initialState)

    const result: Result<ReducerType<S, D>, Error> = createResult.ok(
      reducerResult,
    )

    return <Context value={result}>{children}</Context>
  }

  const useReducerContext = (): ReducerType<S, D> => {
    const result = useContext(Context)

    if (result.kind === RESULT_NG) {
      throw result.err
    }

    return result.value
  }

  return [Provider, useReducerContext]
}
