import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {NuqsAdapter} from 'nuqs/adapters/react-router/v6'
import List from './pages/List'
import Detail from './pages/Detail'
import Create from './pages/Create'
import Footer from './components/Footer'
import {TooltipProvider} from '@/components/ui/tooltip'
import {
  type LabelMatcher,
  type Objective,
} from './proto/objectives/v1alpha1/objectives_pb'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {formatDuration, parseDuration} from './duration'

// Injected by the HTML template, not by the bundle.
declare global {
  interface Window {
    PATH_PREFIX: string
    API_BASEPATH: string
    EXTERNAL_URL: string
    EXTERNAL_GRAFANA_DATASOURCE_ID: string
    EXTERNAL_GRAFANA_ORG_ID: string
    VERSION: string
  }
}

export const PATH_PREFIX: string = window.PATH_PREFIX
export const API_BASEPATH: string = window.API_BASEPATH
export const EXTERNAL_URL: string = window.EXTERNAL_URL
export const EXTERNAL_GRAFANA_DATASOURCE_ID: string = window.EXTERNAL_GRAFANA_DATASOURCE_ID
export const EXTERNAL_GRAFANA_ORG_ID: string = window.EXTERNAL_GRAFANA_ORG_ID
export const VERSION: string = window.VERSION

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  const basename =
    PATH_PREFIX === undefined ? '' : `/${PATH_PREFIX.replace(/^\//, '').replace(/\/$/, '')}`

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename={basename}>
          <NuqsAdapter>
            <Routes>
              <Route path="/" element={<List />} />
              <Route path="/objectives/create" element={<Create />} />
              <Route path="/objectives" element={<Detail />} />
            </Routes>
            <Footer version={VERSION} />
          </NuqsAdapter>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export enum ObjectiveType {
  Ratio,
  Latency,
  LatencyNative,
  BoolGauge,
}

export const hasObjectiveType = (o: Objective): ObjectiveType => {
  if (o.indicator?.options.case === 'latency') {
    return ObjectiveType.Latency
  }
  if (o.indicator?.options.case === 'latencyNative') {
    return ObjectiveType.LatencyNative
  }
  if (o.indicator?.options.case === 'boolGauge') {
    return ObjectiveType.BoolGauge
  }
  return ObjectiveType.Ratio
}

// returns the latency target in milliseconds
export const latencyTarget = (o: Objective): number | undefined => {
  const options = o.indicator?.options

  if (options?.case === 'latency') {
    const m = options.value.success?.matchers.find((m: LabelMatcher) => {
      return m.name === 'le'
    })

    if (m !== undefined) {
      return parseFloat(m.value) * 1000
    }
  }

  if (options?.case === 'latencyNative') {
    return parseDuration(options.value.latency) ?? undefined
  }

  return undefined
}

export const renderLatencyTarget = (o: Objective): string => {
  const objectiveType = hasObjectiveType(o)

  if (objectiveType === ObjectiveType.Latency) {
    const latency = latencyTarget(o)
    if (latency === undefined) {
      return ''
    }

    return formatDuration(latency)
  }
  if (o.indicator?.options.case === 'latencyNative') {
    return o.indicator.options.value.latency
  }

  return ''
}

export const dateFormatter =
  (timeRange: number) =>
  (t: number): string => {
    const date = new Date(t * 1000)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()
    const hour = date.getUTCHours()
    const minute = date.getUTCMinutes()

    const monthLeading = month > 9 ? month : `0${month}`
    const dayLeading = day > 9 ? day : `0${day}`
    const hourLeading = hour > 9 ? hour : `0${hour}`
    const minuteLeading = minute > 9 ? minute : `0${minute}`

    if (timeRange >= 24 * 3600 * 1000) {
      return `${year}-${monthLeading}-${dayLeading} ${hourLeading}:${minuteLeading}`
    }

    return `${hourLeading}:${minuteLeading}`
  }

export const dateFormatterFull = (t: number): string => {
  const date = new Date(t * 1000)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const hour = date.getUTCHours()
  const minute = date.getUTCMinutes()

  const monthLeading = month > 9 ? month : `0${month}`
  const dayLeading = day > 9 ? day : `0${day}`
  const hourLeading = hour > 9 ? hour : `0${hour}`
  const minuteLeading = minute > 9 ? minute : `0${minute}`

  return `${year}-${monthLeading}-${dayLeading} ${hourLeading}:${minuteLeading}`
}

export default App
