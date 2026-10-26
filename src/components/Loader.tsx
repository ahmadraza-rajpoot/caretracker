import React from 'react'
import { Spinner } from './ui/spinner'

const Loader = () => {
  return (
    <span className="flex gap-1 items-center justify-center">
            <Spinner />
            Loading....
    </span>
  )
}

export default Loader