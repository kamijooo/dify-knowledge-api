import { NextResponse } from 'next/server'
import cheerio from 'cheerio'
import axios from 'axios'

const SOURCES = [
  {
    url: 'https://www.support.papano.ai/AI-POS-4d4a4f48e70c4a9493aa3c1d22252132',
    title: 'AI-POS マニュアル'
  },
  {
    url: 'https://www.support.papano.ai/10108a9cd2f580439dd8e86fda80ad35',
    title: 'papano サポートFAQ'
  }
]

export async function POST(req) {
  const { query } = await req.json()
  const results = []

  for (const source of SOURCES) {
    try {
      const res = await axios.get(source.url)
      const $ = cheerio.load(res.data)
      const text = $('body').text().replace(/\s+/g, ' ').trim()

      if (text.includes(query)) {
        results.push({
          content: text.slice(0, 1500),
          metadata: {
            source: source.url,
            title: source.title
          }
        })
      }
    } catch (error) {
      console.error(`Failed to fetch from ${source.url}:`, error.message)
    }
  }

  return NextResponse.json({
    code: 200,
    data: results.length > 0 ? results : [{
      content: '該当する情報が見つかりませんでした',
      metadata: { source: '', title: 'No match' }
    }]
  })
}
