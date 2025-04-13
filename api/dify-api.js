import { NextResponse } from 'next/server'
import cheerio from 'cheerio'
import axios from 'axios'

const NOTION_URL = 'https://www.support.papano.ai/AI-POS-4d4a4f48e70c4a9493aa3c1d22252132'

export async function POST(req) {
  const { query } = await req.json()

  const res = await axios.get(NOTION_URL)
  const $ = cheerio.load(res.data)
  const text = $('body').text().replace(/\s+/g, ' ').trim()

  const matched = text.includes(query) ? text : '該当する情報が見つかりませんでした'

  return NextResponse.json({
    code: 200,
    data: [
      {
        content: matched.slice(0, 1500),
        metadata: {
          source: NOTION_URL,
          title: 'AI-POS マニュアル'
        }
      }
    ]
  })
}
