import React from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'
import { User } from '../models/user'
import { get } from 'http'
import axios from 'axios'
import Reader from '../models/reader'

export default function useReader() {
  const fetcher = async (url) => await axios.get(url).then((res) => res.data).catch((error) => {alert(error.response.data)});
  const { data: readers, mutate: mutateReader } = useSWR<Reader[]>('/api/reader', fetcher)
  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    
  }, [readers])

  return { readers, mutateReader }
}